import { TemplateCard } from '@/app/dashboard/(default)/templates/_components/template-card'
import { TemplateCreate } from '@/app/dashboard/(default)/templates/_components/template-create'
import { TemplatesFilter } from '@/app/dashboard/(default)/templates/_components/templates-filter'
import { Pagination } from '@/components/shared/pagination'
import { SearchInput } from '@/components/shared/search-input'
import { db } from '@/lib/drizzle'
import { buildWhere, getSqlOrderBy, parseCategory } from '@/lib/features/templates/filters'
import { getTemplates } from '@/lib/features/templates/queries'
import { TemplatesFilters } from '@/lib/features/templates/types'
import { isPremium } from '@/lib/features/users/roles'
import { withSession } from '@/lib/server/guards'
import { getPaginationArgs } from '@/lib/server/params/pagination'

export default async function TemplatesPage({
  searchParams,
  params,
}: {
  searchParams: Promise<TemplatesFilters>
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const filters = await searchParams

  const [premium, user] = await Promise.all([
    isPremium(),
    withSession((userId) =>
      db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
        columns: { id: true, username: true },
      }),
    ),
  ])

  if (!user) return null

  const limits = [12, 24, 48]

  const templateCategory = parseCategory(category)
  const { page, limit } = getPaginationArgs(filters, { limits })
  const where = buildWhere(filters, templateCategory, user.id)
  const orderBy = getSqlOrderBy(filters.sortBy ?? 'newest')

  const { items, total } = await getTemplates({
    page,
    limit,
    where,
    viewerId: user.id,
    orderBy,
  })

  return (
    <>
      <SearchInput placeholder="Search templates..." value={filters.q} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <TemplatesFilter filters={filters} />
          {templateCategory === 'owned' && <TemplateCreate isPremium={premium} />}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((template) => (
            <TemplateCard key={template.id} template={template} filters={filters} isPremium={premium} user={user} />
          ))}
        </div>
      </div>
      <Pagination
        pagination={{
          limit,
          page,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        }}
        limits={limits}
        buttonSize="icon-md"
      />
    </>
  )
}
