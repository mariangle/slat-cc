'use client'

import type { CursorTrail } from '@/lib/features/app'
import dynamic from 'next/dynamic'
import { match } from 'ts-pattern'

const BubblesTrail = dynamic(() => import('./bubbles-trail').then((m) => m.BubblesTrail))
const FallingParticlesTrail = dynamic(() => import('./falling-particles-trail').then((m) => m.FallingParticlesTrail))
const SparklesTrail = dynamic(() => import('./sparkles-trail').then((m) => m.SparklesTrail))
const StardustTrail = dynamic(() => import('./stardust-trail').then((m) => m.StardustTrail))
const TrailingTrail = dynamic(() => import('./trailing-cursor-trail').then((m) => m.TrailingCursor))
const SpotlightCursor = dynamic(() => import('./spotlight-cursor').then((m) => m.SpotlightCursor))
const RainbowCursor = dynamic(() => import('./rainbow-cursor').then((m) => m.RainbowCursor))
const CanvasCursor = dynamic(() => import('./canvas-cursor').then((m) => m.CanvasCursor))
const SnowflakeCursorTrail = dynamic(() => import('./falling-snowflakes-trail').then((m) => m.SnowflakeCursorTrail))

export interface GenericCursorTrailProps {
  color: string
  className?: string
}

export function CursorTrail({ color, trail, className }: { trail: CursorTrail } & GenericCursorTrailProps) {
  const Component = match(trail)
    .with('sparkles', () => SparklesTrail)
    .with('falling-particles', () => FallingParticlesTrail)
    .with('stardust', () => StardustTrail)
    .with('bubbles', () => BubblesTrail)
    .with('trailing', () => TrailingTrail)
    .with('spotlight', () => SpotlightCursor)
    .with('rainbow', () => RainbowCursor)
    .with('canvas', () => CanvasCursor)
    .with('falling-snowflakes', () => SnowflakeCursorTrail)
    .exhaustive()

  return <Component color={color} className={className} />
}
