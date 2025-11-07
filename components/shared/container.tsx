import * as React from 'react'

import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  as?: 'div' | 'section'
}

export function Container({ className, as = 'div', ...props }: ContainerProps) {
  const Component = as
  return (
    <Component className={cn('mx-auto w-full max-w-(--breakpoint-lg) px-5', className)} {...props}>
      {props.children}
    </Component>
  )
}
