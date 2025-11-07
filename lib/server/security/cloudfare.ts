import { validateTurnstileToken } from 'next-turnstile'
import { v4 } from 'uuid'
import { isDevelopment } from '@/lib/utils'

interface TurnstileValidateResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
  action?: string
  cdata?: string
}

export async function verifyWithCloudfare(token: string, remoteip?: string): Promise<TurnstileValidateResponse> {
  console.info(`Verifying Turnstile token: ${token} from IP: ${remoteip}`)

  const validationResponse: TurnstileValidateResponse = await validateTurnstileToken({
    token,
    secretKey: process.env.TURNSTILE_SECRET_KEY!,
    idempotencyKey: v4(),
    remoteip,
    sandbox: isDevelopment(),
  })

  console.info('Turnstile validation response:', validationResponse)

  return validationResponse
}
