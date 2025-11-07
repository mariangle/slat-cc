import { withLead } from '@/lib/api/middleware/lead'
import { db, schema } from '@/lib/drizzle'
import { FedsServerError } from '@/lib/server/errors'
import { and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

/** POST /api/analytics/leads/track-click - Track a click for a link */
export const POST = withLead(async ({ lead, target }) => {
  const link = await db.query.links.findFirst({
    where: (links, { eq }) => eq(links.id, target.id),
  })

  if (!link) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Link not found',
    })
  }

  const existing = await db.query.clicks.findFirst({
    where: (clicks, { eq }) => and(eq(clicks.ip, lead.ip), eq(clicks.linkId, link.id)),
  })

  if (existing) {
    throw new FedsServerError({
      code: 'conflict',
      message: 'Click already exists for this IP address and link',
    })
  }

  await db.insert(schema.clicks).values({
    ip: lead.ip,
    linkId: link.id,
    userId: link.userId,
  })

  return NextResponse.json({ message: 'View added successfully' })
})
