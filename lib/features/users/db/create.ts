import { db, schema } from '@/lib/drizzle'
import { ProviderId } from '@/lib/features/accounts/types'
import { insertBiolink } from '@/lib/features/config/db'
import { hashPassword } from '@/lib/server/security/bcrypt'
import type { UserInsert } from '@slat/db'

type CreateUserInput = UserInsert & {
  oauth?: {
    providerId: ProviderId
    providerIdentifier: string
  }
}

export async function createUser(input: CreateUserInput) {
  const { ip, oauth } = input

  const username = input.username.toLowerCase()
  const email = input.email ? input.email.toLowerCase() : null
  const passwordHash = input.password ? hashPassword(input.password) : null

  const userId = await db.transaction(async (tx) => {
    const [{ insertId }] = await tx.insert(schema.users).values({
      username,
      email,
      ip,
      password: passwordHash,
    })

    if (oauth) {
      await tx.insert(schema.oauth2).values({
        userId: insertId,
        providerId: oauth.providerId,
        providerIdentifier: oauth.providerIdentifier,
      })
    }

    return insertId
  })

  await insertBiolink(userId)

  return { userId, username }
}
