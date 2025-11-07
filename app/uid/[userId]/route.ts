import { APP_CONFIG } from '@/lib/config'
import { getUsernameByUserId } from '@/lib/features/users/queries'
import { notFound } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest, props: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await props.params

    const username = await getUsernameByUserId(parseInt(userId))

    if (!username) notFound()

    return NextResponse.redirect(`${APP_CONFIG.baseUrl}/${username}`)
  } catch (error) {
    return NextResponse.json({ message: 'Not Found' })
  }
}
