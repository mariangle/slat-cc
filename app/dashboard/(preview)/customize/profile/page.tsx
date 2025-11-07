import { SaveAllBar } from '@/components/dashboard/save-changes-bar'
import { ProfilePreviewWrapper } from '@/components/profile/preview/profile-preview-wrapper'
import { Separator } from '@/components/ui/separator'
import { getMyProfile } from '@/lib/features/profile/queries'
import { isPremium } from '@/lib/features/users/roles'
import { SaveBarProvider } from '@/lib/stores/save-bar'
import { AvatarForm } from './_components/avatar-form'
import { InfoForm } from './_components/info-form'
import { MediaForm } from './_components/media-form'

export default async function Page() {
  const [profile, premium] = await Promise.all([
    getMyProfile({ include: { tracks: false, embeds: false } }),
    isPremium(),
  ])

  if (!profile) return null

  return (
    <SaveBarProvider>
      <SaveAllBar />
      <ProfilePreviewWrapper profile={profile}>
        <AvatarForm config={profile.config} />
        <Separator />
        <MediaForm config={profile.config} premium={premium} />
        <Separator />
        <InfoForm config={profile.config} premium={premium} />
      </ProfilePreviewWrapper>
    </SaveBarProvider>
  )
}
