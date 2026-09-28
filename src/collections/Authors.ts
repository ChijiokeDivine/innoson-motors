import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isEditorOrAdmin } from '@/access/isAdmin'
import { revalidateAuthors } from '@/lib/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateAuthors],
    afterDelete: [revalidateAuthors],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
  ],
}