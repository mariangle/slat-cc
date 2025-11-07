import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-24 w-full" />
    </>
  )
}
