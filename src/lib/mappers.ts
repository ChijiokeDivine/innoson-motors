import type {
  AboutPageDTO,
  AuthorDTO,
  BlogDetailDTO,
  BlogListItemDTO,
  CategoryDTO,
  ColorOptionDTO,
  ContactInfoDTO,
  DealershipDTO,
  HighlightDTO,
  MediaDTO,
  ModelDetailDTO,
  ModelListItemDTO,
  SiteSettingsDTO,
  SpecRowDTO,
  TagDTO,
} from '@/types/dto'

export function toMediaDTO(doc: unknown): MediaDTO | null {
  if (!doc || typeof doc !== 'object') return null
  const d = doc as Record<string, unknown>
  return {
    id: String(d.id),
    url: (d.cloudinaryURL as string) || (d.url as string) || '',
    alt: (d.alt as string) || '',
  }
}

export function toCategoryDTO(doc: unknown): CategoryDTO & { order?: number | null } {
  const d = doc as Record<string, unknown>
  return {
    id: String(d.id),
    name: d.name as string,
    slug: d.slug as string,
    description: (d.description as string) ?? null,
    image: toMediaDTO(d.image),
    order: (d.order as number) ?? null,
  }
}

export function toModelListItemDTO(doc: unknown): ModelListItemDTO {
  const d = doc as Record<string, unknown>
  const cat = d.category
  const catObj = cat && typeof cat === 'object' ? (cat as Record<string, unknown>) : null
  return {
    id: String(d.id),
    name: d.name as string,
    slug: d.slug as string,
    tagline: (d.tagline as string) ?? null,
    summary: (d.summary as string) ?? null,
    category: {
      id: String(catObj?.id ?? cat ?? ''),
      name: (catObj?.name as string) ?? '',
      slug: (catObj?.slug as string) ?? '',
    },
    heroImage: toMediaDTO(d.heroImage),
    featured: Boolean(d.featured),
    basePrice: (d.basePrice as number) ?? null,
    currency: (d.currency as string) ?? null,
    updatedAt: (d.updatedAt as string | Date | undefined) ?? null,
  }
}

export function toModelDetailDTO(doc: unknown): ModelDetailDTO {
  const d = doc as Record<string, unknown>
  const gallery = (d.gallery ?? d.images ?? []) as Record<string, unknown>[]
  const specs = (d.specs ?? []) as Record<string, unknown>[]
  const highlights = (d.highlights ?? []) as Record<string, unknown>[]
  const colorOptions = (d.colorOptions ?? []) as Record<string, unknown>[]
  const base = toModelListItemDTO(doc)
  return {
    ...base,
    description: d.description ?? null,
    design: d.design ?? null,
    technology: d.technology ?? null,
    specs: specs.map((s) => ({
      label: s.label as string,
      value: s.value as string,
      group: (s.group as SpecRowDTO['group']) ?? 'general',
      order: (s.order as number) ?? 0,
    })),
    gallery: gallery.map((row) => ({
      image: toMediaDTO(row.image) as MediaDTO,
      caption: (row.caption as string) ?? null,
    })),
    highlights: highlights.map((h) => ({
      title: h.title as string,
      description: h.description as string,
      icon: toMediaDTO(h.icon),
    })),
    colorOptions: colorOptions.map((c) => ({
      name: c.name as string,
      hexCode: (c.hexCode as string) ?? null,
      image: toMediaDTO(c.image),
    })),
    brochure: toMediaDTO(d.brochure),
  }
}

export function toAuthorDTO(doc: unknown): AuthorDTO | null {
  if (!doc || typeof doc !== 'object') return null
  const d = doc as Record<string, unknown>
  return {
    id: String(d.id),
    name: d.name as string,
    avatar: toMediaDTO(d.avatar),
    bio: (d.bio as string) ?? null,
  }
}

export function toTagDTO(doc: unknown): TagDTO {
  const d = doc as Record<string, unknown>
  return {
    id: String(d.id),
    name: d.name as string,
    slug: d.slug as string,
  }
}

