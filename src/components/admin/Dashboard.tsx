'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type CountResult = { totalDocs: number }
type PostDoc = {
  id: string | number
  title?: string
  slug?: string
  updatedAt?: string
}

const fetcher = async (url: string, opts?: RequestInit) => {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    ...(opts || {}),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [counts, setCounts] = useState<{
    contact: number
    quotes: number
    testDrive: number
  }>({ contact: 0, quotes: 0, testDrive: 0 })
  const [posts, setPosts] = useState<PostDoc[]>([])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const [contactRes, quoteRes, tdRes, postsRes] = await Promise.all([
          fetcher(
            '/api/collections/contact-messages?where[status][equals]=new&limit=0&depth=0',
          ) as Promise<CountResult>,
          fetcher(
            '/api/collections/quote-requests?where[status][equals]=new&limit=0&depth=0',
          ) as Promise<CountResult>,
          fetcher(
            '/api/collections/test-drive-bookings?where[status][equals]=new&limit=0&depth=0',
          ) as Promise<CountResult>,
          fetcher(
            '/api/collections/blog-posts?sort=-updatedAt&limit=5&depth=0',
          ) as Promise<{ docs: PostDoc[] }>,
        ])
        if (cancelled) return
        setCounts({
          contact: contactRes.totalDocs || 0,
          quotes: quoteRes.totalDocs || 0,
          testDrive: tdRes.totalDocs || 0,
        })
        setPosts(postsRes.docs || [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const statCards: {
    label: string
    count: number
    href: string
    accent: string
  }[] = [
    {
      label: 'New contact messages',
      count: counts.contact,
      href: '/admin/collections/contact-messages?where[status][equals]=new',
      accent: 'bg-[#005eb8]',
    },
    {
      label: 'New quote requests',
      count: counts.quotes,
      href: '/admin/collections/quote-requests?where[status][equals]=new',
      accent: 'bg-[#002a52]',
    },
    {
      label: 'New test drive bookings',
      count: counts.testDrive,
      href: '/admin/collections/test-drive-bookings?where[status][equals]=new',
      accent: 'bg-[#1e1e1e]',
    },
  ]

  return (
    <div className="mb-8 space-y-6 px-6 pt-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1e1e]">
          Innoson Motors — Admin Dashboard
        </h1>
        <p className="text-sm text-[#666]">
          Welcome back. Here is the latest activity across submissions and content.
        </p>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading dashboard…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load dashboard stats: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            {statCards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className={`group block rounded-lg p-5 text-white shadow-sm transition hover:opacity-95 ${c.accent}`}
              >
                <p className="text-sm font-medium opacity-90">{c.label}</p>
                <p className="mt-2 text-4xl font-black tabular-nums">
                  {c.count}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide opacity-80 group-hover:opacity-100">
                  View list →
                </p>
              </Link>
            ))}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-bold text-[#1e1e1e]">
              Recently updated posts
            </h2>
            {posts.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No posts yet — create one in{' '}
                <Link
                  href="/admin/collections/blog-posts"
                  className="text-[#005eb8] underline"
                >
                  Blog posts
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {posts.map((p) => (
                  <li
                    key={String(p.id)}
                    className="flex items-center justify-between py-3"
                  >
                    <Link
                      href={`/admin/collections/blog-posts/${p.id}`}
                      className="font-medium text-[#1e1e1e] hover:text-[#005eb8]"
                    >
                      {p.title || '(untitled)'}
                    </Link>
                    <span className="text-xs text-slate-500">
                      {p.updatedAt
                        ? new Date(p.updatedAt).toLocaleString()
                        : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
