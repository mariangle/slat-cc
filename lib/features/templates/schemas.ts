import { urlSchema } from '@/lib/zod/schemas'
import type { Template as TemplateRow } from '@slat/db'
import * as z from 'zod'

const tagSchema = z
  .string()
  .regex(/^[a-zA-Z]+$/, { message: 'Tags can only contain letters.' })
  .max(10, { message: 'Tags must be 10 characters or less.' })

export const templateFields = {
  id: z.number(),
  name: z.string(),
  isPublic: z.boolean(),
  image: urlSchema.optional(),
  tags: z.array(tagSchema),
  isPremiumRequired: z.boolean(),
  createdAt: z.date(),
  userId: z.number(),
} satisfies Partial<Record<keyof TemplateRow, z.ZodTypeAny>>

export type TemplateField = keyof typeof templateFields

const authorSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().optional(),
  avatar: urlSchema.optional(),
})

export const templateSchema = z.object({
  id: z.number(),
  name: templateFields.name,
  isPublic: templateFields.isPublic,
  image: templateFields.image,
  tags: templateFields.tags,
  isPremiumRequired: templateFields.isPremiumRequired,
  favoriteCount: z.number(),
  useCount: z.number(),
  isFavorited: z.boolean(),
  isUsed: z.boolean(),
  createdAt: templateFields.createdAt,
  author: authorSchema,
})

export type Template = z.infer<typeof templateSchema>

export const templateAuthorSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().optional(),
  avatar: urlSchema.optional(),
})

export const templateMetricsSchema = z.object({
  favorites: z.object({ count: z.number(), byViewer: z.boolean() }),
  uses: z.object({ count: z.number(), byViewer: z.boolean() }),
})

export const templateViewSchema = z.object({
  id: templateFields.id,
  name: templateFields.name,
  isPublic: templateFields.isPublic,
  image: templateFields.image,
  tags: templateFields.tags,
  isPremiumRequired: templateFields.isPremiumRequired,
  createdAt: templateFields.createdAt,
  author: templateAuthorSchema,
  metrics: templateMetricsSchema,
  isOwned: z.boolean(),
})

export type TemplateView = z.infer<typeof templateViewSchema>
