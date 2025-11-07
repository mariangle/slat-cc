import { db } from '@/lib/drizzle'
import { withSession } from '@/lib/server/guards'

export async function getCoins(userId?: number): Promise<number> {
  return withSession(
    async (resolvedUserId) => {
      const row = await db.query.users.findFirst({
        where: (t, { eq }) => eq(t.id, resolvedUserId),
        columns: { coins: true },
      })
      return row?.coins ?? 0
    },
    { userId, fallback: () => 0 },
  )
}
