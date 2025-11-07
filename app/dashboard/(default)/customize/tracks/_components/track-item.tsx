import * as React from 'react'

import { MusicPlayer } from '@/components/profile/tracks/track-music-player'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import type { Config } from '@/lib/features/config/schemas'
import { deleteTrack } from '@/lib/features/tracks/actions'
import { useTrackStore } from '@/lib/stores/track'
import { TrackCustomForm } from './track-custom-form'

export function TrackItem({ itemId, config, premium }: { itemId: number; config: Config; premium: boolean }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)

  const item = useTrackStore((s) => s.items.find((i) => i.id === itemId))
  const upsert = useTrackStore((s) => s.upsert)
  const removeLocal = useTrackStore((s) => s.remove)

  const { run: remove, loading: removing } = useServerAction(deleteTrack)

  if (!item) return null

  const onDelete = async () => {
    const prev = item

    removeLocal(prev.id)
    setDeleteDialogOpen(false)

    try {
      await remove(prev.id)
    } catch {
      upsert(prev)
    }
  }

  const isLoading = removing

  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={onDelete}
        title="Remove Track"
        description="Are you sure you want to remove this track?"
        variant="destructive"
      />
      <div className="flex flex-col items-start gap-2 p-4 md:flex-row-reverse md:items-center md:justify-end md:gap-4">
        <div className="w-full max-w-md">
          <MusicPlayer
            tracks={[item]}
            colors={{
              text: config.textColor,
              theme: config.themeColor,
              name: config.nameColor,
            }}
            card={config.card}
            layout={config.layout.musicPlayer}
            preview
          />
        </div>
        <div className="flex items-center justify-start gap-1 md:flex-col md:justify-center">
          {!item.deezerTrackId && (
            <ResponsiveModal
              open={editDialogOpen}
              setOpen={setEditDialogOpen}
              icon={Icons.music}
              title="Edit Track"
              trigger={
                <Tooltip content="Edit Track">
                  <Button onClick={() => setEditDialogOpen(true)} variant="secondary" size="icon-sm">
                    <Icons.pencil className="size-3.5" />
                  </Button>
                </Tooltip>
              }
            >
              <TrackCustomForm premium={premium} onClose={() => setEditDialogOpen(false)} itemId={item.id} />
            </ResponsiveModal>
          )}
          <Tooltip content="Delete Track">
            <Button disabled={isLoading} onClick={() => setDeleteDialogOpen(true)} variant="destructive" size="icon-sm">
              <Icons.trash className="size-3.5" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  )
}
