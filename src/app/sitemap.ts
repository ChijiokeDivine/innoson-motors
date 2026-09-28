import type { MetadataRoute } from 'next'

const DEFAULT_URL =
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || 'https://innosonmotors.example'

async function safeAsync<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

type SitemapEntry = { url: string; lastModified?: Date; changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']; priority?: number }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = DEFAULT_URL
  const staticRoutes: SitemapEntry[] = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/vehicles`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/news`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/book-a-test-drive`, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const models = await safeAsync(async (): Promise<SitemapEntry[]> => {
    const { getPublishedModels } = await import('@/server/models')
    const res = await getPublishedModels({ limit: 500 })
    return res.docs.map((m) => ({
      url: `${base}/vehicles/${m.slug}`,
      lastModified: m.updatedAt ? new Date(m.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  }, [] as SitemapEntry[])

  const posts = await safeAsync(async (): Promise<SitemapEntry[]> => {
    const { getPublishedPosts } = await import('@/server/blog')
    const res = await getPublishedPosts({ limit: 500 })
    return res.docs.map((p) => ({
      url: `${base}/news/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : p.publishedAt ? new Date(p.publishedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))
  }, [] as SitemapEntry[])

  return [...staticRoutes, ...models, ...posts] as MetadataRoute.Sitemap
}
