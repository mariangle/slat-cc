import { cn } from '@/lib/utils'

function SkeletonBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn('rounded bg-neutral-400', className)}>{children}</div>
}

function CardBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn('border border-white/10 bg-white/15', className)}>{children}</div>
}

function LinksBlock({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full items-center justify-center gap-1', className)}>
      {new Array(3).fill(null).map((_, index) => (
        <SkeletonBlock key={index} className="size-3 rounded-full" />
      ))}
    </div>
  )
}

function BioBlock({ className }: { className?: string }) {
  return <SkeletonBlock className={cn('h-2 w-full rounded-md', className)} />
}

function AvatarBlock({ className }: { className?: string }) {
  return <SkeletonBlock className={cn('size-8 shrink-0 rounded-full', className)} />
}

function NameAndBadgesBlock({ inline }: { inline?: boolean }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-1', inline && 'flex-row')}>
      <SkeletonBlock className="h-2 w-9 rounded-md" />
      <div className="flex gap-1">
        {new Array(2).fill(null).map((_, index) => (
          <SkeletonBlock key={index} className="size-2 rounded-full" />
        ))}
      </div>
    </div>
  )
}

function ProfileCardBlock({
  children,
  className,
  hideViews,
}: {
  children: React.ReactNode
  className?: string
  hideViews?: boolean
}) {
  return (
    <CardBlock
      className={cn(
        'relative mx-auto flex w-full max-w-[150px] flex-col items-center justify-center gap-2 rounded-xl p-3 pt-6',
        className,
      )}
    >
      {!hideViews && <SkeletonBlock className="absolute top-2 right-2 h-3 w-6 rounded-full" />}
      {children}
    </CardBlock>
  )
}

export { AvatarBlock, BioBlock, CardBlock, LinksBlock, NameAndBadgesBlock, ProfileCardBlock, SkeletonBlock }
