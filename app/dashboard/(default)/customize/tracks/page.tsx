import { getConfig } from '@/lib/features/config/queries'
import { getTracks } from '@/lib/features/tracks/queries'
import { isPremium } from '@/lib/features/users/roles'

import { TrackListClient } from './_components/track-list-client'

export default async function TracksPage() {
  const [config, premium, tracks] = await Promise.all([getConfig(), isPremium(), getTracks()])

  if (!config) return null

  return <TrackListClient items={tracks} config={config} premium={premium} />
}
