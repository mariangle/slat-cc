import {
  AvatarBlock,
  BioBlock,
  LinksBlock,
  NameAndBadgesBlock,
  ProfileCardBlock,
} from '@/components/dashboard/profile-elements'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LayoutFormValues } from '@/lib/zod/schemas/config'
import { isEqual } from 'lodash'

interface LayoutOptionsProps {
  onChange: (values: Partial<LayoutFormValues>) => void
  values: LayoutFormValues
  isShowcaseMode: boolean
}

export function FloatingAvatarLayout() {
  return (
    <ProfileCardBlock>
      <AvatarBlock className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2" />
      <NameAndBadgesBlock />
      <BioBlock />
      <LinksBlock />
    </ProfileCardBlock>
  )
}

export function StackedLayout() {
  return (
    <ProfileCardBlock className="items-start pt-4">
      <AvatarBlock />
      <NameAndBadgesBlock inline />
      <BioBlock />
      <LinksBlock className="justify-start" />
    </ProfileCardBlock>
  )
}

export function CompactRowLayout() {
  return (
    <ProfileCardBlock className="max-w-[180px] pt-4">
      <div className="flex w-full items-center gap-2">
        <AvatarBlock />
        <div className="space-y-1">
          <NameAndBadgesBlock inline />
          <BioBlock />
        </div>
      </div>
      <LinksBlock />
    </ProfileCardBlock>
  )
}

export function LayoutPicker({ onChange, values, isShowcaseMode }: LayoutOptionsProps) {
  const options = [
    {
      name: 'Floating Avatar',
      component: <FloatingAvatarLayout />,
      properties: {
        alignLeft: false,
        isBadgesNextToName: false,
        avatarPosition: 'float',
        maxWidth: 500,
      },
    },
    {
      name: 'Stacked',
      component: <StackedLayout />,
      properties: {
        alignLeft: true,
        isBadgesNextToName: true,
        avatarPosition: 'default',
        maxWidth: 500,
      },
    },
    {
      name: 'Compact Row',
      component: <CompactRowLayout />,
      properties: {
        alignLeft: true,
        isBadgesNextToName: true,
        avatarPosition: 'aside',
        maxWidth: 600,
      },
    },
  ] satisfies { name: string; component: React.ReactNode; properties: Partial<LayoutFormValues> }[]

  function isSelected(option: (typeof options)[number]) {
    if (isShowcaseMode) return false

    const pickedValues = {
      alignLeft: values.alignLeft,
      isBadgesNextToName: values.isBadgesNextToName,
      avatarPosition: values.avatarPosition,
      maxWidth: values.maxWidth,
    } satisfies Partial<LayoutFormValues>

    return isEqual(pickedValues, option.properties)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {options.map((option, idx) => (
          <Button
            type="button"
            key={idx}
            variant={isSelected(option) ? 'primary' : 'secondary'}
            className="relative h-44 flex-col"
            onClick={() => onChange(option.properties)}
          >
            <div className={cn('text-xs', idx === 0 && 'pb-4')}>{option.name}</div>
            {option.component}
          </Button>
        ))}
      </div>
    </div>
  )
}
