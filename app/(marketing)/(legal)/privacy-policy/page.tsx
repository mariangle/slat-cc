import { Container } from '@/components/shared/container'
import { getPublicArticleByPath } from '@/lib/content/queries'
import { paths } from '@/lib/routes/paths'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read our privacy policy to understand how we handle your data.',
}

export default async function PrivacyPolicy() {
  const article = await getPublicArticleByPath(paths.privacyPolicy)

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
