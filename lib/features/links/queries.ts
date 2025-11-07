import { withSession } from '@/lib/server/guards'
import { db, schema } from '@slat/db'
import { asc } from 'drizzle-orm'
import { formatLink } from './format'
import type { Link } from './schemas'

export async function getLinks(userId?: number): Promise<Link[]> {
  return withSession(
    async (resolvedUserId) => {
      const rows = await db.query.links.findMany({
        where: (links, { eq }) => eq(links.userId, resolvedUserId),
        orderBy: asc(schema.links.sortOrder),
      })

      return rows.map(formatLink)
    },
    { userId, fallback: () => [] },
  )
}
