'use server'

import { upsertBiolink } from '@/lib/features/config/db'
import { isPremium } from '@/lib/features/users/roles'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'
import { mediaFormSchema, type MediaFormValues } from '@/lib/zod/schemas/config'
import { toNullSchemaDeep } from '@/lib/zod/utils'
import type { BiolinkRow } from '@slat/db'

function hasPremiumFeatures(data: MediaFormValues): boolean {
  return Boolean(data.video || data.cursor || data.audio)
}

export const updateAssets = requireActionSession(async (userId: number, values: MediaFormValues) => {
  const { audio, video, cursor, background, banner } = toNullSchemaDeep(mediaFormSchema).parse(values)

    if (hasPremiumFeatures(values)) {
    const premium = await isPremium(userId)

    if (!premium) {
      throw new FedsServerError({
        code: 'forbidden',
        message: 'You need a premium account to use video, cursor, or audio assets.',
      })
    }
  }

  await upsertBiolink(userId, {
    audio,
    video,
    cursor,
    background,
    banner,
  } satisfies Partial<BiolinkRow>)

})
