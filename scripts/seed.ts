import 'dotenv/config'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { plainTextToLexical } from '../src/lib/lexical'

type Sluggable = { name: string; slug?: string }

const slugify = (s: string): string =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const now = new Date().toISOString()
function parseNigerianDate(s: string): string {
  // "20th June 2026" -> ISO yyyy-mm-dd
  const m = s.match(/(\d+)\s+([A-Za-z]+)\s+(\d{4})/)
  if (!m) return new Date(s).toISOString()
  const day = Number(m[1])
  const monthMap: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  }
  const month = monthMap[m[2]] ?? 0
  const year = Number(m[3])
  return new Date(Date.UTC(year, month, day, 12, 0, 0)).toISOString()
}

const CATEGORIES = [
  { name: 'Cars', slug: 'cars', order: 1 },
  { name: 'MPV', slug: 'mpv', order: 2 },
  { name: 'Pickup', slug: 'pickup', order: 3 },
  { name: 'SUVs', slug: 'suvs', order: 4 },
  { name: 'Buses', slug: 'buses', order: 5 },
  { name: 'Electric', slug: 'electric', order: 6 },
]

const AUTHORS = [
  { name: 'Nneka Okoli', bio: 'Senior correspondent covering manufacturing, finance, and IVM product launches.' },
  { name: 'Chidi Eze', bio: 'Auto reviewer — long-form drives and hands-on deep-dives into each IVM line.' },
  { name: 'Amara Nwosu', bio: 'Supply-chain analyst and long-time observer of the Nigerian automotive ecosystem.' },
  { name: 'Tunde Bakare', bio: 'Customer experience editor and IVM brand historian.' },
]

const TAGS = [
  { name: 'EV', slug: 'ev' },
  { name: 'Manufacturing', slug: 'manufacturing' },
  { name: 'Export', slug: 'export' },
  { name: 'Service', slug: 'service' },
  { name: 'Financing', slug: 'financing' },
  { name: 'Driving Review', slug: 'driving-review' },
  { name: 'Supply Chain', slug: 'supply-chain' },
  { name: 'Company', slug: 'company' },
]

const ARTICLES = [
  {
    slug: 'all-you-need-to-know-about-the-innoson-evm-vehicles',
    readTime: 15,
    title: 'All you need to know about the innoson EVM vehicles',
    author: 'Nneka Okoli',
    date: '20th June 2026',
    tags: ['EV', 'Manufacturing'],
  },
  {
    slug: 'innoson-caris-production-milestone',
    readTime: 8,
    title: 'IVM hits a new production milestone with the Caris line',
    author: 'Chidi Eze',
    date: '14th June 2026',
    tags: ['Manufacturing', 'Company'],
  },
  {
    slug: 'made-in-nigeria-export-plans',
    readTime: 6,
    title: 'Made in Nigeria: IVM\'s plans to export across West Africa',
    author: 'Amara Nwosu',
    date: '9th June 2026',
    tags: ['Export', 'Company'],
  },
  {
    slug: 'ivm-service-centers-expansion',
    readTime: 5,
    title: 'IVM opens three new service centers across the South-East',
    author: 'Tunde Bakare',
    date: '2nd June 2026',
    tags: ['Service'],
  },
  {
    slug: 'flexible-financing-access-bank',
    readTime: 7,
    title: 'How IVM\'s partnership with Access Bank makes ownership easier',
    author: 'Nneka Okoli',
    date: '27th May 2026',
    tags: ['Financing'],
  },
  {
    slug: 'innoson-fox-driving-experience',
    readTime: 10,
    title: 'Behind the wheel: a first drive of the Innoson Fox',
    author: 'Chidi Eze',
    date: '19th May 2026',
    tags: ['Driving Review'],
  },
  {
    slug: 'local-parts-manufacturing-update',
    readTime: 9,
    title: 'Zero imported parts: an update on IVM\'s local supply chain',
    author: 'Amara Nwosu',
    date: '11th May 2026',
    tags: ['Supply Chain', 'Manufacturing'],
  },
  {
    slug: 'ivm-motorcycle-legacy',
    readTime: 12,
    title: 'From motorcycles to automobiles: revisiting IVM\'s founding story',
    author: 'Tunde Bakare',
    date: '3rd May 2026',
    tags: ['Company', 'Manufacturing'],
  },
]

