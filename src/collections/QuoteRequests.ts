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

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'phone', 'email', 'status', 'createdAt'],
    group: 'Submissions',
    description:
      '"Get a Quote" submissions associated with a specific vehicle model.',
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
          collection: 'quote-requests',
          sort,
          where,
          depth: 1,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'address', label: 'Address' },
            {
              key: 'model',
              label: 'Model',
              resolve: (d) => {
                const m = d.model as Record<string, unknown> | undefined
                return m?.name ?? d.modelId ?? ''
              },
            },
            { key: 'message', label: 'Message' },
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
      name: 'address',
      type: 'text',
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
      name: 'message',
      type: 'textarea',
      access: readOnlyAfterCreate,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
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
