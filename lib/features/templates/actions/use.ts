'use server'

import { db } from '@/lib/drizzle'
import { applyTemplate } from '@/lib/features/templates/queries'
import { isPremium } from '@/lib/features/users/roles'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'

export const useTemplate = requireActionSession(async (userId: number, templateId: number) => {
  const template = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.id, templateId),
    columns: {
      id: true,
      isPremiumRequired: true,
    },
  })

  if (!template) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Template not found',
    })
  }

  if (template.isPremiumRequired) {
    const premium = await isPremium(userId)

    if (!premium)
      throw new FedsServerError({
        code: 'forbidden',
        message: 'Template requires premium',
      })
  }

  await applyTemplate({ userId, templateId })
})
