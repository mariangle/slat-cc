import { IconContainer } from '@/components/shared/icon-container'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/lib/constants/icons'
import { VariantProps } from 'class-variance-authority'

export function ConfirmDialog({
  open,
  setOpen,
  onConfirm,
  title,
  description,
  variant,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {variant === 'destructive' && <IconContainer icon={Icons.trash} color="destructive" />}
            <AlertDialogTitle className="text-foreground">{title || 'Are you absolutely sure?'}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            {description || 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant={variant}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
