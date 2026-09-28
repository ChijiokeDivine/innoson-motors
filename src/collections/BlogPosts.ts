import type { CollectionConfig } from 'payload'
import { isAdmin, isEditorOrAdmin, publishedOnly } from '@/access/isAdmin'
import { autoSlugFrom } from '@/lib/slug'
import { revalidateBlogPosts } from '@/lib/revalidate'
import { calculateReadTimeMinutes, lexicalToPlainText } from '@/lib/readTime'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'readTimeMinutes', 'updatedAt'],
    group: 'Content',
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOnly(),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [autoSlugFrom('title', 'slug')],
    beforeChange: [
      ({ data }) => {
        if (data?.content) {
          const plain = lexicalToPlainText(data.content)
          ;(data as Record<string, unknown>).readTimeMinutes =
            calculateReadTimeMinutes(plain)
        }
        return data
      },
    ],
    afterChange: [revalidateBlogPosts],
    afterDelete: [revalidateBlogPosts],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title, still editable.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on the blog listing/cards.',
      },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true },
    { name: 'author', type: 'relationship', relationTo: 'authors' },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'readTimeMinutes',
      type: 'number',
      admin: {
        position: 'sidebar',
        description:
          'Auto-calculated from content on save (~200 words/min). Editable if needed.',
      },
    },
  ],
}
