'use client'

import { Card } from '@/components/profile/card/card'
import { CardImage } from '@/components/profile/card/card-image'
import type { EmbedProps } from '@/components/profile/embeds/embed'
import { EmbedAvatar } from '@/components/profile/embeds/embed-avatar'
import { EmbedTitle } from '@/components/profile/embeds/embed-typography'
import { getCardConfig } from '@/lib/features/config/utils/card-utils'
import { getApiUrl } from '@/lib/features/embeds/utils/embed-utils'
import type {
  DiscordActivity,
  DiscordActivityType,
  DiscordPresence,
  DiscordStatus,
} from '@/lib/integrations/providers/discord/presence/types'
import type { EmbedStatus } from '@/lib/integrations/providers/schemas'
import { cn } from '@/lib/utils'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { kebabCase } from 'lodash'
import Image from 'next/image'
import { ofetch } from 'ofetch'
import { IconType } from 'react-icons'
import { HiMiniMusicalNote } from 'react-icons/hi2'
import { IoGameController } from 'react-icons/io5'
import { PiMonitorFill } from 'react-icons/pi'
import useSWR from 'swr'
import { match } from 'ts-pattern'

export function DiscordPresence({ embed, card, container, colors }: EmbedProps) {
  const embedCard = getCardConfig({ overrideStyle: embed.insideProfileCard, card, container })

  const { data, error: _, isLoading: loading } = useSWR(getApiUrl(embed), async (url) => ofetch<DiscordPresence>(url))

  function getStatus(status?: DiscordStatus): EmbedStatus {
    return match(status)
      .returnType<EmbedStatus>()
      .with('offline', () => 'gray')
      .with('online', () => 'green')
      .with('idle', () => 'yellow')
      .with('dnd', () => 'red')
      .with('streaming', () => 'purple')
      .otherwise(() => 'gray')
  }

  return (
    <Card card={embedCard} className="flex w-full items-center justify-between gap-2" style={{ color: colors.text }}>
      <div className="flex w-full flex-row items-center gap-3">
        <EmbedAvatar
          container={container}
          card={embedCard}
          src={data?.avatarUrl}
          borderRadius={embedCard.borderRadius}
          alt={`${data?.username} Avatar`}
          status={getStatus(data?.status)}
        />
        <div className="flex w-full items-center justify-between gap-2 overflow-hidden">
          <div className={cn('flex h-full w-full flex-col items-start justify-center')}>
            <div className="flex w-full flex-row items-center gap-1.5">
              <EmbedTitle
                title={data?.username}
                color={colors.name}
                href={`https://discordapp.com/users/${data?.userId}`}
                loading={loading}
              />
              {data?.badges && data.badges.length > 0 && <DiscordBadges badges={data.badges} />}
            </div>
            {data?.activity && <DiscordActivityDetails activity={data.activity} />}
          </div>
        </div>
        {data?.activity?.assetURL && (
          <CardImage
            card={card}
            src={data.activity.assetURL}
            alt={`${data.activity.title} Activity`}
            borderRadius={card.borderRadius}
          />
        )}
      </div>
    </Card>
  )
}

function DiscordBadges({ badges }: { badges: DiscordPresence['badges'] }) {
  return (
    <div className="flex shrink-0 items-center justify-start gap-1">
      {badges.map((badge, idx) => (
        <Image
          key={idx}
          src={`/icons/${kebabCase(badge)}.png`}
          width={200}
          height={200}
          alt="Discord Badge"
          className="h-[14px] w-fit shrink-0 object-cover"
        />
      ))}
    </div>
  )
}

function DiscordActivityDetails({ activity }: { activity: DiscordActivity }) {
  const activityElapsedTime = activity.startedAt
    ? formatDistanceToNow(parseISO(activity.startedAt), { addSuffix: false })
    : null

  const getActivityIcon = (type: DiscordActivityType): IconType | undefined => {
    return match(type)
      .with('playing', () => IoGameController)
      .with('listening', () => HiMiniMusicalNote)
      .with('streaming', 'watching', () => PiMonitorFill)
      .otherwise(() => undefined)
  }

  const getPrefix = (type: DiscordActivityType): string | undefined => {
    return match(type)
      .with('streaming', () => 'Streaming')
      .with('playing', () => 'Playing')
      .with('watching', () => 'Watching')
      .with('listening', () => 'Listening to')
      .otherwise(() => undefined)
  }

  const Icon = getActivityIcon(activity.type)
  const prefix = getPrefix(activity.type)

  return (
    <div className="flex h-full w-full flex-col items-start justify-center">
      <div className="flex w-full items-center gap-1">
        {activity.emojiUrl && (
          <Image
            src={activity.emojiUrl}
            alt="Emoji"
            className="size-5 object-cover"
            unoptimized
            width={50}
            height={50}
          />
        )}
        <div className="w-full truncate text-[11px] font-medium">
          {Icon && <Icon className="mr-1 inline-block text-green-500" />}
          {prefix && <span>{prefix} </span>}
          {activity.title}
        </div>
      </div>
      {activity.details && <div className="w-full truncate text-[9px]">{activity.details}</div>}
      {activityElapsedTime && <div className="text-[9px]">for {activityElapsedTime}</div>}
    </div>
  )
}
