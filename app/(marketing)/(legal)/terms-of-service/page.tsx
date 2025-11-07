import { Container } from '@/components/shared/container'
import { getPublicArticleByPath } from '@/lib/content/queries'
import { paths } from '@/lib/routes/paths'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our terms of service to understand your rights and responsibilities.',
}

export default async function TermsOfService() {
  const article = await getPublicArticleByPath(paths.termsOfService)

  if (!article) {
    notFound()
  }

  return (
    <Container className="py-24">
      <h1 className="text-foreground mb-4 text-3xl font-semibold">{article.title}</h1>
      <article
        className="prose prose-invert w-full max-w-prose"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </Container>
  )
}
