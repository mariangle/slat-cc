'use client'

import { DisplayName } from '@/components/profile/core/display-name'
import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/lib/constants/icons'
import { TextEffect, textEffectOptions } from '@/lib/features/app'
import { NameEffectsLength } from '@/lib/features/enums'
import * as React from 'react'

type Props = {
  value: string[] // selected effect ids
  onChange: (v: string[]) => void
  premium: boolean
  multiple?: boolean
  children: React.ReactNode
}

export function TextEffectPicker({ value, onChange, premium, multiple, children }: Props) {
  const [open, setOpen] = React.useState(false)

  // Options: match your old filtering — only bio-capable when !multiple
  const baseOptions = React.useMemo(() => {
    return multiple ? textEffectOptions : textEffectOptions.filter((o) => o.bio)
  }, [multiple])

  const isSelected = React.useCallback((id: string) => value.includes(id), [value])

  const toggle = React.useCallback(
    (id: string) => {
      const already = isSelected(id)
      if (multiple) {
        if (!already) {
          if (value.length >= NameEffectsLength.Max) return
          onChange([...value, id])
        } else {
          onChange(value.filter((v) => v !== id))
        }
      } else {
        onChange(already ? [] : [id])
      }
    },
    [multiple, value, onChange, isSelected],
  )

  const onClear = React.useCallback(() => onChange([]), [onChange])
  const onConfirm = React.useCallback(() => setOpen(false), [])

  const EffectTile: React.FC<{
    id: TextEffect
    label: string
    premiumOnly?: boolean
  }> = ({ id, label, premiumOnly }) => {
    const locked = !!premiumOnly && !premium
    const selected = isSelected(id)

    return (
      <Button
        type="button"
        onClick={() => !locked && toggle(id)}
        disabled={locked}
        variant={selected ? 'primary' : 'secondary'}
        title={label}
        aria-pressed={selected}
        className="h-12"
      >
        <DisplayName
          title={label}
          className="text-center text-base leading-tight"
          options={{ effects: [id], color: '#FFFFFF' }}
        />
      </Button>
    )
  }

  return (
    <ResponsiveModal
      size="3xl"
      open={open}
      setOpen={setOpen}
      title={multiple ? 'Choose Name Effects' : 'Choose Bio Effect'}
      description={
        multiple
          ? 'Select up to 3 effects to apply to your display name. Note some effects may not be compatible together.'
          : 'Select an effect to apply to your bio.'
      }
      icon={Icons.sparkles}
      trigger={
        <button
          type="button"
          className="group border-foreground/20 bg-tertiary hover:border-foreground flex w-full items-center gap-2 rounded-lg border-2 border-dashed p-4 shadow-sm duration-300"
        >
          <Badge>
            <Icons.pencil className="h-4 w-4" />
          </Badge>
          {children}
        </button>
      }
      footer={
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          <div className="flex w-full gap-2 md:w-auto">
            {value.length > 0 && (
              <Button type="button" variant="secondary" className="w-full md:w-auto" onClick={onClear}>
                {multiple ? 'Clear all' : 'Remove effect'}
              </Button>
            )}
            <Button onClick={onConfirm} className="w-full md:w-auto">
              Confirm
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2 md:max-h-[340px] md:grid-cols-3 md:overflow-y-auto xl:grid-cols-4">
        {baseOptions.map((opt) => (
          <EffectTile key={opt.value} id={opt.value} label={opt.label} premiumOnly={!!opt.premium} />
        ))}
      </div>
    </ResponsiveModal>
  )
}