function extractTags(tagsField: unknown): TagDTO[] {
  if (!Array.isArray(tagsField)) return []
  return tagsField
    .map((entry: unknown) => {
      if (entry && typeof entry === 'object') {
        const e = entry as Record<string, unknown>
        if (typeof e.name === 'string') return toTagDTO(entry)
        if (typeof e.tag === 'string') {
          return {
            id: String(e.id ?? e.tag),
            name: e.tag as string,
            slug: e.tag as string,
          } satisfies TagDTO
        }
      }
      return null
    })
    .filter((t): t is TagDTO => Boolean(t))
}

export function toBlogListItemDTO(doc: unknown): BlogListItemDTO {
  const d = doc as Record<string, unknown>
  return {
    id: String(d.id),
    title: d.title as string,
    slug: d.slug as string,
    excerpt: (d.excerpt as string) ?? null,
    coverImage: toMediaDTO(d.coverImage),
    author: toAuthorDTO(d.author),
    publishedAt: (d.publishedAt as string) || (d.publishedDate as string) || '',
    readTimeMinutes: (d.readTimeMinutes as number) ?? 1,
    tags: extractTags(d.tags),
    updatedAt: (d.updatedAt as string | Date | undefined) ?? null,
  }
}

export function toBlogDetailDTO(doc: unknown): BlogDetailDTO {
  const d = doc as Record<string, unknown>
  return {
    ...toBlogListItemDTO(doc),
    content: d.content,
  }
}

export function toAboutPageDTO(doc: unknown): AboutPageDTO {
  const d = doc as Record<string, unknown>
  const stats = (d.stats ?? []) as Record<string, unknown>[]
  const gallery = (d.gallery ?? []) as Record<string, unknown>[]
  return {
    heading: d.heading as string,
    intro: d.intro ?? null,
    qualityPolicyHeading: d.qualityPolicyHeading as string,
    qualityPolicy: d.qualityPolicy ?? null,
    signatoryTitle: (d.signatoryTitle as string) ?? null,
    heroImage: toMediaDTO(d.heroImage),
    stats: stats.map((s) => ({
      label: s.label as string,
      value: s.value as string,
      order: (s.order as number) ?? 0,
    })),
    gallery: gallery
      .map((g) => toMediaDTO(g.image))
      .filter((m): m is MediaDTO => Boolean(m)),
  }
}

export function toContactInfoDTO(doc: unknown): ContactInfoDTO {
  const d = doc as Record<string, unknown>
  const phones = (d.phones ?? []) as Record<string, unknown>[]
  const emails = (d.emails ?? []) as Record<string, unknown>[]
  const socials = (d.socialLinks ?? []) as Record<string, unknown>[]
  return {
    phones: phones.map((p) => ({
      label: (p.label as string) ?? null,
      number: p.number as string,
    })),
    emails: emails.map((e) => e.email as string),
    address: (d.address as string) ?? null,
    mapLat: (d.mapLat as number) ?? null,
    mapLng: (d.mapLng as number) ?? null,
    socialLinks: socials.map((s) => ({
      platform: s.platform as string,
      url: s.url as string,
    })),
  }
}

export function toSiteSettingsDTO(doc: unknown): SiteSettingsDTO {
  const d = doc as Record<string, unknown>
  return {
    banner: (d.banner as string) ?? null,
    hotline: (d.hotline as string) ?? null,
    financePartnerText: (d.financePartnerText as string) ?? null,
  }
}

export function toDealershipDTO(doc: unknown): DealershipDTO {
  const d = doc as Record<string, unknown>
  return {
    id: String(d.id),
    name: d.name as string,
    address: d.address as string,
    city: (d.city as string) ?? null,
    state: (d.state as string) ?? null,
    phone: (d.phone as string) ?? null,
    lat: (d.lat as number) ?? null,
    lng: (d.lng as number) ?? null,
  }
}
