// src/services/contact.service.ts
import 'server-only'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { toAboutPageDTO, toContactInfoDTO } from '@/lib/mappers'
import type { AboutPageDTO, ContactInfoDTO, CreateContactMessageInput } from '@/types/dto'

/** Creates a general "Contact us" message. No email is ever sent — DB only. */
export async function createContactMessage(input: CreateContactMessageInput) {
  const payload = await getPayloadClient()
  const doc = await payload.create({
    collection: 'contact-messages',
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      status: 'new',
    },
  })
  return { id: String(doc.id), createdAt: doc.createdAt }
}

/** Fetches the singleton "About" page content. */
export async function getAboutPage(): Promise<AboutPageDTO> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'about-page', depth: 2 })
  return toAboutPageDTO(doc)
}

/** Fetches the singleton "Contact" page content (phones, emails, address, socials). */
export async function getContactInfo(): Promise<ContactInfoDTO> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'contact-info', depth: 0 })
  return toContactInfoDTO(doc)
}
