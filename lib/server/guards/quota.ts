import { schema } from '@/lib/drizzle'
import { getCountRaw } from '@/lib/drizzle/queries/get-count'
import { isPremium as fetchIsPremium } from '@/lib/features/users/roles'
import { FedsServerError } from '@/lib/server/errors'
import { eq } from 'drizzle-orm'

type TablesWithUserId = {
  [K in keyof typeof schema]: 'userId' extends keyof (typeof schema)[K] ? K : never
}[keyof typeof schema]

export type Quota = { free: number; premium: number }

export async function validateQuota(args: {
  resource: TablesWithUserId
  userId: number
  quota: Quota
  isPremium?: boolean
  label?: string
}): Promise<void> {
  const { resource, userId, quota: limits, label } = args

  const premium = args.isPremium ?? (await fetchIsPremium(userId))
  const total = await getCountRaw(schema[resource], eq(schema[resource].userId, userId))
  const cap = premium ? limits.premium : limits.free

  if (total >= cap) {
    throw new FedsServerError({
      code: 'exceeded_limit',
      message: `The limit of ${label ?? resource} (${cap}) for a ${premium ? 'premium' : 'free'} account has been reached.`,
    })
  }
}
