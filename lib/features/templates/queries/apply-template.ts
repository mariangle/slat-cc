'use server'

import type { SqlTransaction } from '@slat/db'
import { db, schema } from '@slat/db'
import { and, eq } from 'drizzle-orm'

type Args = {
  userId: number
  templateId: number
}

function insertTemplateUse(tx: SqlTransaction, args: Args) {
  return tx.insert(schema.templateUses).values({
    userId: args.userId,
    templateId: args.templateId,
  })
}

export async function applyTemplate(args: Args) {
  const { userId, templateId } = args

  await db.transaction(async (tx) => {
    const [existingTemplateUse] = await tx
      .select({ id: schema.templateUses.id })
      .from(schema.templateUses)
      .where(and(eq(schema.templateUses.userId, userId), eq(schema.templateUses.templateId, templateId)))

    if (!existingTemplateUse) {
      await insertTemplateUse(tx, args)
    }

    const configTables = [schema.cards, schema.miscellanea, schema.biolinks]

    for (const table of configTables) {
      const templateTables = await tx.select().from(table).where(eq(table.templateId, templateId))

      if (templateTables.length > 0) {
        for (const templateRecord of templateTables) {
          const { id, ...recordWithoutId } = templateRecord

          const existingRecord = await tx
            .select()
            .from(table)
            .where(and(eq(table.userId, userId)))

          if (existingRecord.length > 0) {
            await tx
              .update(table)
              .set({
                ...recordWithoutId,
                userId,
                templateId: null,
              })
              .where(eq(table.userId, userId))
          } else {
            await tx.insert(table).values({
              ...recordWithoutId,
              userId,
              templateId: null,
            })
          }
        }
      }
    }
  })
}
