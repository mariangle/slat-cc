import { casinoInputSchema, casinoPayloadSchema, withMeta } from '@/lib/casino/schemas'
import * as z from 'zod'

const wheelColor = z.enum(['green', 'yellow', 'blue', 'pink'])

export type WheelColor = z.infer<typeof wheelColor>

export const spinTheWheelInputSchema = casinoInputSchema.merge(
  z.object({
    guess: wheelColor,
  }),
)

export type SpinTheWheelInput = z.infer<typeof spinTheWheelInputSchema>

export const spinTheWheelPayloadSchema = casinoPayloadSchema.merge(
  z.object({
    input: spinTheWheelInputSchema,
  }),
)

export type SpinTheWheelPayload = z.infer<typeof spinTheWheelPayloadSchema>

const spinTheWheelResultSchema = withMeta({
  wheelResult: wheelColor,
  wheelIndex: z.number(),
  guess: wheelColor,
  multiplier: z.number().positive(),
})

export type SpinTheWheelResult = z.infer<typeof spinTheWheelResultSchema>

export type WheelSegment = {
  color: WheelColor
  multiplier: number
  hex: string
}
