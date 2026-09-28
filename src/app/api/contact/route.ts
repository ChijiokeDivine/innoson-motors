import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { createContactMessageSchema } from '@/lib/validation'
import { createContactMessage } from '@/services/contact.service'
import { isHoneypotClean } from '@/lib/honeypot'
import { checkRateLimit, ipFromRequest } from '@/lib/rateLimit'
import { notifyNewSubmission } from '@/server/notifications'

const RL_CONFIG = { actionKey: 'contact', max: 6, windowMs: 60 * 60_000 }

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

  const parsed = createContactMessageSchema.safeParse(json)
  if (!parsed.success) {
    return fail('Validation failed.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await createContactMessage(parsed.data)
    try {
      await notifyNewSubmission('contact-message', result)
    } catch {
      /* best-effort */
    }
    return ok(result, 201)
  } catch (err) {
    console.error('POST /api/contact failed:', err)
    return fail('Could not send your message. Please try again.', 500)
  }
}
