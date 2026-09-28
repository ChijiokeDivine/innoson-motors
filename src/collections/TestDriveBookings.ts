import type { CollectionConfig } from 'payload'
import {
  isAdmin,
  isEditorOrAdmin,
  readOnlyAfterCreate,
  statusWritableByEditor,
  internalNotesWritableByEditor,
} from '@/access/isAdmin'
import { streamCollectionCSV } from '@/lib/csvExport'
import { getPayloadClient } from '@/lib/getPayloadClient'

export const TestDriveBookings: CollectionConfig = {
  slug: 'test-drive-bookings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'phone', 'email', 'preferredDate', 'status', 'createdAt'],
    group: 'Submissions',
    description: 'Book-a-test-drive submissions from the two-step public form.',
  },
  defaultSort: '-createdAt',
  access: {
    read: isEditorOrAdmin,
    create: isAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        const user = req.user
        if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const payload = await getPayloadClient()
        const url = new URL(req.url ?? 'http://localhost/')
        const whereParam = url.searchParams.get('where')
        const where = whereParam ? (JSON.parse(whereParam) as Record<string, unknown>) : undefined
        const sortParam = url.searchParams.get('sort')
        const sort = (sortParam as string) ?? '-createdAt'
        const result = await streamCollectionCSV(payload, req, {
          collection: 'test-drive-bookings',
          sort,
          where,
          depth: 1,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            {
              key: 'model',
              label: 'Model',
              resolve: (d) => {
                const m = d.model as Record<string, unknown> | undefined
                return m?.name ?? d.modelId ?? ''
              },
            },
            { key: 'preferredDate', label: 'Preferred Date' },
            {
              key: 'dealership',
              label: 'Dealership',
              resolve: (d) => {
                const dl = d.dealership as Record<string, unknown> | undefined
                return dl?.name ?? d.dealershipId ?? ''
              },
            },
            { key: 'message', label: 'Message' },
            { key: 'marketingOptIn', label: 'Marketing Opt-In' },
            { key: 'status', label: 'Status' },
            { key: 'internalNotes', label: 'Internal Notes' },
            { key: 'createdAt', label: 'Created At' },
            { key: 'updatedAt', label: 'Updated At' },
          ],
        })
        return new Response(result.stream, {
          status: result.status,
          headers: result.headers,
        })
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      access: readOnlyAfterCreate,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      access: readOnlyAfterCreate,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      access: readOnlyAfterCreate,
    },
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
      required: true,
      access: readOnlyAfterCreate,
    },
    {
      name: 'preferredDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Optional requested date; staff will confirm.',
      },
      access: readOnlyAfterCreate,
    },
    {
      name: 'dealership',
      type: 'relationship',
      relationTo: 'dealerships',
      access: readOnlyAfterCreate,
    },
    {
      name: 'message',
      type: 'textarea',
      access: readOnlyAfterCreate,
    },
    {
      name: 'marketingOptIn',
      type: 'checkbox',
      defaultValue: false,
      access: readOnlyAfterCreate,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
      access: statusWritableByEditor,
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Staff-only notes. Never shown publicly.',
      },
      access: internalNotesWritableByEditor,
    },
  ],
}
