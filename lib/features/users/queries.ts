import { db } from '@/lib/drizzle'
import { withSession } from '@/lib/server/guards'

export async function getUserIdByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.username, username),
    columns: { id: true },
  })

  return user?.id
}

export async function getUserById(userId: number) {
  return await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  })
}

export async function getUsernameByUserId(userId: number) {
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
    columns: { username: true },
  })

  return user?.username
}

export async function getCurrentUsername() {
  return withSession(async (userId) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
      columns: { username: true },
    })

    return user?.username
  })
}

export async function isPasswordSet(userId: number): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
    columns: { password: true },
  })

  return !!user?.password
}
