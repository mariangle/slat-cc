'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagsInput } from '@/components/ui/tags-input'
import { SORT_BY_OPTIONS, TEMPLATE_PLANS, type SortByOption, type TemplatePlan } from '@/lib/features/templates/types'

import { useSearchParams } from '@/hooks/use-search-params'
import type { TemplatesFilters } from '@/lib/features/templates/types'
import { parseTags, unparseTags } from '@/lib/features/templates/utils'
import { FieldOptions } from '@/lib/types'
import { humanize } from '@/lib/utils'
import * as React from 'react'
import { BiSortAlt2 } from 'react-icons/bi'
import { RiFilter3Fill } from 'react-icons/ri'

const typeOptions = TEMPLATE_PLANS.map((value) => ({
  value,
  label: humanize(value),
})) satisfies FieldOptions<TemplatePlan>

const sortByOptions = SORT_BY_OPTIONS.map((value) => ({
  value,
  label: humanize(value),
})) satisfies FieldOptions<SortByOption>

export function TemplatesFilter({ filters: initialFilters }: { filters: TemplatesFilters }) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = React.useState<Partial<TemplatesFilters>>({
    plan: initialFilters.plan || 'all',
    sortBy: initialFilters.sortBy || 'popular',
    tags: initialFilters.tags,
  })

  const updateSearchParams = (params: Partial<TemplatesFilters>) => {
    const updatedParams: TemplatesFilters = {
      ...initialFilters,
      ...params,
      page: '1',
    }

    searchParams.update({
      sortBy: updatedParams.sortBy,
      plan: updatedParams.plan,
      tags: updatedParams.tags,
      page: updatedParams.page?.toString(),
    } satisfies TemplatesFilters)
  }

  return (
    <div className="flex flex-row justify-end gap-x-3 sm:items-center">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 text-sm font-medium">
            Filter
            <RiFilter3Fill className="text-muted-foreground h-5 w-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="border-b p-3">
            <h3 className="text-sm font-medium">Filters</h3>
          </div>
          <div className="space-y-3 p-3">
            <div className="space-y-1">
              <h4 className="text-muted-foreground text-xs font-medium">Tags</h4>
              <TagsInput
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, tags: unparseTags(value) }))
                  updateSearchParams({ tags: value.join(',') })
                }}
                value={parseTags(filters.tags ?? '')}
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-muted-foreground text-xs font-medium">Filter by</h4>
              <Select
                value={filters.plan}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, plan: value as TemplatePlan }))
                  updateSearchParams({ plan: value as TemplatePlan })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    {typeOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center border-t p-3">
            <button
              className="text-muted-foreground hover:text-foreground text-xs underline focus:outline-none"
              onClick={() => searchParams.clear()}
            >
              Clear filters
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <Select
        value={filters.sortBy}
        onValueChange={(value) => {
          setFilters((prev) => ({ ...prev, sortBy: value as SortByOption }))
          updateSearchParams({
            sortBy: value as SortByOption,
          })
        }}
      >
        <SelectTrigger unstyled className="flex w-fit items-center gap-2 text-sm font-medium">
          Sort by
          <BiSortAlt2 className="text-muted-foreground h-5 w-5" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {sortByOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
