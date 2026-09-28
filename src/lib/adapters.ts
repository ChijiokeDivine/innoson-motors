import type { CategoryDTO, ModelListItemDTO, BlogListItemDTO, MediaDTO } from '@/types/dto'
import type { Vehicle } from '@/components/vehicles/vehicles-data'
import type { Article } from '@/components/news/news-data'

function mediaToUrl(m: MediaDTO | string | null | undefined, fallback: string): string {
  if (typeof m === 'string') return m
  if (m && typeof m === 'object' && 'url' in m) return m.url
  return fallback
}

export function modelsAsVehicleCards(
  models: ModelListItemDTO[],
): Vehicle[] {
  return models.map((m) => {
    const image = mediaToUrl(
      m.heroImage,
      m.slug === 'caris' ? '/images/vehicle-card-suv.png' : '/images/vehicle-card-sedan.png',
    )
    const categoryUpper = (m.category?.name?.toUpperCase()?.replace(/\s+/g, '') ?? 'SUVS') as Vehicle['category']
    return {
      id: m.id,
      name: m.name,
      category: isValidCategory(categoryUpper) ? categoryUpper : 'SUVS',
      image,
    }
  })
}

export function categoriesAsList(
  cats: CategoryDTO[],
): { slug: string; name: string; order: number }[] {
  return cats
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({ slug: c.slug, name: c.name, order: c.order ?? 0 }))
}

const VALID_CATEGORIES = new Set<string>(['CARS', 'MPV', 'PICKUP', 'SUVS', 'BUSES', 'ELECTRIC'])

function isValidCategory(s: unknown): s is Vehicle['category'] {
  return typeof s === 'string' && VALID_CATEGORIES.has(s)
}

export function postsAsArticles(posts: BlogListItemDTO[]): Article[] {
  return posts.map((p) => ({
    slug: p.slug,
    readTime: `${p.readTimeMinutes ?? 5} mins read`,
    title: p.title,
    excerpt: p.excerpt ?? 'Lorem ipsum dolor sit amet consectetur.',
    author: p.author?.name ?? 'IVM Editorial',
    date: formatNigerianDate(p.publishedAt),
    image: mediaToUrl(p.coverImage, '/images/news-car.png'),
  }))
}

function formatNigerianDate(isoOrEmpty: string | undefined | null): string {
  if (!isoOrEmpty) return ''
  try {
    const d = new Date(isoOrEmpty)
    if (Number.isNaN(d.getTime())) return String(isoOrEmpty).slice(0, 10)
    const day = d.getUTCDate()
    const month = d.toLocaleString('en-NG', { month: 'long', timeZone: 'UTC' })
    const year = d.getUTCFullYear()
    return `${day}${ordinalSuffix(day)} ${month} ${year}`
  } catch {
    return String(isoOrEmpty).slice(0, 10)
  }
}

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
