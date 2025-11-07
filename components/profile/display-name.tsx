'use client'

import Image from 'next/image'
import Typewriter from 'typewriter-effect'

import { Tooltip } from '@/components/ui/tooltip'
import type { Font, TextEffect } from '@/lib/features/app'

import { getFontVariable } from '@/lib/features/app'
import {
  formatCssTextEffect,
  generateSparklesUrl,
  isCssTextEffect,
  isSparklesTextEffect,
  recycleTypewriterText,
} from '@/lib/features/app/text-effects'
import { cn, getDropShadow, getShimmerStyles, getShineStyles, humanize, joinStringsBySpace } from '@/lib/utils'
import { match, P } from 'ts-pattern'
import { FlamesText } from '../text-effects/flames-text'
import { FlickerText } from '../text-effects/flicker-text'
import { FlipText } from '../text-effects/flip-text'
import { GlitchText } from '../text-effects/glitch-text'
import { LoadingText } from '../text-effects/loading-text'
import { ScrambleText } from '../text-effects/scramble-text'

export interface TextEffectProps {
  text: string
  color: string
}

interface DisplayNameProps {
  title: string
  options: {
    color?: string
    effects: TextEffect[] | TextEffect | undefined
    font?: Font
  }
  tooltip?: string
  className?: string
}

export function DisplayName({ title, options, className, tooltip }: DisplayNameProps) {
  const effects = match(options.effects)
    .returnType<TextEffect[]>()
    .with(P.string, (effect) => [effect])
    .with(P.array(P.string), (effects) => effects)
    .with(P.nullish, () => [])
    .otherwise(() => [])

  const sparklesTextEffect = effects.find(isSparklesTextEffect)
  const cssTextEffects = effects.filter(isCssTextEffect)
  const combinedCssClasses = joinStringsBySpace(cssTextEffects.map(formatCssTextEffect))

  const textEffectProps: TextEffectProps = {
    text: title,
    color: options.color || '#FFFFFF',
  }

  const displayComponent = renderDisplayComponent(effects, textEffectProps)

  return (
    <TitleTooltip tooltip={tooltip}>
      {effects.includes('cherry-blossoms') && (
        <Image
          src="/effects/cherry-blossoms.gif"
          alt="cherry blossoms"
          unoptimized
          width="0"
          height="0"
          sizes="100vw"
          className="absolute h-full w-full object-cover"
        />
      )}
      {sparklesTextEffect && (
        <Image
          src={generateSparklesUrl(sparklesTextEffect)}
          alt={humanize(sparklesTextEffect)}
          unoptimized
          width="0"
          height="0"
          sizes="100vw"
          className="absolute h-full w-full object-cover"
        />
      )}
      <h2
        className={cn(
          'relative w-fit bg-transparent text-3xl font-medium tracking-wider text-wrap break-all',
          className,
          combinedCssClasses,
        )}
        style={{
          color: options.color,
          fontFamily: options.font ? getFontVariable(options.font) : undefined,
          filter: effects.includes('glow') ? getDropShadow(textEffectProps.color) : undefined,
          ...(effects.includes('shimmer') && getShimmerStyles(textEffectProps.color)),
          ...(effects.includes('shine') && getShineStyles(textEffectProps.color)),
        }}
        data-text={title}
      >
        {displayComponent}
      </h2>
    </TitleTooltip>
  )
}

function TitleTooltip({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  if (!tooltip) return <div className="relative w-fit">{children}</div>

  return (
    <Tooltip content={tooltip}>
      <div className="relative">{children}</div>
    </Tooltip>
  )
}

function renderDisplayComponent(effects: TextEffect[], props: TextEffectProps) {
  return match(effects)
    .when(
      (effects) => effects.includes('typewriter'),
      () => (
        <Typewriter
          options={{
            strings: recycleTypewriterText(props.text),
            autoStart: true,
            loop: true,
          }}
        />
      ),
    )
    .when(
      (effects) => effects.includes('flicker'),
      () => <FlickerText {...props} />,
    )
    .when(
      (effects) => effects.includes('flip'),
      () => <FlipText {...props} />,
    )
    .when(
      (effects) => effects.includes('loading'),
      () => <LoadingText {...props} />,
    )
    .when(
      (effects) => effects.includes('flames'),
      () => <FlamesText {...props} />,
    )
    .when(
      (effects) => effects.includes('glitch'),
      () => <GlitchText {...props} />,
    )
    .when(
      (effects) => effects.includes('scramble'),
      () => <ScrambleText {...props} />,
    )
    .otherwise(() => props.text)
}
