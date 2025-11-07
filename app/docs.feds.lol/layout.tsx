import { Header } from '@/app/docs.feds.lol/_components/header'
import { NavSidebar } from '@/app/docs.feds.lol/_components/nav-sidebar'
import { Container } from '@/components/shared/container'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { constructMetadata } from '@/lib/utils'

export const revalidate = 86400 // 24 hours

export const metadata = constructMetadata({
  templateTitle: 'Docs',
  description: `Documentation for feds.lol`,
})

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="font-mono">
      <NavSidebar variant="sidebar" />
      <SidebarInset>
        <Header />
        <Container className="max-w-7xl">{children}</Container>
      </SidebarInset>
    </SidebarProvider>
  )
}
