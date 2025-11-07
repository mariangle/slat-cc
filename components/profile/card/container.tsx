'use client'

import type { Container } from '@/lib/features/config/schemas'
import { isContainerTransparent } from '@/lib/features/config/utils/card-utils'
import { cn, hexToRgba } from '@/lib/utils'
import * as React from 'react'

export interface ContainerProps {
  container: Container
  borderRadius: number
  className?: string
  style?: React.CSSProperties
  isInsideProfileCard?: boolean
}

export function Container({
  container,
  borderRadius,
  children,
  className,
  style,
  isInsideProfileCard,
  ...props
}: React.PropsWithChildren<ContainerProps & React.HTMLAttributes<HTMLDivElement>>) {
  const isTransparent = isContainerTransparent(container)

  const containerStyle = {
    backgroundColor: hexToRgba(container.backgroundColor, container.backgroundOpacity / 100),
    borderRadius: isInsideProfileCard ? `${borderRadius}px` : `${Math.min(borderRadius, 25)}px`,
    borderColor: hexToRgba(container.borderColor, container.borderOpacity / 100),
    borderWidth: `${container.borderWidth}px`,
  } satisfies React.CSSProperties

  return (
    <div
      style={{ ...(!isTransparent && containerStyle), ...style }}
      className={cn(!isInsideProfileCard && 'p-1.5', isTransparent && 'p-0!', className)}
      {...props}
    >
      {children}
    </div>
  )
}
