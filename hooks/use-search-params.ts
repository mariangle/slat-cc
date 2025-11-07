import { isUndefined } from 'lodash'
import { useSearchParams as useNextSearchParams, usePathname, useRouter } from 'next/navigation'

export function useSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useNextSearchParams()

  const update = (params: Record<string, string | undefined>) => {
    const currentParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (!isUndefined(value)) {
        currentParams.set(key, String(value))
      } else {
        currentParams.delete(key)
      }
    })

    router.push(`${pathname}?${currentParams.toString()}`)
  }

  const remove = (key: string) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.delete(key)
    router.push(`${pathname}?${currentParams.toString()}`)
  }

  const clear = () => router.push(pathname)

  return { searchParams, update, remove, clear }
}
