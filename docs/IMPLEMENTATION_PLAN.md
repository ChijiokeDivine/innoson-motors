
### Phase 4 — Admin Customization

28. **Admin branding in `payload.config.ts`:**
    - `admin.meta.titleSuffix = ' | Innoson Motors Admin'`
    - Admin favicon → `/favicon.ico` (reuse) or upload logo asset.
    - Admin nav groups via `admin.group` on each collection:
      - **Content:** Authors, Blog posts, Tags, Media, About page, Contact info, Site settings
      - **Vehicles:** Categories, Models, Dealerships
      - **Submissions:** Contact messages, Quote requests, Test drive bookings, Newsletter subscribers
      - **Users** (admin only): Users

29. **Dashboard widget (admin.components.beforeDashboard or current Payload API):**
    - Server component fetching counts:
      - New contact messages (`where: status equals 'new'`)
      - New quote requests
      - New test drive bookings
      - Recent 5 updated posts
    - Links to filtered list views.

30. **List-view defaults:**
    - Submissions: `defaultSort = '-createdAt'` (newest first).
    - Quote/Test-drive lists: include related model name in `defaultColumns`.
    - Search on `name`, `email`, `subject` for submissions.

31. **CSV export:**
    - If `@payloadcms/plugin-form-builder` (or similar import/export plugin) isn't bundled, add a custom admin-only endpoint on each submission collection: `POST /api/export/csv` that respects access + current `where` filter, streams CSV. Or defer to Payload's built-in export if 3.88 ships it.

32. **Role enforcement verification:**
    - Confirm editor cannot delete submissions (set submission `delete: isAdmin` access).
    - Users collection: editor has `read/create/update = false` access unless `isAdmin`.
    - Admin routes already require auth via Payload's built-in gate.

33. **SEO:**
    - `/admin/*` route → add `X-Robots-Tag: noindex` header or metadata; exclude in robots.txt.

### Phase 5 — Security Pass + Final Items

34. **Security checklist walkthrough:**
    - Verify every collection/global/field has explicit access (no defaults relied on).
    - Draft-filter test: hit `/api/models?where[_status][equals]=draft` with no auth → returns empty.
    - Submission REST/GraphQL: anonymous → 401/403.
    - All Zod schemas reviewed for length/format; honeypot + rate limits in every handler.
    - `PAYLOAD_SECRET`, DB URL in env only.
    - Cloudinary creds never leak to client (storage adapter runs server-side only ✓).
    - Payload `users` auth: default login rate-limiting/lockout verified in Payload 3.88 docs; if none, add a `beforeLogin` hook that tracks attempts per email.

35. **Final docs artifacts:**
    - `docs/TESTING.md` — manual checklist actually executed.
    - `docs/FINAL_REPORT.md` — phases 1-5 summary, all new routes, env vars added, package.json changes, route-group/layout resolution (no change needed), deviations, known limitations, Prisma unused list, next steps.
    - Update `README.md` with setup, env, migrate/seed commands, how-to-add-collection instructions.

---

## 3. Risks

| Risk | Mitigation |
|---|---|
| **Payload 3.88 drafts API differs from custom `status` field** → existing service/query code that filters `status: published` breaks. | Search the repo for `status: { equals: 'published' }` BEFORE enabling drafts; swap to `_status: 'published'`. The `read` access query on Models/BlogPosts already uses `{ status: ... }` — that's the first one to update. |
| **`graphql@17` peer incompatibility with Payload** | Check Payload's `package.json` `peerDependencies` at install-time. If hard-blocked, downgrade to `graphql@16.x` and report in final report. |
| **`app/vehicles/caris/page.tsx` hardcoded URL** → converting to dynamic `[slug]` route makes `/vehicles/caris` 404 unless Caris model exists with slug `caris`. | Seed script MUST create the Caris model first, and the dynamic route should 301 or handle it cleanly. Verify the seed creates a `caris` slug entry so the current URL keeps working. |
| **Cloudinary upload failures during seed (no creds in CI)** | Seed keeps static images as fallbacks (documented decision); fail gracefully with console.warning if media uploads error, but the rest of the doc still gets created with placeholder URLs. |
| **`@payloadcms/richtext-lexical/react` renderer API changed in 3.88** | Read the installed type definitions before writing the first renderer call; don't copy old tutorial code. |
| **Rate limit store = in-memory → won't work on multi-instance Vercel** | Documented as "swap interface later"; the task explicitly accepts in-memory to start. |
| **Newsletter re-subscribe edge case** | Service already handles this pattern; just verify the status flip logic doesn't error on `unique: email` constraint. |
