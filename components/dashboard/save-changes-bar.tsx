'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePreventLeave } from '@/hooks/use-prevent-leave'
import { useSaveBar } from '@/lib/stores/save-bar'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

export function SaveAllBar() {
  const bar = useSaveBar((s) => s)
  const dirtyForms = useMemo(() => Object.values(bar.forms).filter((f) => f.isDirty), [bar.forms])
  const isOpen = dirtyForms.length > 0

  usePreventLeave(isOpen)

  return (
    <div className={cn('fixed inset-x-3 bottom-3 z-40', !isOpen && 'pointer-events-none')}>
      <div
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          'mx-auto max-w-xl transition-all duration-200 ease-out will-change-transform',
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-6 scale-95 opacity-0',
          // layout offsets for preview and sidebar
          'lg:translate-x-24 xl:-translate-x-24',
        )}
      >
        <Card className="flex items-center justify-between rounded-2xl p-2">
          <p className="text-foreground ml-2 text-sm font-medium">You have unsaved changes.</p>
          <Button
            type="button"
            variant="primary-gradient"
            onClick={bar.saveAll}
            disabled={bar.saving}
            size="sm"
            className="rounded-xl"
          >
            {bar.saving ? 'Saving…' : 'Save changes'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
