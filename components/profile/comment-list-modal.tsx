'use client'

import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { badgeVariants } from '@/components/ui/badge'
import { Icons } from '@/lib/constants/icons'
import { Comment as CommentType } from '@/lib/features/comments/schemas'
import { Profile } from '@/lib/features/profile/schemas'
import { OrderBy } from '@/lib/types'
import { cn } from '@/lib/utils'
import React from 'react'
import { PiArrowsDownUpBold } from 'react-icons/pi'
import { CardButton } from '../overlay'
import { Comment as CommentItem } from './comment'
import { CommentCreateForm } from './comment-create-form'

const MemoComment = React.memo(CommentItem)

export function CommentListModal({
  comments: initialComments,
  profile,
  visitorId,
  trigger,
}: {
  comments: CommentType[]
  profile: Profile
  visitorId?: number
  trigger?: React.ReactNode
}) {
  const [comments, setComments] = React.useState<CommentType[]>(initialComments)
  const [open, setOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [orderBy, setOrderBy] = React.useState<OrderBy>('desc')

  const toggleSort = React.useCallback(() => setOrderBy((p) => (p === 'desc' ? 'asc' : 'desc')), [])

  const handleCreate = React.useCallback(
    (comment: CommentType) => {
      setIsCreating(false)
      setComments((prev) => [...prev, comment])
    },
    [setComments],
  )

  const sortedComments = React.useMemo(() => {
    const next = [...comments]
    next.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return orderBy === 'desc' ? tb - ta : ta - tb
    })
    return next
  }, [comments, orderBy])

  const onDelete = React.useCallback(
    (commentId: number) => {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    },
    [setComments],
  )

  const onPin = React.useCallback(
    (commentId: number, isPinned: boolean) => {
      setComments((prev) =>
        prev.map((c) => ({
          ...c,
          isPinned: c.id === commentId ? isPinned : false,
        })),
      )
    },
    [setComments],
  )

  return (
    <ResponsiveModal
      title="Comments"
      open={open}
      icon={Icons.comment}
      size="3xl"
      setOpen={setOpen}
      trigger={
        trigger ?? (
          <div className="fixed top-3 right-3 z-30 flex items-center gap-3">
            <CardButton
              onClick={() => setOpen(true)}
              icon="gravity-ui:comment"
              config={profile.config}
              title="Comment"
            />
          </div>
        )
      }
      footer={
        isCreating && (
          <CommentCreateForm
            onCancel={() => setIsCreating(false)}
            onCreate={handleCreate}
            username={profile.user.username}
            visitorId={visitorId}
          />
        )
      }
    >
      <div>
        <div className="mb-4 flex items-center justify-end gap-2">
          <button onClick={toggleSort} className={cn(badgeVariants({ variant: 'secondary' }))}>
            <PiArrowsDownUpBold className="size-3.5" />
            <span className="text-sm">{orderBy === 'desc' ? 'Newest first' : 'Oldest first'}</span>
          </button>
          <button
            onClick={() => setIsCreating((creating) => !creating)}
            className={cn(badgeVariants({ variant: 'primary-solid' }))}
          >
            <Icons.plusCircle className="size-3.5" />
            New Comment
          </button>
        </div>
        <div className="space-y-2">
          {sortedComments.map((comment) => (
            <MemoComment key={comment.id} comment={comment} visitorId={visitorId} onDelete={onDelete} onPin={onPin} />
          ))}
        </div>
      </div>
    </ResponsiveModal>
  )
}
