import { toUndefined } from '@/lib/utils'
import { db, schema, TagRow } from '@slat/db'
import { asc } from 'drizzle-orm'
import { Tag } from './schemas'

export async function getTags(userId: number): Promise<Tag[]> {
  const tags = await db.query.tags.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
    orderBy: asc(schema.tags.sortOrder),
  })

  return tags.map(formatTag)
}

const formatTag = (tag: TagRow): Tag => {
  return {
    id: tag.id,
    iconName: toUndefined(tag.iconName),
    label: tag.label,
  }
}
