import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'
import { revalidateAllFor, REVALIDATE_TAGS } from '@/lib/revalidate'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  admin: {
    group: 'Content',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      revalidateAllFor(
        [REVALIDATE_TAGS.contactInfo, REVALIDATE_TAGS.home, REVALIDATE_TAGS.sitemap],
        ['/', '/contact'],
      ),
    ],
  },
  fields: [
    {
      name: 'phones',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'number', type: 'text', required: true },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'emails',
      type: 'array',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
    { name: 'address', type: 'textarea' },
    {
      name: 'mapLat',
      type: 'number',
      admin: { step: 0.000001, position: 'sidebar' },
    },
    {
      name: 'mapLng',
      type: 'number',
      admin: { step: 0.000001, position: 'sidebar' },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            'facebook',
            'twitter',
            'instagram',
            'youtube',
            'linkedin',
            'tiktok',
          ],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
