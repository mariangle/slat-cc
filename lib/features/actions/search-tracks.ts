'use server'

import { searchDeezerTracks as deezerSearch } from '@/lib/integrations/deezer'
import { FedsServerError } from '@/lib/server/errors'
import { requireActionSession } from '@/lib/server/guards'

export const searchDeezerTracks = requireActionSession(async (_: number, query: string) => {
  if (query.length < 3) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Query must be at least 3 characters',
    })
  }

  const deezerTracks = await deezerSearch(query)

  return deezerTracks.slice(0, 15)
})
