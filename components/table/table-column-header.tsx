'use client'

import { useSearchParams } from '@/hooks/use-search-params'
import { Icons } from '@/lib/constants/icons'
import { SearchParamsBase } from '@/lib/server/params/pagination'
import type { OrderBy } from '@/lib/types'
import { cn } from '@/lib/utils'
import { match } from 'ts-pattern'

const getNextOrder = (currentOrderBy: OrderBy | undefined): OrderBy | undefined => {
  return match(currentOrderBy)
    .returnType<OrderBy | undefined>()
    .with(undefined, () => 'asc')
    .with('asc', () => 'desc')
    .with('desc', () => undefined)
    .exhaustive()
}

export function TableColumnHeader({
  label,
  sortKey,
  currentSortBy,
  currentOrderBy,
}: {
  label: string
  sortKey: string
  currentSortBy?: string
  currentOrderBy?: OrderBy
}) {
  const sp = useSearchParams()
  const active = currentSortBy === sortKey

  const onClick = () => {
    const nextOrder = getNextOrder(currentOrderBy)

    sp.update({
      page: '1',
      sortBy: nextOrder ? sortKey : undefined,
      orderBy: nextOrder,
    } satisfies Partial<SearchParamsBase>)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('inline-flex items-center gap-1', active && 'text-foreground')}
    >
      <span>{label}</span>
      {active ? (
        currentOrderBy === 'asc' ? (
          <Icons.arrowUp className="h-3 w-3" />
        ) : (
          <Icons.arrowDown className="h-3 w-3" />
        )
      ) : (
        <Icons.chevronsUpDown className="text-muted-foreground h-3 w-3" />
      )}
    </button>
  )
}
