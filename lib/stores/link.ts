'use client'

import { Link } from '@/lib/features/links/schemas'
import { createItemsStore } from '@/lib/stores/item'

export const useLinkStore = createItemsStore<Link>()
