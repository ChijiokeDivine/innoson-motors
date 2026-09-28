import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Categories } from '@/collections/Categories'
import { Models } from '@/collections/Models'
import { Authors } from '@/collections/Authors'
import { BlogPosts } from '@/collections/BlogPosts'
import { Tags } from '@/collections/Tags'
import { Dealerships } from '@/collections/Dealerships'
import { QuoteRequests } from '@/collections/QuoteRequests'
import { ContactMessages } from '@/collections/ContactMessages'
import { Newsletter } from '@/collections/Newsletter'
import { TestDriveBookings } from '@/collections/TestDriveBookings'
import { AboutPage } from '@/globals/AboutPage'
import { ContactInfo } from '@/globals/ContactInfo'
import { SiteSettings } from '@/globals/SiteSettings'
import { cloudinaryAdapter } from '@/lib/cloudinaryStorage'
import AdminDashboard from '@/components/admin/Dashboard'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Innoson Motors Admin',
      icons: [{ rel: 'icon', url: '/favicon.ico' }],
    },
    components: {
      beforeDashboard: [AdminDashboard as never],
    },
  },
  sharp,
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    schemaName: 'payload', // ← add this
  }),
  collections: [
    Users,
    Media,
    Categories,
    Models,
    Authors,
    BlogPosts,
    Tags,
    Dealerships,
    QuoteRequests,
    ContactMessages,
    Newsletter,
    TestDriveBookings,
  ],
  globals: [AboutPage, ContactInfo, SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    disable: true,
  },
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter(),
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
})
