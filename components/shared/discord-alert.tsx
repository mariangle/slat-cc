import { Alert, AlertVariant } from '@/components/ui/alert'
import { DiscordErrorCode, DiscordState, errorCodeToMessage } from '@/lib/auth/providers/discord/schemas'
import { startCase } from 'lodash'

interface DiscordAlertProps {
  state: DiscordState
  error: DiscordErrorCode
  variant?: AlertVariant
}

export function DiscordAlert({ state, error, variant = 'error' }: DiscordAlertProps) {
  return (
    <Alert title={`Discord ${startCase(state)} Error`} variant={variant} animate className="mb-4">
      {errorCodeToMessage[error] || 'An unknown error occurred.'}
    </Alert>
  )
}
