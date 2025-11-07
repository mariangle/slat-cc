'use client'

import * as React from 'react'
import { Icons } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { TemplateForm } from './template-form'

export function TemplateCreate({ isPremium }: { isPremium: boolean }) {
  const [open, setOpen] = React.useState(false)

  return (
    <TemplateForm
      open={open}
      setOpen={setOpen}
      isPremium={isPremium}
      trigger={
        <Button onClick={() => setOpen(true)}>
          <Icons.plusCircle className="size-3" />
          Create Template
        </Button>
      }
    />
  )
}
