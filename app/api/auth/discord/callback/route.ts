import { parse } from '@/lib/api/parse'
import { handleConnect, handleDisconnect, handleLogin, handleRegister } from '@/lib/auth/providers/discord/handlers'
import { exchangeDiscordToken } from '@/lib/auth/providers/discord/oauth'
import { getDiscordRedirectUri, redirectDiscordAuthResult } from '@/lib/auth/providers/discord/redirect'
import type { DiscordHandlerArgs } from '@/lib/auth/providers/discord/schemas'
import { discordStateSchema } from '@/lib/auth/providers/discord/schemas'
import { NextRequest, NextResponse } from 'next/server'
import { FetchError, ofetch } from 'ofetch'
import { match } from 'ts-pattern'

/** POST /api/auth/discord/callback - Initiate Discord OAuth flow */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { searchParamsObj } = parse(req)

  try {
    const state = discordStateSchema.parse(searchParamsObj.state)

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      redirect_uri: getDiscordRedirectUri(),
      response_type: 'code',
      scope: 'identify',
      state,
    })

    return NextResponse.json(`https://discord.com/api/oauth2/authorize?${params.toString()}`)
  } catch (error) {
    console.error('Error initiating Discord OAuth flow:', error)
    return redirectDiscordAuthResult({ error: 'discord_missing_params' })
  }
}

/** GET /api/auth/discord/callback - Handle Discord OAuth callback */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParamsObj } = parse(req)

  try {
    const state = discordStateSchema.parse(searchParamsObj.state)
    const code = searchParamsObj.code

    if (!code) {
      return redirectDiscordAuthResult({ error: 'discord_missing_params' })
    }

    const { accessToken, tokenType } = await exchangeDiscordToken(code)

    const { id: discordUserId, username: discordUsername } = await ofetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `${tokenType} ${accessToken}` },
    })

    const args: DiscordHandlerArgs = {
      discordUserId,
      discordUsername,
    }

    const result = await match(state)
      .with('connect', async () => await handleConnect(args))
      .with('disconnect', async () => await handleDisconnect(args))
      .with('login', async () => await handleLogin(args))
      .with('register', async () => await handleRegister(args))
      .exhaustive()

    console.info('Discord OAuth handled with result:', result)

    return redirectDiscordAuthResult({ error: result.error, state })
  } catch (error) {
    console.error('Error during Discord OAuth callback handling:', error)

    const errorCode = error instanceof FetchError ? 'discord_invalid_code' : 'discord_unexpected_error'

    return redirectDiscordAuthResult({ error: errorCode })
  }
}
