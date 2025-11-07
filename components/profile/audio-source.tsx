'use client'

import { useAudioVisualizer } from '@/hooks/use-audio-visualizer'
import type { Config } from '@/lib/features/config/schemas'
import { paths } from '@/lib/routes/paths'
import { createPath } from '@/lib/utils'

const getShadowOpacity = (config: Config): number => {
  const { shadowOpacity } = config.card

  if (config.enhancements.visualizeAudio && shadowOpacity === 0) return 35
  return Math.max(shadowOpacity * (2 / 3), 0)
}

export function AudioSource({ source, config }: { source: string; config: Config }) {
  const audioRef = useAudioVisualizer({
    shadowColor: config.card.shadowColor,
    shadowOpacity: getShadowOpacity(config),
  })

  return (
    <audio
      ref={audioRef}
      src={createPath(paths.api.audioProxy, { url: encodeURIComponent(source) })}
      crossOrigin="anonymous"
      loop
    />
  )
}
