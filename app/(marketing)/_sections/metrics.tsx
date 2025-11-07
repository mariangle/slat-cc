import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { Container } from '@/components/shared/container'
import { Icon } from '@/components/ui/icon'
import { FeaturedUser, fetchFeaturedUsers } from '@/lib/analytics/queries/featured-users'
import { ONE_DAY_IN_SECONDS } from '@/lib/constants/revalidates'
import { schema } from '@/lib/drizzle'
import { getCount } from '@/lib/drizzle/queries/get-count'
import { Marquee } from '../../../components/ui/marquee'
import { AnimatedCounter } from '../_components/animated-counter'
import { Heading } from '../_components/heading'

const getTotalViewsCount = unstable_cache(() => getCount(schema.views), ['total-views-count'], {
  revalidate: ONE_DAY_IN_SECONDS,
})

const getTotalLinksCount = unstable_cache(() => getCount(schema.links), ['total-links-count'], {
  revalidate: ONE_DAY_IN_SECONDS,
})

const getUsersCount = unstable_cache(() => getCount(schema.users), ['total-users-count'], {
  revalidate: ONE_DAY_IN_SECONDS,
})

function MetricsStats({ label, value }: { label: string; value: number }) {
  return (
    <div className="self-end text-center font-mono lg:text-left">
      <div className="text-primary text-sm whitespace-nowrap uppercase">{label}</div>
      <div className="text-foreground text-4xl md:text-3xl">
        <AnimatedCounter finalCount={value} />
      </div>
    </div>
  )
}

export async function Metrics() {
  const [usersCount, linksCount, viewsCount] = await Promise.all([
    getUsersCount(),
    getTotalLinksCount(),
    getTotalViewsCount(),
  ])
  return (
    <div className="flex flex-col items-center gap-y-12 py-24">
      <Container className="relative flex w-fit flex-col items-center gap-y-6 md:flex-row">
        <Heading
          level={2}
          className="text-foreground max-w-sm text-center text-4xl font-semibold tracking-tight md:text-left md:text-4xl"
        >
          More than 90k users trust feds<span className="text-primary">.</span>lol
        </Heading>
        <div className="relative grid w-fit shrink-0 grid-cols-1 gap-6 sm:grid-cols-3">
          <MetricsStats label="Users" value={usersCount} />
          <MetricsStats label="Links Created" value={linksCount} />
          <MetricsStats label="Profile Views" value={viewsCount} />
        </div>
      </Container>
      <div className="relative flex items-center justify-center">
        <React.Suspense fallback={<div />}>
          <SuspendedUsersMarquee />
        </React.Suspense>
        <Image
          src="/assets/bg-blur-1.webp"
          alt="Background"
          width={250}
          unoptimized
          height={250}
          style={{ opacity: 0.75 }}
          className="absolute top-1/2 left-1/2 -z-10 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      </div>
    </div>
  )
}

async function SuspendedUsersMarquee() {
  const featuredUsers = await unstable_cache(fetchFeaturedUsers, ['featured-users'], {
    revalidate: ONE_DAY_IN_SECONDS,
  })()

  return (
    <Marquee speed="slow" scrollerClassName="gap-12">
      {featuredUsers.map((user: FeaturedUser) => (
        <UserCard key={user.username} user={user} />
      ))}
    </Marquee>
  )
}

function UserCard({ user }: { user: FeaturedUser }) {
  return (
    <li>
      <Link
        href={`/${user.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-4"
      >
        {user.avatar && (
          <Image
            src={user.avatar}
            unoptimized
            width={48}
            alt="profile picture"
            height={48}
            className="relative size-12 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <div className="text-foreground truncate text-base leading-[1.6] font-medium">
              {user.name || user.username}
            </div>
            {user.verified && <Icon name="solar:verified-check-bold-duotone" className="size-5 text-blue-400" />}
          </div>
          <div className="text-sm leading-[1.6] font-normal">/{user.username}</div>
        </div>
      </Link>
    </li>
  )
}
