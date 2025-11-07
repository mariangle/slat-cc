'use client'

import * as React from 'react'

import { IconContainer } from '@/components/shared/icon-container'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useMounted } from '@/hooks/use-mounted'
import type { IconType } from '@/lib/constants/icons'
import { cn } from '@/lib/utils'

interface ResponsiveModalProps {
  icon?: IconType | string
  title: string
  description?: string
  trigger?: React.ReactNode
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  dialogClassName?: string
  footerClassName?: string
  size?: Size
  footer?: React.ReactNode
}

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

const dialogSizes: Record<Size, string> = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-md',
  lg: 'md:max-w-lg',
  xl: 'md:max-w-xl',
  '2xl': 'md:max-w-2xl',
  '3xl': 'md:max-w-3xl',
  '4xl': 'md:max-w-4xl',
}

export function ResponsiveModal({
  icon: Icon,
  title,
  description,
  trigger,
  children,
  open,
  setOpen,
  dialogClassName,
  footerClassName,
  size = 'sm',
  footer,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)') // md
  const mounted = useMounted()

  const dialogSize = dialogSizes[size]

  if (!mounted) return trigger

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={cn(dialogSize, dialogClassName)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5">
              {Icon && <IconContainer icon={Icon} />}
              {title}
            </DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="overflow-y-auto">{children}</div>
          {footer && <DialogFooter className={footerClassName}>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            {Icon && <IconContainer icon={Icon} />}
            {title}
          </DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto px-2 pb-2">{children}</ScrollArea>
        {footer && <DialogFooter className={cn('p-2', footerClassName)}>{footer}</DialogFooter>}
      </DrawerContent>
    </Drawer>
  )
}
