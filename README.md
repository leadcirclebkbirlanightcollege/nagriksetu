# NagrikSetu

**Digital Civic Issue Reporting & Community Problem Monitoring Portal**

A production-ready civic-tech web application: citizens report civic issues,
track them through a 9-stage resolution lifecycle, and municipal staff manage,
route, and analyse complaints. Built with a government-inspired, accessible UI.

---

## Tech stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** (custom government theme)
- **Supabase** — PostgreSQL, Auth, Storage, Realtime, Row Level Security
- **React Router**, **React Hook Form + Zod**
- **Leaflet + OpenStreetMap** (maps, clustering, heatmap)
- **Recharts** (analytics)
- **jsPDF / xlsx / PapaParse** (PDF / Excel / CSV export)

---

## Architecture

Layered, type-safe, no duplicated data logic:

```
src/
  types/            Domain models (index.ts) + DB row types (db.ts)
  lib/              supabase client, env, mappers (row -> domain), validation
  repositories/     Data access (BaseRepository + one class per entity)
  services/         Business logic (auth, complaint, storage, survey, feedback,
                    notification, analytics, export, search)
  hooks/            React hooks bridging services -> UI (useComplaints, useAnalytics,
                    useNotifications [realtime], useGeo, useSurveys, ...)
  features/         Feature UI (complaints, map)
  components/       Reusable UI, layout, brand (Logo)
  pages/            Public, auth, citizen portal, admin console
  context/          Auth + Language providers
  data/             Demo fallback data
supabase/
  schema.sql        14-table normalized schema, enums, triggers, RLS, realtime
  seed.sql          Departments (with routing), wards, areas, sample survey
```

**Repository pattern** isolates Supabase calls; **services** compose them and
hold business rules; **hooks** expose them to components with loading/error
state. Components keep the approved UI unchanged.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your Supabase project values:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=http://localhost:5173
```

> Without keys the app runs in **demo mode** with bundled mock data so the UI
> stays fully explorable. Add keys to enable the real backend.

### 3. Set up the database

In the Supabase SQL Editor run, in order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Then create a **Storage bucket** named `complaint-images` (public read).

### 4. Run

```bash
npm run dev
```

---

## Roles

Four roles are supported (`profiles.role`):

| Role | Access |
|------|--------|
| `citizen` | Report, track, feedback, surveys, own dashboard |
| `officer` | Assigned complaints, status updates |
| `admin` | Full complaint management, analytics, surveys, exports |
| `super_admin` | Everything + user/role management |

New sign-ups become `citizen` automatically (via the `handle_new_user` trigger).
To promote a user, run in SQL:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Citizens log in at `/login`; staff log in at `/admin/login`.

---

## Key features

- **Auth:** registration, login, email verification, forgot/reset password,
  session persistence, logout, protected routes.
- **Report Issue:** title, category, description, area, ward, landmark, GPS
  lat/lng, photo upload (Supabase Storage), priority, anonymous, contact.
  Auto Complaint ID `NGS-2026-000123` + automatic department routing (DB triggers).
- **Tracking:** search by Complaint ID or mobile; 9-stage timeline
  (Reported → Verified → Assigned → Officer Accepted → Work Started →
  Inspection → Resolved → Citizen Verified → Closed) with timestamp,
  officer and remarks.
- **Admin:** analytics (totals, resolved, pending, avg resolution, top
  category/area, monthly, today, officer performance), search/filter,
  CSV/Excel/PDF export, assign officer, change status/priority, internal
  notes, archive/restore/delete.
- **Surveys:** builder, submission, response analytics (area/age/gender,
  common problems, satisfaction).
- **Community dashboard:** live stats, resolved %, trends, interactive map.
- **Realtime notifications** via Supabase Realtime.
- **Accessibility:** EN/HI switcher, font-size controls, ARIA, keyboard nav.
- **Security:** RLS on every table, Zod validation, input sanitisation (XSS),
  client rate limiting, image type/size validation.

---

## Notes

- The UI/theme is intentionally unchanged from the approved design.
- Database triggers handle Complaint ID generation, department routing, status
  history, resolved timestamps, and notification fan-out, so the client stays
  thin and consistent.
