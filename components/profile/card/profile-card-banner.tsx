import Image from 'next/image'

import type { Card, Config } from '@/lib/features/config/schemas'
import { hexToRgba } from '@/lib/utils'

function HorizontalBorder({ card }: { card: Card }) {
  function getBorderStyle(card: Card): React.CSSProperties {
    return {
      borderBottomColor: hexToRgba(card.borderColor, card.borderOpacity / 100),
      borderBottomWidth: `${card.borderWidth}px`,
      borderBottomStyle: 'solid',
    }
  }

  return <div style={getBorderStyle(card)} />
}

export const ProfileCardBanner = ({ config }: { config: Config }) => {
  if (!config.media.banner) return null
  return (
    <>
      <Image
        alt="Banner"
        src={config.media.banner}
        unoptimized
        className="h-[125px] w-full object-cover"
        width={1920}
        height={1080}
      />
      <HorizontalBorder card={config.card} />
    </>
  )
}
