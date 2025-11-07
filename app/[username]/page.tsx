import { AudioSource } from '@/components/profile/audio-source'
import { CommentListModal } from '@/components/profile/comments/comment-list-modal'
import { CursorTrail } from '@/components/profile/cursor-trails/cursor-trail'
import { Overlay } from '@/components/profile/overlay'
import { ProfilePageContent } from '@/components/profile/profile-page-content'
import { ProfilePageProvider } from '@/components/profile/profile-page-provider'
import { Views } from '@/components/profile/views'
import { getSessionUserId } from '@/lib/auth/session'
import { getComments } from '@/lib/features/comments/queries'
import type { Config } from '@/lib/features/config/schemas'
import { getProfile } from '@/lib/features/profile/queries'
import { getViewsCount } from '@/lib/features/profile/queries/views'
import { Profile } from '@/lib/features/profile/schemas'
import { getUserIdByUsername } from '@/lib/features/users/queries'
import { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { generateProfileMetadata } from './_actions/metadata'
import { generateViewportMetadata } from './_actions/viewport'
import { ClientViewTracker } from './_components/client-view-tracker'
import { TemplatePreviewBanner } from './_components/template-preview-banner'

interface Params {
  username: string
}

interface SearchParams {
  templateId?: string
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata | undefined> {
  const { username } = await props.params

  return await generateProfileMetadata(username)
}

export async function generateViewport(props: { params: Promise<Params> }): Promise<Viewport> {
  const { username } = await props.params

  return await generateViewportMetadata(username)
}

export default async function ProfilePage(props: { params: Promise<Params>; searchParams: Promise<SearchParams> }) {
  const { username } = await props.params
  const { templateId: rawTemplateId } = await props.searchParams

  const templateId = rawTemplateId ? parseInt(rawTemplateId) : undefined
  const userId = await getUserIdByUsername(username)

  if (!userId) notFound()

  const profile = await getProfile(userId, { templateId })

  if (!profile) notFound()

  const config = profile.config
  const { enhancements, media, enterScreen, comments, themeColor } = profile.config
  const showEnterScreen = !!media.video || !!media.audio || enterScreen.persistent
  const visitorId = comments.enabled ? await getSessionUserId() : undefined
  const audioSource = media.audio || media.background

  return (
    <ProfilePageProvider config={config} className="relative min-h-svh w-full overflow-x-hidden">
      <Overlay showEnterscreen={showEnterScreen} config={config} />
      {comments.enabled && <SuspenseCommentsModal userId={userId} profile={profile} visitorId={visitorId} />}
      <ClientViewTracker userId={userId} />
      {audioSource && <AudioSource source={audioSource} config={config} />}
      {enhancements.cursorTrail && (
        <CursorTrail
          color={themeColor}
          trail={enhancements.cursorTrail}
          className="pointer-events-none fixed inset-0 z-99 h-full w-full"
        />
      )}
      {templateId && <TemplatePreviewBanner templateId={templateId} />}
      <ProfilePageContent profile={profile} views={config.layout.showViews && <SuspenseViews config={config} />} />
    </ProfilePageProvider>
  )
}

async function SuspenseViews({ config }: { config: Config }) {
  const views = await getViewsCount({ biolinkId: config.id })

  return <Views views={views} config={config} />
}

async function SuspenseCommentsModal({
  userId,
  profile,
  visitorId,
}: {
  userId: number
  profile: Profile
  visitorId?: number
}) {
  const comments = await getComments({ userId, visitorId })

  return <CommentListModal comments={comments} profile={profile} visitorId={visitorId} />
}
