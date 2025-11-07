import * as z from 'zod'

export const isSchema =
  <S extends z.ZodTypeAny>(schema: S) =>
  (value: unknown): value is z.infer<S> =>
    schema.safeParse(value).success

/**
 * Loosen the schema to accept empty strings (controlled form inputs), then preprocess them to undefined.
 */
export const allowEmpty = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((v) => (v === '' ? undefined : v), schema)

/**
 * Recursively unwraps a Zod schema until we reach the "base" type,
 * tracking whether any layer along the way made the field optional.
 */
function unwrapSchema(schema: z.ZodTypeAny): { base: z.ZodTypeAny; isOptional: boolean } {
  let current = schema
  let isOptional = false

  // peel off layers like .optional() and preprocess/transform effects
  while (true) {
    if (current instanceof z.ZodOptional) {
      isOptional = true
      current = current.unwrap()
      continue
    }
    if (current instanceof z.ZodEffects) {
      current = current.innerType()
      continue
    }
    break
  }

  return { base: current, isOptional }
}

/**
 * Wraps a Zod object schema so any logically optional field that is undefined or missing becomes `null`.
 */
export function toNullSchemaDeep<T extends z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>>(schema: T): T {
  const objectSchema = schema instanceof z.ZodEffects ? schema.innerType() : schema

  if (!(objectSchema instanceof z.ZodObject)) {
    throw new Error('toNullSchemaDeep can only be applied to ZodObject schemas')
  }

  // Collect all keys that are logically optional
  const optionalKeys = Object.entries(objectSchema.shape)
    .filter(([, field]) => unwrapSchema(field as z.ZodTypeAny).isOptional)
    .map(([key]) => key)

  // Add a single object-level transform that fills undefined optionals with null
  return (schema as unknown as z.ZodTypeAny).transform((data: Record<string, unknown>) => {
    const result: Record<string, unknown> = { ...data }

    for (const key of optionalKeys) {
      if (result[key] === undefined) {
        result[key] = null
      }
    }

    return result
  }) as T
}
