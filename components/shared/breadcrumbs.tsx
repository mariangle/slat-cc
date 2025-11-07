import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'

export function Breadcrumbs({
  items,
}: {
  items: {
    name: string
    href: string
  }[]
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Link href={item.href}>
              <BreadcrumbItem key={index}>
                <BreadcrumbPage className="text-muted-foreground hover:text-foreground duration-200">
                  {item.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Link>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
