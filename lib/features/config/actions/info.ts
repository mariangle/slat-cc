'use server'

import { upsertBiolink } from '@/lib/features/config/db'
import { isPremium } from '@/lib/features/users/roles'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'
import { infoFormSchema, type InfoFormValues } from '@/lib/zod/schemas/config'
import { handleTags } from '../../tags/handler'

function bioContainsLinkOrImage(bio: string): boolean {
  return /<(?:a|img)[^>]*(?:href|src)="([^"]*)"/gi.test(bio)
}

export const updateInfo = requireActionSession(async (userId: number, values: InfoFormValues) => {
  const parsed = infoFormSchema.parse(values)

  if (bioContainsLinkOrImage(parsed.bio)) {
    const premium = await isPremium(userId)

    if (!premium) {
      throw new FedsServerError({
        code: 'bad_request',
        message: 'Your bio contains a link or image, which is only available to premium users.',
      })
    }
  }

  const { tags, ...info } = parsed

  await upsertBiolink(userId, info)

  const newTags = await handleTags(userId, tags)
  
  return newTags
})
