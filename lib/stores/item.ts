'use client'
import { create } from 'zustand'

export type ItemsState<T extends { id: number }> = {
  items: T[]
  activeId: number | null
  hydrate: (items: T[]) => void
  clear: () => void
  upsert: (item: T) => void
  replaceId: (tempId: number, actual: T) => void
  replaceAll: (items: T[]) => void
  remove: (id: number) => void
  setAll: (fn: (item: T) => T) => void
  reorderByIds: (ids: number[]) => void
  setActive: (id: number | null) => void
}

export function createItemsStore<T extends { id: number }>() {
  return create<ItemsState<T>>((set, get) => ({
    items: [],
    activeId: null,

    hydrate: (items) => set({ items }),
    clear: () => set({ items: [] }),

    upsert: (item) =>
      set(() => {
        const cur = get().items
        const idx = cur.findIndex((i) => i.id === item.id)
        if (idx === -1) return { items: [...cur, item] }
        const next = [...cur]
        next[idx] = item
        return { items: next }
      }),
    replaceId: (tempId: number, actual: T) =>
      set((s) => ({
        items: s.items.map((x) => (x.id === tempId ? actual : x)),
      })),
    replaceAll: (items) => set({ items }),
    remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
    setAll: (fn) => set({ items: get().items.map(fn) }),

    reorderByIds: (ids) => {
      const map = new Map(get().items.map((i) => [i.id, i]))
      const next: T[] = []
      ids.forEach((id) => {
        const found = map.get(id)
        if (found) next.push(found)
      })
      set({ items: next })
    },

    setActive: (id) => set({ activeId: id }),
  }))
}