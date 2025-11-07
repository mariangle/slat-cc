import {
  AvatarPosition,
  parseAvatarBorderRadius,
  parseAvatarDecoration,
  parseAvatarPosition,
  parseBackgroundEffect,
  parseCursorTrail,
  parseFont,
  parseMusicPlayerLayout,
  parsePageOverlay,
  parsePageTransition,
  parseProfileMode,
  parseTextEffect,
  parseTextEffects,
} from '@/lib/features/app'
import {
  defaultCard,
  defaultColor,
  defaultContainer,
  defaultEnhancements,
  defaultLayout,
} from '@/lib/features/config/defaults'
import type { ConfigResult } from '@/lib/features/config/queries'
import type { Config } from '@/lib/features/config/schemas'
import type { Tag } from '@/lib/features/tags/schemas'
import { sanitizeHtml } from '@/lib/utils/html-utils'

type FormatConfigOptions = {
  result: ConfigResult
  tags: Tag[]
}

export function formatConfig({ result, tags }: FormatConfigOptions): Config {
  return {
    id: result.id as number,
    name: result.name || '',
    bio: sanitizeHtml(result.bio || ''),
    location: result.location || '',
    occupation: result.occupation || '',
    tags,
    themeColor: result.themeColor || defaultColor,
    nameColor: result.nameColor || defaultColor,
    textColor: result.textColor || defaultColor,
    nameFont: parseFont(result.nameFont),
    textFont: parseFont(result.textFont),
    avatar: {
      url: result.avatar || undefined,
      decorationId: parseAvatarDecoration(result.avatarDecorationId),
      decorationHue: result.avatarDecorationHue ?? 0,
      borderRadius: parseAvatarBorderRadius(result.avatarBorderRadius),
    },
    media: {
      banner: result.banner || undefined,
      background: result.video || result.background || undefined,
      audio: result.audio || undefined,
      video: result.video || undefined,
      cursor: result.cursor || undefined,
    },
    container: {
      backgroundColor: result.containerBackgroundColor || defaultContainer.backgroundColor,
      backgroundOpacity: result.containerBackgroundOpacity ?? defaultContainer.backgroundOpacity,
      borderColor: result.containerBorderColor || defaultContainer.borderColor,
      borderOpacity: result.containerBorderOpacity ?? defaultContainer.borderOpacity,
      borderWidth: result.containerBorderWidth ?? defaultContainer.borderWidth,
    },
    card: {
      backgroundColor: result.cardBackgroundColor || defaultCard.backgroundColor,
      backgroundColorSecondary: result.cardbackgroundColorSecondary || undefined,
      backgroundOpacity: result.cardBackgroundOpacity ?? defaultCard.backgroundOpacity,
      backgroundBlur: result.cardBackgroundBlur ?? defaultCard.backgroundBlur,
      gradientAngle: result.cardGradientAngle ?? defaultCard.gradientAngle,
      borderColor: result.cardBorderColor || defaultCard.borderColor,
      borderOpacity: result.cardBorderOpacity ?? defaultCard.borderOpacity,
      borderRadius: result.cardBorderRadius ?? defaultCard.borderRadius,
      borderWidth: result.cardBorderWidth ?? defaultCard.borderWidth,
      shadowColor: result.cardShadowColor || defaultCard.shadowColor,
      shadowOpacity: result.cardShadowOpacity ?? defaultCard.shadowOpacity,
      tilt: Boolean(result.cardTilt ?? defaultCard.tilt),
    },
    layout: {
      profileModeId: parseProfileMode(result.profileModeId),
      musicPlayer: parseMusicPlayerLayout(result.layoutMusicPlayer ?? undefined),
      alignLeft: Boolean(result.alignLeft ?? defaultLayout.alignLeft),
      avatarPosition: getAvatarPosition(result),
      showViews: Boolean(result.showViews ?? defaultLayout.showViews),
      isBadgesNextToName: Boolean(result.isBadgesNextToName ?? defaultLayout.isBadgesNextToName),
      maxWidth: result.maxWidth ?? defaultLayout.maxWidth,
    },
    enhancements: {
      backgroundEffect: parseBackgroundEffect(result.backgroundEffect),
      backgroundEffectHue: result.backgroundEffectHue ?? defaultEnhancements.backgroundEffectHue,
      bioEffect: parseTextEffect(result.bioEffect),
      nameEffects: parseTextEffects(result.nameEffect ?? undefined),
      pageTransition: parsePageTransition(result.pageTransition),
      pageTransitionDuration: result.pageTransitionDuration ?? defaultEnhancements.pageTransitionDuration,
      pageOverlay: parsePageOverlay(result.pageOverlay),
      cursorTrail: parseCursorTrail(result.cursorTrail),
      visualizeAudio: Boolean(result.visualizeAudio ?? defaultEnhancements.visualizeAudio),
      animateViews: Boolean(result.viewsAnimated ?? defaultEnhancements.animateViews),
      iconsGlow: Boolean(result.iconsGlow ?? defaultEnhancements.iconsGlow),
      tiltingCard: Boolean(result.cardTilt ?? defaultEnhancements.tiltingCard),
    },
    comments: {
      enabled: Boolean(result.commentsEnabled ?? false),
    },
    enterScreen: {
      text: result.enterScreenText || '',
      persistent: Boolean(result.enterScreenPersistent ?? false),
    },
  }
}

function getAvatarPosition(result: ConfigResult): AvatarPosition {
  const { layoutWithBanner, banner, avatarPosition } = result

  if (avatarPosition) return parseAvatarPosition(avatarPosition)
  if (!layoutWithBanner) return 'float'
  if (banner) return 'float'
  return 'default'
}
