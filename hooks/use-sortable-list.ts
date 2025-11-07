import { useMediaQuery } from '@/hooks/use-media-query'
import {
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import * as React from 'react'

type UseSortableListArgs<T extends { id: number }> = {
  items: T[]
  onReorder: (idsInOrder: number[]) => void
}

export function useSortableList<T extends { id: number }>({ items, onReorder }: UseSortableListArgs<T>) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const sensors = useSensors(
    useSensor(isDesktop ? PointerSensor : TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // dropped outside the list
    if (!over || active.id === over.id) {
      setActiveId(null)
      return
    }

    const ids = items.map((i) => i.id)
    const from = ids.indexOf(Number(active.id))
    const to = ids.indexOf(Number(over.id))

    // guard against invalid indices
    if (from < 0 || to < 0) {
      setActiveId(null)
      return
    }

    const next = [...ids]
    next.splice(to, 0, next.splice(from, 1)[0])
    onReorder(next)
    setActiveId(null)
  }

  return { activeId, sensors, handleDragStart, handleDragEnd }
}
