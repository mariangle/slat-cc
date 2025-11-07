'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSearchParams } from '@/hooks/use-search-params'
import { Icons, type IconType } from '@/lib/constants/icons'
import type { Pagination as PaginationType } from '@/lib/types'
import { cn, formatNumber } from '@/lib/utils'
import { VariantProps } from 'class-variance-authority'

type Props = {
  pagination: PaginationType
  buttonSize?: VariantProps<typeof buttonVariants>['size']
  /** When provided, shows a per-page selector on the left and uses justify-between layout */
  limits?: number[]
  /** Optional override for handling page changes (defaults to updating ?page) */
  onPageChange?: (page: number) => void
  /** Optional override for handling limit changes (defaults to updating ?limit and resetting page=1) */
  onLimitChange?: (limit: number) => void
  /** Query param keys (if you use custom names) */
  paramKeys?: { page?: string; limit?: string }
  className?: string
}

export function Pagination({
  pagination,
  limits,
  onPageChange,
  onLimitChange,
  paramKeys,
  className,
  buttonSize = 'icon-sm',
}: Props) {
  const { page, totalPages, limit, total } = pagination
  const currentPage = Math.max(1, Number(page || 1))
  const pages = Math.max(1, Number(totalPages || 1))
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= pages

  const searchParams = useSearchParams()
  const pageKey = paramKeys?.page ?? 'page'
  const limitKey = paramKeys?.limit ?? 'limit'

  const goTo = (newPage: number) => {
    const clamped = Math.max(1, Math.min(pages, newPage))
    if (onPageChange) return onPageChange(clamped)
    searchParams.update({ [pageKey]: String(clamped) })
  }

  const changeLimit = (newLimit: number) => {
    if (onLimitChange) return onLimitChange(newLimit)
    searchParams.update({ [limitKey]: String(newLimit), [pageKey]: '1' })
  }

  const hasLimitSelect = Array.isArray(limits) && limits.length > 0
  const wrapperJustify = hasLimitSelect ? 'justify-between' : 'justify-center'

  return (
    <div
      className={cn(
        'text-foreground mt-4 flex flex-col-reverse items-center gap-6 lg:flex-row',
        wrapperJustify,
        className,
      )}
    >
      {hasLimitSelect ? (
        <div className="flex items-center gap-2">
          <label htmlFor="per-page" className="text-sm">
            Per page
          </label>
          <Select value={limit.toString()} onValueChange={(value) => changeLimit(Number(value))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {limits.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm">• {formatNumber(total)} total</span>
        </div>
      ) : (
        <span aria-hidden className="hidden w-[1px] sm:block" />
      )}
      <div className="flex items-center justify-center gap-2">
        <PaginationButton
          onClick={() => goTo(1)}
          buttonSize={buttonSize}
          ariaLabel={`Go to first page`}
          disabled={isFirstPage}
          icon={Icons.chevronFirst}
        />
        <PaginationButton
          onClick={() => goTo(currentPage - 1)}
          buttonSize={buttonSize}
          ariaLabel={`Go to previous page`}
          disabled={isFirstPage}
          icon={Icons.chevronLeft}
        />
        <div className="flex px-3 font-medium">
          Page {currentPage} of {pages}
        </div>
        <PaginationButton
          onClick={() => goTo(currentPage + 1)}
          buttonSize={buttonSize}
          ariaLabel={`Go to next page`}
          disabled={isLastPage}
          icon={Icons.chevronRight}
        />
        <PaginationButton
          onClick={() => goTo(pages)}
          buttonSize={buttonSize}
          ariaLabel={`Go to last page`}
          disabled={isLastPage}
          icon={Icons.chevronLast}
        />
      </div>
    </div>
  )
}

export function PaginationButton({
  onClick,
  buttonSize = 'icon-md',
  ariaLabel,
  disabled,
  icon: Icon,
}: {
  onClick?: () => void
  buttonSize?: VariantProps<typeof buttonVariants>['size']
  disabled?: boolean
  ariaLabel?: string
  icon: IconType
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="secondary"
      size={buttonSize}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <Icon className="size-4 shrink-0" />
    </Button>
  )
}