const LOREM_SHORT =
  'Lorem ipsum dolor sit amet consectetur. Integer cursus eu aliquam cras nunc. Malesuada eu ultrices venenatis viverra nam integer in feugiat. Ipsum viverra id quam id leo sed. Malesuada eu ultrices venenatis viverra nam integer in feugiat. Ipsum viverra id……'

const DESIGN_BODY = `Improved Exhaust Tech – IVM improved exhaust helps to create that energetic performance needed to drive through long distance while maintaining optimal stability. It also helps to conserve your fuel efficiently, cools the temperature of the engine and allows the engine to breathe better.

Adjustable passenger seats – IVM Caris gives you the finesse and peace you need while driving. There is a great need for your muscles to be well relaxed while driving; there is no room for discomfort while cruising with IVM Caris.

Air Conditioned leather seats – each drive with IVM Caris is a memorable experience. The air conditioned leather seats create a lush feel and extreme relaxation while driving.

Standard LED front lights – we used the latest technology in automotive lighting technology. No need to be frustrated with dull lights while driving. Power through the dark, your vision and balance are secured.

Enhanced multimedia experience – play your favorite sounds with the inbuilt modern multimedia system in IVM Caris. You can connect your multimedia devices while driving.

Automatic folding side mirrors – you can park comfortably without bothering about accidental smashing of your side mirrors.

Front and rear airbags – the front and rear airbags are there to prevent fatal injuries if there is an unexpected crash.`

const SHOWROOMS = [
  { name: 'IVM Abuja Showroom', address: 'Edwin Medani Crescent, By St Martins Catholic Church, Back of VIO Office, Mabuchi Abuja', city: 'Abuja', state: 'FCT', phone: '07049087160' },
  { name: 'IVM Lagos MainLand Service Center', address: '39 Alh Tokan Street, Alaka Estate, Surulere', city: 'Lagos', state: 'Lagos', phone: '08037222939' },
  { name: 'IVM Lagos Island Service Center', address: 'Lekki/Ajah express Way, After Cosharis Ibeju Lekki', city: 'Lagos', state: 'Lagos', phone: '09138177285' },
  { name: 'IVM Enugu Service Center', address: 'Enugu Abakaliki Express Way, After Mobil Filling Station, Emene, Enugu State', city: 'Enugu', state: 'Enugu', phone: '08122202053' },
]

const FACTORY_ADDRESS = 'No 2 Innoson Industrial Estate, Akwa-Uru, Uru Umudim, Nnewi, Anambra State'
const PHONE_NUMBERS = [
  { label: 'Sales Hotline', number: '07049087160', order: 1 },
  { label: 'Customer Care', number: '08037222939', order: 2 },
  { label: 'Service Booking', number: '09138177285', order: 3 },
  { label: 'Factory', number: '08122202053', order: 4 },
  { label: 'Spare Parts', number: '09020984374', order: 5 },
  { label: 'Finance Partners', number: '08054459560', order: 6 },
]

const EMAIL_CONTACTS = [
  { email: 'Enquiries@innosonmotors.com', order: 1 },
  { email: 'Sales@innosonmotors.com', order: 2 },
  { email: 'Support@innosonmotors.com', order: 3 },
]

const SOCIAL_LINKS = [
  { platform: 'facebook', url: 'https://facebook.com/innosonmotors', order: 1 },
  { platform: 'twitter', url: 'https://twitter.com/innosonmotors', order: 2 },
  { platform: 'instagram', url: 'https://instagram.com/innosonmotors', order: 3 },
  { platform: 'youtube', url: 'https://youtube.com/@innosonmotors', order: 4 },
  { platform: 'linkedin', url: 'https://linkedin.com/company/innoson-motors', order: 5 },
  { platform: 'tiktok', url: 'https://tiktok.com/@innosonmotors', order: 6 },
]

const STATS = [
  { label: 'Years of manufacturing', value: '20+', order: 1 },
  { label: 'Vehicle models in range', value: '15', order: 2 },
  { label: 'Showrooms nationwide', value: '12', order: 3 },
  { label: 'Locally sourced parts', value: '90%', order: 4 },
]

