'use client'

import { CardFormWrapper } from '@/components/form/card-form-wrapper'
import { ColorPicker } from '@/components/form/color-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useServerAction } from '@/hooks/use-server-action'
import { useSyncProfilePreview } from '@/hooks/use-sync-preview'
import { Icons } from '@/lib/constants/icons'
import { updateColors } from '@/lib/features/config/actions/colors'
import type { Config } from '@/lib/features/config/schemas'
import { colorsFormSchema, type ColorsFormValues } from '@/lib/zod/schemas/config'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export function ColorsForm({ config }: { config: Config }) {
  const form = useForm<ColorsFormValues>({
    resolver: zodResolver(colorsFormSchema),
    defaultValues: {
      themeColor: config.themeColor,
      nameColor: config.nameColor,
      textColor: config.textColor,
    },
  })

  const { run, loading } = useServerAction(updateColors, {
    toast: {
      success: 'Colors updated successfully',
    },
  })

  const onSubmit = async (values: ColorsFormValues) => {
    await run(values)
  }

  useSyncProfilePreview(form, (values, prev) => ({
    config: { ...prev.config, ...values },
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardFormWrapper loading={loading} title="Colors" icon={Icons.paintBrush}>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="themeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardFormWrapper>
      </form>
    </Form>
  )
}
