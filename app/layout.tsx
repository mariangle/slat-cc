import RootProviders from '@/app/providers'
import { APP_CONFIG } from '@/lib/config'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/css/globals.css'
import '../styles/css/globals.scss'
import '../styles/css/index.css'

export const viewport: Viewport = {
  themeColor: APP_CONFIG.themeColor,
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.baseUrl),
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('scroll-smooth', inter.variable)} suppressHydrationWarning>
      <body className="bg-background text-muted-foreground relative min-h-svh overflow-x-hidden">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
