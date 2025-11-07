'use server'

import { formatLink } from '@/lib/features/links/format'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'
import { toNull } from '@/lib/utils'
import { LinkFormValues, linkFormSchema } from '@/lib/zod/schemas/link'
import type { LinkUpdate } from '@slat/db'
import { db, schema } from '@slat/db'
import { and, eq } from 'drizzle-orm'

export const updateLink = requireActionSession(
  async (userId: number, { id, values }: { id: number; values: Partial<LinkFormValues> }) => {
    const existing = await db.query.links.findFirst({
      where: (t, { and, eq }) => and(eq(t.id, id), eq(t.userId, userId)),
    })

    if (!existing) {
      throw new FedsServerError({
        code: 'not_found',
        message: 'Link not found',
      })
    }

    const parsed = linkFormSchema.partial().parse(values)

    const normalized = {
      ...parsed,
      image: toNull(parsed.image),
      iconColor: toNull(parsed.iconColor),
      backgroundColor: toNull(parsed.backgroundColor),
    }

    await db
      .update(schema.links)
      .set({ ...existing, ...normalized } satisfies LinkUpdate)
      .where(and(eq(schema.links.id, existing.id), eq(schema.links.userId, userId)))

    const updated = await db.query.links.findFirst({
      where: (t, { and, eq }) => and(eq(t.id, existing.id), eq(t.userId, userId)),
    })

    if (!updated) {
      throw new FedsServerError({
        code: 'not_found',
        message: 'Link not found',
      })
    }

    return formatLink(updated)
  },
)
