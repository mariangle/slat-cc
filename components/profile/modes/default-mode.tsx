import { ProfileCard } from '@/components/profile/card/profile-card'
import { Embed } from '@/components/profile/embeds/embed'
import { SocialLink } from '@/components/profile/links/link'
import { ProfileContentProps } from '@/components/profile/profile-page-content'
import { ProfileWidthWrapper } from '@/components/profile/profile-page-wrapper'
import { MusicPlayer } from '@/components/profile/tracks/track-music-player'
import React from 'react'

export function ProfileDefaultMode(props: ProfileContentProps) {
  const config = props.profile.config
  const { profile, preview } = props

  const outsideProfileCardLinks = profile.links.filter((link) => link.style === 'card' && !link.hidden)
  const outsideProfileCardEmbeds = profile.embeds.filter((embed) => !embed.insideProfileCard)

  return (
    <ProfileWidthWrapper config={config} className="py-24 md:py-32">
      <ProfileCard {...props} />
      {!preview && (
        <React.Fragment>
          {outsideProfileCardLinks.map((item) => (
            <SocialLink key={item.id} item={item} config={config} />
          ))}
          {profile.tracks.length > 0 && (
            <MusicPlayer
              tracks={profile.tracks}
              colors={{
                text: config.textColor,
                theme: config.themeColor,
                name: config.nameColor,
              }}
              card={config.card}
              layout={config.layout.musicPlayer}
            />
          )}
          {outsideProfileCardEmbeds.map((embed) => (
            <Embed
              key={embed.id}
              embed={embed}
              card={config.card}
              container={config.container}
              colors={{
                text: config.textColor,
                theme: config.themeColor,
                name: config.nameColor,
              }}
            />
          ))}
        </React.Fragment>
      )}
    </ProfileWidthWrapper>
  )
}
