'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function AnimatedEmptyState({
  title,
  description,
  cardContent,
  className,
  buttons,
}: {
  title: string
  description: string
  cardContent: ReactNode
  className?: string
  buttons?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 rounded-lg border px-4 py-10 md:min-h-[400px]',
        className,
      )}
    >
      <div className="animate-fade-in h-36 w-full max-w-64 overflow-hidden [mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)] px-4">
        <div className="animate-scroll-y flex flex-col gap-y-6">
          {[...Array(10)].map((_, idx) => (
            <div key={idx} className="bg-muted w-full rounded-md border">
              {cardContent}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-sm text-center text-pretty">
        <span className="text-foreground text-base font-medium">{title}</span>
        <p className="mt-2 text-sm text-pretty">{description}</p>
      </div>
      <div className="flex items-center gap-2">{buttons}</div>
    </div>
  )
}
