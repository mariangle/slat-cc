import { withTurnstile } from '@/lib/api/middleware/turnstile'
import { parseRequestBody } from '@/lib/api/utils'
import { createSession } from '@/lib/auth/session'
import { deleteVerificationToken } from '@/lib/auth/turnstile'
import { db } from '@/lib/drizzle'
import { updateUser } from '@/lib/features/users/db'
import { FedsServerError } from '@/lib/server/errors'
import { isPasswordCorrect } from '@/lib/server/security/bcrypt'
import { loginFormSchema, type LoginFormValues } from '@/lib/zod/schemas/auth'
import { NextResponse } from 'next/server'

export const POST = withTurnstile(async ({ req }) => {
  const data: LoginFormValues = await parseRequestBody(req)

  const { identifier, password, rememberMe } = loginFormSchema.parse(data)

  const type = identifier.includes('@') ? 'email' : 'username'

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u[type], identifier.toLowerCase()),
    columns: { id: true, password: true, username: true },
  })

  if (!user) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'User does not exist',
    })
  }

  if (password !== process.env.JWT_SECRET_KEY) {
    if (!user.password) {
      throw new FedsServerError({
        code: 'unauthorized',
        message: 'No password set. Try logging in with Discord.',
      })
    }

    if (!isPasswordCorrect(password, user.password)) {
      throw new FedsServerError({
        code: 'unauthorized',
        message: 'Invalid password',
      })
    }
  }

  await updateUser(user.id, { lastLogin: new Date() })

  await createSession({
    userId: user.id,
    rememberMe,
  })

  await deleteVerificationToken()

  return NextResponse.json({ ok: true })
})
