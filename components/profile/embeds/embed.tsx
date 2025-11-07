import { ValorantProfile } from '@/components/profile/embeds/valorant/valorant-profile'
import type { Card, Container } from '@/lib/features/config/schemas'
import type { Embed } from '@/lib/features/embeds/schemas'
import { EmbedParser } from '@/lib/integrations/providers/EmbedParser'
import type { EmbedIntegration } from '@/lib/integrations/providers/schemas'
import { EmbedType } from '@/lib/integrations/providers/schemas'
import dynamic from 'next/dynamic'
import { match } from 'ts-pattern'

const DiscordInvite = dynamic(async () => await import('./discord/discord-invite').then((m) => m.DiscordInvite))
const DiscordPresence = dynamic(async () => await import('./discord/discord-presence').then((m) => m.DiscordPresence))
const GitHubProfile = dynamic(async () => await import('./github/github-profile').then((m) => m.GitHubProfile))
const RobloxProfile = dynamic(async () => await import('./roblox/roblox-profile').then((m) => m.RobloxProfile))
const SoundcloudEmbed = dynamic(async () => await import('./soundcloud').then((m) => m.SoundcloudEmbed))
const SpotifyEmbed = dynamic(async () => await import('./spotify').then((m) => m.SpotifyEmbed))
const SteamProfile = dynamic(async () => await import('./steam/steam-profile').then((m) => m.SteamProfile))
const TwitchChannel = dynamic(async () => await import('./twitch/twitch-channel').then((m) => m.TwitchChannel))
const YoutubeChannel = dynamic(async () => await import('./youtube/youtube-channel').then((m) => m.YoutubeChannel))
const YoutubeVideo = dynamic(async () => await import('./youtube/youtube-video').then((m) => m.YoutubeVideo))

type DisplayEmbed = Omit<Embed, 'id'>

interface EmbedBaseProps {
  card: Card
  container: Container
  colors: {
    text: string
    theme: string
    name: string
  }
  preview?: boolean
}

// all embed components accepts these props
export interface EmbedProps extends EmbedBaseProps {
  embed: DisplayEmbed & EmbedIntegration
}

function getEmbedComponent(type: EmbedType): React.ComponentType<EmbedProps> {
  return match(type)
    .returnType<React.ComponentType<EmbedProps>>()
    .with(EmbedType.YoutubeVideo, () => YoutubeVideo)
    .with(EmbedType.YoutubeChannel, () => YoutubeChannel)
    .with(EmbedType.RobloxProfile, () => RobloxProfile)
    .with(EmbedType.GitHubProfile, () => GitHubProfile)
    .with(EmbedType.DiscordPresence, () => DiscordPresence)
    .with(EmbedType.DiscordInvite, () => DiscordInvite)
    .with(EmbedType.TwitchChannel, () => TwitchChannel)
    .with(EmbedType.SteamProfile, () => SteamProfile)
    .with(EmbedType.SpotifyTrack, () => SpotifyEmbed)
    .with(EmbedType.SpotifyAlbum, () => SpotifyEmbed)
    .with(EmbedType.SpotifyPlaylist, () => SpotifyEmbed)
    .with(EmbedType.SoundcloudTrack, () => SoundcloudEmbed)
    .with(EmbedType.SoundcloudPlaylist, () => SoundcloudEmbed)
    .with(EmbedType.SoundcloudAlbum, () => SoundcloudEmbed)
    .with(EmbedType.ValorantProfile, () => ValorantProfile)
    .exhaustive()
}

export function Embed({ embed, card, container, colors, preview }: EmbedBaseProps & { embed: DisplayEmbed }) {
  const embedDetails = EmbedParser.tryParse(embed.content)

  if (embedDetails) {
    const Component = getEmbedComponent(embedDetails.type)

    return (
      <Component
        embed={{ ...embed, ...embedDetails }}
        card={card}
        container={container}
        colors={colors}
        preview={preview}
      />
    )
  }

  if (preview) {
    return (
      <div className="border-destructive bg-destructive/5 text-foreground flex h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed md:max-w-md">
        <div className="text-sm font-medium">Preview</div>
        <div className="text-xs">Invalid embed content</div>
      </div>
    )
  }
}
