import { Button } from '@/components/ui/button'
import { DATA_TABLE_LIMITS } from '@/lib/analytics/utils'
import type { GiveawayRow } from '@/lib/drizzle'
import { schema } from '@/lib/drizzle'
import { getPaginatedData } from '@/lib/drizzle/commands/paginate'
import { GiveawayStatus, giveawayStatuses } from '@/lib/drizzle/enums'
import { getRewardDetails } from '@/lib/features/giveaways/utils'
import { isSuperAdmin } from '@/lib/features/users/roles'
import { getPaginationArgs, toTypeOrUndefined, type SearchParamsBase } from '@/lib/server/params/pagination'
import { formatDate, formatDateTime } from '@/lib/utils'
import { and, eq, getTableColumns, SQL } from 'drizzle-orm'
import { FaCirclePlus } from 'react-icons/fa6'
import { FacetDef, ListFilters } from '../_components/list-filters'
import PaginationTable, { type Column } from '../_components/pagination-table'
import { GiveawayFormDialog } from './_components/giveaway-form'

type SortKey = 'id' | 'createdAt' | 'title' | 'status' | 'drawnAt'

type GiveawaysSearchParams = SearchParamsBase & { status?: GiveawayStatus }

export default async function GiveawaysPage({ searchParams }: { searchParams: Promise<GiveawaysSearchParams> }) {
  const filters = await searchParams

  const { page, limit, limits, sortBy, orderBy } = getPaginationArgs<SortKey>(filters, {
    limits: DATA_TABLE_LIMITS,
  })

  const status = toTypeOrUndefined<GiveawayStatus>(filters.status)

  const conds: SQL[] = []

  if (status) {
    conds.push(eq(schema.giveaways.status, status))
  }

  const admin = await isSuperAdmin()

  const where = conds.length ? and(...conds) : undefined

  const { data, pagination } = await getPaginatedData({
    table: schema.giveaways,
    columns: getTableColumns(schema.giveaways),
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
      options: giveawayStatuses.map((value) => ({ label: value, value })),
    },
  ]

  const columns: Array<Column<GiveawayRow, SortKey>> = [
    { key: 'id', label: 'ID', sortKey: 'id', className: 'w-[90px]' },
    { key: 'title', label: 'Title', sortKey: 'title' },
    { key: 'status', label: 'Status', sortKey: 'status' },
    { key: 'winnerCount', label: 'Winners', render: (r) => r.winnerCount.toString() },
    { key: 'endsAt', label: 'Ends', render: (r) => formatDate(r.endsAt) },
    { key: 'rewardId', label: 'Reward', render: (r) => getRewardDetails(r.rewardId)?.name ?? '—' },
    {
      key: 'drawnAt',
      label: 'Drawn At',
      sortKey: 'drawnAt',
      render: (r) => (r.drawnAt ? formatDateTime(r.drawnAt) : '—'),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortKey: 'createdAt',
      render: (r) => formatDateTime(r.createdAt),
    },
    {
      label: 'Actions',
      render: (row) => (
        <GiveawayFormDialog
          giveaway={row}
          isSuperAdmin={admin}
          trigger={<button className="text-primary underline">edit</button>}
        />
      ),
    },
  ]

  return (
    <>
      <ListFilters
        initial={filters}
        facets={facets}
        searchPlaceholder="Search User ID..."
        extra={
          <GiveawayFormDialog
            isSuperAdmin={admin}
            trigger={
              <Button variant="primary-solid" size="sm">
                <FaCirclePlus className="size-4" />
                New Giveaway
              </Button>
            }
          />
        }
      />
      <PaginationTable<GiveawayRow, SortKey>
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
