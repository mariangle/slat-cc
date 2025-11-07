import { casinoInputSchema, casinoPayloadSchema, withMeta } from '@/lib/casino/schemas'
import * as z from 'zod'

const choiceSchema = z.enum(['rock', 'paper', 'scissors'])

export type RpsChoice = z.infer<typeof choiceSchema>

export const rpsInputSchema = casinoInputSchema.merge(
  z.object({
    playerChoice: choiceSchema,
  }),
)

export type RpsInput = z.infer<typeof rpsInputSchema>

export const rpsPayloadSchema = casinoPayloadSchema.merge(
  z.object({
    input: rpsInputSchema,
  }),
)

export type RpsPayload = z.infer<typeof rpsPayloadSchema>

const rpsResultSchema = withMeta({ computerPick: choiceSchema, playerPick: choiceSchema })

export type RpsResult = z.infer<typeof rpsResultSchema>
