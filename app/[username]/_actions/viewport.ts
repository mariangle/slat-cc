import { APP_CONFIG } from '@/lib/config'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'
import { Viewport } from 'next'

export async function generateViewportMetadata(username: string): Promise<Viewport> {
  const [result = null] = await db
    .select({ themeColor: schema.biolinks.themeColor })
    .from(schema.biolinks)
    .innerJoin(schema.users, eq(schema.biolinks.userId, schema.users.id))
    .where(eq(schema.users.username, username))

  return { themeColor: result?.themeColor ?? APP_CONFIG.themeColor }
}
