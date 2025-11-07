import { CardBlock, SkeletonBlock } from '@/components/dashboard/profile-elements'
import { Button } from '@/components/ui/button'
import { Icons } from '@/lib/constants/icons'
import type { LinkStyle } from '@/lib/drizzle/enums'
import * as React from 'react'

export function LinkStylePicker({ value, onChange }: { value: LinkStyle; onChange: (value: LinkStyle) => void }) {
  const options = [
    {
      value: 'icon',
      label: 'Icon',
      render: () => (
        <SkeletonBlock className="grid size-8 shrink-0 place-content-center rounded-full">
          <Icons.globe className="size-6 text-white" />
        </SkeletonBlock>
      ),
    },
    {
      value: 'card',
      label: 'Card',
      render: () => (
        <CardBlock className="relative flex h-10 w-full max-w-[150px] items-center gap-2 rounded-md border border-white/10 bg-white/15 p-3 px-1.5">
          <SkeletonBlock className="grid size-6 shrink-0 place-content-center rounded-full">
            <Icons.globe className="size-4 text-white" />
          </SkeletonBlock>
          <div className="w-full space-y-1">
            <SkeletonBlock className="h-1.5 w-full rounded" />
            <SkeletonBlock className="h-[5px] w-2/3 rounded" />
          </div>
          <SkeletonBlock className="h-2 w-6 shrink-0 rounded-full" />
        </CardBlock>
      ),
    },
  ] satisfies Array<{ value: LinkStyle; label: string; render: () => React.ReactNode }>

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <Button
            key={option.value}
            type="button"
            size="auto"
            onClick={() => onChange(option.value)}
            variant={isActive ? 'primary' : 'secondary'}
            className="flex-col p-2.5"
          >
            <div className="flex w-full items-center justify-center">{option.render()}</div>
          </Button>
        )
      })}
    </div>
  )
}
