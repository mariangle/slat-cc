'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { FileUpload } from '@/components/media/file-upload'
import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Button } from '@/components/ui/button'
import { CardSection } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TagsInput } from '@/components/ui/tags-input'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import { createTemplate, updateTemplate } from '@/lib/features/templates/actions'
import type { TemplateView } from '@/lib/features/templates/schemas'
import { templateFormSchema, type TemplateFormValues } from '@/lib/zod/schemas/template'
import { useRouter } from 'next/navigation'

export function TemplateForm({
  data,
  open,
  setOpen,
  isPremium,
  trigger,
}: {
  data?: TemplateView
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isPremium: boolean
  trigger: React.ReactNode
}) {
  const router = useRouter()

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      image: data?.image,
      name: data?.name || '',
      tags: data?.tags || [],
      isPublic: data?.isPublic || false,
      removePremiumFeatures: false,
      applyCurrentCustomization: false,
    },
  })

  const { run: create, loading: creating } = useServerAction(createTemplate, {
    toast: {
      success: 'Template created successfully',
    },
  })

  const { run: update, loading: updating } = useServerAction(updateTemplate, {
    toast: {
      success: 'Template updated successfully',
    },
  })

  const onSubmit = async (values: TemplateFormValues) => {
    if (data) await update({ id: data.id, values })
    else await create(values)

    setOpen(false)
    router.refresh()
  }

  const loading = updating || creating

  return (
    <>
      <ResponsiveModal
        icon={Icons.folderOpen}
        open={open}
        setOpen={setOpen}
        title={`${data ? 'Edit' : 'Create'} Template`}
        description={data ? 'Edit your template' : 'Create a new template based on your current configuration.'}
        trigger={trigger}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUpload value={field.value} onChange={field.onChange} supportedMediaTypes={['image']} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={(value) => form.setValue(field.name, value)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardSection className="p-3">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div>
                        <FormLabel className="text-foreground mb-1">Public</FormLabel>
                        <FormDescription>Make this template visible to all users.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardSection>
              {isPremium && (
                <CardSection className="p-3">
                  <FormField
                    control={form.control}
                    name="removePremiumFeatures"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel className="text-foreground mb-1">Exclude Premium Features</FormLabel>
                          <FormDescription>
                            Your template is premium by default. Check to remove all premium features.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardSection>
              )}
              {data && (
                <CardSection className="p-3">
                  <FormField
                    control={form.control}
                    name="applyCurrentCustomization"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel className="text-foreground mb-1">Apply Current Customization</FormLabel>
                          <FormDescription>Check to apply your current customization to the template.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardSection>
              )}
            </div>
            <div className="space-y-4">
              <Button disabled={loading} className="w-full">
                {data ? 'Save' : 'Create'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full md:hidden">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </>
  )
}
