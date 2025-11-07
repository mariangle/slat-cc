import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command-list'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Icons } from '@/lib/constants/icons'
import { getFontVariable, parseFont } from '@/lib/features/app'
import { cn } from '@/lib/utils'
import { injectFontVariable } from '@/lib/utils/inject-font-variable'

import type { FieldOptionsWithPremium } from '@/lib/types'
import { inputVariants } from '../ui/input'

interface OptionsPickerProps<T> {
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  optional?: boolean
  premium?: boolean
  items: FieldOptionsWithPremium<T>
  placeholder?: string
  modal?: boolean
  isFontPicker?: boolean
}

export function OptionsPicker<T>({
  value,
  onChange,
  disabled,
  optional,
  modal,
  premium = true, // if not provided, assume all options are free
  items,
  placeholder = 'Select an option',
  isFontPicker,
}: OptionsPickerProps<T>) {
  const selectedOption = React.useMemo(() => items.find((item) => item.value === value), [value, items])

  return (
    <div className="flex w-full items-center gap-2">
      <Popover modal={modal}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex items-center justify-between gap-x-2',
              inputVariants(),
              isFontPicker ? injectFontVariable(selectedOption?.value) : undefined,
            )}
          >
            <span
              className={cn('text-sm', !selectedOption && 'opacity-50')}
              style={{
                fontFamily: isFontPicker ? getFontVariable(parseFont(value)) : undefined,
              }}
            >
              {selectedOption?.label || placeholder}
            </span>
            <Icons.chevronsUpDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] overflow-y-auto p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>Nothing found.</CommandEmpty>

            <CommandGroup>
              <CommandList>
                {items.map((item, idx) => {
                  const isLocked = item.premium && !premium
                  const fontClass = isFontPicker ? injectFontVariable(item.value) : undefined
                  const isSelected = item.value === selectedOption?.value

                  return (
                    <CommandItem
                      key={idx}
                      value={String(item.value)}
                      onSelect={() => onChange(item.value)}
                      disabled={disabled || isLocked}
                      className={cn('flex items-center', fontClass)}
                    >
                      {isLocked ? (
                        <Icons.lock className="text-primary-800 mr-2 size-3.5" />
                      ) : (
                        <Icons.check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                      )}
                      <span
                        style={{
                          fontFamily: isFontPicker ? getFontVariable(parseFont(item.value)) : undefined,
                        }}
                      >
                        {item.label}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {optional && value && (
        <Button
          type="button"
          variant="destructive"
          size="icon-md"
          className="ml-auto"
          onClick={() => onChange('' as T)}
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
