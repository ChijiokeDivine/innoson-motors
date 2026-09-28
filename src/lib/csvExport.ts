import type { Payload, PayloadRequest } from 'payload'

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export type ExportColumn = {
  key: string
  label: string
  resolve?: (doc: Record<string, unknown>) => unknown
}

export async function streamCollectionCSV(
  payload: Payload,
  req: PayloadRequest,
  options: {
    collection: string
    columns: ExportColumn[]
    where?: Record<string, unknown>
    sort?: string | string[]
    depth?: number
  },
): Promise<{
  status: number
  headers: Record<string, string>
  stream: ReadableStream
}> {
  const { collection, columns, where, sort, depth = 1 } = options

  const pageSize = 500
  let page = 1
  let hasMore = true

  const encoder = new TextEncoder()
  let first = true

  const stream = new ReadableStream({
    async pull(controller) {
      if (first) {
        const headerLine = columns.map((c) => escapeCSV(c.label)).join(',') + '\r\n'
        controller.enqueue(encoder.encode(headerLine))
        first = false
      }
      if (!hasMore) {
        controller.close()
        return
      }
      const res = await payload.find({
        collection: collection as never,
        where: where as never,
        sort,
        depth,
        page,
        limit: pageSize,
        req,
        overrideAccess: false,
      })
      for (const doc of res.docs as Record<string, unknown>[]) {
        const values = columns.map((col) => {
          const value = col.resolve ? col.resolve(doc) : doc[col.key]
          return escapeCSV(value)
        })
        controller.enqueue(encoder.encode(values.join(',') + '\r\n'))
      }
      hasMore = res.hasNextPage
      page += 1
      if (!hasMore) {
        controller.close()
      }
    },
  })

  const filename = `${collection}-${new Date().toISOString().slice(0, 10)}.csv`
  return {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store, no-transform',
    },
    stream,
  }
}
