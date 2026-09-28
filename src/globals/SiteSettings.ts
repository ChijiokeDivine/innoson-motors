import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'
import { revalidateAllFor, REVALIDATE_TAGS } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
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
        [REVALIDATE_TAGS.siteSettings, REVALIDATE_TAGS.home, REVALIDATE_TAGS.sitemap],
        ['/'],
      ),
    ],
  },
  fields: [
    {
      name: 'banner',
      type: 'text',
      admin: {
        description:
          'Optional announcement banner shown at the very top of the page. Leave blank to disable.',
      },
    },
    {
      name: 'hotline',
      type: 'text',
      admin: {
        description:
          'Short "hotline" CTA shown in the header / finance banner (e.g. "Call 0700-IVM-SALES").',
      },
    },
    {
      name: 'financePartnerText',
      type: 'textarea',
      admin: {
        description:
          'Small print on the Payment/Finance banner: partner names, T&Cs, etc.',
      },
    },
  ],
}
