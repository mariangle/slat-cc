export type TimeInterval = {
  value: string // machine-readable key, e.g. '365d'
  label: string // display name
  days: number // number of days
}

export type AnalyticsArgs = {
  userId: number
  biolinkId: number
  interval: TimeInterval
}

export type WeeklyComparison = {
  thisWeek: number
  lastWeek: number
  difference: number
  percentageChange: number
}

export type ChartData = {
  date: string
  count: number
}[]

export type ClicksAnalytics = {
  weeklyComparison: WeeklyComparison
  total: number
  links: LinkAnalytics[]
}

export type LinkAnalytics = {
  label: string
  clicks: number
  fill: string
  target: string
}

export type ViewsAnalytics = {
  weeklyComparison: WeeklyComparison
  visitors: VisitorsAnalytics
  countries: CountryAnalytics[]
}

export type CountryAnalytics = {
  name: string
  countryCode: string
  visitors: number
  fill: string
}

export type VisitorsAnalytics = {
  total: number
  average: number
  data: ChartData
}
