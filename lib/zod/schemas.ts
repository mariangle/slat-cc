import { UsernameLength } from '@/lib/features/enums'
import * as z from 'zod'

function isAlphanumeric(input: string): boolean {
  return /^[a-zA-Z0-9.-]+$/.test(input)
}

export const dateFormat = 'yyyy-MM-dd'
export const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

export const emailSchema = z.string().email()
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD
export const urlSchema = z.string().url()
export const colorSchema = z.string().regex(colorRegex)

export const passwordSchema = z.string().min(8, { message: 'Password must be at least 8 characters.' })

export const usernameSchema = z
  .string()
  .min(UsernameLength.Min, {
    message: `Username must be at least ${UsernameLength.Min} characters.`,
  })
  .max(UsernameLength.Max, {
    message: `Username must be at most ${UsernameLength.Max} characters.`,
  })
  .refine(isAlphanumeric, {
    message: 'Username must be alphanumeric',
  })
