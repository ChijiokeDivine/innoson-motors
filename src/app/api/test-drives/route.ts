import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { createTestDriveBookingSchema } from '@/lib/validation'
import {
  createTestDriveBooking,
  ModelNotFoundError,
} from '@/services/test-drive.service'
import { isHoneypotClean } from '@/lib/honeypot'
import { checkRateLimit, ipFromRequest } from '@/lib/rateLimit'

const RL_CONFIG = { actionKey: 'test-drive', max: 6, windowMs: 60 * 60_000 }

export async function POST(req: NextRequest) {
  const ip = ipFromRequest(req)
  const rl = await checkRateLimit(ip, RL_CONFIG)
  if (!rl.ok) {
    return fail(
      'Too many attempts. Please try again in a little while.',
      429,
    )
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return fail('Request body must be valid JSON.', 400)
  }

  if (!isHoneypotClean(json as Record<string, unknown>)) {
    return ok({ id: 'ignored', createdAt: new Date().toISOString() }, 200)
  }

  const parsed = createTestDriveBookingSchema.safeParse(json)
  if (!parsed.success) {
    return fail('Validation failed.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await createTestDriveBooking(parsed.data)
    return ok(result, 201)
  } catch (err) {
    if (err instanceof ModelNotFoundError) {
      return fail(err.message, 404)
    }
    console.error('POST /api/test-drives failed:', err)
    return fail('Could not book your test drive. Please try again.', 500)
  }
}
