import { getConfig } from '@/lib/features/config/queries'
import { getLinks } from '@/lib/features/links/queries'
import { LinkListClient } from './_components/link-list-client'

export default async function Links() {
  const [links, config] = await Promise.all([getLinks(), getConfig()])

  if (!config) return null

  return <LinkListClient config={config} items={links} />
}
