import type { PredefinedBadge } from '@/lib/features/badges/types'

export type FieldOptions<T, Extra = {}> = Array<
  {
    label: string
    value: T
  } & Extra
>

export type FieldOptionsWithPremium<T> = FieldOptions<T, { premium?: boolean }>

export type SearchParams = Record<string, string | undefined>

export type Params = Record<string, string>

export type PickedColumns<T> = Partial<Record<keyof T, true>>

export type ToggableBadge = PredefinedBadge & { checked: boolean }

export type OrderBy = 'asc' | 'desc'

export type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type Simplify<T> = { [K in keyof T]: T[K] } & {}

export type RecursivePathObject = {
  [key: string]: string | RecursivePathObject
}
