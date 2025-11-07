'use client'

import { Card } from '@/components/profile/card/card'
import type { EmbedProps } from '@/components/profile/embeds/embed'
import { EmbedAvatar } from '@/components/profile/embeds/embed-avatar'
import {
  EmbedAboutList,
  EmbedIdentifier,
  EmbedStatsList,
  EmbedTitle,
} from '@/components/profile/embeds/embed-typography'
import { ProfileSkeleton } from '@/components/profile/profile-skeleton'
import { Icons } from '@/lib/constants/icons'
import { TEN_MINUTES_IN_SECONDS } from '@/lib/constants/revalidates'
import { getCardConfig } from '@/lib/features/config/utils/card-utils'
import { getApiUrl } from '@/lib/features/embeds/utils/embed-utils'
import type { RobloxConnection } from '@/lib/integrations/providers/roblox/types'
import { formatTimeDifference } from '@/lib/utils'
import Image from 'next/image'
import { ofetch } from 'ofetch'
import { FaInfoCircle } from 'react-icons/fa'
import { SiRoblox } from 'react-icons/si'
import useSWR from 'swr'

export function RobloxProfile({ embed, card, container, colors }: EmbedProps) {
  const embedCard = getCardConfig({ overrideStyle: embed.insideProfileCard, card, container })

  const { data, isLoading } = useSWR(getApiUrl(embed), (url) => ofetch<RobloxConnection>(url), {
    revalidateOnFocus: false,
    dedupingInterval: TEN_MINUTES_IN_SECONDS * 1000,
    revalidateIfStale: false,
  })

  return (
    <>
      <Card
        card={embedCard}
        className="group/card relative flex w-full flex-col gap-y-2"
        style={{
          color: embed.secondStyle ? 'white' : colors.text,
        }}
      >
        {data?.bodyshot && embed.secondStyle && (
          <Image
            src={data?.bodyshot}
            width={1000}
            height={1000}
            alt={`${data?.displayName}'s bodyshot`}
            className="group-hover/card:blur-0 absolute inset-0 h-full w-full rounded-lg object-cover blur-[5px] duration-300"
          />
        )}
        <div className="relative flex items-center gap-x-2">
          <EmbedAvatar
            src={data?.headshot}
            card={embedCard}
            container={container}
            borderRadius={embedCard.borderRadius}
            alt={`${data?.displayName}'s headshot`}
            status={data?.online ? 'green' : 'gray'}
          />
          <div className="flex flex-col">
            <EmbedTitle
              href={`https://www.roblox.com/users/${data?.userId}/profile`}
              title={data?.displayName}
              color={embed.secondStyle ? 'white' : colors.name}
              loading={isLoading}
            />
            {data && (
              <>
                <EmbedIdentifier identifier={data.name} icon={SiRoblox} iconClassName="text-[#D4CFC8]" />
                <EmbedStatsList
                  items={[
                    { value: data.friendsCount, label: 'Friends' },
                    { value: data.followersCount, label: 'Followers' },
                  ]}
                />
              </>
            )}
          </div>
        </div>
        {!embed.compactLayout && (
          <>
            <div className="relative text-xs">
              {data ? (
                <EmbedAboutList
                  items={[
                    { value: data.description, icon: FaInfoCircle },
                    {
                      value: data.lastSeen
                        ? `Last online ${formatTimeDifference(new Date(data.lastSeen))}`
                        : `Joined ${formatTimeDifference(new Date(data.joinedAt))}`,
                      icon: Icons.clock,
                    },
                  ]}
                />
              ) : (
                <div className="space-y-1">
                  <ProfileSkeleton className="h-4 w-6" />
                  <ProfileSkeleton className="h-4 w-24" />
                  <ProfileSkeleton className="h-4 w-6" />
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </>
  )
}
