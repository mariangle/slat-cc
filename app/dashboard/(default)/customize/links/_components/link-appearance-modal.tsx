'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { ColorPicker } from '@/components/form/color-picker'
import { IconPicker } from '@/components/form/icon-picker'
import { FileUpload } from '@/components/media/file-upload'
import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import { updateLink } from '@/lib/features/links/actions'
import type { Link } from '@/lib/features/links/schemas'
import { useLinkStore } from '@/lib/stores/link'
import { mergeDefined, toPatch } from '@/lib/utils'
import { linkFormSchema, type LinkFormValues } from '@/lib/zod/schemas/link'
import { LinkStylePicker } from './link-style'

export function LinkAppearanceModal({
  itemId,
  trigger,
  open,
  setOpen,
}: {
  itemId: number
  trigger: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const item = useLinkStore((s) => s.items.find((i) => i.id === itemId))
  const upsert = useLinkStore((s) => s.upsert)
  const { run: update, loading: updating } = useServerAction(updateLink)

  const values = React.useMemo<Partial<LinkFormValues>>(
    () => ({
      iconName: item?.iconName || 'FaGlobe',
      iconColor: item?.iconColor || '#000000',
      backgroundColor: item?.backgroundColor || undefined,
      image: item?.image || undefined,
      style: item?.style || 'icon',
    }),
    [item],
  )

  const form = useForm<Partial<LinkFormValues>>({
    resolver: zodResolver(linkFormSchema.partial()),
    values,
  })

  if (!item) return null

  const onSubmit = async (values: Partial<LinkFormValues>) => {
    const patch = toPatch<Link>(values)
    const next = mergeDefined(item, patch)

    upsert(next)
    setOpen(false)

    try {
      await update({ id: item.id, values })
      return next
    } catch (e) {
      upsert(item)
      setOpen(true)
    }
  }

  return (
    <ResponsiveModal icon={Icons.link} open={open} setOpen={setOpen} title="Edit Link Appearance" trigger={trigger}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style</FormLabel>
                <FormControl>
                  <LinkStylePicker value={field.value || 'icon'} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <Tabs defaultValue="icon" className="w-full">
            <TabsList className="mb-3 grid grid-cols-2">
              <TabsTrigger value="icon">Icon</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
            <TabsContent value="icon" className="space-y-4">
              <FormField
                control={form.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconPicker modal value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="iconColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <ColorPicker value={field.value} onChange={field.onChange} modal />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <ColorPicker value={field.value} onChange={field.onChange} optional modal />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="image" className="space-y-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">Image</FormLabel>
                    <FormControl>
                      <FileUpload value={field.value} onChange={field.onChange} supportedMediaTypes={['image']} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
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
