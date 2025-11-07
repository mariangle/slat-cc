import { Avatar } from '@/components/profile/avatar'
import { BadgeList } from '@/components/profile/badges/badge-list'
import { Card } from '@/components/profile/card/card'
import { ProfileCardBanner } from '@/components/profile/card/profile-card-banner'
import { Bio } from '@/components/profile/core/bio'
import { DisplayName } from '@/components/profile/core/display-name'
import { Details } from '@/components/profile/details/details'
import { Embed } from '@/components/profile/embeds/embed'
import { GridList } from '@/components/profile/grid-list'
import { LinkList } from '@/components/profile/links/link-list'
import { ProfileContentProps } from '@/components/profile/profile-page-content'
import { TagList } from '@/components/profile/tags/tag-list'
import { getDisplayUserId } from '@/lib/features/users/utils'
import { cn } from '@/lib/utils'
import { isNil } from 'lodash'
import { match } from 'ts-pattern'

export function ProfileCard({ profile, views, preview }: ProfileContentProps) {
  const { config, embeds, links, badges } = profile
  const { layout, media, enhancements, avatar } = config

  const avatarPositionClasses = match({ position: layout.avatarPosition, alignLeft: layout.alignLeft })
    .with({ position: 'float', alignLeft: true }, () => 'absolute bottom-full left-0 translate-y-6 translate-x-0')
    .with({ position: 'float', alignLeft: false }, () => 'absolute bottom-full left-1/2 translate-y-6 -translate-x-1/2')
    .otherwise(() => undefined)

  const insideProfileCardEmbeds = embeds.filter((embed) => embed.insideProfileCard)
  const insideProfileCardLinks = links.filter((link) => link.style === 'icon' && !link.hidden)

  function preventViewsOverlap() {
    const conditions = [isNil(media.banner), layout.showViews, layout.isBadgesNextToName]
    return conditions.every(Boolean)
  }

  return (
    <Card
      isProfileCard
      card={config.card}
      className={cn(
        'relative h-fit w-full',
        media.banner && 'overflow-hidden', // ensure banner doesn't overflow the card radius
        enhancements.visualizeAudio && 'audio-visualizer-shadow',
      )}
    >
      {layout.showViews && views}
      {media.banner && <ProfileCardBanner config={config} />}
      <div className={cn('space-y-6 p-6', !avatar.url && layout.avatarPosition === 'default' && 'pt-10')}>
        <div
          className={cn(
            'relative flex w-full flex-col items-center gap-x-4 gap-y-2',
            layout.alignLeft && 'items-start',
            layout.avatarPosition === 'aside' && 'flex-row',
            preventViewsOverlap() && 'pt-4',
            layout.avatarPosition === 'float' && 'pt-8',
          )}
        >
          <Avatar avatar={avatar} className={cn(avatarPositionClasses)} />
          <div className="w-full max-w-full">
            <div
              className={cn(
                'relative mx-auto flex w-fit flex-col items-center gap-1',
                layout.alignLeft && 'mx-0 w-fit items-start',
              )}
            >
              <DisplayName
                title={config.name}
                tooltip={`UID ${getDisplayUserId(profile.user.id)}`}
                options={{
                  effects: enhancements.nameEffects,
                  color: config.nameColor,
                  font: config.nameFont,
                }}
              />
              <BadgeList badges={badges} config={config} />
            </div>
            <Bio
              text={config.bio}
              options={{
                bioEffect: enhancements.bioEffect,
                color: config.textColor,
                alignLeft: layout.alignLeft,
              }}
            />
            <TagList tags={config.tags} config={config} className="mt-3" />
            {(config.location || config.occupation) && <Details config={config} />}
          </div>
        </div>
        <div className="space-y-4">
          {!preview && (
            <GridList
              maxWidth={config.layout.maxWidth}
              items={insideProfileCardEmbeds}
              renderItem={(item) => (
                <Embed
                  key={item.id}
                  embed={item}
                  card={config.card}
                  container={config.container}
                  colors={{
                    text: config.textColor,
                    theme: config.themeColor,
                    name: config.nameColor,
                  }}
                />
              )}
            />
          )}
          {insideProfileCardLinks.length > 0 && <LinkList links={insideProfileCardLinks} config={config} />}
        </div>
      </div>
    </Card>
  )
}
