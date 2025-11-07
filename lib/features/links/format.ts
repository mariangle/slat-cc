import { getPlatformById } from '@/lib/constants/platforms'
import type { Link } from '@/lib/features/links/schemas'
import { toUndefined } from '@/lib/utils'
import type { LinkRow } from '@slat/db'

export const formatLink = (row: LinkRow): Link => {
  const platform = getPlatformById(row.platformId ?? undefined)
  
  return {
    id: row.id,
    platformId: toUndefined(row.platformId),
    source: row.source,
    iconName: row.iconName || platform?.iconName || 'FaGlobe',
    label: row.label || platform?.name || '',
    description: row.description || '',
    style: row.style,
    hidden: row.hidden,
    image: toUndefined(row.image),
    sortOrder: row.sortOrder,
    isCopyable: row.isCopyable ?? false,
    iconColor: toUndefined(row.iconColor),
    backgroundColor: toUndefined(row.backgroundColor),
    isInsideProfileCard: false,
  }
}
