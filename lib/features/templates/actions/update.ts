'use server'

import { sanitizeTemplate } from '@/lib/features/templates/queries'
import { unparseTags } from '@/lib/features/templates/utils'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'
import { templateFormSchema, type TemplateFormValues } from '@/lib/zod/schemas/template'
import { toNullSchemaDeep } from '@/lib/zod/utils'
import type { Template as TemplateRow } from '@slat/db'
import { db, schema } from '@slat/db'
import { and, eq, isNull } from 'drizzle-orm'

export const updateTemplate = requireActionSession(
  async (userId: number, data: { id: number; values: TemplateFormValues }) => {
    const normalized = toNullSchemaDeep(templateFormSchema).parse(data.values)

    const template = await db.query.templates.findFirst({
      where: (t, { eq }) => and(eq(t.id, data.id), eq(t.userId, userId)),
      columns: { id: true },
    })

    if (!template) {
      throw new FedsServerError({
        code: 'not_found',
        message: 'Template not found',
      })
    }

    await db.transaction(async (tx) => {
      await tx
        .update(schema.templates)
        .set({
          name: normalized.name,
          image: normalized.image,
          tags: unparseTags(normalized.tags),
          isPremiumRequired: !normalized.removePremiumFeatures,
          isPublic: normalized.isPublic,
        } satisfies Partial<TemplateRow>)
        .where(and(eq(schema.templates.id, template.id), eq(schema.templates.userId, userId)))

      if (normalized.applyCurrentCustomization) {
        const relatedTables = [schema.cards, schema.miscellanea, schema.biolinks]

        for (const table of relatedTables) {
          const userRecords = await tx
            .select()
            .from(table)
            .where(and(eq(table.userId, userId), isNull(table.templateId)))

          if (userRecords.length > 0) {
            for (const record of userRecords) {
              const { id, ...updatedRecord } = record

              const [existingTemplateRecord] = await tx
                .select({ id: table.id })
                .from(table)
                .where(and(eq(table.templateId, template.id), isNull(table.userId)))

              if (existingTemplateRecord) {
                await tx
                  .update(table)
                  .set({
                    ...updatedRecord,
                    userId: null,
                  })
                  .where(and(eq(table.templateId, template.id), isNull(table.userId)))
              } else {
                await tx.insert(table).values({
                  ...updatedRecord,
                  userId: null,
                  templateId: template.id,
                })
              }
            }
          }
        }
      }

      if (normalized.removePremiumFeatures) {
        await sanitizeTemplate(tx, template.id, userId)
      }
    })
  },
)