async function findOrCreate<T extends Sluggable>(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
  doc: T & Record<string, unknown>,
  by: 'slug' | 'name' = 'slug',
) {
  const keyValue =
    by === 'slug'
      ? doc.slug || slugify(doc.name)
      : (doc as Record<string, unknown>)[by]
  const existing = await payload.find({
    collection: collection as never,
    where: ({ [by]: { equals: keyValue } }) as never,
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    const id = String(existing.docs[0].id)
    return payload.update({
      collection: collection as never,
      id,
      data: doc as never,
    })
  }
  return payload.create({
    collection: collection as never,
    data: doc as never,
  })
}

async function ensureAdminUser(payload: Awaited<ReturnType<typeof getPayload>>) {
  const email = process.env.ADMIN_EMAIL?.trim()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    console.error('[seed] Missing ADMIN_EMAIL or ADMIN_PASSWORD in env. See .env.example.')
    process.exit(1)
  }
  if (password.length < 12) {
    console.error('[seed] ADMIN_PASSWORD must be at least 12 characters long.')
    process.exit(1)
  }
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    console.log(`[seed] Admin user ${email} exists — updating password + name`)
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: { password, role: 'admin', name: 'Default Admin' },
    })
  } else {
    console.log(`[seed] Creating admin user ${email}`)
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role: 'admin',
        name: 'Default Admin',
      },
    })
  }
}

