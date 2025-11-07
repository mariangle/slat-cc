'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSearchParams } from '@/hooks/use-search-params'
import type { FieldOptions } from '@/lib/types'

export type TabOptions<T> = FieldOptions<T, { searchParams: Record<string, string> }>

export function TabsNavigation<T>({ value, options }: { value: string; options: TabOptions<T> }) {
  const searchParams = useSearchParams()

  return (
    <Tabs value={value} className="w-fit">
      <TabsList className="w-fit">
        {options.map((item) => (
          <TabsTrigger
            key={item.label}
            value={item.value as string}
            onClick={() => searchParams.update(item.searchParams)}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
