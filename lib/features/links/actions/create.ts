'use server'

import { formatLink } from '@/lib/features/links/format'
import { Link } from '@/lib/features/links/schemas'
import { quotas } from '@/lib/features/quotas'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession, validateQuota } from '@/lib/server/guards'
import { linkFormSchema, type LinkFormValues } from '@/lib/zod/schemas/link'
import { toNullSchemaDeep } from '@/lib/zod/utils'
import { db, schema } from '@slat/db'

export const createLink = requireActionSession(async (userId: number, values: LinkFormValues): Promise<Link> => {
  const normalized = toNullSchemaDeep(linkFormSchema).parse(values)

  await validateQuota({
    resource: 'links',
    userId,
    quota: quotas.links,
  })

  const [{ insertId }] = await db.insert(schema.links).values({ ...normalized, userId })

  const inserted = await db.query.links.findFirst({ where: (t, { eq }) => eq(t.id, insertId) })

  if (!inserted) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Link not found after creation',
    })
  }

  return formatLink(inserted)
})
