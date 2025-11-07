import type { RecursivePathObject } from '@/lib/types'

export const APP_SUBDOMAINS = {
  docs: ``,
}

export const apiPaths = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
  },
  /** REDACTED */
} as const satisfies Readonly<RecursivePathObject>

export const paths = {
  root: '/',
  /** REDACTED */
} as const satisfies Readonly<RecursivePathObject>

type PathValue<T> = T extends string ? T : T extends Record<string, any> ? PathValue<T[keyof T]> : never

export type AppPath = PathValue<typeof paths>

function flatten(obj: Record<string, any>): string[] {
  return Object.values(obj).flatMap((v) => (typeof v === 'string' ? [v] : flatten(v)))
}

export const allPaths = flatten(paths)
