import { isAuthenticated } from '@/lib/auth/session'
import { constructMetadata } from '@/lib/utils'
import { Suspense } from 'react'
import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { ScrollToTop } from './_components/scroll-to-top'

export const metadata = constructMetadata()

export const experimental_ppr = true

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <div className="overflow-x-hidden">
        <Suspense fallback={null}>
          <AsyncHeader />
        </Suspense>
        {children}
        <Footer />
      </div>
    </>
  )
}

async function AsyncHeader() {
  const authenticated = await isAuthenticated()
  return <Header authenticated={authenticated} />
}
