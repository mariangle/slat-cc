'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useApiRoutes } from '@/hooks/use-api-routes'
import { Icons } from '@/lib/constants/icons'
import { apiPaths, paths } from '@/lib/routes/paths'
import {
  resetPasswordChangeFormSchema,
  resetPasswordRequestFormSchema,
  type ResetPasswordChangeFormValues,
  type ResetPasswordRequestFormValues,
} from '@/lib/zod/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AuthCard } from '../../_components/auth-card'

export interface ResetPasswordProps {
  proceed: () => void
  token?: string
}

export function ResetPasswordRequestForm({ proceed }: ResetPasswordProps) {
  const form = useForm<ResetPasswordRequestFormValues>({
    resolver: zodResolver(resetPasswordRequestFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const { actions, loading } = useApiRoutes([
    {
      name: 'request',
      endpoint: apiPaths.auth.resetPassword.request,
      method: 'POST',
    },
  ] as const)

  const handleSubmit = async (values: ResetPasswordRequestFormValues) => {
    try {
      await actions.request(values)

      proceed()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unknown error occurred.')
    }
  }

  return (
    <AuthCard title="Reset Password" description="Enter your email address to receive a password reset link.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    icon={Icons.at}
                    placeholder="Your email address"
                    autoComplete="false"
                    type="email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} variant="primary-gradient" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}

export function ResetPasswordEmailSent() {
  return <AuthCard title="Email Sent!" description="Please check your email to continue the process." />
}

export function ResetPasswordChangeForm({ proceed, token }: ResetPasswordProps) {
  if (!token) redirect(paths.auth.resetPassword)

  const form = useForm<ResetPasswordChangeFormValues>({
    resolver: zodResolver(resetPasswordChangeFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      token,
    },
  })

  const { actions, loading } = useApiRoutes([
    {
      name: 'change',
      endpoint: apiPaths.auth.resetPassword.change,
      method: 'POST',
    },
  ])

  const onSubmit = async (values: ResetPasswordChangeFormValues) => {
    try {
      await actions.change(values)

      proceed()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unknown error occurred.')
    }
  }

  return (
    <AuthCard title="Change Password" description="Enter your new password below.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter new password"
                    autoComplete="false"
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm new password"
                    autoComplete="false"
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} variant="primary-gradient" type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}

export function ResetPasswordSuccess() {
  return (
    <AuthCard title="Password Changed" description="Your password has been successfully changed.">
      <Link href={paths.auth.login} passHref>
        <Button variant="primary-gradient" className="w-full">
          Login
        </Button>
      </Link>
    </AuthCard>
  )
}
