'use server'

import { searchIconifyIcons as iconifySearch } from '@/lib/integrations/iconify'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'

export const searchIconifyIcons = requireActionSession(async (_userId: number, query: string) => {
  if (query.length < 3) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Query must be at least 3 characters',
    })
  }

  return await iconifySearch(query)
})
