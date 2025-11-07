'use client'

import { Icons } from '@/lib/constants/icons'
import * as React from 'react'

import { PremiumIndicatorBadge } from '@/components/shared/premium-indicator-badge'
import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrackCreateDeezer } from './track-create-deezer'
import { TrackCustomForm } from './track-custom-form'

export function TrackCreateDialog({ premium }: { premium: boolean }) {
  const [open, setOpen] = React.useState(false)

  return (
    <ResponsiveModal
      open={open}
      setOpen={setOpen}
      icon={Icons.music}
      title="Add Track"
      description="Search for a track from Deezer or add a custom track."
      trigger={
        <Button onClick={() => setOpen(true)}>
          <Icons.plusCircle className="size-4" />
          Add Track
        </Button>
      }
    >
      <div className="space-y-3">
        <Tabs defaultValue="deezer">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deezer">Deezer</TabsTrigger>
            <TabsTrigger value="custom" className="gap-x-2">
              Custom
              <PremiumIndicatorBadge />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deezer">
            <TrackCreateDeezer onClose={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="custom">
            <TrackCustomForm onClose={() => setOpen(false)} premium={premium} />
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveModal>
  )
}
