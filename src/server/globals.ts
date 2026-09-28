import 'server-only'
import { getPayloadClient } from '@/lib/getPayloadClient'
import {
  toAboutPageDTO,
  toContactInfoDTO,
  toSiteSettingsDTO,
  toDealershipDTO,
} from '@/lib/mappers'
import type {
  AboutPageDTO,
  ContactInfoDTO,
  DealershipDTO,
  SiteSettingsDTO,
} from '@/types/dto'

export async function getAboutPage(): Promise<AboutPageDTO> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({
    slug: 'about-page',
    depth: 2,
    overrideAccess: false,
  })
  return toAboutPageDTO(doc)
}

export async function getContactInfo(): Promise<ContactInfoDTO> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({
    slug: 'contact-info',
    depth: 0,
    overrideAccess: false,
  })
  return toContactInfoDTO(doc)
}

export async function getSiteSettings(): Promise<SiteSettingsDTO> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: false,
  })
  return toSiteSettingsDTO(doc)
}

export async function listDealerships(): Promise<DealershipDTO[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'dealerships',
    limit: 100,
    depth: 0,
    sort: ['state', 'asc', 'city', 'asc'],
    overrideAccess: false,
  })
  return result.docs.map(toDealershipDTO)
}
