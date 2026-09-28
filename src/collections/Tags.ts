import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isEditorOrAdmin } from '@/access/isAdmin'
import { autoSlugFrom } from '@/lib/slug'
import { revalidateTags } from '@/lib/revalidate'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [autoSlugFrom('name', 'slug')],
    afterChange: [revalidateTags],
    afterDelete: [revalidateTags],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name.',
      },
    },
  ],
}
