'use server'

import { withUser } from '@/lib/api/middleware/user'
import { adjustCoins } from '@/lib/casino/wallet/write'
import { products } from '@/lib/constants/products'
import { insertPremiumBadge } from '@/lib/features/badges/queries'
import { sessionUserColumns } from '@/lib/features/users/types'
import { paths } from '@/lib/routes/paths'
import { FedsServerError } from '@/lib/server/errors'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { revalidatePath } from 'next/cache'
import { after, NextResponse } from 'next/server'

/** POST /api/store/purchase - Purchase premium with coins */
export const POST = withUser({
  columns: { ...sessionUserColumns, coins: true },
  include: ['premium'] as const,
})(async ({ user }) => {
  if (user.premium) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'You already have premium',
    })
  }

  if (user.coins < products.premium.price) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'You do not have enough coins to purchase premium',
    })
  }

  await insertPremiumBadge(user.id)

  const newBalance = await adjustCoins({
    userId: user.id,
    delta: -products.premium.price,
  })

  after(async () => {
    await new DiscordWebhook(webhooks.orders).send({
      title: 'Casino Purchase',
      description: `[Casino]: User \`${user.username}\` has bought \`${products.premium.name}\` for ${products.premium.price} coins.`,
      url: DiscordWebhook.profileUrl(user.username),
      actor: user,
      color: DiscordWebhook.colors.yellow,
      fields: [
        {
          name: 'Product',
          value: products.premium.name,
        },
        {
          name: 'Old Balance',
          value: user.coins.toString(),
        },
        {
          name: 'New Balance',
          value: newBalance.toString(),
        },
      ],
    })
  })

  revalidatePath(paths.dashboard.settings.account)

  return NextResponse.json({ message: 'OK' })
})
