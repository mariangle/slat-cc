import { FieldOptionsWithPremium } from '@/lib/types'
import { humanize } from '@/lib/utils'
import * as z from 'zod'

export const cursorTrailSchema = z.enum([
  'stardust',
  'falling-particles',
  'sparkles',
  'bubbles',
  'trailing',
  'spotlight',
  'rainbow',
  'canvas',
  'falling-snowflakes',
])

export type CursorTrail = z.infer<typeof cursorTrailSchema>

export const cursorTrailOptions = cursorTrailSchema.options.map((value) => ({
  label: humanize(value),
  value,
  premium: true,
})) satisfies FieldOptionsWithPremium<CursorTrail>

export function parseCursorTrail(input: unknown): CursorTrail | undefined {
  try {
    return cursorTrailSchema.parse(input)
  } catch (error) {
    return undefined
  }
}
