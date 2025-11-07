import { getTurnstileStatus } from '@/lib/auth/turnstile'
import { handleAndReturnErrorResponse } from '@/lib/server/errors'
import { NextRequest, NextResponse } from 'next/server'

/** POST /api/auth/challenge/status - Get Turnstile challenge status */
export async function POST(_: NextRequest) {
  try {
    const status = await getTurnstileStatus()

    return NextResponse.json(status)
  } catch (e) {
    return handleAndReturnErrorResponse(e)
  }
}
