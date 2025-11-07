import { withUser } from '@/lib/api/middleware/user'
import { APP_CONFIG } from '@/lib/config'
import { createOrder } from '@/lib/features/orders/actions'
import { sessionUserColumns } from '@/lib/features/users/types'
import { paths } from '@/lib/routes/paths'
import { FedsServerError } from '@/lib/server/errors'
import { stripe } from '@/lib/stripe'
import { isProduction } from '@/lib/utils'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { isNil } from 'lodash'
import { after, NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'

/** POST /api/premium/checkout - Create a stripe checkout session for premium */
export const POST = withUser({
  columns: sessionUserColumns,
  include: ['premium'] as const,
})(async ({ user }) => {
  if (user.premium) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Already premium',
    })
  }

  const token = uuid()

  if (isNil(user.email)) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Please set your email before purchasing premium',
    })
  }

  const orderId = await createOrder({
    userId: user.id,
    status: 'pending',
    token,
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [
      {
        price: isProduction() ? 'REDACTED' : 'REDACTED',
        quantity: 1,
      },
    ],
    success_url: `${APP_CONFIG.baseUrl}${paths.api.premium.checkout}/${token}`,
    cancel_url: `${APP_CONFIG.baseUrl}${paths.dashboard.settings.account}`,
    metadata: {
      userId: user.id.toString(),
      product: 'premium',
      orderId: orderId.toString(),
    },
  })

  if (!session.url) {
    throw new FedsServerError({
      code: 'internal_server_error',
      message: 'Failed to create checkout session',
    })
  }

  after(async () => {
    await new DiscordWebhook(webhooks.orders).send({
      title: 'Order Created',
      description: `[Checkout]: User \`${user.username}\` has created a checkout session for premium.`,
      url: DiscordWebhook.profileUrl(user.username),
      actor: user,
      color: DiscordWebhook.colors.yellow,
      fields: [
        {
          name: 'Order ID',
          value: orderId.toString(),
        },
        {
          name: 'Token',
          value: token,
        },
        {
          name: 'Product',
          value: 'Premium',
        },
      ],
    })
  })

  return NextResponse.json(session.url)
})
