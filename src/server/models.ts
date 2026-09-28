import 'server-only'
import { notFound } from 'next/navigation'
import { listCategories, listModels, getModelBySlug } from '@/services/models.service'
import type { ListModelsParams } from '@/services/models.service'
import type {
  CategoryDTO,
  ModelDetailDTO,
  ModelListItemDTO,
} from '@/types/dto'

export async function getCategories(): Promise<CategoryDTO[]> {
  return listCategories()
}

export async function getPublishedModels(
  params?: ListModelsParams,
): Promise<ReturnType<typeof listModels>> {
  return listModels(params)
}

export async function getFeaturedModels(limit = 6): Promise<ModelListItemDTO[]> {
  const res = await listModels({ featured: true, limit })
  return res.docs
}

export async function getModelBySlugOrNotFound(
  slug: string,
): Promise<ModelDetailDTO> {
  const doc = await getModelBySlug(slug)
  if (!doc) {
    notFound()
  }
  return doc as ModelDetailDTO
}
