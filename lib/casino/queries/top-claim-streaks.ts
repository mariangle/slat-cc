import { GameId } from '@/lib/casino/types'
import { db, schema } from '@/lib/drizzle'
import { desc, eq, sql } from 'drizzle-orm'
import { isNil } from 'lodash'

export type StreakLeadersRow = {
  userId: number
  username: string
  topStreak: number
}

export async function getTopClaimStreaks(page = 1, limit = 10): Promise<StreakLeadersRow[]> {
  const offset = Math.max(0, (page - 1) * limit)

  const wt = schema.walletTransactions
  const u = schema.users

  const agg = db
    .select({
      userId: wt.userId,
      topStreak: sql<number>`COALESCE(MAX(${wt.claimStreak}), 0)`.as('topStreak'),
    })
    .from(wt)
    .where(eq(wt.gameId, GameId.DailyReward))
    .groupBy(wt.userId)
    .as('agg')

  const rows = await db
    .select({
      userId: agg.userId,
      username: u.username,
      topStreak: agg.topStreak,
    })
    .from(agg)
    .innerJoin(u, eq(agg.userId, u.id))
    .orderBy(desc(agg.topStreak))
    .offset(offset)
    .limit(limit)

  return rows
    .filter((r) => !isNil(r.userId))
    .map((r) => ({
      userId: r.userId as number,
      username: r.username,
      topStreak: r.topStreak,
    }))
}
