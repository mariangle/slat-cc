import { deleteSession } from '@/lib/auth/session'
import { APP_CONFIG } from '@/lib/config'
import { isProduction } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

/** POST /api/auth/logout - Log out the current user */
export async function POST(_: NextRequest) {
  await deleteSession()

  const res = NextResponse.redirect(new URL('/', APP_CONFIG.baseUrl))

  res.cookies.delete({
    name: 'session',
    path: '/',
    ...(isProduction() && { domain: '.feds.lol' }),
  })

  return res
}
