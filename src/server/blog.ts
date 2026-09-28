import 'server-only'
import { notFound } from 'next/navigation'
import { listBlogPosts, getBlogPostBySlug, listTags } from '@/services/blog.service'
import type { ListBlogParams } from '@/services/blog.service'
import type { BlogDetailDTO, TagDTO } from '@/types/dto'

export async function getPublishedPosts(params?: ListBlogParams) {
  return listBlogPosts(params)
}

export async function getPostBySlugOrNotFound(slug: string): Promise<BlogDetailDTO> {
  const doc = await getBlogPostBySlug(slug)
  if (!doc) {
    notFound()
  }
  return doc as BlogDetailDTO
}

export async function getTags(): Promise<TagDTO[]> {
  return listTags()
}
