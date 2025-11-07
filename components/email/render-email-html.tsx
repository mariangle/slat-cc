import { FedsPasswordUpdatedEmail } from '@/components/email/feds-password-changed-email'
import { FedsResetPasswordEmail } from '@/components/email/feds-reset-password-email'
import { FedsWelcomeEmail } from '@/components/email/feds-welcome-email'
import { render } from '@react-email/components'
import { match } from 'ts-pattern'

export type FedsEmailProps = {
  type: 'reset-password' | 'welcome' | 'password-changed'
  username: string
  token?: string
}

export async function renderEmailHtml({ ...props }: FedsEmailProps) {
  return match(props.type)
    .with('reset-password', () => render(<FedsResetPasswordEmail {...props} />))
    .with('welcome', () => render(<FedsWelcomeEmail />))
    .with('password-changed', () => render(<FedsPasswordUpdatedEmail {...props} />))
    .exhaustive()
}
