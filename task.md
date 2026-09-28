```markdown
# Task: Make the Innoson Motors site functional with Payload CMS (data + admin)

You are working in an existing Next.js 16 (App Router, TypeScript, React 19, Tailwind 4) codebase for an Innoson Motors dealership website. **The frontend is built; almost nothing is functional.** Your job: complete the Payload CMS backend, wire the public site to it, make every form work, and tailor the Payload admin panel for the client.

The site is inspired by [Innoson Vehicles](https://www.innosonvehicles.com/) (categories: Cars, MPV, Pickup, SUVs, Buses; model pages with specs and gallery; blog; about; contact; auto-finance messaging). It should lean toward that site's functionality but **must not be a copy of it**. Do not change the visual design of any existing public page.

```

---

## 0. Architecture decision (non-negotiable)

**Payload CMS is the single system of record and the admin panel.** All content and all form submissions live in Payload collections/globals on Payload's Postgres adapter (`@payloadcms/db-postgres`). The frontend reads and writes through Payload's **Local API** (`getPayload({ config })`) on the server.

**Prisma is not part of the data path.** The repo has `prisma/schema.prisma` and Prisma packages installed. That schema is a **design blueprint only**: it captures the intended data model, and you will translate it into Payload collections (mapping table in section 3).

* Do **not** run any Prisma migration/`db push`/`db init` against the database Payload uses. Prisma would treat Payload's tables as drift and may try to drop them.
* Do not import `@prisma/client` or the generated client anywhere.
* Leave the Prisma files and dependencies in place; list them in the final report as candidates for removal. Do not delete them yourself.

---

## 1. Working rules

* 1. Explore first. Read the whole repo: `src/app`, `src/components`, `src/collections`, `src/globals`, `src/access`, `src/payload.config.ts`, `next.config.*`, `tsconfig`, `.env*`, `prisma/schema.prisma`. Understand existing patterns and follow them.
* 2. Write a short plan first in `docs/IMPLEMENTATION_PLAN.md` (what exists, what is hardcoded, what you will change, risks). Then execute the phases below.
* 3. Phases with commits. Commit after each phase with clear messages. Don't start the next phase until `npm run lint`, `npx tsc --noEmit` and `npm run build` pass.
* 4. Verify versions, don't assume. This project runs very new versions (Next 16.x, Payload 3.88.x, React 19.2, Zod 4). Some APIs differ from older tutorials. Read the installed packages' types/docs before using an API. Examples to verify: Next 16 conventions (`proxy.ts` replacing `middleware.ts`, changed caching/`revalidateTag` signatures, async request APIs), Zod 4 idioms, Payload's current `slugField`/drafts/versions/jobs APIs, and the Payload importmap workflow. Do not upgrade or downgrade dependencies unless a blocker forces it, and if it does, explain why in the report.
* 5. Sanity-check `package.json` in Phase 0. `graphql` is at `^17` while Payload historically peers `^16`; the `payload` CLI, `generate:types`, `generate:importmap` and migration scripts are missing; there is no `tsx`. Fix what is needed (prefer `payload run` for scripts) and report what you changed.
* 6. Windows-friendly scripts only (no bash-only syntax; `cross-env` is already installed).
* 7. TypeScript strict, no `any`, no `@ts-ignore`. Use generated Payload types (`payload-types.ts`). No new heavy dependencies without stating why in the plan.
* 8. Never commit secrets. Maintain a complete `.env.example`.

---

## 2. Phase 0: Audit and structure

* Confirm how Payload is mounted. Payload's admin needs its own `(payload)` route group with its own root layout, separate from the public site's layout. If public pages currently live at the `app/` root and would conflict, restructure into `(frontend)` and `(payload)` route groups **without changing any public URL**.
* Confirm `next.config` uses `withPayload`, the Postgres connection env var is documented, and the Cloudinary storage setup actually works (upload, delete, correct public URLs, `next/image` `remotePatterns`).
* Inventory every hardcoded piece of content in the frontend (categories, models and all their per-model sections, blog, about, contact, footer socials, testimonials/accordions) so it can be seeded.
* Inventory every form and API route and what it currently does.

---

## 3. Phase 1: Complete the Payload data model

Reconcile the existing collections/globals with the blueprint. Reuse and extend what exists; do not duplicate. Use Payload idioms (array fields and relationships instead of join tables).

