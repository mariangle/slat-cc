import { getSessionUserId, verifySession } from '@/lib/auth/session'
import { getCacheTag } from '@/lib/features/profile/cache'
import { paths } from '@/lib/routes/paths'
import { err, ok, ServerActionResult } from '@/lib/server/actions'
import { handleServerError } from '@/lib/server/errors'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export function requireActionSession<TIn, TOut>(handler: (userId: number, data: TIn) => Promise<TOut> | TOut) {
  return async (data: TIn): Promise<ServerActionResult<TOut>> => {
    try {
      const session = await verifySession()
      if (!session) redirect(paths.auth.login)

      const payload = await handler(session.userId, data)
      return ok<TOut>(payload)
    } catch (e) {
      const { error } = handleServerError(e)
      return err(error.message)
    } finally {
      const userId = await getSessionUserId()
      if (userId) revalidateTag(getCacheTag(userId))
    }
  }
}

/**
 * Wraps a function that requires a userId and returns the given fallback if userId cannot be resolved.
 */
export async function withSession<T>(
  fn: (userId: number) => Promise<T>,
  opts: { userId?: number; fallback: () => T | Promise<T> },
): Promise<T>
export async function withSession<T>(
  fn: (userId: number) => Promise<T>,
  opts?: { userId?: number; fallback?: () => T | Promise<T> },
): Promise<T | undefined>
export async function withSession<T>(
  fn: (userId: number) => Promise<T>,
  opts?: { userId?: number; fallback?: () => T | Promise<T> },
): Promise<T | undefined> {
  const resolved = opts?.userId ?? (await getSessionUserId())

  if (!resolved) return opts?.fallback ? await opts.fallback() : undefined

  return fn(resolved)
}
