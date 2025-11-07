const TAG_SEPARATOR = ','

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase()
}

export function parseTags(input: string): string[] {
  return input
    .split(TAG_SEPARATOR)
    .map(normalizeTag)
    .filter((tag) => tag.length > 0)
}

export function unparseTags(tags: string[]): string {
  return tags.map(normalizeTag).join(TAG_SEPARATOR)
}
