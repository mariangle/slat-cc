'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { SearchInput } from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import { Platform, platforms } from '@/lib/constants/platforms'
import { createLink } from '@/lib/features/links/actions'
import { Link } from '@/lib/features/links/schemas'
import { cleanTarget, generateTarget, isCopyable } from '@/lib/features/links/utils'
import { useLinkStore } from '@/lib/stores/link'
import { isHexDark } from '@/lib/utils'
import { linkFormSchema, type LinkFormValues } from '@/lib/zod/schemas/link'

export function CreateLinkModal() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [step, setStep] = React.useState<'selection' | 'selected'>('selection')

  const { upsert, replaceId, remove } = useLinkStore()

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      hidden: false,
      iconName: 'FaGlobe',
      iconColor: '#000000',
      backgroundColor: undefined,
      platformId: undefined,
      description: '',
      source: '',
      label: '',
      image: undefined,
      style: 'icon',
    },
  })

  const { run: create, loading } = useServerAction(createLink)

  const onSubmit = async (values: LinkFormValues) => {
    const tempId = -Date.now()

    const optimistic: Link = {
      id: tempId,
      source: values.source,
      iconName: values.iconName,
      label: values.label,
      style: values.style,
      hidden: values.hidden,
      sortOrder: 0,
      isCopyable: false,
      description: '',
      platformId: values.platformId,
      image: values.image,
      iconColor: values.iconColor,
      backgroundColor: values.backgroundColor,
      isInsideProfileCard: false,
    }

    upsert(optimistic)
    setOpen(false)
    resetFields()

    try {
      const created = await create(values)
      replaceId(tempId, created)
    } catch (e) {
      remove(tempId)
    }
  }

  const target = generateTarget({ platformId: form.watch('platformId'), source: form.watch('source') })

  const prefillForm = (platform: Platform) => {
    form.setValue('iconName', platform.iconName)
    form.setValue('iconColor', platform.color)
    form.setValue('label', platform.name)
    form.setValue('platformId', platform.id)

    setStep('selected')
  }

  const emptyFields = () => {
    form.reset()
    form.setValue('source', 'https://')

    setStep('selected')
  }

  const resetFields = () => {
    form.reset()

    setStep('selection')
  }

  return (
    <ResponsiveModal
      icon={Icons.link}
      open={open}
      setOpen={(open) => {
        setOpen(open)

        if (!open) resetFields()
      }}
      title={'Add Link'}
      trigger={
        <Button onClick={() => setOpen(!open)} variant="primary-solid">
          <Icons.plusCircle className="size-4" />
          Add Link
        </Button>
      }
    >
      {step === 'selection' ? (
        <div>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search for a platform..."
            className="mb-4 w-full"
          />
          <div className="flex h-[175px] flex-col gap-2 overflow-y-auto">
            {platforms
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((platform, index) => {
                if (platform.name.toLowerCase().includes(query.toLowerCase())) {
                  return (
                    <button
                      type="button"
                      className="hover:bg-accent hover:text-foreground flex items-center gap-x-2 rounded-md px-2 py-1 text-left"
                      key={index}
                      onClick={() => prefillForm(platform)}
                    >
                      <Icon
                        name={platform.iconName}
                        style={{
                          color: platform.color && !isHexDark(platform.color, 50) ? platform.color : 'white',
                        }}
                        className="size-5"
                      />
                      {platform.name}
                    </button>
                  )
                }
              })}
          </div>
          <Button onClick={emptyFields} variant="primary-solid" className="mt-4 w-full">
            <Icons.plusCircle className="size-4" />
            Or Create Custom Link
          </Button>
        </div>
      ) : (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
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
                    <FormDescription>
                      {form.watch('platformId')
                        ? 'This will generate a platform-specific link based on your input.'
                        : 'Tip: Sources without https:// will be treated as simple copyable links instead.'}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="space-y-3">
                <Button type="submit" variant="primary-gradient" disabled={loading} className="w-full">
                  Save
                </Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="w-full md:hidden">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </ResponsiveModal>
  )
}
