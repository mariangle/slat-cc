'use client'

import { ofetch } from 'ofetch'
import * as React from 'react'

type HttpMethod = 'PATCH' | 'POST' | 'DELETE' | 'GET'

interface Config {
  name: string
  endpoint: string
  method: HttpMethod
  stringify?: boolean
}

function getRequestInit<T>(data?: T, stringify = true): RequestInit {
  if (!data) return {}
  if (stringify) {
    return {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }
  }
  return { body: data as BodyInit }
}

export const useApiRoutes = <C extends readonly Config[]>(configs: C) => {
  const [loading, setLoading] = React.useState(false)

  const run = React.useCallback(async <R = unknown>(config: Config, data?: any): Promise<R | undefined> => {
    setLoading(true)

    try {
      return await ofetch<R>(config.endpoint, {
        method: config.method,
        ...getRequestInit(data, config.stringify),
        onResponseError({ response }) {
          throw new Error(response._data?.message ?? 'An unknown error occurred.')
        },
      })
    } catch (e) {
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const actions = React.useMemo(() => {
    const entries = configs.map((cfg) => [cfg.name, <R = unknown>(formData?: any) => run<R>(cfg, formData)])

    return Object.fromEntries(entries) as {
      [K in (typeof configs)[number]['name']]: <R = unknown>(data?: any) => Promise<R>
    }
  }, [configs, run])

  return { actions, loading }
}
