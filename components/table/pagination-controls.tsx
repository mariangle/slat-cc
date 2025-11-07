'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSearchParams } from '@/hooks/use-search-params'
import { Icons, type IconType } from '@/lib/constants/icons'
import type { Pagination } from '@/lib/types'

export function PaginationControls({ pagination, hideLimit }: { pagination: Pagination; hideLimit?: boolean }) {
  const { page, totalPages, limit } = pagination

  const searchParams = useSearchParams()

  const updatePage = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(totalPages, newPage))
    searchParams.update({ page: clampedPage.toString() })
  }

  const updateLimit = (newLimit: string) => {
    searchParams.update({ limit: newLimit })
  }

  const renderButton = (newPage: number, disabled: boolean, Icon: IconType) => {
    return (
      <Button variant="secondary" size="icon-sm" onClick={() => updatePage(newPage)} disabled={disabled}>
        <Icon className="size-4 shrink-0" />
      </Button>
    )
  }

  const currentPage = Number(page)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex items-center space-x-2">
        {!hideLimit && (
          <>
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={limit.toString()} onValueChange={updateLimit}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={limit.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 text-white">
        {renderButton(1, isFirstPage, Icons.chevronFirst)}
        {renderButton(currentPage - 1, isFirstPage, Icons.chevronLeft)}
        <div className="px-3 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        {renderButton(currentPage + 1, isLastPage, Icons.chevronRight)}
        {renderButton(totalPages, isLastPage, Icons.chevronLast)}
      </div>
    </div>
  )
}
