import 'server-only'
import { getPayloadClient } from '@/lib/getPayloadClient'
import {
  toCategoryDTO,
  toModelDetailDTO,
  toModelListItemDTO,
} from '@/lib/mappers'
import type {
  CategoryDTO,
  ModelDetailDTO,
  ModelListItemDTO,
} from '@/types/dto'
import type { Where } from 'payload'

export interface ListModelsParams {
  category?: string
  featured?: boolean
  limit?: number
  page?: number
}

export interface PaginatedResult<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function listCategories(): Promise<CategoryDTO[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return result.docs.map(toCategoryDTO)
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryDTO | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ? toCategoryDTO(result.docs[0]) : null
}

export async function listModels(
  params: ListModelsParams = {},
): Promise<PaginatedResult<ModelListItemDTO>> {
  const payload = await getPayloadClient()
  const { category, featured, limit = 50, page = 1 } = params

  const where: Where = { _status: { equals: 'published' } }

  if (category) {
    const cat = await getCategoryBySlug(category)
    if (!cat) {
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
    ;(where as Record<string, unknown>).category = { equals: cat.id }
  }

  if (typeof featured === 'boolean') {
    ;(where as Record<string, unknown>).featured = { equals: featured }
  }

  const result = await payload.find({
    collection: 'models',
    where,
    sort: ['order', 'asc'],
    limit,
    page,
    depth: 1,
  })

  return {
    docs: result.docs.map(toModelListItemDTO),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? page,
    limit: result.limit,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

export async function getModelBySlug(
  slug: string,
): Promise<ModelDetailDTO | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'models',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ? toModelDetailDTO(result.docs[0]) : null
}

export async function modelExistsAndPublished(
  modelId: string,
): Promise<boolean> {
  const payload = await getPayloadClient()
  try {
    const doc = await payload.findByID({
      collection: 'models',
      id: modelId,
      depth: 0,
    })
    return Boolean(doc) && doc._status === 'published'
  } catch {
    return false
  }
}
