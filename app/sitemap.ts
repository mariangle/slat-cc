import { APP_CONFIG } from '@/lib/config'
import { alternatives } from '@/lib/constants/alternatives'
import { db, schema } from '@/lib/drizzle'
import { AppPath } from '@/lib/routes/paths'
import { subMonths } from 'date-fns'
import { and, gte, isNotNull } from 'drizzle-orm'
import { MetadataRoute } from 'next'

const fetchActiveUsers = async (): Promise<{ username: string }[]> => {
  return await db
    .select({ username: schema.users.username })
    .from(schema.users)
    .where(and(gte(schema.users.lastLogin, subMonths(new Date(), 6)), isNotNull(schema.users.lastLogin)))
}

const entries: Partial<Record<AppPath, number>> = {
  '/': 1,
  '/login': 0.9,
  '/register': 0.9,
  '/docs': 0.8,
  '/casino/hall-of-fame': 0.8,
  '/casino': 0.8,
  '/leaderboard': 0.5,
  '/terms-of-service': 0.5,
  '/privacy-policy': 0.5,
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const users = await fetchActiveUsers()

  const staticEntries = Object.entries(entries).map(([path, priority]) => ({
    url: `${APP_CONFIG.baseUrl}${path}`,
    lastModified,
    priority,
  }))

  const userEntries = users.map(({ username }) => ({
    url: `/${username}`,
    lastModified,
    priority: 0.7,
  }))

  const alternativeEntries = Object.keys(alternatives).map((slug) => ({
    url: `/${slug}`,
    lastModified,
    priority: 0.6,
  }))

  return [...staticEntries, ...userEntries, ...alternativeEntries]
}
