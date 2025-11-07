import { renderEmailHtml } from '@/components/email/render-email-html'
import { withTurnstile } from '@/lib/api/middleware/turnstile'
import { parseRequestBody } from '@/lib/api/utils'
import { deletePasswordResetByUserId, getPasswordReset } from '@/lib/auth/password-reset/actions'
import { PASSWORD_RESET_TTL_MINUTES } from '@/lib/auth/password-reset/constants'
import { sendEmail } from '@/lib/email'
import { FedsServerError } from '@/lib/server/errors'
import { resetPasswordRequestFormSchema, ResetPasswordRequestFormValues } from '@/lib/zod/schemas/auth'
import { db, schema } from '@slat/db'
import { addMinutes, isAfter, subMinutes } from 'date-fns'
import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'

/** POST /api/auth/reset-password/request-email - Request password reset email */
export const POST = withTurnstile(async ({ req }) => {
  const data: ResetPasswordRequestFormValues = await parseRequestBody(req)

  const { email } = resetPasswordRequestFormSchema.parse(data)

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
    columns: { id: true, email: true, username: true },
  })

  if (!user) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Email does not exist',
    })
  }

  if (!user.email) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'No email set for this user',
    })
  }

  const existingPasswordReset = await getPasswordReset({ userId: user.id })

  if (existingPasswordReset) {
    if (isAfter(existingPasswordReset.createdAt, subMinutes(new Date(), PASSWORD_RESET_TTL_MINUTES))) {
      throw new FedsServerError({
        code: 'bad_request',
        message: 'A password reset request has already been sent within the last 10 minutes.',
      })
    } else {
      await deletePasswordResetByUserId(user.id)
    }
  }

  const token = uuid()

  await db.insert(schema.passwordResets).values({
    userId: user.id,
    token,
    expiresAt: addMinutes(new Date(), PASSWORD_RESET_TTL_MINUTES),
    createdAt: new Date(),
  })

  await sendEmail({
    username: user.username,
    html: await renderEmailHtml({ username: user.username, type: 'reset-password', token }),
    recipient: user.email,
    subject: 'Reset Password',
  })

  return NextResponse.json({ message: 'Password reset requested. Please check your email shortly.' })
})
