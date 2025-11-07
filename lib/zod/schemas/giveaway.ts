import type { GiveawayRow } from '@/lib/drizzle'
import { rewardIds } from '@/lib/features/giveaways/reward'
import * as z from 'zod'

enum WinnerBounds {
  Min = 1,
  Max = 5,
}

export const winnerCounts = Array.from(
  { length: WinnerBounds.Max - WinnerBounds.Min + 1 },
  (_, i) => i + WinnerBounds.Min,
)

export const giveawayFormSchema = z
  .object({
    rewardId: z.coerce
      .number({ message: 'Reward is required' })
      .refine((val) => rewardIds.includes(val), { message: 'Invalid reward' }),
    endsAt: z.coerce.date(),
    winnerCount: z.coerce.number().min(WinnerBounds.Min).max(WinnerBounds.Max),
  } satisfies Partial<Record<keyof GiveawayRow, z.ZodTypeAny>>)
  .refine((v) => v.endsAt.getTime() > Date.now(), {
    path: ['endsAt'],
    message: 'End date must be in the future',
  })

export type GiveawayFormValues = z.infer<typeof giveawayFormSchema>
