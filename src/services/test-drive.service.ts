import 'server-only'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { modelExistsAndPublished } from '@/services/models.service'
import type { CreateTestDriveBookingInput } from '@/types/dto'
import { notifyNewSubmission } from '@/server/notifications'

export class ModelNotFoundError extends Error {
  constructor() {
    super('The selected vehicle model could not be found or is not published.')
    this.name = 'ModelNotFoundError'
  }
}

export async function createTestDriveBooking(input: CreateTestDriveBookingInput) {
  const payload = await getPayloadClient()

  const valid = await modelExistsAndPublished(input.modelId)
  if (!valid) throw new ModelNotFoundError()

  const data: Record<string, unknown> = {
    name: input.name,
    phone: input.phone,
    email: input.email,
    model: input.modelId,
    message: input.message,
    marketingOptIn: Boolean(input.marketingOptIn),
    status: 'new',
  }
  if (input.preferredDate) data.preferredDate = input.preferredDate
  if (input.dealershipId) data.dealership = input.dealershipId

  const doc = await payload.create({
    collection: 'test-drive-bookings',
    data,
  })

  try {
    await notifyNewSubmission('test-drive-booking', {
      id: String(doc.id),
      name: input.name,
      email: input.email,
      phone: input.phone,
      modelId: input.modelId,
    })
  } catch {
    /* notifications are best-effort — never fail the user request */
  }

  return { id: String(doc.id), createdAt: doc.createdAt }
}
