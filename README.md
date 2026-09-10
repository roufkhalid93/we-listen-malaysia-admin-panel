# We Listen Malaysia — Admin Panel & Backend

This is the **backend + admin panel** for We Listen Malaysia Organisation's
fundraising platform. It owns all the data (causes, donations, contact
messages, admin credentials) as flat JSON files, and exposes a REST API that
the separate **public frontend repo** consumes.

> Looking for the public-facing site (Home, Causes, About, Contact, Donate)?
> That lives in a separate repo, `we-listen-malaysia-frontend`, and talks to
> this app over HTTP.

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Auth: JWT in an httpOnly cookie (`jsonwebtoken` + `bcryptjs`)
- Data storage: flat JSON files in `/data`

## Getting started

```bash
npm install
cp .env.example .env.local   # adjust FRONTEND_ORIGIN if needed
npm run dev
```

This app runs on **http://localhost:4001** by default (see `package.json`
scripts), so it doesn't collide with the frontend repo's default port 3000.

For production:

```bash
npm run build
npm run start
```

## Admin login

Visit `/admin/login`.

- **Email:** `admin@welisten.org.my`
- **Password:** `WeListen@2026`

Change these by editing `data/admin.json` — replace `passwordHash` with a new
bcrypt hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('yourNewPassword', 10))"
```

## What's in here

- `app/admin/login` — admin login page
- `app/admin/(dashboard)` — protected route group (redirects to `/admin/login`
  if there's no valid session cookie):
  - `dashboard` — stats overview (amount collected, people helped, donations, etc.)
  - `causes` — full CRUD for causes/families shown on the public site
- `app/api/*` — the REST API:
  - `GET/POST /api/causes`, `GET/PUT/DELETE /api/causes/[id]` — cause management (writes require an admin session)
  - `POST /api/auth/login`, `POST /api/auth/logout` — admin auth
  - `GET/POST /api/contact` — contact form messages (`GET` requires admin session)
  - `GET/POST /api/donations` — donations (`GET` requires admin session)
  - `GET /api/org-stats` — public org-wide figures (volunteers, years active, partner communities)
  - `GET /api/stats` — protected dashboard aggregate stats
- `lib/data.ts` — JSON file read/write layer
- `lib/auth.ts` — session/JWT helpers
- `lib/cors.ts` — CORS headers applied to the public endpoints so the
  separate frontend repo's browser can call them directly

## CORS / connecting the frontend repo

The following endpoints are public (no auth) and CORS-enabled so a browser
on a different origin can call them directly:

- `GET /api/causes`
- `GET /api/org-stats`
- `POST /api/donations`
- `POST /api/contact`

Set `FRONTEND_ORIGIN` in `.env.local` to the frontend repo's URL (comma-
separate multiple values if you have more than one, e.g. local + deployed):

```
FRONTEND_ORIGIN=http://localhost:3000,https://welisten.org.my
```

All other endpoints (cause create/edit/delete, admin auth, protected reads)
are same-origin only, used by this app's own admin UI, and are not exposed
for cross-origin use.

## Data files (`/data`)

| File              | Purpose                                          |
|--------------------|---------------------------------------------------|
| `causes.json`      | All causes/families shown on the public site       |
| `donations.json`   | Every donation submitted (from either repo)         |
| `messages.json`    | Contact form submissions (from either repo)         |
| `stats.json`       | Manually curated org-wide figures                    |
| `admin.json`       | Admin login credentials (bcrypt-hashed password)     |

For a real production deployment on a serverless host (e.g. Vercel), the
filesystem is read-only/ephemeral at runtime — swap `lib/data.ts` for a real
database before going live with real donations.
