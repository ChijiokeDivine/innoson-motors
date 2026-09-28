import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isEditorOrAdmin } from '@/access/isAdmin'
import { revalidateMedia } from '@/lib/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateMedia],
    afterDelete: [revalidateMedia],
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt text',
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'cloudinaryURL',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: { hidden: true },
    },
  ],
}
