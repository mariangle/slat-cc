import {
  avatarBorderRadiusSchema,
  avatarDecorationSchema,
  avatarPositionSchema,
  backgroundEffectSchema,
  cursorTrailSchema,
  fontSchema,
  musicPlayerLayoutSchema,
  pageOverlaySchema,
  pageTransitionSchema,
  profileModeIdSchema,
  textEffectSchema,
} from '@/lib/features/app'
import { tagSchema } from '@/lib/features/tags/schemas'
import { colorSchema, urlSchema } from '@/lib/zod/schemas'
import * as z from 'zod'

export const avatarFields = {
  url: urlSchema.optional(),
  borderRadius: avatarBorderRadiusSchema,
  decorationId: avatarDecorationSchema.optional(),
  decorationHue: z.number(),
}

export type AvatarField = keyof z.infer<typeof avatarSchema>

export const avatarSchema = z.object(avatarFields)

export const mediaFields = {
  banner: urlSchema.optional(),
  background: z.union([urlSchema, colorSchema]).optional(),
  audio: urlSchema.optional(),
  video: urlSchema.optional(),
  cursor: urlSchema.optional(),
}

export type MediaField = keyof z.infer<typeof mediaSchema>

export const mediaSchema = z.object(mediaFields)

export const commentsFields = {
  enabled: z.boolean(),
}

export type CommentsField = keyof z.infer<typeof commentsSchema>

export const commentsSchema = z.object(commentsFields)

export const enterScreenFields = {
  text: z.string(),
  persistent: z.boolean(),
}

export type EnterScreenField = keyof z.infer<typeof enterScreenSchema>

export const enterScreenSchema = z.object(enterScreenFields)

export const layoutFields = {
  musicPlayer: musicPlayerLayoutSchema,
  alignLeft: z.boolean(),
  isBadgesNextToName: z.boolean(),
  avatarPosition: avatarPositionSchema,
  maxWidth: z.number(),
  profileModeId: profileModeIdSchema,
  showViews: z.boolean(),
}

export type LayoutField = keyof z.infer<typeof layoutSchema>

export const layoutSchema = z.object(layoutFields)

export const enhancementsFields = {
  backgroundEffect: backgroundEffectSchema.optional(),
  backgroundEffectHue: z.number(),
  bioEffect: textEffectSchema.optional(),
  nameEffects: z.array(textEffectSchema),
  pageTransition: pageTransitionSchema.optional(),
  pageTransitionDuration: z.number(),
  pageOverlay: pageOverlaySchema.optional(),
  cursorTrail: cursorTrailSchema.optional(),
  visualizeAudio: z.boolean(),
  animateViews: z.boolean(),
  iconsGlow: z.boolean(),
  tiltingCard: z.boolean(),
}

export const enhancementsSchema = z.object(enhancementsFields)

export type EnhancementsField = keyof z.infer<typeof enhancementsSchema>

export const cardContainerFields = {
  backgroundColor: colorSchema,
  backgroundColorSecondary: colorSchema.optional(),
  backgroundBlur: z.number(),
  backgroundOpacity: z.number(),
  borderColor: colorSchema,
  borderRadius: z.number(),
  borderOpacity: z.number(),
  borderWidth: z.number(),
  gradientAngle: z.number(),
  shadowColor: colorSchema,
  shadowOpacity: z.number(),
  containerBackgroundColor: colorSchema,
  containerBackgroundOpacity: z.number(),
  containerBorderColor: colorSchema,
  containerBorderOpacity: z.number(),
  containerBorderWidth: z.number(),
  tilt: z.boolean().optional(),
}

export type CardContainerField = keyof typeof cardContainerFields

export const cardSchema = z.object({
  backgroundColor: cardContainerFields.backgroundColor,
  backgroundColorSecondary: cardContainerFields.backgroundColorSecondary,
  backgroundBlur: cardContainerFields.backgroundBlur,
  backgroundOpacity: cardContainerFields.backgroundOpacity,
  borderColor: cardContainerFields.borderColor,
  borderRadius: cardContainerFields.borderRadius,
  borderOpacity: cardContainerFields.borderOpacity,
  borderWidth: cardContainerFields.borderWidth,
  gradientAngle: cardContainerFields.gradientAngle,
  shadowColor: cardContainerFields.shadowColor,
  shadowOpacity: cardContainerFields.shadowOpacity,
  tilt: cardContainerFields.tilt,
})

export type CardField = keyof z.infer<typeof cardSchema>

export const containerSchema = z.object({
  backgroundColor: cardContainerFields.backgroundColor,
  backgroundOpacity: cardContainerFields.backgroundOpacity,
  borderColor: cardContainerFields.borderColor,
  borderOpacity: cardContainerFields.borderOpacity,
  borderWidth: cardContainerFields.borderWidth,
})

export type ContainerField = keyof z.infer<typeof containerSchema>

export const configFields = {
  id: z.number(),
  name: z.string(),
  bio: z.string(),
  location: z.string(),
  occupation: z.string(),
  tags: z.array(tagSchema),
  avatar: avatarSchema,
  themeColor: colorSchema,
  nameColor: colorSchema,
  textColor: colorSchema,
  nameFont: fontSchema,
  textFont: fontSchema,
  media: mediaSchema,
  container: containerSchema,
  card: cardSchema,
  layout: layoutSchema,
  comments: commentsSchema,
  enhancements: enhancementsSchema,
  enterScreen: enterScreenSchema,
}

export type ConfigField = keyof z.infer<typeof configSchema>

export const configSchema = z.object(configFields)

export type Config = z.infer<typeof configSchema>

export type Avatar = z.infer<typeof avatarSchema>

export type Media = z.infer<typeof mediaSchema>

export type Layout = z.infer<typeof layoutSchema>

export type Enhancements = z.infer<typeof enhancementsSchema>

export type Card = z.infer<typeof cardSchema>

export type Container = z.infer<typeof containerSchema>

export type Comments = z.infer<typeof commentsSchema>

export type EnterScreen = z.infer<typeof enterScreenSchema>
