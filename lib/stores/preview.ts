import type { Profile } from '@/lib/features/profile/schemas'
import { create } from 'zustand'

type ProfilePreview = {
  profile?: Profile
  setProfile: (values: Profile) => void
}

export const useProfilePreview = create<ProfilePreview>((set) => ({
  profile: undefined,
  setProfile: (values) => {
    set((state) => ({
      profile: {
        ...state.profile,
        ...values,
      },
    }))
  },
}))
