# <a href="https://mehranapp.vercel.app/" target="_blank"> mehranapp </a>

Mehran APP  is a production-ready, mobile-first academic SaaS platform built with Next.js App Router, TypeScript, Supabase, and Tailwind CSS.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Database, Auth, Storage)
- Tailwind CSS v4

## Features

- Landing page with institutional branding and clean UX
- Past papers search with server-side filtering and debounced filter inputs
- Achievements directory with polished cards and filters
- Loading skeletons, empty states, and error boundaries
- Sticky responsive header with mobile navigation
- Public paper upload page
- SEO metadata and favicon support

## Folder Structure

```text
app/
	achievements/
		error.tsx
		loading.tsx
		page.tsx
	admin/
		upload/
			page.tsx
	login/
		page.tsx
	past-papers/
		error.tsx
		loading.tsx
		page.tsx
	globals.css
	layout.tsx
	page.tsx
components/
	achievements/
	admin/
	home/
	layout/
	past-papers/
	ui/
lib/
	supabase/
	constants.ts
	queries.ts
	utils.ts
supabase/
	schema.sql
	seed.sql
types/
	database.ts
	filters.ts
proxy.ts
```

## Supabase Setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Run `supabase/seed.sql` for sample data.
4. Create a public storage bucket named `papers`.
5. Configure public insert/upload policies for your use case.

## Environment Configuration

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SITE_URL=https://mehranapp.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=you@example.com
SUPER_ADMIN_EMAIL=you@example.com
```

## Local Development

Install dependencies and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database Design

### `past_papers`

- `id` (uuid)
- `teacher_name`
- `department`
- `semester`
- `course`
- `year`
- `file_url`
- `created_at`

Indexes included:

- `teacher_name`
- `department`
- `semester`
- `course`

### `achievements`

- `id` (uuid)
- `student_name`
- `department`
- `achievement_title`
- `description`
- `github_link`
- `linkedin_link`
- `photo_url`
- `created_at`

### `profiles`

- `id` (references `auth.users.id`)
- `role` (`admin` | `student`)
- `created_at`

## Production Deployment (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set environment variables from `.env.local` in Vercel Project Settings.
4. Deploy.
5. Re-deploy after future environment changes.

Recommended checks:

- `npm run lint`
- `npm run build`

## Notes

- Filtering is server-side using Supabase queries.
- Debounce is applied in client filter panels for instant-feel UX.
- `app/admin/upload` is publicly accessible.
