import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { subscribeNewsletterSchema } from '@/lib/validation'
import {
  AlreadySubscribedError,
  subscribeToNewsletter,
} from '@/services/newsletter.service'
import { isHoneypotClean } from '@/lib/honeypot'
import { checkRateLimit, ipFromRequest } from '@/lib/rateLimit'
import { notifyNewSubmission } from '@/server/notifications'

const RL_CONFIG = { actionKey: 'newsletter', max: 10, windowMs: 60 * 60_000 }

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
    return ok({ id: 'ignored', email: '' }, 200)
  }

  const parsed = subscribeNewsletterSchema.safeParse(json)
  if (!parsed.success) {
    return fail('Validation failed.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await subscribeToNewsletter(parsed.data)
    try {
      await notifyNewSubmission('newsletter-subscribe', result)
    } catch {
      /* best-effort */
    }
    return ok(result, 201)
  } catch (err) {
    if (err instanceof AlreadySubscribedError) {
      return fail(err.message, 409)
    }
    console.error('POST /api/newsletter failed:', err)
    return fail('Could not subscribe. Please try again.', 500)
  }
}
