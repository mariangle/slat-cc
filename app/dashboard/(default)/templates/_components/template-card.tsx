'use client'

import * as React from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

import { Card, CardContent, CardFooter } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { TemplateForm } from './template-form'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PremiumIndicatorBadge } from '@/components/shared/premium-indicator-badge'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import { deleteTemplate, favoriteTemplate, useTemplate } from '@/lib/features/templates/actions'
import type { TemplateView } from '@/lib/features/templates/schemas'
import type { TemplatesFilters } from '@/lib/features/templates/types'
import { generateTemplateUrl } from '@/lib/features/templates/utils'
import { cn, formatNumber } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function TemplateCard({
  template,
  filters,
  isPremium,
  user,
}: {
  template: TemplateView
  filters: TemplatesFilters
  isPremium: boolean
  user: { username: string; id: number }
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)

  const router = useRouter()

  const { run: favorite, loading: favoriting } = useServerAction(favoriteTemplate, {
    toast: {
      success: 'Template favorited',
    },
  })

  const { run: apply, loading: using } = useServerAction(useTemplate, {
    toast: {
      success: 'Template applied',
    },
  })

  const { run: remove, loading: removing } = useServerAction(deleteTemplate, {
    toast: {
      success: 'Template deleted successfully',
    },
  })

  const onCopyUrl = (id: number) => {
    const url = generateTemplateUrl(id)
    navigator.clipboard.writeText(url)
    toast.success('Template URL copied to clipboard!')
  }

  const onFavorite = async () => {
    await favorite(template.id)

    router.refresh()
  }

  const onApply = async () => {
    await apply(template.id)

    router.refresh()
  }

  const onRemove = async () => {
    await remove(template.id)
    setDeleteDialogOpen(false)

    router.refresh()
  }

  const loading = favoriting || using || removing

  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={onRemove}
        title="Remove Template"
        description="Are you sure you want to remove this template?"
        variant="destructive"
      />
      <Card>
        <div className="mb- relative">
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
            {!template.isPublic && (
              <Tooltip content="Private Template">
                <div className={cn(buttonVariants({ variant: 'black-blur', size: 'sm' }), 'rounded-xl text-sm')}>
                  Private
                </div>
              </Tooltip>
            )}
            <Tooltip content="Preview Template">
              <Link
                href={`/${user.username}?templateId=${template.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'black-blur', size: 'icon-sm' }), 'rounded-xl')}
              >
                <Icons.eye className="size-3.5" />
              </Link>
            </Tooltip>
            <Tooltip content="Copy Link">
              <Button
                variant="black-blur"
                type="button"
                size="icon-sm"
                className="rounded-xl"
                onClick={() => onCopyUrl(template.id)}
              >
                <Icons.link className="size-3.5" />
              </Button>
            </Tooltip>
          </div>
          {template.image ? (
            <Image
              alt={template.name}
              src={template.image}
              width={500}
              height={250}
              className="h-[170px] w-full rounded-t-3xl object-cover"
            />
          ) : (
            <div className="bg-muted h-[170px] w-full rounded-t-3xl" />
          )}
        </div>
        <CardContent>
          <div className="mb-2 flex items-center gap-2.5">
            <Link href={`/${template.author.username}`} className="group flex w-fit items-center gap-2">
              <Image
                src={template.author.avatar || '/images/default-avatar.jpg'}
                alt={`${template.author.name}'s avatar`}
                width={50}
                height={50}
                className="size-10 rounded-full object-cover"
              />
            </Link>
            <div>
              <div className="flex max-w-[250px] items-center gap-2">
                <h4 className="text-foreground line-clamp-1 truncate font-medium break-words">{template.name}</h4>
                {template.isPremiumRequired && (
                  <Tooltip content="Premium Required">
                    <PremiumIndicatorBadge />
                  </Tooltip>
                )}
              </div>
              <div className="text-muted-foreground text-sm group-hover:underline">@{template.author.username}</div>
            </div>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Icons.download className="size-3.5" />
              <span className="text-foreground"> {formatNumber(template.metrics.uses.count)}</span> use
              {template.metrics.uses.count === 1 ? '' : 's'}
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.heart className="size-3.5" />
              <span className="text-foreground"> {formatNumber(template.metrics.favorites.count)}</span> favorite
              {template.metrics.favorites.count === 1 ? '' : 's'}
            </div>
          </div>
          <ul className="mt-2 flex flex-wrap gap-1">
            {template.tags.map((tag, idx) => (
              <li key={idx}>
                <Badge variant={filters.tags?.includes(tag) ? 'primary' : 'secondary'} className="text-xs">
                  #{tag}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex items-stretch gap-2">
          {template.author.id !== user.id ? (
            <Button variant="secondary" disabled={loading} onClick={onFavorite} size="icon-md" className="rounded-xl">
              {template.metrics.favorites.byViewer ? (
                <Icons.heart className="text-destructive size-4" />
              ) : (
                <Icons.heart className="size-4" />
              )}
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                disabled={loading}
                onClick={() => setDeleteDialogOpen(true)}
                size="icon-md"
                className="rounded-xl"
              >
                <Icons.trash className="text-destructive size-4" />
              </Button>
              <TemplateForm
                data={template}
                open={editDialogOpen}
                setOpen={setEditDialogOpen}
                isPremium={isPremium}
                trigger={
                  <Button variant="secondary" onClick={() => setEditDialogOpen(true)} className="rounded-xl">
                    <Icons.pencil className="size-3.5" />
                    Edit
                  </Button>
                }
              />
            </>
          )}
          <Button
            variant="primary-gradient"
            className="w-full rounded-xl"
            disabled={loading || (template.isPremiumRequired && !isPremium)}
            onClick={onApply}
          >
            Apply
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
