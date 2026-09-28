import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isEditorOrAdmin } from '@/access/isAdmin'
import { revalidateDealerships } from '@/lib/revalidate'

export const Dealerships: CollectionConfig = {
  slug: 'dealerships',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'state', 'phone'],
    group: 'Vehicles',
    description: 'Showroom locations used on the test drive booking form.',
  },
  defaultSort: ['state', 'city'],
  access: {
    read: anyone,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateDealerships],
    afterDelete: [revalidateDealerships],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'city', type: 'text' },
    { name: 'state', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'lat',
      type: 'number',
      admin: { position: 'sidebar', step: 0.000001 },
    },
    {
      name: 'lng',
      type: 'number',
      admin: { position: 'sidebar', step: 0.000001 },
    },
  ],
}
