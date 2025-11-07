import { db, schema } from '@/lib/drizzle'
import { and, desc, eq, isNotNull, sql } from 'drizzle-orm'

export type NetLeadersRow = {
  userId: number
  username: string
  net: number
  startBalance: number
  endBalance: number
}

async function getTopNetCore(
  page = 1,
  limit = 10,
  order: 'desc' | 'asc',
  sign: 'positive' | 'negative',
): Promise<NetLeadersRow[]> {
  const offset = Math.max(0, (page - 1) * limit)

  const wt = schema.walletTransactions
  const u = schema.users

  const netExpr = sql<number>`COALESCE(SUM(${wt.delta}), 0)`
  const havingExpr =
    sign === 'positive' ? sql`SUM(${wt.delta}) > 0` : sign === 'negative' ? sql`SUM(${wt.delta}) < 0` : undefined

  const agg = db
    .select({
      userId: wt.userId,
      net: netExpr.as('net'),
    })
    .from(wt)
    .where(and(isNotNull(wt.userId)))
    .groupBy(wt.userId)
    .having(havingExpr)
    .as('agg')

  const rows = await db
    .select({
      userId: agg.userId,
      username: u.username,
      net: agg.net,
      endBalance: u.coins,
    })
    .from(agg)
    .innerJoin(u, eq(agg.userId, u.id))
    .orderBy(order === 'desc' ? desc(agg.net) : sql`(${agg.net}) ASC`)
    .offset(offset)
    .limit(limit)

  return rows.map((r) => ({
    userId: r.userId as number,
    username: r.username,
    net: r.net,
    endBalance: r.endBalance,
    startBalance: r.endBalance - r.net,
  }))
}

export const getTopNetWinners = (page = 1, limit = 10) => getTopNetCore(page, limit, 'desc', 'positive')
export const getTopNetLosers = (page = 1, limit = 10) => getTopNetCore(page, limit, 'asc', 'negative')