async function run() {
  const payload = await getPayload({ config })

  await ensureAdminUser(payload)

  console.log('[seed] Categories…')
  const createdCategories = new Map<string, string>()
  for (const c of CATEGORIES) {
    const r = await findOrCreate(payload, 'categories', {
      name: c.name,
      slug: c.slug,
      order: c.order,
      description: `Browse our full range of ${c.name.toLowerCase()}.`,
    })
    createdCategories.set(c.slug, String(r.id))
  }

  console.log('[seed] Authors…')
  const authorsBy = new Map<string, string>()
  for (const a of AUTHORS) {
    const slug = slugify(a.name)
    const r = await findOrCreate(payload, 'authors', {
      name: a.name,
      slug,
      bio: a.bio,
    })
    authorsBy.set(a.name, String(r.id))
  }

  console.log('[seed] Tags…')
  const tagsBy = new Map<string, string>()
  for (const t of TAGS) {
    const r = await findOrCreate(payload, 'tags', t)
    tagsBy.set(t.name, String(r.id))
  }

  console.log('[seed] Dealerships…')
  for (const d of SHOWROOMS) {
    await findOrCreate(
      payload,
      'dealerships',
      { ...d },
      'name',
    )
  }

  console.log('[seed] Model: INNOSON Caris…')
  const carisId = createdCategories.get('suvs')!
  await (async () => {
    const SLUG = 'caris'
    const existing = await payload.find({
      collection: 'models',
      where: { slug: { equals: SLUG } },
      limit: 1,
      depth: 0,
    })
    const specs = [
      { label: 'Engine Capacity', value: '2.4L 4-Cylinder Petrol', group: 'performance', order: 1 },
      { label: 'Transmission', value: '6-Speed Automatic', group: 'performance', order: 2 },
      { label: 'Drive Type', value: '4x2 (FWD) — 4x4 optional', group: 'performance', order: 3 },
      { label: 'Seating', value: '5 seats', group: 'general', order: 4 },
      { label: 'Fuel Tank', value: '60L', group: 'general', order: 5 },
      { label: 'Length', value: '4,695 mm', group: 'dimensions', order: 6 },
      { label: 'Width', value: '1,820 mm', group: 'dimensions', order: 7 },
      { label: 'Height', value: '1,505 mm', group: 'dimensions', order: 8 },
      { label: 'Wheelbase', value: '2,710 mm', group: 'dimensions', order: 9 },
    ]
    const gallery = [
      { caption: 'Front three-quarter view', order: 1 },
      { caption: 'Interior cabin', order: 2 },
      { caption: 'Rear three-quarter view', order: 3 },
    ]
    const highlights = [
      { title: 'Improved Exhaust Tech', description: 'Optimized long-distance efficiency without sacrificing pull.', order: 1 },
      { title: 'Air-conditioned leather seats', description: 'Every seat benefits from independent vents and premium leather finish.', order: 2 },
      { title: 'Front & rear airbags', description: 'Dual-stage front bags plus side curtain coverage at both rows.', order: 3 },
      { title: 'LED projector lighting', description: 'Standard LED headlamps with auto-leveling and daytime running lamps.', order: 4 },
    ]
    const colorOptions = [
      { name: 'Deep Ocean Blue', hexCode: '#005eb8', order: 1 },
      { name: 'Ivory White', hexCode: '#f5f5f5', order: 2 },
      { name: 'Granite Grey', hexCode: '#4a4a4a', order: 3 },
      { name: 'Signature Red', hexCode: '#b71c1c', order: 4 },
    ]
    const data = {
      name: 'INNOSON Caris',
      slug: SLUG,
      category: carisId,
      tagline: 'Bold and elegant.',
      summary: '4x2 — 2.4L / Automatic / 5 Seats',
      description: plainTextToLexical(
        'IVM Caris embodies the beauty you want to explore in a car and the strength you need to sustain the experience. With a captivating sleeker design, it was produced to give you the all-encompassing comfort, sophistication, and experience you crave in a modern car.',
      ),
      design: plainTextToLexical(DESIGN_BODY),
      technology: plainTextToLexical(
        'Reverse camera with dynamic parking lines, automatic folding side mirrors, a 10-inch multimedia unit with Apple CarPlay and Android Auto compatibility, cruise control, hill-start assist, and tyre-pressure monitoring all come standard on the Caris line.',
      ),
      specs,
      gallery,
      highlights,
      colorOptions,
      currency: 'NGN',
      basePrice: 12500000,
      featured: true,
      order: 1,
      _status: 'published' as const,
    }
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'models',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({ collection: 'models', data })
    }
  })()

  console.log('[seed] Blog posts…')
  for (const a of ARTICLES) {
    const existing = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: a.slug } },
      limit: 1,
      depth: 0,
    })
    const author = authorsBy.get(a.author)
    const tagIds = a.tags.map((t) => tagsBy.get(t)).filter(Boolean) as string[]
    const body = `# ${a.title}\n\n${LOREM_SHORT}\n\n${LOREM_SHORT}\n\n${LOREM_SHORT}\n\n${LOREM_SHORT}`
    const data = {
      title: a.title,
      slug: a.slug,
      excerpt: LOREM_SHORT,
      content: plainTextToLexical(body),
      author,
      tags: tagIds,
      publishedAt: parseNigerianDate(a.date),
      readTimeMinutes: a.readTime,
      _status: 'published' as const,
    }
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'blog-posts', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'blog-posts', data })
    }
  }

  console.log('[seed] Globals: About Page…')
  {
    const aboutIntro = plainTextToLexical(
      'Innoson Vehicle Manufacturing Co. Ltd. (IVM) is the first privately-owned indigenous automobile manufacturing company in Nigeria, and the largest in West Africa. Since 2007, our Nnewi plant has rolled out thousands of cars, SUVs, MPVs, pickup trucks, buses and EVs — all designed, stamped, welded, painted and assembled right here in Nigeria.',
    )
    const qualityPolicy = plainTextToLexical(
      'It is the policy of Innoson Vehicle Manufacturing Co. Ltd. to design, produce and deliver motor vehicles and after-sales services that consistently meet the requirements of our customers. We commit to compliance with all relevant statutory and regulatory requirements, and to the continuous improvement of the quality management system through measurable quality objectives reviewed at every management meeting.',
    )
    await payload.updateGlobal({
      slug: 'about-page',
      data: {
        heading: 'About Innoson Vehicles',
        intro: aboutIntro,
        qualityPolicyHeading: 'Quality Policy',
        qualityPolicy,
        signatoryTitle: 'Chairman/Chief Executive Officer',
        stats: STATS,
        gallery: [],
      },
    })
  }

  console.log('[seed] Globals: Contact Info…')
  {
    await payload.updateGlobal({
      slug: 'contact-info',
      data: {
        phones: PHONE_NUMBERS,
        emails: EMAIL_CONTACTS,
        address: FACTORY_ADDRESS,
        mapLat: 6.015,
        mapLng: 6.9157,
        socialLinks: SOCIAL_LINKS,
      },
    })
  }

  console.log('[seed] Globals: Site Settings…')
  {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        banner: '',
        hotline: 'Call 0700-IVM-SALES for enquiries, pricing and test-drive bookings.',
        financePartnerText:
          'Flexible vehicle-finance in partnership with Access Bank, Fidelity Bank, and other authorized finance partners. Terms and conditions apply.',
      },
    })
  }

  console.log('[seed] Done at ' + now)
}

run().catch((err) => {
  console.error('[seed] FATAL:', err)
  process.exit(1)
})
