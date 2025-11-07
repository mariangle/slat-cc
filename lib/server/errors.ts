import { FetchError } from 'ofetch'
import * as z from 'zod'

import type { ServerActionResponse } from '@/lib/server/guards'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { generateErrorMessage } from 'zod-error'

export const errorCode = z.enum([
  'bad_request',
  'not_found',
  'internal_server_error',
  'unauthorized',
  'forbidden',
  'rate_limit_exceeded',
  'exceeded_limit',
  'conflict',
  'unprocessable_entity',
  'service_unavailable',
])

const errorCodeToHttpStatus: Record<z.infer<typeof errorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  exceeded_limit: 403,
  not_found: 404,
  conflict: 409,
  unprocessable_entity: 422,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
  service_unavailable: 503,
}

export const httpStatusToErrorCode = Object.fromEntries(
  Object.entries(errorCodeToHttpStatus).map(([code, status]) => [status, code]),
) as Record<number, z.infer<typeof errorCode>>

export class FedsServerError extends Error {
  public readonly code: z.infer<typeof errorCode>
  public readonly headers?: Record<string, string>

  constructor({
    code,
    message,
    headers,
  }: {
    code: z.infer<typeof errorCode>
    message: string
    headers?: Record<string, string>
  }) {
    super(message)
    this.code = code
    this.headers = headers
    this.name = 'FedsServerError'
    Object.setPrototypeOf(this, FedsServerError.prototype)
  }
}

export function handleServerError(error: any): {
  error: { code: string; message: string }
  status: number
} {
  console.error('API error occurred', error.message)
  console.log(error)

  if (error instanceof ZodError) {
    return {
      error: {
        code: 'unprocessable_entity',
        message: generateErrorMessage(error.issues, {
          maxErrors: 1,
          delimiter: {
            component: ': ',
          },
          path: {
            enabled: true,
            type: 'objectNotation',
            label: '',
          },
          code: {
            enabled: true,
            label: '',
          },
          message: {
            enabled: true,
            label: '',
          },
        }),
      },
      status: errorCodeToHttpStatus.unprocessable_entity,
    }
  }

  if (error instanceof FetchError) {
    const status = error.response?.status || 500

    return {
      error: {
        code: httpStatusToErrorCode[status],
        message: error.message,
      },
      status,
    }
  }

  if (error instanceof FedsServerError) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
      status: errorCodeToHttpStatus[error.code],
    }
  }

  return {
    error: {
      code: 'internal_server_error',
      message: 'An internal server error occurred.',
    },
    status: 500,
  }
}

type Headers = Record<string, string>

/** Handles API errors. */
export function handleAndReturnErrorResponse(err: unknown, extraHeaders?: Headers): NextResponse {
  const { error, status } = handleServerError(err)

  const headers = {
    ...(extraHeaders ?? {}),
    ...((err as { headers?: Headers })?.headers ?? {}),
  }

  return NextResponse.json(
    { message: error.message },
    { headers: Object.keys(headers).length ? headers : undefined, status },
  )
}
