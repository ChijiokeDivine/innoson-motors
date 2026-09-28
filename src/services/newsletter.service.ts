// src/services/newsletter.service.ts
import 'server-only'
import { getPayloadClient } from '@/lib/getPayloadClient'
import type { SubscribeNewsletterInput } from '@/types/dto'

export class AlreadySubscribedError extends Error {
  constructor() {
    super('This email is already subscribed.')
    this.name = 'AlreadySubscribedError'
  }
}

/**
 * Stores a newsletter signup. Per requirements this NEVER sends mail — it
 * only persists the email (idempotently: re-subscribing a previously
 * unsubscribed address flips it back to "subscribed" instead of erroring).
 */
export async function subscribeToNewsletter(input: SubscribeNewsletterInput) {
  const payload = await getPayloadClient()

  const existing = await payload.find({
    collection: 'newsletter-subscribers',
    where: { email: { equals: input.email } },
    limit: 1,
  })

  if (existing.docs[0]) {
    const doc = existing.docs[0]
    if (doc.status === 'subscribed') {
      throw new AlreadySubscribedError()
    }
    const updated = await payload.update({
      collection: 'newsletter-subscribers',
      id: doc.id,
      data: { status: 'subscribed', source: input.source ?? doc.source },
    })
    return { id: String(updated.id), email: updated.email }
  }

  const created = await payload.create({
    collection: 'newsletter-subscribers',
    data: { email: input.email, source: input.source, status: 'subscribed' },
  })
  return { id: String(created.id), email: created.email }
}
