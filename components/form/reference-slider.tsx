import { Slider } from '@/components/ui/slider'

import { Degree, PercentRange } from '@/lib/features/enums'
import { match } from 'ts-pattern'

type Unit = 'px' | '%' | 'deg' | 's'

interface ReferenceSliderProps {
  min?: number
  max?: number
  value: number
  onValueChange: (values: number) => void
  disabled?: boolean
  step?: number
  unit: Unit
}

const getMinValue = (unit: Unit): number | undefined => {
  return match(unit)
    .with('%', () => PercentRange.Min)
    .with('deg', () => Degree.Min)
    .otherwise(() => undefined)
}

const getMaxValue = (unit: Unit): number | undefined => {
  return match(unit)
    .with('%', () => PercentRange.Max)
    .with('deg', () => Degree.Max)
    .otherwise(() => undefined)
}

export function ReferenceSlider({ min, max, value, onValueChange, disabled, unit, step }: ReferenceSliderProps) {
  const minValue = min ?? getMinValue(unit)
  const maxValue = max ?? getMaxValue(unit)

  return (
    <div className="w-full">
      <Slider
        value={[value]}
        onValueChange={([val]) => onValueChange(val)}
        min={minValue}
        max={max ?? getMaxValue(unit)}
        disabled={disabled}
        step={step}
      />
      <span
        className="mt-2 flex w-full items-center justify-between gap-1 text-xs text-muted-foreground"
        aria-hidden="true"
      >
        <span>
          {minValue} {unit}
        </span>
        <span className="font-medium text-foreground">
          {value} {unit}
        </span>
        <span>
          {maxValue} {unit}
        </span>
      </span>
    </div>
  )
}
