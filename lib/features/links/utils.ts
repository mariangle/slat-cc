import { getPlatformById } from '@/lib/constants/platforms'
import type { Link } from '@/lib/features/links/schemas'

export function generateTarget(link: Pick<Link, 'platformId' | 'source'>): string {
  const platform = getPlatformById(link.platformId)

  if (!platform?.baseURL) return link.source

  const target = platform.baseURL.replace('{source}', link.source)

  return `https://${target}`
}

export function isCopyable(target: string): boolean {
  return !target.startsWith('https://')
}

export const cleanTarget = (target: string) => target.replace(/^(https?:\/\/)?/, '')
