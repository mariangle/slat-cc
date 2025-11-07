'use server'

import { Font, fontSchema, isFontPremium, parseFont } from '@/lib/features/app'
import { FedsServerError } from '@/lib/server/errors'
import type { SqlTransaction } from '@slat/db'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'

export async function sanitizeTemplate(tx: SqlTransaction, templateId: number, userId: number) {
  const [biolink] = await db
    .select({
      nameFont: schema.biolinks.nameFont,
      textFont: schema.biolinks.textFont,
    })
    .from(schema.biolinks)
    .where(eq(schema.biolinks.userId, userId))

  if (!biolink) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Template not found',
    })
  }

  await tx
    .update(schema.biolinks)
    .set({
      video: null,
      audio: null,
      cursor: null,
      backgroundEffect: null,
      nameEffect: null,
      cursorTrail: null,
      nameFont: parseValidatedFont(biolink.nameFont),
      textFont: parseValidatedFont(biolink.textFont),
      enterScreenPersistent: false,
      enterScreenText: null,
    })
    .where(eq(schema.biolinks.templateId, templateId))

  await tx
    .update(schema.miscellanea)
    .set({
      visualizeAudio: false,
      pageTransition: null,
    })
    .where(eq(schema.miscellanea.templateId, templateId))

  await tx.update(schema.templates).set({ isPremiumRequired: false }).where(eq(schema.templates.id, templateId))
}

function parseValidatedFont(value: string | null): Font {
  const parsed = parseFont(value)

  if (isFontPremium(parsed)) return fontSchema.enum.inter

  return parsed
}
