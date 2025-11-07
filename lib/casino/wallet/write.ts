import { db, schema, SqlTransaction } from '@/lib/drizzle'
import { eq, sql } from 'drizzle-orm'

const COINS_LIMIT = 10_000_000
const COINS_MIN = 0

type Delta = number

export async function adjustCoinsTx(
  tx: SqlTransaction,
  { userId, delta }: { userId: number; delta: Delta },
): Promise<number> {}

export async function adjustCoins({ userId, delta }: { userId: number; delta: Delta }): Promise<number> {
  return db.transaction((tx) => adjustCoinsTx(tx, { userId, delta }))
}
