'use client'

import { NavMenuItem } from '@/app/dashboard/_components/nav-menu-item'
import * as React from 'react'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar'
import { DASHBOARD_NAV } from '@/lib/routes/dashboard'

export function NavFooter({ ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {DASHBOARD_NAV.footer.map((item) => (
            <NavMenuItem key={item.label} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
