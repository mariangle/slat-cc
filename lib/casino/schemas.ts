import * as z from 'zod'

import type { CasinoUser } from '@/lib/features/users/types'

export const outcomeSchema = z.enum(['win', 'lose', 'draw'])

export type GameOutcome = z.infer<typeof outcomeSchema>

const baseMetaSchema = z.object({}).passthrough()

const casinoResultSchema = z.object({
  delta: z.number(),
  grossPayout: z.number(),
  outcome: outcomeSchema,
  newBalance: z.number(),
  meta: baseMetaSchema,
  betAmount: z.number(),
})

export type CasinoResult = z.infer<typeof casinoResultSchema>

export const withMeta = <S extends z.ZodRawShape>(shape: S) =>
  casinoResultSchema.extend({
    meta: baseMetaSchema.extend(shape),
  })

export const casinoUserSchema: z.ZodType<CasinoUser> = z.object({
  id: z.number(),
  username: z.string(),
  coins: z.number(),
  lastClaimedAt: z.date().nullable(),
})

export const casinoInputSchema = z.object({
  betAmount: z.number().min(1, 'Bet amount must be at least 1.'),
})

export const casinoPayloadSchema = z.object({
  user: casinoUserSchema,
})

export type CasinoPayload = z.infer<typeof casinoPayloadSchema>
