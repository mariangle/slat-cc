'use client'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DatePicker } from '@/components/shared/date-picker'
import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useServerAction } from '@/hooks/use-server-action'
import { GiveawayRow } from '@/lib/drizzle'
import { createGiveaway, drawGiveaway } from '@/lib/features/giveaways/actions'
import { updateGiveaway } from '@/lib/features/giveaways/actions/update'
import { rewards } from '@/lib/features/giveaways/reward'
import { GiveawayFormValues, giveawayFormSchema, winnerCounts } from '@/lib/zod/schemas/giveaway'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { PiConfettiBold } from 'react-icons/pi'
import { toast } from 'sonner'

export function GiveawayFormDialog({
  giveaway,
  trigger,
  isSuperAdmin,
}: {
  giveaway?: GiveawayRow
  trigger: React.ReactNode
  isSuperAdmin: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [drawDialogOpen, setDrawDialogOpen] = React.useState(false)

  const form = useForm<GiveawayFormValues>({
    resolver: zodResolver(giveawayFormSchema),
    defaultValues: {
      rewardId: giveaway?.rewardId,
      endsAt: giveaway?.endsAt ?? new Date(),
      winnerCount: giveaway?.winnerCount ?? 1,
    },
  })

  const { run: create, loading: creating } = useServerAction(createGiveaway, {
    onSuccess: (data) => {
      toast.success(`Giveaway "${data.title}" created successfully.`)
    },
  })

  const { run: update, loading: updating } = useServerAction(updateGiveaway, {
    toast: {
      success: 'Giveaway updated successfully.',
    },
  })

  const { run: draw, loading: drawing } = useServerAction(drawGiveaway, {
    onSuccess: (winners) => {
      if (winners.length === 0) {
        toast.info('No winners were drawn for this giveaway.')
        return
      } else {
        toast.success(`Drawn ${winners.length} winner(s) successfully.`)
      }
    },
  })

  const onSubmit = async (values: GiveawayFormValues) => {
    if (giveaway) await update({ giveawayId: giveaway.id, values })
    else await create(values)

    setOpen(false)
    setDrawDialogOpen(false)
    form.reset()
  }

  const onDraw = async () => {
    if (!giveaway) return

    await draw(giveaway.id)
  }

  const loading = creating || updating || drawing

  return (
    <>
      <ConfirmDialog
        setOpen={setDrawDialogOpen}
        open={drawDialogOpen}
        onConfirm={onDraw}
        title="Draw Giveaway"
        description="Are you sure you want to draw this giveaway? This action cannot be undone."
        variant="destructive"
      />
      <ResponsiveModal
        icon={PiConfettiBold}
        open={open}
        setOpen={setOpen}
        title={`${giveaway ? 'Draw' : 'Create'} Giveaway`}
        trigger={trigger}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rewardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select reward" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(rewards).map(([key, value], idx) => (
                        <SelectItem key={idx} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="winnerCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Winner Count</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {winnerCounts.map((count, idx) => (
                        <SelectItem key={idx} value={count.toString()}>
                          {count}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endsAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ends At</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value ? new Date(field.value) : undefined} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>The date and time when the giveaway will end.</FormDescription>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="primary-gradient"
              size="sm"
              className="w-full"
              disabled={loading || !isSuperAdmin}
            >
              {giveaway ? 'Edit' : 'Create'} Giveaway
            </Button>
            {giveaway && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDrawDialogOpen(true)}
                className="w-full"
                disabled={loading || !isSuperAdmin}
              >
                Draw Giveaway
              </Button>
            )}
          </form>
        </Form>
      </ResponsiveModal>
    </>
  )
}