| Blueprint (Prisma) | Payload construct |
| --- | --- |
| `AdminUser` + `Role` | `users` auth collection with a `role` select (`admin`, `editor`) |
| `Media` | `media` upload collection (Cloudinary via the existing storage plugin), required `alt` |
| `Category` | `categories` collection (name, slug, description, image, order) |
| `VehicleModel` | `models` collection (name, slug, category relationship, tagline, summary, lexical `description`/`design`/`technology`, hero image, brochure upload/relationship, optional `basePrice` + `currency`, `featured`, `order`) with **drafts enabled** so unpublished models are never public |
| `VehicleSpec` | array field `specs` on models: `label`, `value`, `group` (dimensions/performance/general) |
| `VehicleImage` | array field `gallery`: `image`, optional `caption` (array order = display order) |
| `VehicleHighlight` | array field `highlights`: `title`, `description`, optional icon |
| `VehicleColorOption` | array field `colorOptions`: `name`, `hexCode`, optional image |
| `Author` | `authors` collection (name, avatar, bio) |
| `BlogPost` | `blog-posts` collection (title, slug, excerpt, lexical `content`, cover image, author, `tags`, `publishedAt`, `readTimeMinutes`) with **drafts enabled** |
| `Tag` / `BlogPostTag` | `tags` collection + `hasMany` relationship on blog posts |
| `ContactMessage` | `contact-messages` collection with a `status` select (new/read/resolved) |
| `NewsletterSubscriber` | existing newsletter collection: unique `email`, `status` (subscribed/unsubscribed), `source` |
| `QuoteRequest` | `quote-requests` collection: name, phone, email, address, model relationship, message, `status` (new/contacted/closed) |
| `TestDriveBooking` | **new** `test-drive-bookings` collection: name, phone, email, model relationship, message, `marketingOptIn`, optional `preferredDate`, optional `dealership` relationship, `status` (new/confirmed/completed/cancelled) |
| `Dealership` | **new** `dealerships` collection (name, address, city, state, phone, optional lat/lng) |
| `AboutPage` | `about` global (heading, intro, quality policy, signatory title, hero image, `stats` array, `gallery` array) |
| `ContactInfo` | `contact-info` global (address, map coordinates, `phones`, `emails`, `socialLinks` arrays with a platform select) |
| `SiteSetting` | `site-settings` global for small toggles/texts (banner, hotline copy, finance-partner text) |

### Additional requirements:

