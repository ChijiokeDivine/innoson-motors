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

export const Newsletter: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'createdAt'],
    group: 'Submissions',
    description:
      'Newsletter signups. Email is unique; unsubscribed entries can be re-activated by the server-side API.',
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
          collection: 'newsletter-subscribers',
          sort,
          where,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' },
            { key: 'source', label: 'Source' },
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
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      access: readOnlyAfterCreate,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'subscribed',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: { position: 'sidebar' },
      access: statusWritableByEditor,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description:
          'Optional: which page/section the signup came from (footer, pop-up, blog).',
      },
      access: readOnlyAfterCreate,
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
