import { linkFields, type LinkField } from '@/lib/features/links/schemas'
import { allowEmpty } from '@/lib/zod/utils'
import { z } from 'zod'

export const linkFormSchema = z.object({
  platformId: allowEmpty(linkFields.platformId),
  source: linkFields.source.max(255),
  iconName: linkFields.iconName.max(50),
  label: linkFields.label.min(1).max(50),
  description: linkFields.description.max(255),
  style: linkFields.style,
  hidden: linkFields.hidden,
  image: allowEmpty(linkFields.image),
  iconColor: allowEmpty(linkFields.iconColor).default('#FFFFFF'),
  backgroundColor: allowEmpty(linkFields.backgroundColor),
} satisfies Partial<Record<LinkField, z.ZodTypeAny>>)

export type LinkFormValues = z.output<typeof linkFormSchema>

export const linkColorsFormSchema = z.object({
  iconColor: linkFields.iconColor,
  backgroundColor: allowEmpty(linkFields.backgroundColor),
} satisfies Partial<Record<LinkField, z.ZodTypeAny>>)

export type LinkColorsFormValues = z.output<typeof linkColorsFormSchema>
