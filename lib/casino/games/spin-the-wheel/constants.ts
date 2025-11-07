import type { WheelColor, WheelSegment } from '@/lib/casino/games/spin-the-wheel/schemas'

export const wheelSegments: WheelSegment[] = [
  {
    hex: '#00A8E8',
    color: 'blue',
    multiplier: 2,
  },
  {
    hex: '#00A8E8',
    color: 'blue',
    multiplier: 2,
  },
  {
    hex: '#00A8E8',
    color: 'blue',
    multiplier: 2,
  },
  {
    hex: '#33ff7a',
    color: 'green',
    multiplier: 6,
  },
  {
    hex: '#FDE047',
    color: 'yellow',
    multiplier: 3,
  },
  {
    hex: '#FDE047',
    color: 'yellow',
    multiplier: 3,
  },
]

export const colorToMultiplier = new Map<WheelColor, number>()
wheelSegments.forEach((segment) => {
  colorToMultiplier.set(segment.color, segment.multiplier)
})
