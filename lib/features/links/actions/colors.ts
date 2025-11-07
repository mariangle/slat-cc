'use server'

import { requireActionSession } from '@/lib/server/guards'
import { linkColorsFormSchema, LinkColorsFormValues } from '@/lib/zod/schemas/link'
import { toNullSchemaDeep } from '@/lib/zod/utils'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'

export const updateLinkColors = requireActionSession(async (userId: number, input: LinkColorsFormValues) => {
  const normalized = toNullSchemaDeep(linkColorsFormSchema).parse(input)

  await db.update(schema.links).set(normalized).where(eq(schema.links.userId, userId))
})
