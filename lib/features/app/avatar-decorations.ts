import { FieldOptionsWithPremium } from '@/lib/types'
import { humanize } from '@/lib/utils'
import * as z from 'zod'

export enum AvatarDecorationId {
  ZombieFoodPurple = 1,
  ZombieFood = 2,
  Yunara = 3,
  YoruDimensionalDrift = 4,
  YodaOnDagobah = 5,
  /** ETC */
}

export const avatarDecorationSchema = z.nativeEnum(AvatarDecorationId)

const decorationFiles: Record<AvatarDecorationId, string> = {
  [AvatarDecorationId.ZombieFoodPurple]: 'zombie_food_purple.png',
  [AvatarDecorationId.ZombieFood]: 'zombie_food.png',
  [AvatarDecorationId.Yunara]: 'yunara.png',
  [AvatarDecorationId.YoruDimensionalDrift]: 'yoru_dimensional_drift.png',
  [AvatarDecorationId.YodaOnDagobah]: 'yoda_on_dagobah.png',
  /** ETC */
} as const

const featuredDecorationIds: AvatarDecorationId[] = [
  AvatarDecorationId.Air,
  AvatarDecorationId.Angry,
  AvatarDecorationId.Angel,
  AvatarDecorationId.AstralAura,
  AvatarDecorationId.BlackHole,
  /** ETC */
]

export const avatarDecorationOptions = Object.entries(decorationFiles).map(([key, value]) => ({
  label: humanize(value.replace('.png', '')),
  value: Number(key),
  premium: true,
  featured: featuredDecorationIds.includes(Number(key)),
})) satisfies FieldOptionsWithPremium<AvatarDecorationId>

export function parseAvatarDecoration(input: unknown): AvatarDecorationId | undefined {
  try {
    return avatarDecorationSchema.parse(input)
  } catch (error) {
    return undefined
  }
}

export function decorationSourceUrl(id: AvatarDecorationId): string {
  return `/decorations/${decorationFiles[id]}`
}
