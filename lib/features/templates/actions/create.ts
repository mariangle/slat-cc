'use server'

import { quotas } from '@/lib/features/quotas'
import { sanitizeTemplate } from '@/lib/features/templates/queries'
import { unparseTags } from '@/lib/features/templates/utils'
import { isPremium } from '@/lib/features/users/roles'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession, validateQuota } from '@/lib/server/guards'
import { templateFormSchema, type TemplateFormValues } from '@/lib/zod/schemas/template'
import { toNullSchemaDeep } from '@/lib/zod/utils'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'

export const createTemplate = requireActionSession(async (userId: number, values: TemplateFormValues) => {
  const normalized = toNullSchemaDeep(templateFormSchema).parse(values)

  if (normalized.isPublic && !normalized.image) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Image is required for public templates',
    })
  }

  const premium = await isPremium(userId)

  await validateQuota({
    resource: 'templates',
    userId,
    quota: quotas.templates,
  })

  await db.transaction(async (tx) => {
    const [{ insertId }] = await tx.insert(schema.templates).values({
      userId,
      name: normalized.name,
      image: normalized.image,
      tags: unparseTags(normalized.tags),
      isPremiumRequired: premium ? true : false,
      isPublic: normalized.isPublic,
    })

    const relatedTables = [schema.cards, schema.miscellanea, schema.biolinks]

    for (const table of relatedTables) {
      const records = await tx.select().from(table).where(eq(table.userId, userId))

      if (records.length > 0) {
        const newRecords = records.map(({ id, ...record }) => ({
          ...record,
          userId: null,
          templateId: insertId,
        }))

        await tx.insert(table).values(newRecords)
      }
    }

    if (normalized.removePremiumFeatures) {
      await sanitizeTemplate(tx, insertId, userId)
    }
  })
})
