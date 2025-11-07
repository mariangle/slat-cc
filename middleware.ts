import { parse } from '@/lib/api/parse'
import { isAuthenticated } from '@/lib/auth/session'
import { getTurnstileStatus } from '@/lib/auth/turnstile'
import SubdomainMiddleware from '@/lib/middleware/subdomain'
import { classifyPath } from '@/lib/middleware/utils/classify-path'
import { isReservedSubdomain } from '@/lib/middleware/utils/subdomain-utils'
import { AppPath, paths } from '@/lib/routes/paths'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'

function appendRedirectParam(path: AppPath, req: NextRequest) {
  const { origin, fullPath } = parse(req)

  const params = new URLSearchParams({ redirect: fullPath })

  return `${origin}${path}?${params.toString()}`
}

export async function middleware(req: NextRequest) {
  const { host, path, subdomain } = parse(req)
  const pathType = classifyPath(path)

  if (subdomain) {
    // rewrite to internal path structure
    if (isReservedSubdomain(host)) {
      return SubdomainMiddleware(req)
    }

    // don't rewrite API requests for tenant subdomains
    if (pathType === 'api') {
      return NextResponse.next()
    }

    const url = req.nextUrl.clone()
    url.pathname = `/${subdomain}${path}`

    return NextResponse.rewrite(url)
  }

  const authenticated = await isAuthenticated()

  return match(pathType)
    .with('auth', async () => {
      if (authenticated) {
        return NextResponse.redirect(new URL(paths.dashboard.overview, req.url))
      }
      const turnstileStatus = await getTurnstileStatus()
      if (turnstileStatus !== 'success') {
        return NextResponse.redirect(appendRedirectParam(paths.auth.verification, req))
      }
    })
    .with('dash', () => {
      if (!authenticated) {
        return NextResponse.redirect(appendRedirectParam(paths.auth.login, req))
      }
    })
    .otherwise(() => NextResponse.next())
}

export const config = { matcher: '/((?!.*\\.).*)' }
