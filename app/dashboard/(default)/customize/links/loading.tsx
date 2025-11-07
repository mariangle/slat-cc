import { Skeleton, SkeletonContent } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
      {[...Array(5)].map((_, idx) => (
        <Skeleton key={idx} className="4 flex w-full items-center gap-x-4 p-4">
          <SkeletonContent className="size-7 rounded-2xl" />
          <div className="w-full space-y-2">
            <SkeletonContent className="h-4 w-1/5" />
            <SkeletonContent className="h-3 w-1/3" />
          </div>
        </Skeleton>
      ))}
    </div>
  )
}
