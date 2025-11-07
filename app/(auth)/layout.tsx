import { constructMetadata } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = constructMetadata()

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-svh w-full flex-col items-center justify-center">{children}</div>
}
