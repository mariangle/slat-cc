import { emailSchema, passwordSchema, usernameSchema } from '@/lib/zod/schemas'
import type { UserRow } from '@slat/db'
import * as z from 'zod'

export const userFields = {
  id: z.number(),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  coins: z.number(),
} satisfies Partial<Record<keyof UserRow, z.ZodTypeAny>>

export type UserField = keyof typeof userFields
