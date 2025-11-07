import { Card } from '@/components/profile/card/card'
import { Container } from '@/components/profile/card/container'
import { Icons } from '@/lib/constants/icons'
import { isContainerTransparent } from '@/lib/features/config/utils/card-utils'
import { cn } from '@/lib/utils'
import type { CardFormValues } from '@/lib/zod/schemas/config'
import Image from 'next/image'

const CARD_TEMPLATES = [
  {
    name: 'Classic',
    values: {
      backgroundBlur: 10,
      backgroundOpacity: 15,
      borderOpacity: 5,
      borderRadius: 50,
      borderWidth: 2,
      backgroundColor: '#151515',
      borderColor: '#FFFFFF',
      gradientAngle: 0,
      shadowOpacity: 0,
      containerBackgroundColor: '#FFFFFF',
      containerBackgroundOpacity: 5,
      containerBorderColor: '#FFFFFF',
      containerBorderOpacity: 10,
      containerBorderWidth: 1,
    },
  },
  {
    name: 'Frosted Square',
    values: {
      backgroundBlur: 20,
      backgroundOpacity: 2,
      borderOpacity: 5,
      borderRadius: 0,
      borderWidth: 1,
      backgroundColor: '#FFFFFF',
      borderColor: '#FFFFFF',
      gradientAngle: 0,
      shadowOpacity: 0,
      containerBackgroundColor: '#FFFFFF',
      containerBackgroundOpacity: 3,
      containerBorderColor: '#FFFFFF',
      containerBorderOpacity: 5,
      containerBorderWidth: 1,
    },
  },
  {
    name: 'Frosted Soft',
    values: {
      backgroundBlur: 10,
      backgroundOpacity: 15,
      backgroundColor: '#151515',
      borderOpacity: 0,
      borderWidth: 0,
      borderRadius: 25,
      gradientAngle: 0,
      shadowOpacity: 0,
      containerBackgroundColor: '#FFFFFF',
      containerBackgroundOpacity: 0,
      containerBorderColor: '#FFFFFF',
      containerBorderOpacity: 0,
      containerBorderWidth: 0,
    },
  },
  {
    name: 'Outlined',
    values: {
      backgroundBlur: 0,
      backgroundOpacity: 0,
      borderOpacity: 10,
      borderWidth: 2,
      borderRadius: 0,
      backgroundColor: '#151515',
      borderColor: '#FFFFFF',
      gradientAngle: 0,
      shadowColor: '#FFFFFF',
      shadowOpacity: 10,
      containerBackgroundColor: '#FFFFFF',
      containerBackgroundOpacity: 2,
      containerBorderColor: '#FFFFFF',
      containerBorderOpacity: 5,
      containerBorderWidth: 1,
    },
  },
  {
    name: 'Aurora',
    values: {
      backgroundColor: '#d4d4d4',
      backgroundColorSecondary: '#000000',
      gradientAngle: 135,
      backgroundBlur: 0,
      backgroundOpacity: 20,
      borderOpacity: 0,
      borderWidth: 0,
      borderRadius: 28,
      shadowOpacity: 35,
      shadowColor: '#575BAF',
      containerBackgroundColor: '#FFFFFF',
      containerBackgroundOpacity: 4,
      containerBorderColor: '#FFFFFF',
      containerBorderOpacity: 0,
      containerBorderWidth: 0,
    },
  },
  {
    name: 'Transparent',
    values: {
      backgroundBlur: 0,
      backgroundOpacity: 0,
      borderOpacity: 0,
      borderWidth: 0,
      gradientAngle: 0,
      shadowOpacity: 0,
      containerBackgroundColor: '#FFFFFF',
      containerBackgroundOpacity: 0,
      containerBorderColor: '#FFFFFF',
      containerBorderOpacity: 0,
      containerBorderWidth: 0,
    },
  },
] satisfies CardTemplate[]

type CardTemplate = {
  name: string
  values: Partial<CardFormValues>
}

interface CardPickerProps {
  onClick: (values: CardFormValues) => void
  values: CardFormValues
}

export function CardTemplatePicker({ onClick, values }: CardPickerProps) {
  const IGNORED_KEYS = new Set(['backgroundColor', 'shadowColor', 'containerBackgroundColor', 'containerBorderColor'])

  function isTemplateSelected(template: CardTemplate, values: CardFormValues) {
    return Object.entries(template.values).every(([key, val]) => {
      if (IGNORED_KEYS.has(key)) return true
      return values[key as keyof typeof values] === val
    })
  }

  function getFormattedContainer(values: CardFormValues) {
    return {
      backgroundColor: values.containerBackgroundColor,
      backgroundOpacity: values.containerBackgroundOpacity,
      borderColor: values.containerBorderColor,
      borderOpacity: values.containerBorderOpacity,
      borderWidth: values.containerBorderWidth,
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 md:gap-4">
        {CARD_TEMPLATES.map((template, index) => {
          const cardValues = { ...values, ...template.values } satisfies CardFormValues
          const cardDisplayValues = {  ...cardValues, borderRadius: cardValues.borderRadius * 0.6 } satisfies CardFormValues
          const formattedContainer = getFormattedContainer(cardDisplayValues)

          return (
            <button
              type="button"
              key={index}
              className={cn(
                'outline-foreground/10 relative w-full overflow-hidden rounded-xl p-4 outline-2 transition outline-dashed',
                isTemplateSelected(template, values) && 'outline-foreground/80',
              )}
              onClick={() => onClick(cardValues)}
            >
              <Image
                src="/images/profile-card-background.jpg"
                alt="Card Template"
                fill
                className="object-cover brightness-75 hue-rotate-[20deg]"
              />

              <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-xs text-white lowercase drop-shadow-[0_0_3px_white]">
                {template.name}
              </div>
              <Card
                isProfileCard
                card={cardDisplayValues}
                className="relative mx-auto flex h-[140px] w-full flex-col justify-end overflow-hidden p-3"
              >
                <Container
                  borderRadius={cardDisplayValues.borderRadius}
                  container={formattedContainer}
                  className={cn(
                    'absolute top-2 right-2 flex w-fit items-center gap-x-1',
                    !isContainerTransparent(formattedContainer) && 'px-1.5 py-0.5',
                  )}
                  isInsideProfileCard
                >
                  <Icons.eye className="text-primary-400 size-3 drop-shadow-[0_0_3px_var(--primary)]" />
                  <span className="text-[11px]">0</span>
                </Container>
                <Container
                  borderRadius={cardDisplayValues.borderRadius}
                  container={formattedContainer}
                  className={cn('flex h-9 w-full flex-wrap items-center justify-center gap-1.5')}
                  isInsideProfileCard
                >
                  <Icons.tiktok className="text-primary-400/50 size-4 drop-shadow-[0_0_5px_var(--primary)]" />
                  <Icons.discord className="text-primary-400/50 size-4 drop-shadow-[0_0_5px_var(--primary)]" />
                  <Icons.spotify className="text-primary-400/50 size-4 drop-shadow-[0_0_5px_var(--primary)]" />
                </Container>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
