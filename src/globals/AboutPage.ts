import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'
import { revalidateAllFor, REVALIDATE_TAGS } from '@/lib/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
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
        [REVALIDATE_TAGS.aboutPage, REVALIDATE_TAGS.sitemap],
        ['/', '/about'],
      ) as unknown as GlobalAfterChangeHook,
    ],
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'About Innoson Vehicles' },
    { name: 'intro', type: 'richText' },
    {
      name: 'qualityPolicyHeading',
      type: 'text',
      defaultValue: 'Quality Policy',
    },
    { name: 'qualityPolicy', type: 'richText' },
    {
      name: 'signatoryTitle',
      type: 'text',
      defaultValue: 'Chairman/Chief Executive Officer',
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      type: 'array',
      label: 'Highlight stats',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}