import { Pagination } from '@/components/shared/pagination'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { LeaderboardCategory, LeaderboardUser } from '@/lib/analytics/queries/leaderboard'
import { getLeaderboardUsers, LeaderboardQueryArgs } from '@/lib/analytics/queries/leaderboard'
import { Icons } from '@/lib/constants/icons'
import { formatNumber } from '@/lib/utils'
import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { LEADERBOARD_CATEGORIES } from '@/lib/analytics/queries/leaderboard'
import type { FieldOptions, Pagination as PaginationType } from '@/lib/types'
import { humanize } from '@/lib/utils'

const leaderboardCategoryOptions = LEADERBOARD_CATEGORIES.map((value) => ({
  value,
  label: humanize(value),
})) satisfies FieldOptions<LeaderboardCategory>

export function LeaderboardTable({
  pagination,
  category,
}: {
  pagination: PaginationType
  category: LeaderboardCategory
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <TableHeader category={category} />
      <React.Suspense
        key={category + pagination.page}
        fallback={
          <div className="w-full space-y-2">
            {Array.from({ length: 10 }, (_, idx) => (
              <TableRow key={idx} loading />
            ))}
          </div>
        }
      >
        <TableRows pagination={pagination} category={category} />
      </React.Suspense>
      <Pagination pagination={pagination} buttonSize="icon-md" />
    </div>
  )
}

async function TableRows({ pagination, category }: { pagination: PaginationType; category: LeaderboardCategory }) {
  const getLeaderboardUsersCached = unstable_cache(
    async (args: LeaderboardQueryArgs) => {
      return await getLeaderboardUsers(args)
    },
    ['leaderboard'],
    { revalidate: 3600 * 24 },
  )

  const data = await getLeaderboardUsersCached({ page: pagination.page, category })
  return (
    <div className="w-full space-y-2">
      {data.map((user, idx) => (
        <TableRow key={idx} user={user} />
      ))}
    </div>
  )
}

function TableHeader({ category }: { category?: LeaderboardCategory }) {
  return (
    <div className="group flex h-full w-full items-center justify-between pl-4">
      <div className="flex items-center">
        <div className="py-1.5 text-center text-xs">#</div>
        <div className="ml-2 text-xs">User</div>
      </div>
      <div className="flex items-center gap-2">
        {leaderboardCategoryOptions.map((option) => {
          if (category === option.value) {
            return (
              <Link key={option.value} href={`?category=${option.value === 'views' ? 'coins' : 'views'}`} passHref>
                <Card className="flex flex-row items-center gap-x-1 rounded-md p-1.5 pl-2 duration-300 hover:opacity-80">
                  <span className="text-foreground text-xs">{option.label}</span>
                  <Icons.chevronsUpDown className="text-muted-foreground ml-auto size-3" />
                </Card>
              </Link>
            )
          }
        })}
      </div>
    </div>
  )
}

function TableRow({ user, loading = false }: { user?: LeaderboardUser; loading?: boolean }) {
  return (
    <Link
      href={`/${user?.username}`}
      data-disabled={!user}
      target="_blank"
      rel="noopener noreferrer"
      passHref
      className="block w-full"
    >
      <Card className="flex w-full flex-row items-center justify-between gap-4 rounded-xl p-3">
        <div className="flex h-full items-center gap-4">
          <div className="bg-muted flex size-6 items-center justify-center rounded-full">
            {user ? <span className="text-xs">{user.rank}</span> : <Skeleton className="mx-auto h-3 w-6" />}
          </div>
          <div className="flex items-center gap-2">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                unoptimized
                width={32}
                height={32}
                className="size-7 shrink-0 rounded-full"
              />
            ) : (
              loading && <Skeleton className="size-7 rounded-full" />
            )}
            {user ? (
              <div className="text-sm font-medium text-white">{user.name || user.username}</div>
            ) : (
              <Skeleton className="ml-2 h-3 w-20" />
            )}
          </div>
        </div>
        <div className="flex h-full w-16 items-center justify-center text-white">
          {user ? (
            <span className="text-xs font-medium">
              {formatNumber(user.stats, {
                abbreviation: true,
              })}
            </span>
          ) : (
            <Skeleton className="h-3 w-10" />
          )}
        </div>
      </Card>
    </Link>
  )
}
