export const HONEYPOT_FIELD = 'website' as const

export interface HoneypotInput {
  [HONEYPOT_FIELD]?: unknown
}

/**
 * Returns true if the honeypot field is empty / untouched (human-like).
 * Returns false if a bot filled the hidden "website" field.
 *
 * When false, callers should short-circuit and return an OK-looking response
 * without actually writing to the database — bots never read the response,
 * and this avoids cluttering logs.
 */
export function isHoneypotClean(input: HoneypotInput): boolean {
  const value = input[HONEYPOT_FIELD]
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim().length === 0
  return false
}
