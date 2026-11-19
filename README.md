# Senior Hub — Coppell High School

A centralized dashboard for the senior class. Admins post announcements, events,
deadlines, info and resources; every senior sees the updates instantly, with no
account and no personal data collected.

## How it works

**Students** — open the site and everything is there. No login, no sign-up,
nothing stored about them. The dashboard is identical for every senior and
updates live (via Supabase Realtime) the moment an admin posts something.
Students can optionally opt into browser notifications for new announcements
from the Announcements page.

**Admins** — go to `/admin`, enter the access code, and manage all content.

### Admin access code

The access code is set in the Supabase Auth account `admin@seniorhub.app`.
It was shared separately and is deliberately not committed to this repository.

The code is a real credential, not a client-side check. Write access is enforced
by Postgres row-level security, so the gate cannot be bypassed by editing the
page or calling the API directly.

To change it, open the Supabase dashboard → Authentication → Users → the
`admin@seniorhub.app` user → reset password.

## Routes

| Route | Who | Purpose |
| --- | --- | --- |
| `/` | Everyone | Home: announcements banner, calendar, deadlines, resources, quick links |
| `/announcements` | Everyone | Full announcement feed |
| `/events` | Everyone | Calendar + upcoming and past events |
| `/deadlines` | Everyone | Key dates, upcoming and passed |
| `/info` | Everyone | Senior FAQs grouped by category |
| `/resources` | Everyone | Guides, forms and links |
| `/admin/login` | — | Access-code gate |
| `/admin` | Admin | Dashboard with live counts and quick actions |
| `/admin/announcements` | Admin | Create, edit, delete announcements |
| `/admin/events` | Admin | Create, edit, delete events |
| `/admin/deadlines` | Admin | Create, edit, delete deadlines |
| `/admin/info` | Admin | Create, edit, delete info items |
| `/admin/resources` | Admin | Create, edit, delete resources |

## Data model

Five content tables — `announcements`, `events`, `deadlines`, `info_items`,
`resources` — plus an `admins` registry that maps an auth user to write access.

Every content table has the same two policies:

- **read** — `anon` and `authenticated` may `select` (students need no account)
- **write** — only `authenticated` users listed in `admins` may insert, update or delete

## Local development

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

## Deploying

Deploys to Vercel as-is. Set these environment variables on the project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAIL`

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres,
Auth, Realtime, RLS)
