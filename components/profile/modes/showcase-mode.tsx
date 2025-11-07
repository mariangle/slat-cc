import { AnimateInView } from '@/components/profile/animations/animate-in-view'
import { Detail } from '@/components/profile/details/detail'
import { SocialLink } from '@/components/profile/links/link'
import { ProfileWidthWrapper } from '@/components/profile/profile-page-wrapper'
import { Tag } from '@/components/profile/tags/tag-list'
import { Icons } from '@/lib/constants/icons'
import type { Config } from '@/lib/features/config/schemas'
import { shouldEmbedHaveFullWidth } from '@/lib/features/embeds/utils/embed-utils'
import { getDisplayUserId } from '@/lib/features/users/utils'
import { cn } from '@/lib/utils'
import { stripHtml } from '@/lib/utils/html-utils'
import { StaggerItem } from '../animations/motion-item'
import { Avatar } from '../avatar'
import { BadgeList } from '../badges/badge-list'
import { Container } from '../card/container'
import { Bio } from '../core/bio'
import { DisplayName } from '../core/display-name'
import { Embed } from '../embeds/embed'
import { GridList } from '../grid-list'
import { ProfileContentProps } from '../profile-page-content'

export function ProfileShowcaseMode({ profile, views, preview }: ProfileContentProps) {
  const { config: initialConfig, badges, links } = profile

  const config = {
    ...initialConfig,
    layout: {
      ...initialConfig.layout,
      maxWidth: 1000, // force grid
    },
  } satisfies Config

  const { enhancements, avatar } = profile.config

  const insideProfileCardLinks = links.filter((link) => link.style === 'icon' && !link.hidden)

  const outsideProfileCardLinks = profile.links.filter((link) => !link.hidden && link.style === 'card')
  const embeds = profile.embeds.map((embed) => ({
    ...embed,
    insideProfileCard: true, // force container style
    fullWidth: shouldEmbedHaveFullWidth(embed),
  }))

  const isBioEmpty = stripHtml(config.bio).length === 0

  return (
    <>
      <div
        className={cn(
          'fixed bottom-4 left-4 z-25 flex items-center gap-x-3',
          preview && 'xl:right-[270px] xl:left-auto',
        )}
      >
        {views}
        {config.location && <Detail icon={Icons.location} label={config.location} config={config} />}
        {config.occupation && <Detail icon={Icons.briefcase} label={config.occupation} config={config} />}
      </div>
      <ProfileWidthWrapper config={config}>
        <section id="profile-header" className="relative">
          <AnimateInView
            variant="scaleIn"
            distance={32}
            duration={0.6}
            delay={0.2}
            className="flex min-h-svh flex-col items-center justify-center"
          >
            <Avatar avatar={{ ...avatar, borderRadius: avatar.borderRadius * 1.3 }} className="size-[140px]" />
            <div className="mt-4 flex w-full max-w-full flex-col items-center">
              <div className={cn('relative mx-auto flex w-fit flex-col items-center gap-1')}>
                <DisplayName
                  title={config.name}
                  tooltip={`UID ${getDisplayUserId(profile.user.id)}`}
                  options={{
                    effects: enhancements.nameEffects,
                    color: config.nameColor,
                    font: config.nameFont,
                  }}
                  className="text-4xl!"
                />
                <BadgeList badges={badges} config={config} />
              </div>
              <div className={cn('mx-auto mt-6 flex w-full flex-wrap items-center justify-center gap-4')}>
                {insideProfileCardLinks.map((item) => (
                  <SocialLink key={item.id} item={item} config={config} />
                ))}
              </div>
            </div>
          </AnimateInView>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform animate-bounce flex-col items-center opacity-50">
            Scroll for more
            <Icons.chevronDown className="size-5" />
          </div>
        </section>
        <section className="flex min-h-svh flex-col justify-center py-12" id="about-me">
          <AnimateInView variant="fadeUp" distance={32} duration={0.6} delay={0.3}>
            <h2 className="mb-4 text-xl font-semibold">About Me</h2>
          </AnimateInView>
          {!isBioEmpty && (
            <AnimateInView variant="fadeUp" distance={32} duration={0.6} delay={0.3}>
              <Container borderRadius={config.card.borderRadius} container={config.container} className="p-6">
                <Bio
                  text={config.bio}
                  options={{
                    bioEffect: enhancements.bioEffect,
                    color: config.textColor,
                    alignLeft: true,
                  }}
                  className="text-lg"
                />
              </Container>
            </AnimateInView>
          )}
          <AnimateInView variant="fadeUp" distance={32} duration={0.6} delay={0.3}>
            <GridList
              className="mt-4 gap-4"
              maxWidth={config.layout.maxWidth}
              items={embeds}
              renderItem={(item, idx) => (
                <StaggerItem key={item.id ?? idx} i={idx} preset="blurIn" step={0.25} baseDelay={0.1}>
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
                </StaggerItem>
              )}
            />
          </AnimateInView>
          {config.tags.length > 0 && (
            <AnimateInView
              variant="fadeUp"
              distance={32}
              duration={0.6}
              delay={0.3}
              className="mt-4 flex w-full flex-wrap justify-start gap-2"
            >
              {config.tags.map((tag, idx) => (
                <StaggerItem key={tag.id ?? idx} i={idx} preset="blurIn" step={0.25} baseDelay={0.1}>
                  <Tag tag={tag} config={config} />
                </StaggerItem>
              ))}
            </AnimateInView>
          )}
        </section>
        {outsideProfileCardLinks.length > 0 && (
          <section className="flex min-h-svh flex-col justify-center py-12" id="links">
            <AnimateInView variant="fadeUp" distance={32} duration={0.6} delay={0.3}>
              <h2 className="mb-4 text-xl font-semibold">Links</h2>
            </AnimateInView>
            <AnimateInView variant="fadeUp" distance={32} duration={0.6} delay={0.2}>
              <GridList
                maxWidth={config.layout.maxWidth}
                items={outsideProfileCardLinks}
                renderItem={(item, idx) => (
                  <StaggerItem i={idx} preset="fadeUp" step={0.25}>
                    <SocialLink item={item} config={config} />
                  </StaggerItem>
                )}
              />
            </AnimateInView>
          </section>
        )}
      </ProfileWidthWrapper>
    </>
  )
}
