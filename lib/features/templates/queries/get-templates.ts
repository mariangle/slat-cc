import type { TemplateView } from '@/lib/features/templates/schemas'
import { parseTags } from '@/lib/features/templates/utils'
import { db, schema } from '@slat/db'
import { eq, sql, type SQL } from 'drizzle-orm'

type GetTemplatesPageArgs = {
  where?: SQL
  orderBy?: SQL
  viewerId?: number
  page: number
  limit: number
}

export async function getTemplates({
  where,
  orderBy,
  viewerId,
  page,
  limit,
}: GetTemplatesPageArgs): Promise<{ items: TemplateView[]; total: number }> {
  const t = schema.templates
  const u = schema.users
  const b = schema.biolinks
  const fav = schema.templateFavorites
  const uses = schema.templateUses

  const favoriteCountSql = sql<number>`(SELECT COUNT(*) FROM ${fav} WHERE ${fav.templateId} = ${t.id})`
  const useCountSql = sql<number>`(SELECT COUNT(*) FROM ${uses} WHERE ${uses.templateId} = ${t.id})`
  const favoritedByViewerSql =
    viewerId != null
      ? sql<number>`EXISTS(SELECT 1 FROM ${fav} WHERE ${fav.templateId} = ${t.id} AND ${fav.userId} = ${viewerId})`
      : sql<number>`0`
  const usedByViewerSql =
    viewerId != null
      ? sql<number>`EXISTS(SELECT 1 FROM ${uses} WHERE ${uses.templateId} = ${t.id} AND ${uses.userId} = ${viewerId})`
      : sql<number>`0`

  const q = db
    .select({
      template: {
        id: t.id,
        name: t.name,
        isPublic: t.isPublic,
        image: t.image,
        tags: t.tags,
        isPremiumRequired: t.isPremiumRequired,
        createdAt: t.createdAt,
        userId: t.userId,
      },
      author: { username: u.username, name: b.name, avatar: b.avatar },
      favoriteCount: favoriteCountSql,
      useCount: useCountSql,
      favoritedByViewer: favoritedByViewerSql,
      usedByViewer: usedByViewerSql,
    })
    .from(t)
    .leftJoin(u, eq(t.userId, u.id))
    .leftJoin(b, eq(u.id, b.userId))

  if (where) q.where(where)
  if (orderBy) q.orderBy(orderBy)

  const offset = Math.max(0, (page - 1) * limit)
  q.limit(limit).offset(offset)

  const rows = await q

  const items: TemplateView[] = rows.map((r) => ({
    id: r.template.id,
    name: r.template.name,
    isPublic: r.template.isPublic,
    image: r.template.image || undefined,
    tags: parseTags(r.template.tags),
    isPremiumRequired: r.template.isPremiumRequired,
    createdAt: r.template.createdAt,
    author: {
      id: r.template.userId,
      username: r.author.username ?? '',
      name: r.author.name ?? undefined,
      avatar: r.author.avatar ?? undefined,
    },
    metrics: {
      favorites: { count: r.favoriteCount, byViewer: Boolean(r.favoritedByViewer) },
      uses: { count: r.useCount, byViewer: Boolean(r.usedByViewer) },
    },
    isOwned: r.template.userId === viewerId,
  }))

  const countQ = db.select({ total: sql<number>`COUNT(*)` }).from(t)
  const [{ total }] = await (where ? countQ.where(where) : countQ)

  return { items, total }
}
