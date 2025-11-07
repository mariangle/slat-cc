import { TableOfContents } from '@/components/shared/table-of-contents'
import { Alert } from '@/components/ui/alert'
import { getPublicArticleByPath } from '@/lib/content/queries'
import { buildPathFromSlugs, buildSlugsFromPath } from '@/lib/content/utils/build-path-from-slugs'
import { addIdsToHeadings, generateTableOfContents } from '@/lib/content/utils/toc-utils'
import { constructMetadata, isProduction } from '@/lib/utils'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClientUpdateDate } from '../_components/client-update-date'

type Params = {
  slug?: string[]
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata | undefined> {
  const { slug } = await props.params
  const path = buildPathFromSlugs(slug)

  const article = await getPublicArticleByPath(path, 'docs')
  if (!article) return

  return constructMetadata({
    title: article.title,
    description: article.description ?? undefined,
  })
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const articles = await db
    .select({ path: schema.contentEntries.path })
    .from(schema.contentEntries)
    .where(eq(schema.contentEntries.contentType, 'docs'))

  return articles.map((article) => ({
    slug: buildSlugsFromPath(article.path),
  }))
}

export default async function Page(props: { params: Promise<Params> }) {
  if (!isProduction()) {
    return (
      <div className="py-12">
        <Alert title="Under Construction" variant="info">
          We are working on the new API documentation. Please check back later.
        </Alert>
      </div>
    )
  }

  const { slug } = await props.params
  const path = buildPathFromSlugs(slug)

  const article = await getPublicArticleByPath(path, 'docs')

  if (!article) return notFound()

  const contentWithIds = addIdsToHeadings(article.content)
  const items = generateTableOfContents(contentWithIds)

  return (
    <div className="py-16">
      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        <div className="w-full lg:mt-4">
          <Alert title="Coming Soon" variant="info" className="mb-8">
            We are working on the new API documentation.
          </Alert>
          <div className="space-y-2">
            <ClientUpdateDate date={article.updatedAt ?? article.createdAt} />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-semibold md:text-4xl">{article.title}</h1>
            {article.description && <p className="mt-2 text-base">{article.description}</p>}
          </div>
          <article
            className="prose prose-invert prose-h2:mt-2 prose-strong:font-semibold text-muted-foreground prose-hr:border prose-hr:border-foreground/25 underline:text-red-500 hr:bg-red-500 marker:text-foreground mt-4 w-full pb-24 break-words"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />
        </div>
        <div className="w-full lg:sticky lg:top-24 lg:max-w-xs lg:self-start">
          <TableOfContents items={items} />
        </div>
      </div>
    </div>
  )
}
