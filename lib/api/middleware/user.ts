import { verifySession } from '@/lib/auth/session'
import { db, UserRow } from '@/lib/drizzle'
import { isPremium, isStaff, isSuperAdmin } from '@/lib/features/users/roles'
import { casinoUserColumns, CasinoUserKey, sessionUserColumns, SessionUserKey } from '@/lib/features/users/types'
import { FedsServerError, handleAndReturnErrorResponse } from '@/lib/server/errors'
import { Params } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export const gates = {
  staff: isStaff,
  premium: isPremium,
  superAdmin: isSuperAdmin,
} as const

export type GateKey = keyof typeof gates

type IncludedProps<I extends readonly GateKey[]> = {
  [P in I[number]]?: boolean
}

type WithUserHandler<K extends keyof UserRow, I extends readonly GateKey[] = []> = (args: {
  user: Pick<UserRow, K> & IncludedProps<I>
  req: NextRequest
  params: Promise<Params>
}) => Promise<NextResponse>

export function withUser<K extends keyof UserRow, I extends readonly GateKey[] = []>(opts: {
  columns?: Readonly<Record<K, true>>
  include?: I
  require?: readonly GateKey[]
}) {
  return (handler: WithUserHandler<K, I>) => async (req: NextRequest, props: { params: Promise<Params> }) => {
    try {
      const session = await verifySession()
      if (!session?.userId) throw new FedsServerError({ code: 'unauthorized', message: 'Unauthorized' })

      // use concrete key arrays for runtime work (avoid casting [] to I)
      const includeKeys = (opts.include ?? []) as readonly GateKey[]
      const requireKeys = (opts.require ?? []) as readonly GateKey[]
      const need = Array.from(new Set<GateKey>([...includeKeys, ...requireKeys]))

      // evaluate gates
      const gateResults: Partial<Record<GateKey, boolean>> = {}
      for (const g of need) gateResults[g] = await gates[g](session.userId)

      // enforce
      for (const g of requireKeys) {
        if (!gateResults[g]) throw new FedsServerError({ code: 'forbidden', message: `Requires ${g}` })
      }

      // select columns (optional)
      let selected = {} as Pick<UserRow, K>
      if (opts.columns && Object.keys(opts.columns).length) {
        const user = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.id, session.userId),
          columns: opts.columns as any,
        })
        if (!user) throw new FedsServerError({ code: 'not_found', message: 'User not found' })
        selected = user as Pick<UserRow, K>
      }

      // attach only included gates
      const attached = Object.fromEntries(includeKeys.map((k) => [k, !!gateResults[k]])) as IncludedProps<I>

      return await handler({
        user: { ...selected, ...attached } as Pick<UserRow, K> & IncludedProps<I>,
        req,
        params: props.params,
      })
    } catch (e) {
      return handleAndReturnErrorResponse(e)
    }
  }
}

export const withStaffGuard = <K extends keyof UserRow = never>(opts?: { columns?: Readonly<Record<K, true>> }) => {
  return withUser<K, ['staff']>({
    columns: opts?.columns,
    require: ['staff'],
    include: ['staff'],
  })
}

export const withSuperAdminGuard = <K extends keyof UserRow = never>(opts?: {
  columns?: Readonly<Record<K, true>>
}) => {
  return withUser<K, ['superAdmin']>({
    columns: opts?.columns,
    require: ['superAdmin'],
    include: ['superAdmin'],
  })
}

export const withPremiumUser = <K extends keyof UserRow = never>(opts?: { columns?: Readonly<Record<K, true>> }) => {
  return withUser<K, ['premium']>({
    columns: opts?.columns,
    include: ['premium'],
  })
}

export const withCasinoUser = () => {
  return withUser<CasinoUserKey>({
    columns: casinoUserColumns,
  })
}

export const withSessionUser = () => {
  return withUser<SessionUserKey>({
    columns: sessionUserColumns,
  })
}
