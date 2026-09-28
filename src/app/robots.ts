import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const host =
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || 'https://innosonmotors.example'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/api/admin/', '/book-a-test-drive'],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  }
}
