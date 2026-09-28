import type { CollectionConfig } from 'payload'
import { isAdmin, isEditorOrAdmin, publishedOnly } from '@/access/isAdmin'
import { autoSlugFrom } from '@/lib/slug'
import { revalidateModels } from '@/lib/revalidate'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured', 'order', 'updatedAt'],
    group: 'Vehicles',
  },
  defaultSort: 'order',
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
    beforeValidate: [autoSlugFrom('name', 'slug')],
    afterChange: [revalidateModels],
    afterDelete: [revalidateModels],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "INNOSON G80"' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-safe id, e.g. "g80". Auto-generated from name.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'e.g. "What a luxury SUV should be."' },
    },
    {
      name: 'summary',
      type: 'text',
      admin: {
        description:
          'Short one-liner, e.g. "4x4-2.4L / Automatic / 5 Seats"',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: { description: 'Full marketing description / overview copy.' },
    },
    {
      name: 'design',
      type: 'richText',
      admin: { description: 'The "Design" tab copy on the model page.' },
    },
    {
      name: 'technology',
      type: 'richText',
      admin: {
        description: 'The "Technology" tab copy / feature highlights.',
      },
    },
    {
      name: 'specs',
      type: 'array',
      label: 'Specifications',
      labels: { singular: 'Spec', plural: 'Specs' },
      admin: {
        description:
          'Key/value spec rows, e.g. "Engine Capacity" / "3.0 Turbocharged"',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        {
          name: 'group',
          type: 'select',
          defaultValue: 'general',
          options: [
            { label: 'Dimensions', value: 'dimensions' },
            { label: 'Engine & Performance', value: 'performance' },
            { label: 'General', value: 'general' },
          ],
        },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Main hero/banner image for the model page.' },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery images',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
      admin: {
        description: 'Array order = display order on the model page.',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Feature highlights',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'colorOptions',
      type: 'array',
      label: 'Color / trim options',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'hexCode', type: 'text' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'brochure',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional downloadable PDF brochure.' },
    },
    {
      name: 'basePrice',
      type: 'number',
      admin: { description: 'Optional, in Naira. Leave blank to show "Contact us".' },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'NGN',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage highlights.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
