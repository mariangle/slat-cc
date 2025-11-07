import type { TagRow } from '@/lib/drizzle'
import * as z from 'zod'

export const tagFields = {
  id: z.number(),
  iconName: z.string(),
  label: z.string(),
  sortOrder: z.number(),
} satisfies Partial<Record<keyof TagRow, z.ZodTypeAny>>

export type TagField = keyof z.infer<typeof tagSchema>

export const tagSchema = z.object({
  id: tagFields.id,
  iconName: tagFields.iconName.optional(),
  label: tagFields.label,
})

export type Tag = z.infer<typeof tagSchema>
