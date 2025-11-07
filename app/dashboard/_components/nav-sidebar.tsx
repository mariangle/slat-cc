import { NavFooter } from '@/app/dashboard/_components/nav-footer'
import { LogoutButton } from '@/app/dashboard/_components/nav-logout-button'
import { NavMain } from '@/app/dashboard/_components/nav-main'
import { Logo } from '@/components/ui/logo'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Formatter } from '@/lib/casino/utils/formatters'
import { Icons } from '@/lib/constants/icons'
import { db } from '@/lib/drizzle'
import { isStaff } from '@/lib/features/users/roles'
import { getDisplayUserId } from '@/lib/features/users/utils'
import { paths } from '@/lib/routes/paths'
import { withSession } from '@/lib/server/guards'
import Link from 'next/link'
import { cache } from 'react'
import { LuUser } from 'react-icons/lu'

const getCachedUser = cache(async () => {
  const [user, staff] = await Promise.all([
    withSession((userId) =>
      db.query.users.findFirst({
        where: (t, { eq }) => eq(t.id, userId),
      }),
    ),
    isStaff(),
  ])

  return { ...user, staff }
})

export async function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getCachedUser()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 pt-6">
        <SidebarMenu>
          <Link href={paths.root} className="flex items-center">
            <Logo className="mr-1 size-8" />
            <span className="text-xl font-medium">
              feds<span className="text-primary-400">.</span>lol
            </span>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <NavMain isStaff={user?.staff} />
        <NavFooter className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="space-y-3 px-1 py-2">
          <Link
            target="_blank"
            rel="noopener nofollow"
            href={`/${user?.username}`}
            className="bg-foreground/2.5 text-foreground border-foreground/2.5 hover:bg-foreground/5 hidden items-center gap-x-2 rounded-2xl border px-3 py-2 text-sm font-medium duration-200 lg:flex"
          >
            <Icons.externalLink className="text-muted-foreground size-3.5" />
            View Profile
          </Link>
          <div className="bg-foreground/2.5 border-foreground/2.5 flex items-center gap-3 rounded-full border p-1.5">
            <div className="text-foreground bg-foreground/5 grid size-10 place-content-center rounded-full">
              <LuUser className="size-5" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold">{user?.username}</span>
              <div className="text-muted-foreground truncate text-sm">
                UID {Formatter.formatNumber(getDisplayUserId(user?.id || 0))}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
