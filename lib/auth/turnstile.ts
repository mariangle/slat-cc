import { decrypt, encrypt } from '@/lib/server/security/jwt'
import { addMinutes } from 'date-fns'
import { cookies } from 'next/headers'
import 'server-only'
import { match } from 'ts-pattern'
import * as z from 'zod'

export type TurnstileStatus = 'required' | 'success' | 'expired' | 'error'

const TURNSTILE_COOKIE_NAME = 'turnstile_token'

type TurnstilePayload = {
  verifiedAt: Date
  expiresAt: Date
}

export async function issueVerificationToken(ttlMinutes = 5) {
  const verifiedAt = new Date()
  const expiresAt = addMinutes(verifiedAt, ttlMinutes)

  const payload: TurnstilePayload = {
    verifiedAt,
    expiresAt,
  }

  const token = await encrypt(payload)
  const cookieStore = await cookies()

  cookieStore.set(TURNSTILE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteVerificationToken() {
  const cookieStore = await cookies()

  cookieStore.delete(TURNSTILE_COOKIE_NAME)
}

const decryptedSchema = z.object({
  verifiedAt: z.string(),
  expiresAt: z.string(),
  iat: z.number(),
  exp: z.number(),
})

export async function getTurnstileStatus(): Promise<TurnstileStatus> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(TURNSTILE_COOKIE_NAME)?.value

  if (!cookie) return 'required'

  const session = await decrypt(cookie)
  if (!session) return 'required'

  const parsed = decryptedSchema.safeParse(session)

  return match(parsed)
    .returnType<TurnstileStatus>()
    .with({ success: false }, () => 'error')
    .with({ success: true }, ({ data }) => {
      const now = new Date()
      const expiresAt = new Date(data.expiresAt)
      return expiresAt < now ? 'expired' : 'success'
    })
    .exhaustive()
}
