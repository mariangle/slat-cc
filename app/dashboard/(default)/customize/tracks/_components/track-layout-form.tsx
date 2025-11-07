import { CardBlock, SkeletonBlock } from '@/components/dashboard/profile-elements'
import { PremiumIndicatorBadge } from '@/components/shared/premium-indicator-badge'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useServerAction } from '@/hooks/use-server-action'
import { Icons } from '@/lib/constants/icons'
import type { MusicPlayerLayout } from '@/lib/features/app'
import { musicPlayerLayoutOptions } from '@/lib/features/app'
import { updateTrackLayout } from '@/lib/features/tracks/actions'
import { cn } from '@/lib/utils'
import { type TrackLayoutFormValues, trackLayoutFormSchema } from '@/lib/zod/schemas/config'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'

export function TrackLayoutForm({
  onUpdate,
  layout,
  premium,
}: {
  onUpdate: (layout: MusicPlayerLayout) => void
  layout: MusicPlayerLayout
  premium: boolean
}) {
  const form = useForm<TrackLayoutFormValues>({
    resolver: zodResolver(trackLayoutFormSchema),
    defaultValues: {
      musicPlayer: layout,
    },
  })

  const { run: updateLayout } = useServerAction(updateTrackLayout)

  const options: Record<MusicPlayerLayout, React.ReactNode> = {
    default: <DefaultMusicPlayer />,
    banner: <BannerMusicPlayer />,
    vinyl: <VinylMusicPlayer />,
    compact: <CompactMusicPlayer />,
    'cover-vinyl': <CoverMusicPlayer />,
  }

  const onSelect = async (value: MusicPlayerLayout) => {
    const snapshot = form.getValues()

    form.setValue('musicPlayer', value)
    onUpdate(value)
    try {
      await updateLayout({ musicPlayer: value })
    } catch (error) {
      onUpdate(snapshot.musicPlayer)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="musicPlayer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Layout</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {musicPlayerLayoutOptions.map(({ label, value, premium: premiumRequired }) => {
                    const isDisabled = premiumRequired && !premium

                    return (
                      <div key={value} className="relative w-full">
                        {isDisabled && <PremiumIndicatorBadge className="absolute top-2 right-2 z-10" />}
                        <Button
                          size="auto"
                          type="button"
                          onClick={() => onSelect(value)}
                          disabled={isDisabled}
                          className={cn('relative h-full w-full flex-col p-4')}
                          variant={field.value === value ? 'primary' : 'secondary'}
                        >
                          <div className="text-xs">{label}</div>
                          {options[value as MusicPlayerLayout]}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

const ProgressBar = () => (
  <div className="bg-foreground/10 relative h-1 w-full rounded-md">
    <div className="bg-primary absolute top-0 left-0 h-full w-1/2 rounded-md" />
  </div>
)

const Cover = ({ className }: { className?: string }) => (
  <SkeletonBlock className={cn('rounded-lg bg-black/25 p-1.5', className)}>
    <div className="bg-foreground/5 grid size-7 place-content-center rounded-full">
      <Icons.music className="size-3.5 text-white/50" />
    </div>
  </SkeletonBlock>
)

const DefaultMusicPlayer = () => (
  <div className="mx-auto flex w-full max-w-[125px] flex-col items-center justify-center gap-2 rounded-md border border-white/15 bg-white/15 p-2">
    <Cover />
    <div className="flex flex-col items-center justify-center space-y-0.5">
      <SkeletonBlock className="h-[5px] w-9" />
      <SkeletonBlock className="h-[4px] w-12" />
    </div>
    <ProgressBar />
    <div className="flex w-full items-center justify-center gap-2">
      <Icons.skipBack className="size-2.5 text-white/50" />
      <Icons.play className="size-3 text-white/75" />
      <Icons.skipForward className="size-2.5 text-white/50" />
    </div>
  </div>
)

const CompactMusicPlayer = () => (
  <CardBlock className="flex w-full max-w-[190px] items-center justify-center gap-2 rounded-xl p-1.5">
    <Cover />
    <div className="flex w-full flex-col items-start justify-center gap-y-1">
      <SkeletonBlock className="h-[5px] w-9" />
      <SkeletonBlock className="h-[4px] w-12" />
      <div className="flex w-full items-center justify-between gap-x-1">
        <ProgressBar />
        <div className="flex items-center gap-1">
          <Icons.skipBack className="size-2.5 text-white/50" />
          <Icons.play className="size-2.5 text-white/75" />
          <Icons.skipForward className="size-2.5 text-white/50" />
        </div>
      </div>
    </div>
  </CardBlock>
)

const BannerMusicPlayer = () => (
  <CardBlock className="flex w-full max-w-[190px] flex-col items-center rounded-xl">
    <div className="w-full p-1.5">
      <div className="flex w-full items-center gap-2">
        <Cover />
        <div className="space-y-1">
          <SkeletonBlock className="h-[5px] w-9" />
          <SkeletonBlock className="h-[4px] w-12" />
          <div className="flex w-full items-center gap-1">
            <Icons.skipBack className="size-2.5 text-white/50" />
            <Icons.play className="size-2.5 text-white/75" />
            <Icons.skipForward className="size-2.5 text-white/50" />
          </div>
        </div>
      </div>
    </div>
    <div className="w-full space-y-1.5 bg-black/20 p-1.5">
      <ProgressBar />
      <div className="flex w-full items-center justify-between gap-2">
        <SkeletonBlock className="h-[4px] w-3" />
        <SkeletonBlock className="h-[4px] w-3" />
      </div>
    </div>
  </CardBlock>
)

const VinylMusicPlayer = () => (
  <CardBlock className="mx-auto flex w-full max-w-[180px] items-center justify-center gap-2 rounded-xl p-2">
    <Cover className="animate-spin rounded-full duration-[5000ms]" />
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex flex-col items-start space-y-1">
        <SkeletonBlock className="h-[5px] w-6" />
        <SkeletonBlock className="h-[4px] w-16" />
      </div>
      <div className="flex w-full items-center justify-center gap-1">
        <Icons.skipBack className="size-2.5 text-white/50" />
        <Icons.play className="size-2.5 text-white/75" />
        <Icons.skipForward className="size-2.5 text-white/50" />
      </div>
    </div>
  </CardBlock>
)

const CoverMusicPlayer = () => (
  <div className="relative">
    <CardBlock className="bg-accent relative z-20 flex size-12 flex-col justify-between gap-2 rounded-xl border-transparent p-1.5">
      <Icons.play className="size-2.5 text-white/75" />
      <div className="flex flex-col items-start space-y-1">
        <SkeletonBlock className="h-[5px] w-1/3" />
        <SkeletonBlock className="h-[4px] w-full" />
      </div>
    </CardBlock>
    <Cover className="absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full duration-[5000ms]" />
  </div>
)
