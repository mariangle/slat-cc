import { ProfilePreviewWrapper } from '@/components/profile/preview/profile-preview-wrapper'
import { getMyProfile } from '@/lib/features/profile/queries'
import { isPremium } from '@/lib/features/users/roles'
import { SaveBarProvider } from '@/lib/stores/save-bar'
import { CardForm } from './_components/card-form'
import { ColorsForm } from './_components/colors-form'
import { EnhancementsForm } from './_components/enhancements-form'
import { EnterScreenForm } from './_components/enter-screen-form'
import { FontForm } from './_components/font-form'
import { LayoutForm } from './_components/layout-form'
import { PremiumUpgradeCard } from './_components/premium-upgrade-card'

export default async function Page() {
  const [profile, premium] = await Promise.all([getMyProfile({ include: { tracks: false } }), isPremium()])

  if (!profile) return null

  const { config } = profile

  return (
    <SaveBarProvider>
      <ProfilePreviewWrapper profile={profile}>
        <LayoutForm config={profile.config} />
        <CardForm config={profile.config} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ColorsForm config={config} />
          <FontForm config={config} premium={premium} />
        </div>
        {!premium && <PremiumUpgradeCard />}
        <EnhancementsForm config={config} premium={premium} />
        {premium && <EnterScreenForm config={config} />}
      </ProfilePreviewWrapper>
    </SaveBarProvider>
  )
}
