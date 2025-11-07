import * as React from 'react'

import { IconContainer } from '@/components/shared/icon-container'
import { Card } from '@/components/ui/card'
import { Skeleton, SkeletonContent } from '@/components/ui/skeleton'
import { getTimeInterval } from '@/lib/analytics/intervals'
import { AnalyticsArgs } from '@/lib/analytics/types'
import { Formatter } from '@/lib/casino/utils/formatters'
import { db, schema } from '@/lib/drizzle'
import { getViewsCount } from '@/lib/features/profile/queries/views'
import { getDisplayUserId } from '@/lib/features/users/utils'
import { withSession } from '@/lib/server/guards'
import { eq } from 'drizzle-orm'
import { IconType } from 'react-icons'
import { FiHash } from 'react-icons/fi'
import { LuEye, LuUser } from 'react-icons/lu'
import { AnalyticsChartCards, AnalyticsChartCardsSkeleton } from './_components/analytics-charts'
import { CasinoStatsCard, CasinoStatsCardSkeleton } from './_components/casino-stats-card'
import { GiveawaysCard, GiveawaysCardSkeleton } from './_components/giveaways-card'
import { QuickLinksCard } from './_components/quick-links-card'
import { SeasonalBadgesCard, SeasonalBadgesCardSkeleton } from './_components/seasonal-badges-card'

export const metadata = {
  title: 'Overview',
}

const getUser = React.cache(async () => {
  return withSession(async (resolvedUserId) => {
    const [user = undefined] = await db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        biolinkId: schema.biolinks.id,
        coins: schema.users.coins,
      })
      .from(schema.users)
      .innerJoin(schema.biolinks, eq(schema.biolinks.userId, schema.users.id))
      .where(eq(schema.users.id, resolvedUserId))

    return user
  })
})

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{
    interval?: string
  }>
}) {
  const { interval } = await searchParams
  const user = await getUser()

  if (!user) return null

  const args: AnalyticsArgs = {
    biolinkId: user.biolinkId,
    userId: user.id,
    interval: getTimeInterval(interval),
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <React.Suspense fallback={<StatsCardSkeleton />}>
          <SuspenseViewsStatsCard />
        </React.Suspense>
        <StatsCard value={Formatter.formatNumber(getDisplayUserId(user.id))} label="User ID" icon={FiHash} />
        <StatsCard value={user.username} label="Username" icon={LuUser} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-7">
        <React.Suspense fallback={<SeasonalBadgesCardSkeleton />}>
          <SeasonalBadgesCard userId={user.id} />
        </React.Suspense>
        <QuickLinksCard userId={user.id} />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* <React.Suspense fallback={<CasinoActivityCardSkeleton />}>
          <CasinoActivityCard />
        </React.Suspense> */}
        <React.Suspense fallback={<GiveawaysCardSkeleton />}>
          <GiveawaysCard userId={user.id} />
        </React.Suspense>
        <React.Suspense fallback={<CasinoStatsCardSkeleton />}>
          <CasinoStatsCard userId={user.id} />
        </React.Suspense>
      </div>
      <React.Suspense fallback={<AnalyticsChartCardsSkeleton />}>
        <AnalyticsChartCards args={args} />
      </React.Suspense>
      {/* <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <React.Suspense fallback={<CountriesAnalyticsCardSkeleton />}>
          <CountriesAnalyticsCard args={args} />
        </React.Suspense>
      </div> */}
    </>
  )
}

async function SuspenseViewsStatsCard() {
  const views = await getViewsCount()

  return <StatsCard label="Profile Views" value={views.toString()} icon={LuEye} />
}

const StatsCard = ({ label, value, icon: Icon }: { label: string; value: string; icon: IconType }) => {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-x-4">
        <IconContainer icon={Icon} size="xl" />
        <div>
          <div className="text-foreground max-w-full truncate overflow-hidden text-xl font-semibold">{value}</div>
          <div className="text-muted-foreground text-sm">{label}</div>
        </div>
      </div>
    </Card>
  )
}

function StatsCardSkeleton() {
  return (
    <Skeleton className="space-y-2 p-5">
      <div className="space-y-3">
        <SkeletonContent className="h-[12px] w-1/4" />
        <SkeletonContent className="h-[24px] w-1/2" />
      </div>
      <SkeletonContent className="h-[16px] w-1/3" />
    </Skeleton>
  )
}
