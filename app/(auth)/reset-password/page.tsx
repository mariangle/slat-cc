import ResetPasswordPageClient from './page-client'

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  return <ResetPasswordPageClient token={token} />
}
