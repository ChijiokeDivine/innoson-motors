import { revalidateTag, revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const REVALIDATE_TAGS = {
  categories: 'categories',
  models: 'models',
  modelDetail: (slug: string) => `model:${slug}`,
  blogPosts: 'blog-posts',
  blogPostDetail: (slug: string) => `blog-post:${slug}`,
  authors: 'authors',
  tags: 'tags',
  dealerships: 'dealerships',
  aboutPage: 'global:about-page',
  contactInfo: 'global:contact-info',
  siteSettings: 'global:site-settings',
  media: 'media',
  home: 'home',
  vehiclesList: 'vehicles:list',
  newsList: 'news:list',
  sitemap: 'sitemap',
} as const

function safeRevalidateTag(t: string) {
  try {
    ;(revalidateTag as (tag: string, opts?: unknown) => void)(t)
  } catch {
    /* noop */
  }
}

function safeRevalidatePath(p: string | string[] | { url?: string; tag?: string }) {
  try {
    ;(revalidatePath as (path: string | string[] | { url?: string; tag?: string }, opts?: unknown) => void)(p)
  } catch {
    /* noop */
  }
}

function forEachModelTag(fn: (t: string) => void, doc?: { slug?: unknown }) {
  fn(REVALIDATE_TAGS.models)
  fn(REVALIDATE_TAGS.vehiclesList)
  fn(REVALIDATE_TAGS.home)
  fn(REVALIDATE_TAGS.sitemap)
  if (typeof doc?.slug === 'string') {
    fn(REVALIDATE_TAGS.modelDetail(doc.slug))
  }
}

function forEachBlogTag(fn: (t: string) => void, doc?: { slug?: unknown }) {
  fn(REVALIDATE_TAGS.blogPosts)
  fn(REVALIDATE_TAGS.newsList)
  fn(REVALIDATE_TAGS.sitemap)
  if (typeof doc?.slug === 'string') {
    fn(REVALIDATE_TAGS.blogPostDetail(doc.slug))
  }
}

type AnyHook = CollectionAfterChangeHook & CollectionAfterDeleteHook & GlobalAfterChangeHook

export function revalidateAllFor(
  tags: string[],
  paths: string[] = [],
): AnyHook {
  return (() => {
    tags.forEach((t) => safeRevalidateTag(t))
    paths.forEach((p) => safeRevalidatePath(p))
  }) as AnyHook
}

export const revalidateModels: CollectionAfterChangeHook & CollectionAfterDeleteHook = ({ doc }) => {
  forEachModelTag((t) => safeRevalidateTag(t))
  try {
    safeRevalidatePath('/')
    safeRevalidatePath('/vehicles')
    if (doc && typeof doc.slug === 'string') {
      safeRevalidatePath(`/vehicles/${doc.slug}`)
    }
  } catch {
    /* noop */
  }
}

export const revalidateBlogPosts: CollectionAfterChangeHook &
  CollectionAfterDeleteHook = ({ doc }) => {
    forEachBlogTag((t) => safeRevalidateTag(t))
    try {
      safeRevalidatePath('/news')
      if (doc && typeof doc.slug === 'string') {
        safeRevalidatePath(`/news/${doc.slug}`)
      }
    } catch {
      /* noop */
    }
}

export const revalidateCategories: CollectionAfterChangeHook &
  CollectionAfterDeleteHook = () => {
    for (const t of [
      REVALIDATE_TAGS.categories,
      REVALIDATE_TAGS.models,
      REVALIDATE_TAGS.vehiclesList,
      REVALIDATE_TAGS.home,
      REVALIDATE_TAGS.sitemap,
    ]) {
      safeRevalidateTag(t)
    }
    try {
      safeRevalidatePath('/vehicles')
      safeRevalidatePath('/')
    } catch {
      /* noop */
    }
}

export const revalidateAuthors: CollectionAfterChangeHook &
  CollectionAfterDeleteHook = () => {
    for (const t of [
      REVALIDATE_TAGS.authors,
      REVALIDATE_TAGS.blogPosts,
      REVALIDATE_TAGS.newsList,
      REVALIDATE_TAGS.sitemap,
    ]) {
      safeRevalidateTag(t)
    }
}

export const revalidateTags: CollectionAfterChangeHook &
  CollectionAfterDeleteHook = () => {
    for (const t of [
      REVALIDATE_TAGS.tags,
      REVALIDATE_TAGS.blogPosts,
      REVALIDATE_TAGS.newsList,
      REVALIDATE_TAGS.sitemap,
    ]) {
      safeRevalidateTag(t)
    }
}

export const revalidateDealerships: CollectionAfterChangeHook &
  CollectionAfterDeleteHook = () => {
    for (const t of [REVALIDATE_TAGS.dealerships, REVALIDATE_TAGS.sitemap]) {
      safeRevalidateTag(t)
    }
    try {
      safeRevalidatePath('/book-a-test-drive')
    } catch {
      /* noop */
    }
}

export const revalidateMedia: CollectionAfterChangeHook &
  CollectionAfterDeleteHook = () => {
  safeRevalidateTag(REVALIDATE_TAGS.media)
  safeRevalidateTag(REVALIDATE_TAGS.home)
  safeRevalidateTag(REVALIDATE_TAGS.vehiclesList)
  safeRevalidateTag(REVALIDATE_TAGS.newsList)
}
