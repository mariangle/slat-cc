'use client'

import { Icons } from '@/lib/constants/icons'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Card } from '@/components/ui/card'
import { useMounted } from '@/hooks/use-mounted'

export function SortableItem({
  id,
  children,
  className,
}: {
  id: string
  children: React.ReactNode
  className?: string
}) {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({ id })
  const mounted = useMounted()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!mounted) return null

  return (
    <div
      id={id}
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging}
      className="bg-foreground/10 flex shrink-0 items-center rounded-xl p-1 data-[dragging=true]:cursor-grabbing"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground grid h-full cursor-grab place-content-center py-2 pl-1 duration-200"
      >
        <Icons.dragIndicator className="size-5" />
      </div>
      <Card className={cn('w-full rounded-xl', className)}>{children}</Card>
    </div>
  )
}
