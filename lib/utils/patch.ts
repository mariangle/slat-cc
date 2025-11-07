export const toUndefined = <T>(v: T | null) => (v === '' || v === null ? undefined : v)
export const toNull = <T>(v: T | undefined) => (v === '' || v === undefined ? null : v)

export const toPatch = <T extends object>(partial: Partial<T>) =>
  Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined)) as Partial<T>

export const mergeDefined = <T extends object>(base: T, patch: Partial<T>): T => ({ ...base, ...toPatch<T>(patch) })

export const nextFrom = <T extends object>(base: T, partial: Partial<T>): T => {
  const patch = Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined)) as Partial<T>
  return { ...base, ...patch }
}
