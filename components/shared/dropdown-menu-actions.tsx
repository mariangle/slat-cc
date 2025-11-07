import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/lib/constants/icons'
import { isNil } from 'lodash'

interface DropdownMenuActionsProps {
  trigger: React.ReactNode
  isVisible?: boolean
  disabled?: boolean
  onEdit?: () => void
  onToggleVisibility?: () => void
  onDelete?: () => void
}

export function DropdownMenuActions({
  trigger,
  isVisible,
  disabled,
  onEdit,
  onToggleVisibility,
  onDelete,
}: DropdownMenuActionsProps) {
  const EyeIcon = isVisible ? Icons.eye : Icons.eyeOff

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} disabled={disabled}>
            <Icons.pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {!isNil(onToggleVisibility) && !isNil(isVisible) && (
          <DropdownMenuItem onClick={onToggleVisibility} disabled={disabled}>
            <EyeIcon className="h-4 w-4" />
            <span>{isVisible ? 'Hide' : 'Show'}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-white/5" />
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} disabled={disabled}>
            <Icons.trash className="text-destructive h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