* **Slugs**: auto-generated from title, unique, editable (use Payload's built-in slug helper if the installed version provides one, otherwise a small `beforeValidate` hook).
* **`readTimeMinutes`**: auto-calculated from the lexical content in a `beforeChange` hook, still manually overridable.
* **Submissions collections** (`contact-messages`, `quote-requests`, `test-drive-bookings`, newsletter): group them in the admin under "Submissions", show sensible `defaultColumns`, make the submitted data read-only in the admin (only `status` and an admin-only `internalNotes` textarea are editable), and add `useAsTitle` and search-friendly fields.
* **Access control** (explicit on every collection, global and sensitive field):
* Anonymous read only for published content (`_status: 'published'`) and for public globals. Drafts never public.
* Submissions: **no anonymous access through Payload's REST/GraphQL at all** (read or create). Public forms submit through server code (section 5), which validates input first.
* `editor`: manage blog posts, authors, tags, media; view submissions and update `status`/`internalNotes`; cannot delete submissions or manage users. `admin`: everything.
* Remember that Local API calls default to `overrideAccess: true`. Use `overrideAccess: false` (with the `user`) whenever an operation runs on behalf of an authenticated user, and use `true` only in trusted server code after validation.


* **Revalidation hooks**: `afterChange`/`afterDelete` on public collections and globals call the Next revalidation functions for affected paths/tags so content updates appear without a redeploy.
* **Migrations**: use Payload's migration workflow for production (`push` only for local dev). Add the npm scripts, create the initial migration, and document the commands in the README.
* **Generate types and importmap** and commit the results according to the repo's conventions.

---

## 4. Phase 2: Seed and public read wiring

### Seed (`payload run`-based script wired to an npm script):

* Convert the existing hardcoded frontend content into documents (categories, models with specs/gallery/highlights, about, contact info and socials, a few blog posts with authors and tags) so the site looks identical after wiring. Use the installed lexical package's conversion helper to build rich-text content from the existing copy.
* Create the first `admin` user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars; refuse to run with a missing/weak password. No hardcoded credentials.
* Idempotent: safe to run repeatedly (find by slug/email then update or create; globals updated in place).
* Media: upload the existing static images to Cloudinary through Payload, or keep them as static assets with a documented decision. Do not leave broken image references.

### Data-access layer in `src/server/`:

Thin, typed functions around the Local API (`getCategories`, `getModelBySlug`, `getPublishedPosts`, etc.). Pages and components call these; they never call Payload directly. Use `depth` deliberately and select only needed fields.

### Public pages (no UI changes):

* Category and model listing pages, and **model detail pages** (grouped specs, ordered gallery, highlights, color options, brochure download when present). Unknown slug -> `notFound()`.
* Blog list (paginated, newest first), post page (author, cover, tags, date, read time), optional tag filter. Published only, `publishedAt <= now`.
* About, contact details, footer socials from the globals.
* Render lexical content with the official React renderer from `@payloadcms/richtext-lexical`, never by injecting raw HTML.
* Static generation/ISR with on-demand revalidation via the Payload hooks above. Follow Next 16's current caching model.
* Graceful empty states everywhere; `generateMetadata` (title, description, OG image) for model and blog pages; `sitemap.ts` and `robots.ts`.

---

## 5. Phase 3: Public forms (write paths)

Implement end to end with server-side validation (Zod 4), loading/success/error states in the existing UI, and friendly error messages. Use the pattern the repo already uses (server actions or route handlers); if none is established, prefer server actions.

| Form | Collection | Notes |
| --- | --- | --- |
| Contact | `contact-messages` | name, email, optional phone/subject, message |
| Newsletter | newsletter | idempotent on email; re-subscribing an unsubscribed email reactivates it; store `source` |
| Get a quote (`GetQuoteModal`) | `quote-requests` | model chosen from Payload data; verify it exists and is published |
| **Book a test drive** | `test-drive-bookings` | the current page's submit only does `console.log`. Wire the two-step flow (vehicle, then form) to the collection. Include `marketingOptIn`. Surface `preferredDate`/`dealership` in the UI only if it fits the existing design without breaking it; otherwise leave them out and say so in the report |

### Cross-cutting:

* **Abuse protection**: honeypot field plus per-IP rate limiting, behind a small interface so the store can be swapped later (in-memory is fine to start). No CAPTCHA unless requested.
* Normalize inputs (trim, lowercase emails, sensible phone validation for Nigerian and international formats).
* Return generic errors to the client; log details server-side; never leak stack traces or database errors.
* Create `src/server/notifications.ts` as a documented extension point for notifying staff about new submissions. **Ship it as a no-op behind an env flag**; do not add an email provider unless asked.

---

## 6. Phase 4: Tailor the Payload admin

Payload already provides login, roles, media library, drafts and CRUD. Your job is to make it fit this client:

* Admin branding: logo, favicon, title suffix, and a tidy nav (groups: Content, Vehicles, Submissions, Site).
* **Dashboard** (`admin.components.beforeDashboard` or the installed version's current equivalent): counts of `new` contact messages, quote requests and test-drive bookings, with links to the filtered lists, plus recently updated posts.
* Useful list-view columns, filters and search on every collection. Submissions default-sorted newest first. Show the linked model name on quote and test-drive lists.
* **CSV export** for submissions: use the official Payload import/export plugin if it is compatible with the installed version; otherwise a small admin-only custom endpoint that respects access control and current filters.
* Blog editing experience: cover image, author, tags, excerpt, lexical editor with sensible features enabled (headings, lists, links, images, quotes), draft/publish, and an admin preview link to the public page (`preview`/live preview only if it can be done cleanly).
* Confirm the `editor` role cannot delete submissions or see user management, and that unauthenticated requests to admin routes and Payload's REST/GraphQL endpoints are refused where intended.
* Keep the admin out of the sitemap and mark it `noindex`.

---

## 7. Phase 5: Optional, only after 1-4 are complete and reported

Do not start unless everything above is done, green, and summarized:

* Dealership selection and preferred date on the test-drive flow.
* Staff notifications for new submissions (email/Slack) via the notifications stub.
* Live preview for models and posts.
* Vehicle comparison or "similar models" on model pages.

---

## 8. Security checklist (must pass before finishing)

* Every collection, global and sensitive field has explicit access control; nothing relies on defaults.
* Drafts are never reachable through pages, Payload REST/GraphQL, sitemap or metadata.
* Submissions (personal data: names, phones, emails, addresses) are only readable by authenticated staff. No anonymous REST/GraphQL access.
* Public form endpoints validate with Zod on the server, are rate-limited, and never trust client-supplied IDs without checking them.
* User-submitted text is rendered as text, never as HTML. Rich text goes through the official renderer.
* No secret or password hash reaches the client or logs. `PAYLOAD_SECRET` and the database URL come from env only.
* Cloudinary credentials stay server-side; upload types/sizes are restricted.
* Login rate limiting and account lockout behaviour verified for the Payload `users` collection.

---

## 9. Extensibility (the clients will keep asking for more)

* Small, typed, reusable helpers: slug/pagination utilities, status badge components, a shared form wrapper, a shared "submission" collection factory or config helper so a new lead type is a few lines.
* Enums/options defined once (constants shared by collections, validators and UI), not duplicated strings.
* No business logic in React components; it belongs in `src/server/` and Payload hooks.
* README sections: local setup, env vars, migrate/seed commands, how to add a new collection, a new lead type, and a new admin dashboard widget.

---

## 10. Definition of done

* `npm run lint`, `npx tsc --noEmit` and `npm run build` pass.
* From a fresh clone: install, configure `.env` from `.env.example`, run migrations and seed, `npm run dev`; the public site renders from Payload identically to the original frontend, and `/admin` works with the seeded admin.
* Write `docs/TESTING.md` as a checklist you actually ran: every form succeeds and appears in the admin; invalid input is rejected; duplicate newsletter signup behaves correctly; draft posts/models are not publicly visible (pages and API); publishing a post updates the public site without a redeploy; `editor` cannot delete submissions or manage users; anonymous requests to submission endpoints via REST/GraphQL are refused.

---

## 11. Final report (required)

Include: what was implemented per phase; every new route (public, admin, API/server action); all env vars added; setup, migrate and seed commands; `package.json` changes with reasons; how you resolved the route-group/layout structure; deviations from the brief and why; known limitations; the list of Prisma files/dependencies now unused; and suggested next steps.

```

```