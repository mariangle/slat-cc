'use server'

import { updateUser } from '@/lib/features/users/db'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'
import { hashPassword, isPasswordCorrect } from '@/lib/server/security/bcrypt'
import { passwordChangeFormSchema, type PasswordChangeFormValues } from '@/lib/zod/schemas/user'
import { db } from '@slat/db'
import { isEqual } from 'lodash'
import { match, P } from 'ts-pattern'

export const updatePassword = requireActionSession(async (userId: number, values: PasswordChangeFormValues) => {
  const { oldPassword, newPassword } = passwordChangeFormSchema.parse(values)

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
    columns: { password: true },
  })

  if (!user) {
    throw new FedsServerError({
      message: 'Unauthorized',
      code: 'unauthorized',
    })
  }

  match(user.password)
    .with(P.string, (currentPassword) => {
      if (isEqual(oldPassword, newPassword)) {
        throw new FedsServerError({
          code: 'bad_request',
          message: 'New password must be different from old password',
        })
      }

      if (!isPasswordCorrect(oldPassword, currentPassword)) {
        throw new FedsServerError({
          code: 'bad_request',
          message: 'Old password is incorrect',
        })
      }
    })
    .with(P.nullish, () => {
      if (!isEqual(oldPassword, newPassword)) {
        throw new FedsServerError({
          code: 'bad_request',
          message: 'Passwords must match',
        })
      }
    })
    .exhaustive()

  await updateUser(userId, { password: hashPassword(newPassword) })
})
