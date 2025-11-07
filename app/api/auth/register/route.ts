import { fetchIpDetails } from '@/lib/api/ip'
import { withTurnstile } from '@/lib/api/middleware/turnstile'
import { parse } from '@/lib/api/parse'
import { parseRequestBody } from '@/lib/api/utils'
import { createSession } from '@/lib/auth/session'
import { deleteVerificationToken } from '@/lib/auth/turnstile'
import { getCountRaw } from '@/lib/drizzle/queries/get-count'
import { createUser } from '@/lib/features/users/db'
import { assertEmailAvailable, assertUsernameAvailable } from '@/lib/features/users/validators'
import { FedsServerError, handleAndReturnErrorResponse } from '@/lib/server/errors'
import { isProduction } from '@/lib/utils'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { registerFormSchema, type RegisterFormValues } from '@/lib/zod/schemas/auth'
import { schema } from '@slat/db'
import { eq } from 'drizzle-orm'
import { after, NextResponse } from 'next/server'

/** POST /api/auth/register - Register a new user */
export const POST = withTurnstile(async ({ req }) => {
  try {
    const data: RegisterFormValues = await parseRequestBody(req)
    const { ip } = parse(req)

    const { username, password, email } = registerFormSchema.parse(data)

    if (!username || !password || !email) {
      throw new FedsServerError({
        message: 'Username, password, and email are required',
        code: 'bad_request',
      })
    }

    if (isProduction()) {
      const ipData = await fetchIpDetails(ip)

      if (ipData.proxy || ipData.hosting) {
        throw new FedsServerError({
          message: 'Proxy or hosting detected',
          code: 'forbidden',
        })
      }

      const accountsCount = await getCountRaw(schema.users, eq(schema.users.ip, ip))

      if (accountsCount >= 2) {
        throw new FedsServerError({
          message: 'Maximum account limit of 2 reached',
          code: 'forbidden',
        })
      }
    }

    await Promise.all([assertEmailAvailable(email), assertUsernameAvailable(username)])

    const created = await createUser({
      username,
      email,
      ip,
      password,
    })

    await createSession({
      userId: created.userId,
      rememberMe: true,
    })

    after(async () => {
      await new DiscordWebhook(webhooks.registrations).send({
        title: DiscordWebhook.title({ id: created.userId, username }),
        url: DiscordWebhook.profileUrl(username),
        description: `🔗 \`${username}\` has signed up with credentials`,
        actor: { id: created.userId, username },
        color: DiscordWebhook.colors.indigo,
      })
    })

    await deleteVerificationToken()

    return NextResponse.json({ message: 'Account successfully created!' })
  } catch (e) {
    return handleAndReturnErrorResponse(e)
  }
})
