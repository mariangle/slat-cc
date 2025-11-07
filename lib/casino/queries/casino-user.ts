import { db } from '@/lib/drizzle'
import { casinoUserColumns } from '@/lib/features/users/types'

export async function getCasinoUserById(userId: number) {
  return await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
    columns: casinoUserColumns,
  })
}
