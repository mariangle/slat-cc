import { parse } from '@/lib/api/parse'
import { NextRequest, NextResponse } from 'next/server'

export default async function SubdomainMiddleware(req: NextRequest) {
  const { fullPath, subdomain } = parse(req)

  /** https://github.com/vercel/next.js/issues/75633 */
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        Allow: 'GET, POST, OPTIONS',
      },
    })
  }

  return NextResponse.rewrite(new URL(`/${subdomain}.feds.lol${fullPath === '/' ? '' : fullPath}`, req.url))
}
