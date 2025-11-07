'use server'

import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'
import { db, schema } from '@slat/db'
import { and, eq } from 'drizzle-orm'

export const favoriteTemplate = requireActionSession(async (userId: number, templateId: number) => {
  const template = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.id, templateId),
    columns: { id: true },
  })

  if (!template) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Template not found',
    })
  }

  const favorited = await db.query.templateFavorites.findFirst({
    where: (t, { eq }) => and(eq(t.userId, userId), eq(t.templateId, templateId)),
    columns: { id: true },
  })

  if (favorited) {
    await db.delete(schema.templateFavorites).where(eq(schema.templateFavorites.id, favorited.id))
  } else {
    await db.insert(schema.templateFavorites).values({ userId, templateId: template.id })
  }
})
