'use client'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DatePicker } from '@/components/shared/date-picker'
import { ResponsiveModal } from '@/components/shared/responsive-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useApiRoutes } from '@/hooks/use-api-routes'
import { Icons } from '@/lib/constants/icons'
import { ApiKeyRow } from '@/lib/drizzle'
import { apiPaths } from '@/lib/routes/paths'
import { buildPath } from '@/lib/utils'
import { apiKeyFormSchema, ApiKeyFormValues } from '@/lib/zod/schemas/apiKey'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ApiKeyFormDialog({
  apiKey,
  trigger,
  isSuperAdmin,
}: {
  apiKey: ApiKeyRow | null
  trigger: React.ReactNode
  isSuperAdmin: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = React.useState(false)
  const [result, setResult] = React.useState<string>('')

  const router = useRouter()

  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      name: apiKey?.name || '',
      expiresAt: apiKey?.expiresAt || null,
      userId: apiKey?.userId.toString() || '',
    },
  })

  const { actions, loading } = useApiRoutes([
    {
      name: 'create',
      endpoint: apiPaths.admin.apiKeys.root,
      method: 'POST',
    },
    {
      name: 'revoke',
      endpoint: buildPath(apiPaths.admin.apiKeys.revoke, { id: apiKey?.id ?? '' }),
      method: 'POST',
    },
  ] as const)

  const onSubmit = async (values: ApiKeyFormValues) => {
    try {
      if (apiKey) throw new Error('Not implemented')
      else {
        const { apiKey } = await actions.create<{ apiKey: string }>(values)
        setResult(apiKey)
      }

      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An error occurred while creating the API key.')
    }
  }

  const onRevoke = async () => {
    try {
      throw new Error('not implemented yet')
      // await actions.revoke()
      // toast.success('API key revoked successfully.')

      // router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An error occurred while revoking the API key.')
    }
  }

  const onCopy = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard.')
  }

  return (
    <>
      <ConfirmDialog
        setOpen={setRevokeDialogOpen}
        open={revokeDialogOpen}
        onConfirm={onRevoke}
        title="Revoke API Key"
        description="Are you sure you want to revoke this API key?"
        variant="destructive"
      />
      <ResponsiveModal
        icon={Icons.fingerprint}
        open={open}
        setOpen={setOpen}
        title={`${apiKey ? 'Edit' : 'Create'} API Key`}
        trigger={trigger}
      >
        {result ? (
          <div className="space-y-4">
            <div>Save this key securely, as it will not be shown again.</div>
            <code className="rounded-lg border border-neutral-900 bg-black p-2 text-white">{result}</code>
            <Button variant="secondary" onClick={() => onCopy(result)} className="mt-4 w-full">
              <Icons.copy className="text-muted-foreground" />
              Copy API Key
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input icon={Icons.hashtag} value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>The unique identifier for the user associated with this API key.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input icon={Icons.key} value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value ? new Date(field.value) : undefined} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      The date when this API key will expire. After this date, the key will no longer be valid. Leave
                      empty for no expiration.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full"
                  disabled={loading || !isSuperAdmin}
                >
                  {apiKey ? 'Update' : 'Create'}
                </Button>
                {apiKey && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setRevokeDialogOpen(true)}
                    className="w-full"
                    disabled={loading || !isSuperAdmin}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </ResponsiveModal>
    </>
  )
}
