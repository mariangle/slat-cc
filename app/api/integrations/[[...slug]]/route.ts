import { embedProviders } from '@/lib/integrations/providers'
import { embedTypeSchema } from '@/lib/integrations/providers/schemas'
import { FedsServerError, handleAndReturnErrorResponse } from '@/lib/server/errors'
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

const providerByType = new Map(embedProviders.map((p) => [p.type, p]))

const paramsSchema = z.object({
  slug: z.tuple([embedTypeSchema, z.string().min(1)]),
})

export async function GET(_: NextRequest, props: { params: Promise<Record<string, string[]>> }) {
  const { slug } = await props.params

  try {
    const parsed = paramsSchema.safeParse({ slug })

    if (!parsed.success) {
      throw new FedsServerError({
        code: 'bad_request',
        message: 'Invalid slug provided.',
      })
    }

    const [type, identifier] = parsed.data.slug

    const provider = providerByType.get(type)

    if (!provider) {
      throw new FedsServerError({
        code: 'bad_request',
        message: `Provider for type '${type}' not found.`,
      })
    }

    const data = await provider.getCached(identifier)

    return NextResponse.json(data)
  } catch (error) {
    return handleAndReturnErrorResponse(error)
  }
}
