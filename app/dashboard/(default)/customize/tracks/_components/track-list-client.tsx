'use client'

import { useSortableList } from '@/hooks/use-sortable-list'
import type { Config } from '@/lib/features/config/schemas'
import type { Track } from '@/lib/features/tracks/schemas'
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import * as React from 'react'

import { SortableItem } from '@/components/shared/sortable-item'
import type { MusicPlayerLayout } from '@/lib/features/app'
import { TrackCreateDialog } from './track-create-dialog'
import { TrackItem } from './track-item'
import { TrackLayoutForm } from './track-layout-form'

import { AnimatedEmptyState } from '@/components/shared/animated-empty-state'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/lib/constants/icons'
import { reorderTracks } from '@/lib/features/tracks/actions'
import { useTrackStore } from '@/lib/stores/track'

export function TrackListClient({
  items: initial,
  premium,
  config: initialConfig,
}: {
  items: Track[]
  premium: boolean
  config: Config
}) {
  const { items, hydrate, reorderByIds } = useTrackStore()
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [config, setConfig] = React.useState<Config>(initialConfig)

  React.useLayoutEffect(() => {
    hydrate(initial)
    setIsHydrated(true)
  }, [hydrate, initial])

  const list = isHydrated ? items : initial

  const { activeId, sensors, handleDragStart, handleDragEnd } = useSortableList({
    items,
    onReorder: (ids) => {
      reorderByIds(ids)
      reorderTracks(ids)
    },
  })

  const updateLayout = (musicPlayer: MusicPlayerLayout) => {
    setConfig((prev) => ({ ...prev, layout: { ...prev.layout, musicPlayer } }))
  }

  return (
    <>
      <TrackLayoutForm onUpdate={updateLayout} layout={config.layout.musicPlayer} premium={premium} />
      <Separator />
      <div className="flex justify-end">
        <TrackCreateDialog premium={premium} />
      </div>
      {list.length === 0 ? (
        <AnimatedEmptyState
          title="No Tracks Found"
          description="Let your visitors listen to your favorite music directly from your profile."
          cardContent={
            <div className="flex flex-col items-center gap-2 px-2 py-4">
              <div className="bg-accent grid size-14 place-content-center rounded-full">
                <Icons.music className="text-muted-foreground size-5" />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-accent size-3 rounded-full" />
                <div className="bg-accent size-6 rounded-full" />
                <div className="bg-accent size-3 rounded-full" />
              </div>
            </div>
          }
          buttons={<TrackCreateDialog premium={premium} />}
        />
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={list.map((i) => String(i.id))} strategy={verticalListSortingStrategy}>
              {list.map((item) => (
                <SortableItem key={item.id} id={String(item.id)}>
                  <TrackItem premium={premium} itemId={item.id} config={config} />
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
                      <TrackItem premium={premium} itemId={activeItem.id} config={config} />
                    </SortableItem>
                  )
                })()}
            </DragOverlay>
          </DndContext>
        </>
      )}
    </>
  )
}
