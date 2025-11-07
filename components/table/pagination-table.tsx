import { Pagination as PaginationType } from '@/components/shared/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { OrderBy, Pagination } from '@/lib/types'
import { cn } from '@/lib/utils'
import React from 'react'
import { TableColumnHeader } from './table-column-header'

export type Column<Row, SortKey extends string> = {
  key?: Extract<keyof Row, string>
  label: string
  sortKey?: SortKey
  render?: (row: Row) => React.ReactNode
  className?: string
}

export type PaginationTableProps<Row, SortKey extends string> = {
  rows: Row[]
  limits?: number[]
  pagination?: Pagination
  currentSortBy?: SortKey
  currentOrderBy?: OrderBy
  columns: Array<Column<Row, SortKey>>
  className?: string
}

export default function PaginationTable<Row, SortKey extends string>({
  rows,
  limits,
  pagination,
  currentSortBy,
  currentOrderBy,
  columns,
  className,
}: PaginationTableProps<Row, SortKey>) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="overflow-hidden rounded-md border">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="text-left">
              {columns.map((c, idx) => {
                const id = c.key ?? c.sortKey ?? `col`
                return (
                  <TableHead key={`${id}-${idx}`} className={cn('px-3 py-2 font-medium', c.className)}>
                    {c.sortKey ? (
                      <TableColumnHeader
                        label={c.label}
                        sortKey={c.sortKey}
                        currentSortBy={currentSortBy}
                        currentOrderBy={currentOrderBy}
                      />
                    ) : (
                      c.label
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row, i) => (
                <TableRow key={i} className="border-t">
                  {columns.map((c, idx) => (
                    <TableCell key={`${i}-${idx}`} className={cn('px-3 py-2', c.className)}>
                      {c.render ? c.render(row) : c.key ? (row as any)[c.key] : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-muted-foreground px-3 py-10 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <PaginationType pagination={pagination} limits={limits} />}
    </div>
  )
}
