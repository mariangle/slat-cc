import type { SearchParamsBase } from '@/lib/server/params/pagination'

export const TEMPLATE_PLANS = ['all', 'free', 'premium'] as const
export type TemplatePlan = (typeof TEMPLATE_PLANS)[number]

export const SORT_BY_OPTIONS = ['popular', 'newest', 'oldest'] as const
export type SortByOption = (typeof SORT_BY_OPTIONS)[number]

export type TemplatesFilters = SearchParamsBase & {
  tags?: string
  plan?: string
  sortBy?: SortByOption
}
