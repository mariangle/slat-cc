import { Button } from '@/components/ui/button'
import { SquareBadge, SquareBadgeColor } from '@/components/ui/square-badge'
import { DATA_TABLE_LIMITS } from '@/lib/analytics/utils'
import type { ApiKeyRow } from '@/lib/drizzle'
import { schema } from '@/lib/drizzle'
import { getPaginatedData } from '@/lib/drizzle/commands/paginate'
import { isSuperAdmin } from '@/lib/features/users/roles'
import {
  getPaginationArgs,
  toIntOrUndefined,
  toTypeOrUndefined,
  type SearchParamsBase,
} from '@/lib/server/params/pagination'
import { formatDateTime } from '@/lib/utils'
import { and, eq, getTableColumns, gt, isNotNull, isNull, like, lte, type SQL } from 'drizzle-orm'
import { FaCirclePlus } from 'react-icons/fa6'
import { match, P } from 'ts-pattern'
import { ListFilters, type FacetDef } from '../_components/list-filters'
import PaginationTable, { type Column } from '../_components/pagination-table'
import { ApiKeyFormDialog } from './_components/api-key-form'

type SortKey = 'id' | 'userId' | 'name' | 'prefix' | 'expiresAt' | 'revokedAt' | 'createdAt' | 'updatedAt'

type ApiKeyStatus = 'active' | 'revoked' | 'expired'

type ApiKeysSearchParams = SearchParamsBase & {
  status?: ApiKeyStatus
  userId?: string
}

export default async function ApiKeysPage({ searchParams }: { searchParams: Promise<ApiKeysSearchParams> }) {
  const filters = await searchParams

  const { page, limit, limits, sortBy, orderBy } = getPaginationArgs<SortKey>(filters, {
    limits: DATA_TABLE_LIMITS,
  })

  const admin = await isSuperAdmin()
  const q = toTypeOrUndefined<string>(filters.q)
  const status = toTypeOrUndefined<ApiKeyStatus>(filters.status)
  const userId = toIntOrUndefined(filters.userId)

  const conds: (SQL | undefined)[] = []

  if (q) {
    const pattern = `%${q}%`
    conds.push(like(schema.apiKeys.userId, pattern))
  }

  if (userId !== undefined) {
    conds.push(eq(schema.apiKeys.userId, userId))
  }

  const now = new Date()
  if (status === 'revoked') {
    conds.push(isNotNull(schema.apiKeys.revokedAt))
  } else if (status === 'active') {
    conds.push(and(isNull(schema.apiKeys.revokedAt), gt(schema.apiKeys.expiresAt, now)))
  } else if (status === 'expired') {
    conds.push(and(isNull(schema.apiKeys.revokedAt), lte(schema.apiKeys.expiresAt, now)))
  }

  const where = conds.filter(Boolean).length ? and(...(conds.filter(Boolean) as SQL[])) : undefined

  const { data, pagination } = await getPaginatedData({
    table: schema.apiKeys,
    columns: getTableColumns(schema.apiKeys),
    sortBy,
    orderBy,
    page,
    limit,
    where,
  })

  const facets: FacetDef[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Revoked', value: 'revoked' },
        { label: 'Expired', value: 'expired' },
      ],
    },
  ]

  const columns: Array<Column<ApiKeyRow, SortKey>> = [
    { key: 'id', label: 'ID', sortKey: 'id', className: 'w-[90px]' },
    { key: 'userId', label: 'User ID', sortKey: 'userId', className: 'w-[110px]' },
    { key: 'name', label: 'Name', sortKey: 'name', className: 'w-[110px]' },
    {
      key: 'prefix',
      label: 'Prefix',
      sortKey: 'prefix',
      className: 'font-mono',
      render: (r) => <span className="font-mono">{r.prefix}</span>,
    },

    {
      label: 'Status',
      render: (r) => {
        const getStatus = (row: ApiKeyRow, now = new Date()): ApiKeyStatus =>
          match(row)
            .returnType<ApiKeyStatus>()
            .with({ revokedAt: P.nonNullable }, () => 'revoked')
            .with({ expiresAt: P.when((d) => d != null && d <= now) }, () => 'expired')
            .otherwise(() => 'active')

        const statusToColor: Record<ApiKeyStatus, SquareBadgeColor> = {
          active: 'green',
          revoked: 'yellow',
          expired: 'indigo',
        }

        return <SquareBadge color={statusToColor[getStatus(r)] ?? 'blue'}>{getStatus(r)}</SquareBadge>
      },
    },
    {
      key: 'expiresAt',
      label: 'Expires',
      sortKey: 'expiresAt',
      render: (r) => (r.expiresAt ? formatDateTime(r.expiresAt) : '—'),
    },
    {
      key: 'revokedAt',
      label: 'Revoked',
      sortKey: 'revokedAt',
      render: (r) => (r.revokedAt ? formatDateTime(r.revokedAt) : '—'),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortKey: 'createdAt',
      render: (r) => (r.createdAt ? formatDateTime(r.createdAt) : '—'),
    },
    {
      label: 'Actions',
      render: (row) => (
        <ApiKeyFormDialog
          isSuperAdmin={admin}
          apiKey={row}
          trigger={<button className="text-primary underline">edit</button>}
        />
      ),
    },
  ]

  return (
    <>
      <ListFilters
        initial={filters}
        searchPlaceholder="Search User ID..."
        facets={facets}
        extra={
          <ApiKeyFormDialog
            isSuperAdmin={admin}
            apiKey={null}
            trigger={
              <Button variant="primary-solid" size="sm">
                <FaCirclePlus className="size-4" />
                New API Key
              </Button>
            }
          />
        }
      />
      <PaginationTable<ApiKeyRow, SortKey>
        rows={data}
        pagination={pagination}
        currentSortBy={sortBy}
        currentOrderBy={orderBy}
        columns={columns}
        limits={limits}
      />
    </>
  )
}
