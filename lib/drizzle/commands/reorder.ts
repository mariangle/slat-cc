'use server'

import { db } from '@slat/db'
import { sql } from 'drizzle-orm'
import type { AnyMySqlColumn, AnyMySqlTable } from 'drizzle-orm/mysql-core'

type Columns = {
  id: AnyMySqlColumn
  userId: AnyMySqlColumn
  sortOrder: AnyMySqlColumn
}

type ReorderArgs = {
  userId: number
  ids: number[]
  table: AnyMySqlTable
  columns?: Columns
}

export async function reorderRows({ userId, ids, table, columns }: ReorderArgs) {
  if (ids.length === 0) return

  const cols = resolveColumns(table, columns)

  const caseWhenClauses = ids.map(
    (id, index) => sql`
    WHEN ${cols.id} = ${id} THEN ${index + 1}
  `,
  )

  const idList = sql.join(
    ids.map((id) => sql`${id}`),
    sql`, `,
  )

  await db.execute(sql`
    UPDATE ${table}
    SET ${cols.sortOrder} = CASE
      ${sql.join(caseWhenClauses, sql` `)}
    END
    WHERE ${cols.userId} = ${userId}
      AND ${cols.id} IN (${idList})
  `)
}

function resolveColumns(table: AnyMySqlTable, columns?: Columns): Columns {
  if (columns) return columns
  const t = table as unknown as Partial<Record<'id' | 'userId' | 'sortOrder', AnyMySqlColumn>>
  if (!t.id || !t.userId || !t.sortOrder) {
    throw new Error('Could not resolve columns for reorder operation. Please provide columns explicitly.')
  }
  return { id: t.id, userId: t.userId, sortOrder: t.sortOrder }
}
