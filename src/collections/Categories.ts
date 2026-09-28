import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isEditorOrAdmin } from '@/access/isAdmin'
import { autoSlugFrom } from '@/lib/slug'
import { revalidateCategories } from '@/lib/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Vehicles',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [autoSlugFrom('name', 'slug')],
    afterChange: [revalidateCategories],
    afterDelete: [revalidateCategories],
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
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
