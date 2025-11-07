import type { AnalyticsArgs, CountryAnalytics, TimeInterval, ViewsAnalytics, VisitorsAnalytics } from '@/lib/analytics/types'
import { getChartData, getHSLColor, getWeeklyComparison } from '@/lib/analytics/utils'
import { countries } from '@/lib/constants/countries'
import { db, schema } from '@slat/db'
import { and, desc, eq, sql } from 'drizzle-orm'

type ViewsRaw = Awaited<ReturnType<typeof fetchViewsData>>

export async function fetchViewsAnalytics(args: AnalyticsArgs): Promise<ViewsAnalytics> {
  const data = await fetchViewsData(args)

  return {
    visitors: getVisitorsAnalytics(data, args.interval),
    weeklyComparison: getWeeklyComparison(data),
    countries: getCountryAnalytics(data),
  }
}

async function fetchViewsData(args: AnalyticsArgs) {
  return await db
    .select({
      createdAt: schema.views.createdAt,
      countryCode: schema.views.countryCode,
    })
    .from(schema.views)
    .where(
      and(
        eq(schema.views.biolinkId, args.biolinkId),
        sql.raw(`created_at >= DATE_SUB(NOW(), INTERVAL ${args.interval.days} DAY)`),
      ),
    )
    .orderBy(desc(schema.views.createdAt))
}

function getVisitorsAnalytics(data: { createdAt: Date }[], interval: TimeInterval): VisitorsAnalytics {
  const chartData = getChartData(data, interval.days)
  const totalVisitors = chartData.reduce((sum, entry) => sum + entry.count, 0)
  const averageVisitors = Math.round(totalVisitors / chartData.length)

  return {
    total: totalVisitors,
    average: averageVisitors,
    data: chartData,
  }
}

function getCountryAnalytics(data: ViewsRaw): CountryAnalytics[] {
  const countryViewsMap: Record<string, number> = {}

  data.forEach(({ countryCode }) => {
    if (countryCode) {
      countryViewsMap[countryCode] = (countryViewsMap[countryCode] || 0) + 1
    }
  })

  return countries
    .map((country, index) => ({
      name: country.name,
      visitors: countryViewsMap[country.code] || 0,
      countryCode: country.code,
      fill: getHSLColor(index),
    }))
    .filter((country) => country.visitors > 0)
    .sort((a, b) => b.visitors - a.visitors)
}
