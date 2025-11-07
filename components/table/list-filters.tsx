'use client'

import { DateRangePicker } from '@/components/shared/date-range-picker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useSearchParams } from '@/hooks/use-search-params'
import { Icons } from '@/lib/constants/icons'
import type { DateRange, SearchParamsBase } from '@/lib/server/params/pagination'
import { dateFormat } from '@/lib/zod/schemas'
import { format } from 'date-fns'
import * as React from 'react'

type FacetOption = { label: string; value: string }
export type FacetDef = {
  key: string
  label: string
  options: FacetOption[]
  multiple?: boolean
}

export function ListFilters({
  initial,
  dateRange,
  searchPlaceholder = 'Search…',
  searchKey = 'q',
  showDatePicker,
  facets = [],
  extra,
}: {
  initial: SearchParamsBase & Record<string, string | undefined>
  dateRange?: DateRange
  showDatePicker?: boolean
  searchPlaceholder?: string
  searchKey?: string
  facets?: FacetDef[]
  extra?: React.ReactNode
}) {
  const sp = useSearchParams()

  // Search (manual submit only)
  const [query, setQuery] = React.useState<string>(initial[searchKey] ?? '')

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sp.update({
      page: '1',
      [searchKey]: query.trim() ? query.trim() : undefined,
    } as SearchParamsBase)
  }

  const onFacetChange = (key: string, value?: string) => {
    sp.update({
      page: '1',
      [key]: value ?? undefined,
    } as SearchParamsBase)
  }

  const reset = () => sp.clear()

  return (
    <div className="mb-4">
      <div className="flex w-full items-center justify-between gap-2">
        <form onSubmit={onSearchSubmit} className="w-full">
          <Input
            icon={Icons.search}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full"
          />
        </form>
        <div className="flex items-center gap-2">
          {showDatePicker && (
            <DateRangePicker
              value={dateRange}
              onChange={(value) => {
                const from = value?.from
                const to = value?.to
                sp.update({
                  page: '1',
                  from: from ? format(from, dateFormat) : undefined,
                  to: to ? format(to, dateFormat) : undefined,
                } as SearchParamsBase)
              }}
            />
          )}
          {extra}
          <Button variant="secondary" onClick={reset} size="sm" title="Reset all filters">
            Clear
          </Button>
        </div>
      </div>
      {facets.length > 0 && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
          {facets.map((f) => {
            const current = initial[f.key] ?? ''
            return (
              <Select
                key={f.key}
                value={current}
                onValueChange={(value) => {
                  const selected = f.options.find((o) => o.value === value)
                  onFacetChange(f.key, selected?.value)
                }}
              >
                <SelectTrigger unstyled className="w-fit" aria-label={f.label}>
                  <Badge variant={current ? 'foreground' : 'primary'}>{(current || f.label).toLowerCase()}</Badge>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectGroup>
                    {/* Uncomment to add a per-facet clear option */}
                    {/* <SelectItem value="">All</SelectItem> */}
                    {f.options.map((o) => (
                      <SelectItem key={o.value} value={o.value} className="rounded-lg">
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
          })}
        </div>
      )}
    </div>
  )
}
