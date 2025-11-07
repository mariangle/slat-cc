'use server'

import { reorderRows } from '@/lib/drizzle/commands/reorder'
import { requireActionSession } from '@/lib/server/guards'
import { schema } from '@slat/db'

export const reorderTags = requireActionSession(async (userId: number, ids: number[]) => {
  await reorderRows({ userId, ids, table: schema.tags })
})
