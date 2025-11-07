'use server'

import { upsertCard } from '@/lib/features/config/db'
import { requireActionSession } from '@/lib/server/guards'
import { cardFormSchema, type CardFormValues } from '@/lib/zod/schemas/config'
import { toNullSchemaDeep } from '@/lib/zod/utils'

export const updateCard = requireActionSession(async (userId: number, values: CardFormValues) => {
  const normalized = toNullSchemaDeep(cardFormSchema).parse(values)

  await upsertCard(userId, normalized)
})
