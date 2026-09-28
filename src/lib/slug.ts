import type { CollectionBeforeValidateHook } from 'payload'

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function autoSlugFrom(sourceField: string, slugField = 'slug'): CollectionBeforeValidateHook {
  return ({ data, operation, originalDoc }) => {
    if (!data) return data

    const currentSlug = (data as Record<string, unknown>)[slugField] as string | undefined
    const source = (data as Record<string, unknown>)[sourceField] as string | undefined

    if (operation === 'create') {
      if (!currentSlug && source) {
        ;(data as Record<string, unknown>)[slugField] = slugify(source)
      }
    } else if (operation === 'update') {
      const wasEmpty = !originalDoc || !(originalDoc as Record<string, unknown>)[slugField]
      if ((wasEmpty || !currentSlug) && source) {
        ;(data as Record<string, unknown>)[slugField] = slugify(source)
      }
    }

    return data
  }
}
