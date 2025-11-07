import type { Profile } from '@/lib/features/profile/schemas'
import { useProfilePreview } from '@/lib/stores/preview'
import * as React from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

export function useSyncProfilePreview<T extends FieldValues>(
  form: UseFormReturn<T>,
  merge: (values: Partial<T>, prev: Profile) => Partial<Profile>,
) {
  const { profile, setProfile } = useProfilePreview()

  React.useEffect(() => {
    if (!profile) return

    const subscription = form.watch((values) => {
      const next = merge(values, profile)

      setProfile({ ...profile, ...next })
    })

    return () => subscription.unsubscribe()
  }, [form, form.watch, profile, setProfile, merge])
}
