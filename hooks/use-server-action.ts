import type { ServerActionResult } from '@/lib/server/actions'
import { isUndefined } from 'lodash'
import { useState } from 'react'
import { toast } from 'sonner'

/** Snippet */

export function useServerAction<F extends (...args: any[]) => Promise<ServerActionResult<void>>>(
  action: F,
  opts?: UseServerActionOpts<F>,
): {
  run: (...args: Parameters<F>) => Promise<void>
  loading: boolean
}

export function useServerAction<F extends (...args: any[]) => Promise<ServerActionResult<any>>>(
  action: F,
  opts?: UseServerActionOpts<F>,
): {
  run: (...args: Parameters<F>) => Promise<InferData<F>>
  loading: boolean
}

export function useServerAction<F extends (...args: any[]) => Promise<ServerActionResult<any>>>(
  action: F,
  opts?: UseServerActionOpts<F>,
) {
  const [loading, setLoading] = useState(false)

  const run = async (...args: Parameters<F>) => {
    setLoading(true)
    const exec = async () => {
      const res = await action(...args)
      if (!res.ok) throw new Error(res.error ?? DEFAULTS.error)
      return res.data as InferData<F> // void resolves to undefined (typed as void)
    }

    try {
      const result = await withSmartToast(exec(), opts?.toast)
      opts?.onSuccess?.(result as InferData<F>)
      return result as InferData<F>
    } catch (e) {
      const err = e instanceof Error ? e : new Error(DEFAULTS.error)
      opts?.onError?.(err)
      throw err
    } finally {
      setLoading(false)
      opts?.onFinally?.()
    }
  }

  return { run, loading }
}
