'use client'

import * as React from 'react'

import { resetPasswordStepSchema, type ResetPasswordStep } from '@/lib/zod/schemas/auth'

import { cn } from '@/lib/utils'
import { match } from 'ts-pattern'
import {
  ResetPasswordChangeForm,
  ResetPasswordEmailSent,
  ResetPasswordRequestForm,
  ResetPasswordSuccess,
} from './_components/reset-password-form'

export default function ResetPasswordPageClient({ token }: { token?: string }) {
  const [step, setStep] = React.useState<ResetPasswordStep>(token ? 'change-password' : 'request-email')

  const proceed = () => {
    const steps = resetPasswordStepSchema.options
    const currentIndex = steps.indexOf(step)

    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const totalSteps = resetPasswordStepSchema.options.length
  const currentStepIndex = resetPasswordStepSchema.options.indexOf(step) + 1

  const StepComponent = match(step)
    .with('request-email', () => ResetPasswordRequestForm)
    .with('email-sent', () => ResetPasswordEmailSent)
    .with('change-password', () => ResetPasswordChangeForm)
    .with('success', () => ResetPasswordSuccess)
    .exhaustive()

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center">
      <div className="sr-only">
        Step {currentStepIndex} of {totalSteps}
      </div>
      <StepComponent proceed={proceed} token={token} />
      <ul className="mt-4 flex flex-wrap gap-x-2">
        {resetPasswordStepSchema.options.map((option, idx) => (
          <li
            key={option}
            className={cn(
              'h-1.5 w-8 rounded-full duration-300',
              currentStepIndex === idx + 1 ? 'bg-primary-600' : 'bg-white/10',
            )}
          />
        ))}
      </ul>
    </div>
  )
}
