import { Skeleton, SkeletonContent } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        {new Array(5).fill(null).map((_, idx) => (
          <Skeleton key={idx} className="h-36 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </div>
      {[...Array(5)].map((_, idx) => (
        <Skeleton key={idx} className="4 flex w-full items-center gap-x-4 p-6">
          <SkeletonContent className="size-12 rounded-md" />
          <div className="w-full space-y-2">
            <SkeletonContent className="h-4 w-1/5" />
            <SkeletonContent className="h-3 w-1/3" />
          </div>
        </Skeleton>
      ))}
    </div>
  )
}
