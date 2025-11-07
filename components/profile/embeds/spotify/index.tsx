import type { EmbedProps } from '@/components/profile/embeds/embed'
import { EmbedWrapper } from '@/components/profile/embeds/embed-wrapper'
import { EmbedType } from '@/lib/integrations/providers/schemas'
import { match } from 'ts-pattern'

type SpotifyEntityType = 'track' | 'album' | 'playlist' // the supported Spotify entity types

function getHeight(embed: EmbedProps['embed']): number {
  return match(embed)
    .with({ type: EmbedType.SpotifyTrack }, () => 80)
    .with({ type: EmbedType.SpotifyAlbum, compactLayout: true }, () => 152)
    .with({ type: EmbedType.SpotifyAlbum, compactLayout: false }, () => 352)
    .with({ type: EmbedType.SpotifyPlaylist, compactLayout: true }, () => 152)
    .with({ type: EmbedType.SpotifyPlaylist, compactLayout: false }, () => 352)
    .otherwise(() => 152)
}

function getType(embed: EmbedProps['embed']): SpotifyEntityType {
  return match(embed.type)
    .returnType<SpotifyEntityType>()
    .with(EmbedType.SpotifyTrack, () => 'track')
    .with(EmbedType.SpotifyAlbum, () => 'album')
    .with(EmbedType.SpotifyPlaylist, () => 'playlist')
    .otherwise(() => 'track')
}

export function SpotifyEmbed({ embed }: EmbedProps) {
  const theme = embed.secondStyle ? '0' : '1'
  const type = getType(embed)

  return (
    <EmbedWrapper>
      <iframe
        src={`https://open.spotify.com/embed/${type}/${embed.identifier}?utm_source=generator&theme=${theme}`}
        width="100%"
        height={getHeight(embed)}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        allowFullScreen
        style={{ borderRadius: '12px' }}
        title={`Spotify ${type}`}
      />
    </EmbedWrapper>
  )
}
