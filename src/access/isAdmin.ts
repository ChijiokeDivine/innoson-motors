import type { Access, FieldAccess } from 'payload'

type UserWithRole = {
  id: string | number
  role?: 'admin' | 'editor'
}

export function hasRole(user: unknown, role: 'admin' | 'editor'): boolean {
  return Boolean(user) && (user as UserWithRole).role === role
}

export function isAuthenticated(user: unknown): boolean {
  return Boolean(user)
}

export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

export const isEditorOrAdmin: Access = ({ req: { user } }) => isAuthenticated(user)

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

export const isEditorOrAdminField: FieldAccess = ({ req: { user } }) => isAuthenticated(user)

export const anyone: Access = () => true

export function publishedOnly(): Access {
  return ({ req: { user } }) => {
    if (isAuthenticated(user)) return true
    return { _status: { equals: 'published' } } as const
  }
}

export function noAnonymous(): Access {
  return isEditorOrAdmin
}

export function readAnyWriteAdmin(): { read: Access; create: Access; update: Access; delete: Access } {
  return { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin }
}

export function readAnyWriteEditor(): {
  read: Access
  create: Access
  update: Access
  delete: Access
} {
  return { read: anyone, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isAdmin }
}

export function submissionsAccess(): {
  read: Access
  create: Access
  update: Access
  delete: Access
} {
  return {
    read: isEditorOrAdmin,
    create: isAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  }
}

// Instead of checking `operation` inside a single FieldAccess function,
// map them to the field's `access: { read, create, update }` object directly:
export const readOnlyAfterCreate: {
  read: FieldAccess
  create: FieldAccess
  update: FieldAccess
} = {
  read: ({ req: { user } }) => isAuthenticated(user),
  create: ({ req: { user } }) => hasRole(user, 'admin'),
  update: () => false,
}

export const statusWritableByEditor: {
  read: FieldAccess
  create: FieldAccess
  update: FieldAccess
} = {
  read: ({ req: { user } }) => isAuthenticated(user),
  create: ({ req: { user } }) => hasRole(user, 'admin'),
  update: ({ req: { user } }) => isAuthenticated(user),
}

export const internalNotesWritableByEditor: {
  read: FieldAccess
  create: FieldAccess
  update: FieldAccess
} = {
  read: ({ req: { user } }) => isAuthenticated(user),
  create: ({ req: { user } }) => hasRole(user, 'admin'),
  update: ({ req: { user } }) => isAuthenticated(user),
}