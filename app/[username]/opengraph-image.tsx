import { OpengraphImage } from '@/components/profile/opengraph-image'
import { parseFont } from '@/lib/features/app'
import { getOpengraphImageMetadata } from '@/lib/features/metadata/queries'
import { getUserIdByUsername } from '@/lib/features/users/queries'
import { isVerified } from '@/lib/features/users/roles'
import { FedsServerError, handleAndReturnErrorResponse } from '@/lib/server/errors'
import { humanize } from '@/lib/utils'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { match } from 'ts-pattern'

export const alt = 'slat cc profile opengraph image'
export const size = {
  width: 1200,
  height: 630,
}

export const dynamic = 'force-dynamic'

function getFontFilename(font: unknown): string | undefined {
  const parsed = parseFont(font)

  return match(parsed)
    /** REDACTED */
    .exhaustive()
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  try {
    const userId = await getUserIdByUsername(username)

    if (!userId) {
      throw new FedsServerError({
        code: 'not_found',
        message: 'User not found',
      })
    }

    const [opengraphMetadata, verified] = await Promise.all([getOpengraphImageMetadata(userId), isVerified(userId)])

    if (!opengraphMetadata) {
      throw new FedsServerError({
        code: 'not_found',
        message: 'Not found',
      })
    }

    const fontFilename = getFontFilename(opengraphMetadata.textFont)

    /** REDACTED */

    return new ImageResponse(<OpengraphImage metadata={opengraphMetadata} verified={verified} />, {
      ...size,
      fonts: fontData
        ? [
            {
              name: humanize(parseFont(opengraphMetadata.textFont)),
              data: fontData,
              style: 'normal',
              weight: 400,
            },
          ]
        : undefined,
    })
  } catch (e) {
    return handleAndReturnErrorResponse(e)
  }
}
