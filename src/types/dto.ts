export interface MediaDTO {
  id: string
  url: string
  alt: string
}

export interface CategoryDTO {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: MediaDTO | null
  order?: number
}

export interface SpecRowDTO {
  label: string
  value: string
  group: 'dimensions' | 'performance' | 'general'
  order?: number
}

export interface HighlightDTO {
  title: string
  description: string
  icon?: MediaDTO | null
}

export interface ColorOptionDTO {
  name: string
  hexCode?: string | null
  image?: MediaDTO | null
}

export interface ModelListItemDTO {
  id: string
  name: string
  slug: string
  tagline?: string | null
  summary?: string | null
  category: Pick<CategoryDTO, 'id' | 'name' | 'slug'>
  heroImage?: MediaDTO | null
  featured: boolean
  basePrice?: number | null
  currency?: string | null
  updatedAt?: string | Date | null
}

export interface ModelDetailDTO extends ModelListItemDTO {
  description?: unknown
  design?: unknown
  technology?: unknown
  specs: SpecRowDTO[]
  gallery: { image: MediaDTO; caption?: string | null }[]
  highlights: HighlightDTO[]
  colorOptions: ColorOptionDTO[]
  brochure?: MediaDTO | null
}

export interface AuthorDTO {
  id: string
  name: string
  avatar?: MediaDTO | null
  bio?: string | null
}

export interface TagDTO {
  id: string
  name: string
  slug: string
}

export interface BlogListItemDTO {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: MediaDTO | null
  author?: AuthorDTO | null
  publishedAt: string
  readTimeMinutes: number
  tags: TagDTO[]
  updatedAt?: string | Date | null
}

export interface BlogDetailDTO extends BlogListItemDTO {
  content: unknown
}

export interface AboutPageDTO {
  heading: string
  intro?: unknown
  qualityPolicyHeading: string
  qualityPolicy?: unknown
  signatoryTitle?: string | null
  heroImage?: MediaDTO | null
  stats: { label: string; value: string; order?: number }[]
  gallery: MediaDTO[]
}

export interface ContactInfoDTO {
  phones: { label?: string | null; number: string; order?: number }[]
  emails: string[]
  address?: string | null
  mapLat?: number | null
  mapLng?: number | null
  socialLinks: { platform: string; url: string; order?: number }[]
}

export interface SiteSettingsDTO {
  banner?: string | null
  hotline?: string | null
  financePartnerText?: string | null
}

export interface DealershipDTO {
  id: string
  name: string
  address: string
  city?: string | null
  state?: string | null
  phone?: string | null
  lat?: number | null
  lng?: number | null
}

export interface CreateQuoteRequestInput {
  name: string
  phone: string
  email: string
  address: string
  modelId: string
  message?: string
}

export interface CreateContactMessageInput {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface SubscribeNewsletterInput {
  email: string
  source?: string
}

export interface CreateTestDriveBookingInput {
  name: string
  phone: string
  email: string
  modelId: string
  preferredDate?: string
  dealershipId?: string
  message?: string
  marketingOptIn: boolean
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    message: string
    fieldErrors?: Record<string, string[]>
  }
}

export type ApiResponseBody<T> = ApiSuccess<T> | ApiError
