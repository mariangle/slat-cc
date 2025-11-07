import { LinkRow } from '@/lib/drizzle'
import { linkStyles } from '@/lib/drizzle/enums'
import { colorSchema, urlSchema } from '@/lib/zod/schemas'
import * as z from 'zod'

export const linkStyleSchema = z.enum(linkStyles)

export type LinkStyle = z.infer<typeof linkStyleSchema>

export const linkFields = {
  id: z.number(),
  platformId: z.coerce.number().optional(),
  source: z.string(),
  iconName: z.string(),
  label: z.string(),
  description: z.string(),
  // TODO:
  isInsideProfileCard: z.boolean(),
  style: linkStyleSchema,
  hidden: z.boolean(),
  image: urlSchema.optional(),
  sortOrder: z.number(),
  isCopyable: z.boolean(),
  iconColor: colorSchema.optional(),
  backgroundColor: colorSchema.optional(),
} satisfies Partial<Record<keyof LinkRow, z.ZodTypeAny>> & Record<'isInsideProfileCard', z.ZodBoolean>

export type LinkField = keyof typeof linkFields

export const linkSchema = z.object(linkFields)

export type Link = z.infer<typeof linkSchema>
