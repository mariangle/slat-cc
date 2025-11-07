'use client'

import { LinkIcon } from '@/components/profile/links/link-icon'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DropdownMenuActions } from '@/components/shared/dropdown-menu-actions'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import type { Config } from '@/lib/features/config/schemas'
import { deleteLink, updateLink } from '@/lib/features/links/actions'
import { cleanTarget, generateTarget } from '@/lib/features/links/utils'
import { useLinkStore } from '@/lib/stores/link'
import { cn } from '@/lib/utils'
import { startCase } from 'lodash'
import * as React from 'react'
import { LinkAppearanceModal } from './link-appearance-modal'
import { LinkContentModal } from './link-content-modal'

export function LinkItem({ itemId, config }: { itemId: number; config: Config }) {
  const [iconDialogOpen, setIconDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [contentDialogOpen, setContentDialogOpen] = React.useState(false)

  const item = useLinkStore((s) => s.items.find((i) => i.id === itemId))
  const upsert = useLinkStore((s) => s.upsert)
  const removeLocal = useLinkStore((s) => s.remove)

  const { run: update, loading: updating } = useServerAction(updateLink)
  const { run: remove, loading: removing } = useServerAction(deleteLink)

  if (!item) return null

  const onToggleStyle = async () => {
    const prev = item
    const nextStyle = prev.style === 'icon' ? 'card' : 'icon'
    upsert({ ...prev, style: nextStyle })
    try {
      await update({ id: item.id, values: { style: nextStyle } })
    } catch {
      upsert(prev)
    }
  }

  const onToggleVisibility = async () => {
    const prev = item
    upsert({ ...prev, hidden: !prev.hidden })
    try {
      await update({ id: item.id, values: { hidden: !item.hidden } })
    } catch {
      upsert(prev)
    }
  }

  const onDelete = async () => {
    const prev = item
    removeLocal(prev.id)
    try {
      await remove(prev.id)
    } catch {
      upsert(prev)
    }
  }

  const loading = updating || removing

  return (
    <>
      <ConfirmDialog
        setOpen={setDeleteDialogOpen}
        open={deleteDialogOpen}
        onConfirm={onDelete}
        title="Remove Link"
        description="Are you sure you want to remove this link?"
        variant="destructive"
      />
      <LinkContentModal itemId={item.id} open={contentDialogOpen} setOpen={setContentDialogOpen} config={config} />
      <div data-hidden={item.hidden} className="group relative flex w-full items-center rounded-xl p-2">
        <div className="border-foreground/10 bg-foreground/5 relative shrink-0 rounded-2xl border p-1.5 group-data-[hidden=true]:opacity-50">
          <LinkAppearanceModal
            itemId={item.id}
            open={iconDialogOpen}
            setOpen={setIconDialogOpen}
            trigger={
              <button
                type="button"
                className={cn(
                  'bg-primary-600 hover:bg-primary-700 absolute -right-2 -bottom-2 z-5 flex size-6 items-center justify-center rounded-full text-white shadow-md duration-200',
                  'p-0.5 transition-all',
                )}
              >
                <Icons.paintBrush className="size-3" />
              </button>
            }
          />
          <LinkIcon
            color={item.iconColor ?? config.themeColor}
            iconName={item.iconName}
            backgroundColor={item.backgroundColor}
            image={item.image}
            borderRadius={config.card.borderRadius}
            glow={config.enhancements.iconsGlow}
            size={30}
          />
        </div>
        <div className="ml-3 flex min-w-0 flex-1 flex-col overflow-hidden">
          <p className="text-muted-foreground max-w-[180px] truncate text-sm sm:max-w-none">
            {cleanTarget(generateTarget({ platformId: item.platformId, source: item.source }))}
          </p>
          <div className="text-foreground flex items-center gap-1 truncate">
            {item.label}{' '}
            <button
              type="button"
              onClick={onToggleStyle}
              className="bg-foreground/10 hover:bg-foreground/15 rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase duration-300"
              title={item.style === 'card' ? 'Featured card' : 'Icon-only'}
            >
              {startCase(item.style)}
            </button>
          </div>
          {item.description && <p className="max-w-[180px] truncate text-xs sm:max-w-none">{item.description}</p>}
        </div>
        <DropdownMenuActions
          trigger={
            <button className="hover:bg-foreground/5 rounded-lg p-1 duration-200">
              <Icons.moreHorizontal className="text-foreground size-6 rotate-90 duration-200" />
            </button>
          }
          isVisible={item.hidden}
          onEdit={() => setContentDialogOpen(true)}
          onToggleVisibility={onToggleVisibility}
          onDelete={() => setDeleteDialogOpen(true)}
          disabled={loading}
        />
      </div>
    </>
  )
}
