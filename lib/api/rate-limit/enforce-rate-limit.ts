import { rateCheckErrorSchema, rateCheckSuccessSchema, rateLimit, RateLimitArgs } from '@/lib/api/rate-limit/rate-limit'
import { FedsServerError } from '@/lib/server/errors'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { isSchema } from '@/lib/zod/utils'
import { match } from 'ts-pattern'

export async function enforceRateLimit(userId: number, args: RateLimitArgs): Promise<Headers> {
  const result = await rateLimit(args)

  return match(result)
    .when(isSchema(rateCheckSuccessSchema), (data) => data.headers)
    .when(isSchema(rateCheckErrorSchema), async (data) => {
      await new DiscordWebhook(webhooks.warnings).send({
        title: 'Rate limit exceeded',
        description: `Rate limit exceeded for scope: ${data.scope}`,
        actor: { id: userId, username: '' },
      })

      throw new FedsServerError({
        code: 'rate_limit_exceeded',
        message: `Rate limit exceeded (${data.scope}).`,
        headers: Object.fromEntries(data.headers.entries()),
      })
    })
    .otherwise(() => {
      throw new FedsServerError({
        code: 'internal_server_error',
        message: 'An unexpected error occurred while enforcing rate limits.',
      })
    })
}
