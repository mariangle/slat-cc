import { Tilt } from '@/components/profile/card/tilt'
import type { Card } from '@/lib/features/config/schemas'
import { isCardTransparent } from '@/lib/features/config/utils/card-utils'
import { cn, hexToRgba } from '@/lib/utils'

export interface CardProps {
  card: Card
  className?: string
  style?: React.CSSProperties
  isProfileCard?: boolean
}

export function Card({
  card,
  children,
  className,
  style,
  isProfileCard,
  ...props
}: React.PropsWithChildren<CardProps> & React.HTMLAttributes<HTMLDivElement>) {
  const isTransparent = isCardTransparent(card)

  const backgroundStyle = `linear-gradient(
      ${card.gradientAngle}deg, 
      ${hexToRgba(card.backgroundColor, card.backgroundOpacity / 100)},
      ${hexToRgba(card.backgroundColorSecondary || card.backgroundColor, card.backgroundOpacity / 100)}
    )`

  const content = (
    <div
      style={{
        ...style,
        ...(!isTransparent && {
          background: backgroundStyle,
          WebkitBackdropFilter: `blur(${card.backgroundBlur}px)`,
          backdropFilter: `blur(${card.backgroundBlur}px)`,
          borderRadius: isProfileCard ? `${Math.min(card.borderRadius, 50)}px` : `${Math.min(card.borderRadius, 30)}px`,
          borderColor: hexToRgba(card.borderColor, card.borderOpacity / 100),
          borderWidth: `${card.borderWidth}px`,
          boxShadow: `0 0 20px ${hexToRgba(card.shadowColor, card.shadowOpacity / 100)}`,
        }),
      }}
      className={cn(!isProfileCard && 'p-2.5', card.tilt && 'duration-200 hover:scale-[1.02]', className)}
      {...props}
    >
      {children}
    </div>
  )

  if (card.tilt) {
    return <Tilt>{content}</Tilt>
  }

  return content
}
