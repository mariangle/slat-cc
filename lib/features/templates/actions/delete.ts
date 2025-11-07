'use server'

import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'
import { db, schema } from '@slat/db'
import { and, eq } from 'drizzle-orm'

export const deleteTemplate = requireActionSession(async (userId: number, templateId: number) => {
  const template = await db.query.templates.findFirst({
    where: (t, { eq }) => and(eq(t.userId, userId), eq(t.id, templateId)),
    columns: { id: true },
  })

  if (!template) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Template not found',
    })
  }

  await db
    .delete(schema.templates)
    .where(and(eq(schema.templates.userId, userId), eq(schema.templates.id, template.id)))
})
