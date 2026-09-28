import { z } from 'zod'
import { HONEYPOT_FIELD } from '@/lib/honeypot'

const nigerianPhone = /^(?:\+234|234)?[0-9]{10,11}$|^0[0-9]{10}$/

const phoneLike = (value: string): boolean => {
  const digits = value.replace(/[^0-9]/g, '')
  return digits.length >= 7 && digits.length <= 20
}

const honeypotShape = {
  [HONEYPOT_FIELD]: z
    .string()
    .max(0, 'This field must remain empty')
    .optional()
    .or(z.literal('')),
}

export const createQuoteRequestSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number')
      .max(20)
      .refine(phoneLike, 'Phone number contains invalid characters'),
    email: z.string().trim().email('Enter a valid email address'),
    address: z.string().trim().min(5, 'Address is too short').max(500),
    modelId: z.string().trim().min(1, 'modelId is required'),
    message: z.string().trim().max(2000).optional(),
    ...honeypotShape,
  })
  .strip()
export type CreateQuoteRequestBody = z.infer<typeof createQuoteRequestSchema>

export const createContactMessageSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z
      .string()
      .trim()
      .max(20)
      .refine((v) => v === '' || phoneLike(v), 'Enter a valid phone number')
      .optional()
      .or(z.literal('')),
    subject: z.string().trim().max(150).optional(),
    message: z.string().trim().min(5, 'Message is too short').max(3000),
    ...honeypotShape,
  })
  .strip()
export type CreateContactMessageBody = z.infer<typeof createContactMessageSchema>

export const subscribeNewsletterSchema = z
  .object({
    email: z.string().trim().email('Enter a valid email address'),
    source: z.string().trim().max(120).optional(),
    ...honeypotShape,
  })
  .strip()
export type SubscribeNewsletterBody = z.infer<typeof subscribeNewsletterSchema>

export const createTestDriveBookingSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number')
      .max(20)
      .refine(phoneLike, 'Enter a valid phone number'),
    email: z.string().trim().email('Enter a valid email address'),
    modelId: z.string().trim().min(1, 'Please select a vehicle'),
    preferredDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
      .optional(),
    dealershipId: z.string().trim().min(1).optional(),
    message: z.string().trim().max(3000).optional(),
    marketingOptIn: z.boolean().default(false),
    ...honeypotShape,
  })
  .strip()
export type CreateTestDriveBookingBody = z.infer<typeof createTestDriveBookingSchema>

export const listModelsQuerySchema = z.object({
  category: z.string().trim().optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  page: z.coerce.number().int().min(1).default(1),
})

export const listBlogQuerySchema = z.object({
  tag: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
})
