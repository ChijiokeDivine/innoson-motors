import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isEditorOrAdminField } from '@/access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: false,
    verify: false,
    maxLoginAttempts: 10,
    lockTime: 600_000,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
    group: 'Users',
    hidden: ({ user }) => !(user?.role === 'admin'),
  },
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Admin: full access. Editor: manage content + submissions, no user management, no delete on submissions.',
      },
      access: {
        create: isAdminField,
        update: isAdminField,
        read: isEditorOrAdminField,
      },
    },
  ],
}
