import { db } from '@/lib/drizzle'
import type { OrderBy, Pagination } from '@/lib/types'
import { asc, desc, sql, type AnyColumn, type InferSelectModel, type SQL } from 'drizzle-orm'
import type { AnyMySqlTable } from 'drizzle-orm/mysql-core'

type TableCols<TTable extends AnyMySqlTable> = TTable['_']['columns']
type SelectRow<TTable extends AnyMySqlTable> = InferSelectModel<TTable>

export type PaginateArgs<TTable extends AnyMySqlTable, TCols extends Record<string, AnyColumn> = TableCols<TTable>> = {
  table: TTable
  columns: TCols
  where?: SQL
  page: number
  limit: number
  sortBy?: keyof TCols
  orderBy?: OrderBy
}

export async function getPaginatedData<TTable extends AnyMySqlTable>({
  table,
  columns,
  where,
  page = 1,
  limit,
  sortBy,
  orderBy = 'asc',
}: PaginateArgs<TTable>): Promise<{
  data: SelectRow<TTable>[]
  pagination: Pagination
}> {
  const offset = Math.max(0, (page - 1) * limit)

  const base = db.select().from(table)

  const withOrder =
    sortBy && columns[sortBy]
      ? orderBy === 'asc'
        ? base.orderBy(asc(columns[sortBy] as AnyColumn))
        : base.orderBy(desc(columns[sortBy] as AnyColumn))
      : base

  const withWhere = where ? withOrder.where(where) : withOrder

  const data = (await withWhere.limit(limit).offset(offset)) as unknown as InferSelectModel<TTable>[]

  const countBase = db.select({ total: sql<number>`count(*)` }).from(table)
  const [{ total }] = await (where ? countBase.where(where) : countBase)

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}
