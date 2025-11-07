'use server'

import { decrypt, encrypt } from '@/lib/server/security/jwt'
import { isProduction } from '@/lib/utils'
import { addDays } from 'date-fns'
import { cookies } from 'next/headers'
import * as z from 'zod'

/*
 * https://nextjs.org/docs/app/guides/authentication#session-management
 */

type SessionPayload = {
  userId: number
  expiresAt: Date
}

const SESSION_COOKIE_NAME = 'session'

type CreateSessionArgs = {
  userId: number
  rememberMe: boolean
}

export async function createSession(args: CreateSessionArgs) {
  const expiresAt = addDays(new Date(), args.rememberMe ? 7 : 1)

  const payload: SessionPayload = {
    userId: args.userId,
    expiresAt,
  }

  const session = await encrypt(payload)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: isProduction(),
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
    ...(isProduction() && { domain: '.feds.lol' }),
  })
}

const decryptedSessionSchema = z.object({
  userId: z.number(),
  expiresAt: z.string(),
  iat: z.number(),
  exp: z.number(),
})

const sessionSchema = z.object({
  userId: z.number(),
})

export const verifySession = async (): Promise<z.infer<typeof sessionSchema> | undefined> => {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value

  const decoded = await decrypt(cookie)

  if (!decoded) return

  const parsed = decryptedSessionSchema.safeParse(decoded)

  if (!parsed.success) return

  return { userId: parsed.data.userId }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSessionUserId(): Promise<number | undefined> {
  const session = await verifySession()
  return session?.userId
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await verifySession()
  return !!session
}

