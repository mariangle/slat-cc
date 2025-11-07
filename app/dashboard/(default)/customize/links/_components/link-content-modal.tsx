'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import { ProfileModeId } from '@/lib/features/app'
import { Config } from '@/lib/features/config/schemas'
import { updateLink } from '@/lib/features/links/actions'
import { Link } from '@/lib/features/links/schemas'
import { cleanTarget, generateTarget, isCopyable } from '@/lib/features/links/utils'
import { useLinkStore } from '@/lib/stores/link'
import { mergeDefined, toPatch } from '@/lib/utils'
import { linkFormSchema, type LinkFormValues } from '@/lib/zod/schemas/link'

export function LinkContentModal({
  itemId,
  trigger,
  open,
  setOpen,
  config,
}: {
  itemId: number
  trigger?: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  config: Config
}) {
  const item = useLinkStore((s) => s.items.find((i) => i.id === itemId))
  const upsert = useLinkStore((s) => s.upsert)

  const form = useForm<Partial<LinkFormValues>>({
    resolver: zodResolver(linkFormSchema.partial()),
    defaultValues: {
      label: item?.label || '',
      description: item?.description || '',
      source: item?.source || '',
    },
  })

  const { run: update, loading: updating } = useServerAction(updateLink)

  if (!item) return null

  const onSubmit = async (values: Partial<LinkFormValues>) => {
    const patch = toPatch<Link>(values)
    const next = mergeDefined(item, patch)

    upsert(next)
    setOpen(false)

    try {
      await update({ id: item.id, values })
    } catch (e) {
      upsert(item)
      setOpen(true)
    }
  }

  const target = generateTarget({ platformId: item.platformId, source: form.watch('source') ?? '' })

  return (
    <ResponsiveModal icon={Icons.link} open={open} setOpen={setOpen} title="Edit Link Appearance" trigger={trigger}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-foreground flex w-full items-center gap-2 text-base">
            {isCopyable(target) ? (
              <Icons.copy className="text-muted-foreground size-4" />
            ) : (
              <Icons.link className="text-muted-foreground size-4" />
            )}
            <span className="max-w-[250px] truncate">{cleanTarget(target)}</span>
          </div>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(item.style === 'card' || config.layout.profileModeId === ProfileModeId.Showcase) && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link description" />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      {item.style === 'card' ? 'Description for a card link.' : 'Description for a showcase link.'}
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-3">
            <Button type="submit" className="w-full" disabled={updating}>
              Save
            </Button>
            <Button type="button" className="w-full md:hidden" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  )
}
