import 'server-only'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { toBlogDetailDTO, toBlogListItemDTO, toTagDTO } from '@/lib/mappers'
import type { BlogDetailDTO, BlogListItemDTO, TagDTO } from '@/types/dto'
import type { PaginatedResult } from '@/services/models.service'
import type { Where } from 'payload'

export interface ListBlogParams {
  tag?: string
  limit?: number
  page?: number
}

export async function listTags(): Promise<TagDTO[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'tags',
    limit: 100,
    depth: 0,
    sort: 'name',
  })
  return result.docs.map(toTagDTO)
}

export async function getTagBySlug(slug: string): Promise<TagDTO | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0] ? toTagDTO(result.docs[0]) : null
}

export async function listBlogPosts(
  params: ListBlogParams = {},
): Promise<PaginatedResult<BlogListItemDTO>> {
  const payload = await getPayloadClient()
  const { tag, limit = 20, page = 1 } = params

  const where: Where = { _status: { equals: 'published' } }
  if (tag) {
    const tagDoc = await getTagBySlug(tag)
    if (!tagDoc) {
      return {
        docs: [],
        totalDocs: 0,
        totalPages: 0,
        page,
        limit,
        hasNextPage: false,
        hasPrevPage: false,
      }
    }
    ;(where as Record<string, unknown>).tags = { in: [tagDoc.id] }
  }

  const result = await payload.find({
    collection: 'blog-posts',
    where,
    sort: ['-publishedAt'],
    limit,
    page,
    depth: 1,
  })

  return {
    docs: result.docs.map(toBlogListItemDTO),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? page,
    limit: result.limit,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogDetailDTO | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ? toBlogDetailDTO(result.docs[0]) : null
}
