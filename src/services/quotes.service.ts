// src/services/quotes.service.ts
import 'server-only'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { modelExistsAndPublished } from '@/services/models.service'
import type { CreateQuoteRequestInput } from '@/types/dto'

export class ModelNotFoundError extends Error {
  constructor() {
    super('The selected vehicle model could not be found or is not published.')
    this.name = 'ModelNotFoundError'
  }
}

/**
 * Creates a "Get a Quote" submission for a specific model. Validates that
 * the referenced model exists and is published before writing to the DB.
 * Called from POST /api/quotes after zod input validation.
 */
export async function createQuoteRequest(input: CreateQuoteRequestInput) {
  const payload = await getPayloadClient()

  const validModel = await modelExistsAndPublished(input.modelId)
  if (!validModel) throw new ModelNotFoundError()

  const doc = await payload.create({
    collection: 'quote-requests',
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      address: input.address,
      model: input.modelId,
      message: input.message,
      status: 'new',
    },
  })

  return {
    id: String(doc.id),
    createdAt: doc.createdAt,
  }
}
