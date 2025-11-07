import { EmbedType } from '@/lib/integrations/providers/schemas'
import { FedsServerError } from '@/lib/server/errors'
import { unstable_cache } from 'next/cache'

type Fetcher<TOut> = (parsed: string) => Promise<TOut>
type Validator = (input: string) => boolean

interface EmbedProviderProps<TOut> {
  type: EmbedType
  /** Validate the extracted identifier */
  validate: Validator
  fetch: Fetcher<TOut>
  cache: number // seconds
}

export class EmbedProvider<TOut> {
  readonly validate: Validator
  private readonly fetch: Fetcher<TOut>
  readonly type: EmbedType
  private readonly cache: number

  constructor(props: EmbedProviderProps<TOut>) {
    this.validate = props.validate
    this.fetch = props.fetch
    this.type = props.type
    this.cache = props.cache
  }

  private get(identifier: string): Promise<TOut> {
    const validated = this.validate(identifier)

    if (!validated) {
      console.info('Validation failed for identifier:', identifier)

      throw new FedsServerError({
        code: 'unprocessable_entity',
        message: 'Invalid input',
      })
    }

    return this.fetch(identifier)
  }

  getCached(identifier: string): Promise<TOut> {
    return unstable_cache(() => this.get(identifier), [this.type, `$${identifier}`], {
      revalidate: this.cache,
      tags: [`${this.type}:${identifier}`],
    })()
  }
}
