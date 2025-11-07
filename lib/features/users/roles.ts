'use server'

import { getBadge } from '@/lib/features/badges/queries'
import { BadgeId } from '@/lib/features/badges/types'
import { withSession } from '@/lib/server/guards'

export async function isPremium(userId?: number): Promise<boolean> {
  return getBadge(BadgeId.Premium, userId)
}

export async function isStaff(userId?: number): Promise<boolean> {
  return getBadge(BadgeId.Staff, userId)
}

export async function isVerified(userId?: number): Promise<boolean> {
  return getBadge(BadgeId.Verified, userId)
}

const ADMIN_USER_IDS = [1, 34]

export async function isSuperAdmin(userId?: number): Promise<boolean> {
  return withSession(async (resolvedUserId) => ADMIN_USER_IDS.includes(resolvedUserId), {
    userId,
    fallback: () => false,
  })
}
