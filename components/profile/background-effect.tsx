'use client'

import { useMounted } from '@/hooks/use-mounted'
import type { BackgroundEffect } from '@/lib/features/app'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { match } from 'ts-pattern'

const AuroraEffect = dynamic(() => import('./aurora-background').then((m) => m.AuroraEffect))
const AuroraSpotlightEffect = dynamic(() => import('./aurora-spotlight-effect').then((m) => m.AuroraSpotlightEffect))
const CashRainEffect = dynamic(() => import('./cash-rain-effect').then((m) => m.CashRainEffect))
const PetalsEffect = dynamic(() => import('./cherry-blossoms-effect').then((m) => m.PetalsEffect))
const GalaxyEffect = dynamic(() => import('./galaxy-effect').then((m) => m.GalaxyEffect))
const ParticlesEffect = dynamic(() => import('./particles-effect').then((m) => m.ParticlesEffect))
const RainEffect = dynamic(() => import('./rain-effect').then((m) => m.RainEffect))
const SnowfallEffect = dynamic(() => import('./snowfall-effect').then((m) => m.SnowfallEffect))
const SpotlightEffect = dynamic(() => import('./spotlight-effect').then((m) => m.SpotlightEffect))
const ThunderEffect = dynamic(() => import('./thunder-effect').then((m) => m.ThunderEffect))

export interface GenericBackgroundEffectProps {
  className?: string
  hue: number
}

export function BackgroundEffect({
  effect,
  className,
  hue,
}: GenericBackgroundEffectProps & { effect: BackgroundEffect }) {
  const mounted = useMounted()

  if (!mounted) return null

  const props: GenericBackgroundEffectProps = { className, hue }

  return match(effect)
    .with('aurora-spotlight', () => <AuroraSpotlightEffect {...props} />)
    .with('galaxy', () => <GalaxyEffect {...props} />)
    .with('petals', () => <PetalsEffect {...props} />)
    .with('snowflakes', () => <ParticlesEffect {...props} />)
    .with('snowfall', () => <SnowfallEffect {...props} />)
    .with('rain', () => <RainEffect {...props} />)
    .with('thunder', () => <ThunderEffect {...props} />)
    .with('cash-rain', () => <CashRainEffect {...props} />)
    .with('aurora', () => <AuroraEffect {...props} />)
    .with('spotlight', () => <SpotlightEffect {...props} className={cn('-top-10 left-1/4 md:-top-20', className)} />)
    .exhaustive()
}
