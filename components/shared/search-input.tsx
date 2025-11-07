'use client'

import { Input } from '@/components/ui/input'
import { Icons } from '@/lib/constants/icons'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
  searchKey?: string
}

export function SearchInput({
  value = '',
  onChange, // if provided, this will not use the router for search
  placeholder = 'Search...',
  inputClassName,
  className,
  disabled,
  searchKey = 'q',
}: SearchInputProps) {
  const [query, setQuery] = React.useState(value)
  const router = useRouter()
  const pathname = usePathname()

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (onChange) return

    router.push(`${pathname}?${searchKey}=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={onSearch} className={cn('relative h-fit w-full', className)}>
      <Input
        icon={Icons.search}
        disabled={disabled}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange?.(e.target.value)
        }}
        className={cn('h-10 rounded-full', inputClassName)}
      />
    </form>
  )
}
