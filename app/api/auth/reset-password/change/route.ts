import { parseRequestBody } from '@/lib/api/utils'
import { deletePasswordResetByUserId, getPasswordReset } from '@/lib/auth/password-reset/actions'
import { db } from '@/lib/drizzle'
import { updateUser } from '@/lib/features/users/db'
import { FedsServerError, handleAndReturnErrorResponse } from '@/lib/server/errors'
import { hashPassword } from '@/lib/server/security/bcrypt'
import { resetPasswordChangeFormSchema, ResetPasswordChangeFormValues } from '@/lib/zod/schemas/auth'
import { isBefore } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

/** POST /api/auth/reset-password/change - Change user password after reset */
export async function POST(req: NextRequest) {
  try {
    const data: ResetPasswordChangeFormValues = await parseRequestBody(req)

    const { token, newPassword } = resetPasswordChangeFormSchema.parse(data)

    const existingPasswordReset = await getPasswordReset({ token })

    if (!existingPasswordReset) {
      throw new FedsServerError({
        code: 'not_found',
        message: 'Invalid token',
      })
    }

    if (isBefore(existingPasswordReset.expiresAt, new Date())) {
      throw new FedsServerError({
        code: 'bad_request',
        message: 'Token expired',
      })
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, existingPasswordReset.userId),
      columns: {
        id: true,
        email: true,
        username: true,
      },
    })

    if (!user) {
      throw new FedsServerError({
        code: 'not_found',
        message: 'User not found',
      })
    }

    await Promise.all([
      updateUser(user.id, { password: hashPassword(newPassword) }),
      deletePasswordResetByUserId(user.id),
    ])

    return NextResponse.json({ message: 'Password updated successfully.' })
  } catch (e) {
    return handleAndReturnErrorResponse(e)
  }
}
