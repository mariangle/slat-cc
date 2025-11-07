export type ServerActionResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: string; code?: string }

export const ok = <T = void>(data: T = undefined as T): ServerActionResult<T> => ({ ok: true, data })
export const err = (error: string, code?: string): ServerActionResult<never> => ({ ok: false, error, code })
