import type { CollectionConfig } from 'payload'
import {
  isAdmin,
  isEditorOrAdmin,
  readOnlyAfterCreate,
  statusWritableByEditor,
  internalNotesWritableByEditor,
} from '@/access/isAdmin'
import { streamCollectionCSV } from '@/lib/csvExport'


export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    group: 'Submissions',
    description:
      "Submissions from the public 'Contact Us' form. Submitted data is read-only; only status and internal notes are editable.",
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
        const payload = req.payload
        const url = new URL(req.url ?? 'http://localhost/')
        const whereParam = url.searchParams.get('where')
        const where = whereParam ? (JSON.parse(whereParam) as Record<string, unknown>) : undefined
        const sortParam = url.searchParams.get('sort')
        const sort = (sortParam as string) ?? '-createdAt'
        const result = await streamCollectionCSV(payload, req, {
          collection: 'contact-messages',
          sort,
          where,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'subject', label: 'Subject' },
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
      name: 'email',
      type: 'email',
      required: true,
      access: readOnlyAfterCreate,
    },
    {
      name: 'phone',
      type: 'text',
      access: readOnlyAfterCreate,
    },
    {
      name: 'subject',
      type: 'text',
      access: readOnlyAfterCreate,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      access: readOnlyAfterCreate,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Resolved', value: 'resolved' },
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
