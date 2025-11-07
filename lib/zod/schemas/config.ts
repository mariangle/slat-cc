import type {
  AvatarField,
  CommentsField,
  ConfigField,
  EnhancementsField,
  EnterScreenField,
  LayoutField,
  MediaField,
} from '@/lib/features/config/schemas'
import {
  avatarFields,
  CardContainerField,
  cardContainerFields,
  commentsFields,
  configFields,
  enhancementsFields,
  enterScreenFields,
  layoutFields,
  mediaFields,
} from '@/lib/features/config/schemas'
import {
  CardBorderRadius,
  ContainerBorderWidth,
  Degree,
  LayoutMaxWidth,
  NameEffectsLength,
  PageTransitionDuration,
  PercentRange,
} from '@/lib/features/enums'
import { allowEmpty } from '@/lib/zod/utils'
import { z } from 'zod'

export const infoFormSchema = z.object({
  name: configFields.name.max(25, { message: 'Name cannot exceed 25 characters' }),
  bio: configFields.bio.max(800, { message: 'Bio cannot exceed 800 characters' }),
  location: configFields.location.max(50, { message: 'Location cannot exceed 50 characters' }),
  occupation: configFields.occupation.max(50, { message: 'Occupation cannot exceed 50 characters' }),
  tags: configFields.tags.max(10, { message: 'Tags cannot exceed 10 items' }),
} satisfies Partial<Record<ConfigField, z.ZodTypeAny>>)

export type InfoFormValues = z.infer<typeof infoFormSchema>

export const colorsFormSchema = z.object({
  textColor: configFields.textColor,
  themeColor: configFields.themeColor,
  nameColor: configFields.nameColor,
} satisfies Partial<Record<ConfigField, z.ZodTypeAny>>)

export type ColorsFormValues = z.infer<typeof colorsFormSchema>

export const avatarFormSchema = z.object({
  url: allowEmpty(avatarFields.url),
  decorationId: allowEmpty(avatarFields.decorationId),
  decorationHue: avatarFields.decorationHue.min(Degree.Min).max(Degree.Max),
  borderRadius: avatarFields.borderRadius,
} satisfies Record<AvatarField, z.ZodTypeAny>)

export type AvatarFormValues = z.infer<typeof avatarFormSchema>

export const mediaFormSchema = z.object({
  banner: allowEmpty(mediaFields.banner),
  background: allowEmpty(mediaFields.background),
  audio: allowEmpty(mediaFields.audio),
  video: allowEmpty(mediaFields.video),
  cursor: allowEmpty(mediaFields.cursor),
} satisfies Record<MediaField, z.ZodTypeAny>)

export type MediaFormValues = z.infer<typeof mediaFormSchema>

export const fontsFormSchema = z.object({
  nameFont: configFields.nameFont,
  textFont: configFields.textFont,
} satisfies Partial<Record<ConfigField, z.ZodTypeAny>>)

export type FontsFormValues = z.infer<typeof fontsFormSchema>

export const cardFormSchema = z.object({
  backgroundColor: cardContainerFields.backgroundColor,
  backgroundColorSecondary: allowEmpty(cardContainerFields.backgroundColorSecondary),
  backgroundBlur: cardContainerFields.backgroundBlur.min(PercentRange.Min).max(PercentRange.Max),
  backgroundOpacity: cardContainerFields.backgroundOpacity.min(PercentRange.Min).max(PercentRange.Max),
  borderColor: cardContainerFields.borderColor,
  borderRadius: cardContainerFields.borderRadius.min(CardBorderRadius.Min).max(CardBorderRadius.Max),
  borderOpacity: cardContainerFields.borderOpacity.min(PercentRange.Min).max(PercentRange.Max),
  borderWidth: cardContainerFields.borderWidth,
  gradientAngle: cardContainerFields.gradientAngle,
  shadowColor: cardContainerFields.shadowColor,
  shadowOpacity: cardContainerFields.shadowOpacity.min(PercentRange.Min).max(PercentRange.Max),
  containerBackgroundColor: cardContainerFields.backgroundColor,
  containerBackgroundOpacity: cardContainerFields.backgroundOpacity.min(PercentRange.Min).max(PercentRange.Max),
  containerBorderColor: cardContainerFields.borderColor,
  containerBorderOpacity: cardContainerFields.borderOpacity.min(PercentRange.Min).max(PercentRange.Max),
  containerBorderWidth: cardContainerFields.borderWidth.min(ContainerBorderWidth.Min).max(ContainerBorderWidth.Max),
} satisfies Partial<Record<CardContainerField, z.ZodTypeAny>>)

export type CardFormValues = z.infer<typeof cardFormSchema>

export const layoutFormSchema = z.object({
  alignLeft: layoutFields.alignLeft,
  isBadgesNextToName: layoutFields.isBadgesNextToName,
  avatarPosition: layoutFields.avatarPosition,
  profileModeId: layoutFields.profileModeId,
  showViews: layoutFields.showViews,
  maxWidth: layoutFields.maxWidth.min(LayoutMaxWidth.Min).max(LayoutMaxWidth.Max),
} satisfies Partial<Record<LayoutField, z.ZodTypeAny>>)

export type LayoutFormValues = z.infer<typeof layoutFormSchema>

export const commentsFormSchema = z.object({
  enabled: commentsFields.enabled,
} satisfies Partial<Record<CommentsField, z.ZodTypeAny>>)

export type CommentsFormValues = z.infer<typeof commentsFormSchema>

export const enterScreenFormSchema = z.object({
  text: enterScreenFields.text.min(1).max(50),
  persistent: enterScreenFields.persistent,
} satisfies Partial<Record<EnterScreenField, z.ZodTypeAny>>)

export type EnterScreenFormValues = z.infer<typeof enterScreenFormSchema>

export const enhancementsFormSchema = z.object({
  pageOverlay: allowEmpty(enhancementsFields.pageOverlay),
  cursorTrail: allowEmpty(enhancementsFields.cursorTrail),
  visualizeAudio: enhancementsFields.visualizeAudio,
  animateViews: enhancementsFields.animateViews,
  tiltingCard: enhancementsFields.tiltingCard,
  backgroundEffect: enhancementsFields.backgroundEffect,
  backgroundEffectHue: enhancementsFields.backgroundEffectHue.min(Degree.Min).max(Degree.Max),
  pageTransitionDuration: enhancementsFields.pageTransitionDuration
    .min(PageTransitionDuration.Min)
    .max(PageTransitionDuration.Max),
  pageTransition: allowEmpty(enhancementsFields.pageTransition),
  nameEffects: enhancementsFields.nameEffects.max(NameEffectsLength.Max),
  bioEffect: allowEmpty(enhancementsFields.bioEffect),
  iconsGlow: enhancementsFields.iconsGlow,
} satisfies Partial<Record<EnhancementsField, z.ZodTypeAny>>)

export type EnhancementsFormValues = z.infer<typeof enhancementsFormSchema>

export const trackLayoutFormSchema = z.object({
  musicPlayer: layoutFields.musicPlayer,
} satisfies Partial<Record<LayoutField, z.ZodTypeAny>>)

export type TrackLayoutFormValues = z.infer<typeof trackLayoutFormSchema>
