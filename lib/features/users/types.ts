import { PickedColumns, Simplify } from '@/lib/types'
import type { BiolinkRow, UserRow } from '@slat/db'

export const actorColumns = {
  id: true,
  username: true,
} as const satisfies PickedColumns<UserRow>

export type ActorKey = keyof typeof actorColumns
export type Actor = Pick<UserRow, ActorKey>

export type PublicUser = Simplify<Actor & Pick<BiolinkRow, 'name' | 'avatar'>>

export const sessionUserColumns = {
  id: true,
  username: true,
  email: true,
} as const satisfies PickedColumns<UserRow>

export type SessionUserKey = keyof typeof sessionUserColumns
export type SessionUser = Pick<UserRow, SessionUserKey>

export const casinoUserColumns = {
  id: true,
  username: true,
  coins: true,
  lastClaimedAt: true,
} satisfies PickedColumns<UserRow>

export type CasinoUserKey = keyof typeof casinoUserColumns
export type CasinoUser = Pick<UserRow, CasinoUserKey>
