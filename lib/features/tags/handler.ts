'use server'

import type { TagInsert } from '@/lib/drizzle'
import { db, schema, SqlTransaction } from '@/lib/drizzle'
import { reorderRows } from '@/lib/drizzle/commands/reorder'
import type { Tag } from '@/lib/features/tags/schemas'
import { toNull } from '@/lib/utils'
import { and, eq, inArray } from 'drizzle-orm'
import { match, P } from 'ts-pattern'
import { getTags } from './queries'

export async function handleTags(userId: number, tags: Tag[]): Promise<Tag[]> {
  const finalIds: number[] = []

  await db.transaction(async (tx) => {
    for (const tag of tags) {
      const finalId = await match(tag.id)
        .with(P.number.gt(0), async () => await updateTag(tx, userId, tag))
        .with(P.number.lt(0), async () => await insertTag(tx, userId, tag))
        .otherwise(() => undefined)

      if (finalId) finalIds.push(finalId)

    }

    const idsToDelete = await getIdsToDelete(tx, userId, finalIds)

    if (idsToDelete.length > 0) {
      await tx.delete(schema.tags).where(and(eq(schema.tags.userId, userId), inArray(schema.tags.id, idsToDelete)))
    }
  })

  if (finalIds.length > 0) {
    await reorderRows({ userId, ids: finalIds, table: schema.tags })
  }

  return await getTags(userId)
}

async function insertTag(tx: SqlTransaction, userId: number, t: TagInsert): Promise<number> {
  const [{ insertId }] = await tx.insert(schema.tags).values({
    userId,
    label: t.label,
    iconName: toNull(t.iconName),
  })

  return insertId
}

async function updateTag(tx: SqlTransaction, userId: number, tag: Tag): Promise<number | undefined> {
  const [exists] = await tx
    .select({ id: schema.tags.id })
    .from(schema.tags)
    .where(and(eq(schema.tags.id, tag.id), eq(schema.tags.userId, userId)))
    .limit(1)

  if (!exists) return undefined

  await tx
    .update(schema.tags)
    .set({ label: tag.label, iconName: toNull(tag.iconName) })
    .where(and(eq(schema.tags.id, tag.id), eq(schema.tags.userId, userId)))

  return tag.id
}

async function getIdsToDelete(tx: SqlTransaction, userId: number, keepIds: number[]): Promise<number[]> {
  const existing = await tx.select({ id: schema.tags.id }).from(schema.tags).where(eq(schema.tags.userId, userId))
  return existing.map(({ id }) => id).filter((id) => !keepIds.includes(id))
}