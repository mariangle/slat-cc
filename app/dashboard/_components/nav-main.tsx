'use client'

import { NavMenuItem } from '@/app/dashboard/_components/nav-menu-item'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar'
import { DASHBOARD_NAV, DashboardLink } from '@/lib/routes/dashboard'

export function NavMain({ isStaff }: { isStaff: boolean }) {
  const groups: { label: string; items: DashboardLink[] }[] = [
    { label: 'Dashboard', items: DASHBOARD_NAV.overview },
    { label: 'Customize', items: DASHBOARD_NAV.customize[0]?.children },
    { label: 'Manage', items: DASHBOARD_NAV.manage },
  ]

  return (
    <SidebarGroup>
      {groups.map((group, idx) => (
        <div key={idx}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {group.items.map((item, idx) => {
              const isHidden = item.staffOnly && !isStaff
              if (isHidden) return null

              return <NavMenuItem item={item} key={idx} />
            })}
          </SidebarMenu>
        </div>
      ))}
    </SidebarGroup>
  )
}
