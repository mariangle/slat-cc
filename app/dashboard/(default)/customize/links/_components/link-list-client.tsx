'use client'

import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import * as React from 'react'

import { AnimatedEmptyState } from '@/components/shared/animated-empty-state'
import { SortableItem } from '@/components/shared/sortable-item'
import { useSortableList } from '@/hooks/use-sortable-list'
import { Icons } from '@/lib/constants/icons'
import type { Config } from '@/lib/features/config/schemas'
import { reorderLinks } from '@/lib/features/links/actions'
import type { Link } from '@/lib/features/links/schemas'
import { useLinkStore } from '@/lib/stores/link'
import { LinkColorsPicker } from './link-colors-picker'
import { CreateLinkModal } from './link-create-modal'
import { LinkItem } from './link-item'

export function LinkListClient({ items: initial, config }: { items: Link[]; config: Config }) {
  const { items, hydrate, reorderByIds } = useLinkStore()
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useLayoutEffect(() => {
    hydrate(initial)
    setIsHydrated(true)
  }, [hydrate, initial])

  const list = isHydrated ? items : initial

  const { activeId, sensors, handleDragStart, handleDragEnd } = useSortableList({
    items,
    onReorder: (ids) => {
      reorderByIds(ids)
      reorderLinks(ids)
    },
  })

  return (
    <>
      <div className="flex w-full justify-end gap-4">
        <LinkColorsPicker />
        <CreateLinkModal />
      </div>
      {list.length === 0 ? (
        <AnimatedEmptyState
          title="No Links Found"
          description="Create your first link to get started."
          cardContent={
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Icons.globe className="text-muted-foreground size-5" />
                <div>
                  <div className="bg-accent h-3 w-24 rounded-sm" />
                </div>
              </div>
              <Icons.moreHorizontal className="text-muted-foreground size-5 rotate-90" />
            </div>
          }
          buttons={<CreateLinkModal />}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={list.map((i) => String(i.id))} strategy={verticalListSortingStrategy}>
            {list.map((item) => (
              <SortableItem key={item.id} id={String(item.id)}>
                <LinkItem itemId={item.id} config={config} />
              </SortableItem>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId &&
              (() => {
                const activeItem = list.find((i) => String(i.id) === activeId)
                if (!activeItem) return null
                return (
                  <SortableItem key={activeItem.id} id={String(activeItem.id)}>
                    <LinkItem itemId={activeItem.id} config={config} />
                  </SortableItem>
                )
              })()}
          </DragOverlay>
        </DndContext>
      )}
    </>
  )
}
