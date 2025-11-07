import * as z from 'zod'

export const hallOfFameCategorySchema = z.enum([
  'claim-streaks',
  'most-played',
  'net-winners',
  'net-losers',
  'recent-activity',
])

export type HallOfFameCategory = z.infer<typeof hallOfFameCategorySchema>

export function parseCategory(category: unknown): HallOfFameCategory {
  try {
    return hallOfFameCategorySchema.parse(category)
  } catch {
    return hallOfFameCategorySchema.enum['most-played']
  }
}
