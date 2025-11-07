import { cn } from '@/lib/utils'

type GridListProps<T> = {
  maxWidth: number
  items: T[]
  renderItem: (item: T, idx: number) => React.ReactNode
  className?: string
}

export function GridList<T extends { id: number; fullWidth?: boolean }>({
  maxWidth,
  items,
  renderItem,
  className,
}: GridListProps<T>) {
  const twoCols = maxWidth >= 600

  const formatted = items.map((item) => ({
    ...item,
    fullWidth: item.fullWidth ?? false,
  }))

  const normalItems = formatted.filter((i) => !i.fullWidth)
  const fullItems = formatted.filter((i) => i.fullWidth)

  if (formatted.length === 0) return null

  return (
    <div className={cn('grid w-full grid-cols-1 gap-3', twoCols && 'md:grid-cols-2', className)}>
      {normalItems.map((item, idx) => {
        const isLastInNormal = idx === normalItems.length - 1
        const isEvenIndex = idx % 2 === 0

        const span =
          twoCols && isLastInNormal && isEvenIndex ? 'md:col-span-2' : twoCols ? 'md:col-span-1' : 'col-span-1'

        return (
          <div key={item.id} className={cn('w-full', span)}>
            {renderItem(item, idx)}
          </div>
        )
      })}

      {fullItems.map((item, idx) => (
        <div key={item.id} className={cn('w-full', twoCols ? 'md:col-span-2' : 'col-span-1')}>
          {renderItem(item, normalItems.length + idx)}
        </div>
      ))}
    </div>
  )
}
