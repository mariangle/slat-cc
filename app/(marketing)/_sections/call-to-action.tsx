import { ClaimYourLink } from '@/app/(marketing)/_components/claim-your-link'
import { Heading } from '@/app/(marketing)/_components/heading'
import { Container } from '@/components/shared/container'
import { ONE_DAY_IN_SECONDS } from '@/lib/constants/revalidates'
import { schema } from '@/lib/drizzle'
import { getCount } from '@/lib/drizzle/queries/get-count'
import { unstable_cache } from 'next/cache'

const getUsersCount = unstable_cache(() => getCount(schema.users), ['total-users-count'], {
  revalidate: ONE_DAY_IN_SECONDS,
  tags: ['counts', 'users'],
})

export async function CallToAction() {
  const usersCount = await getUsersCount()

  return (
    <div className="border-t">
      <Container as="section" className="z-10 py-16">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl p-6 text-center md:p-6">
          <Heading level={5} className="mb-4 text-xl leading-tight md:text-2xl lg:text-3xl">
            Ready to create your Link in Bio?
          </Heading>
          <p className="mb-6">
            Join <span className="text-foreground">{usersCount.toLocaleString()}</span> others — claim your link to get
            started for free.
          </p>

          <ClaimYourLink className="w-fit" />
        </div>
      </Container>
    </div>
  )
}
