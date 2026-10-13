# Clentr — website

Marketing site for Clentr, a software engineering studio.

Built with Next.js (App Router), TypeScript, Motion and Lenis. Plain CSS with design tokens in `src/app/globals.css` (dark and light themes).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Structure

- `src/content/` — copy and data: `site.ts` (services, AI, process, FAQs), `projects.ts` (12 case studies), `figma-sizes.json`
- `src/components/home/` — home sections (Hero, Finder, Services, AI showcase, Trust, Process, FAQ…)
- `src/components/work/` — work cards, contact form, share control
- `src/components/ui/` — nav, footer, logo, icons, themed artwork, reveal
- `src/app/work/[slug]` — case-study pages; `src/app/contact` — contact page
- `public/f/` — artwork exported from the Figma file (Clentr v5) via the REST API, light and dark

The contact form validates input and posts it to FormSubmit, which emails it to the studio inbox (`site.email`). The first submission triggers a one-time activation email to that inbox. No environment variables are required.

## Admin panel, analytics and bookings

`/admin` (sign-in required) shows anonymous site activity, every Cal.com booking and every contact-form message,
and lets you add projects without touching code.

- **Analytics** — `src/components/analytics/Tracker.tsx` posts page views and clicks to `/api/track`. No cookies and
  nothing that identifies a person: path, clicked element, referring site, country, device and a per-tab id.
  Name a click by adding `data-track="something"` to any element.
- **Bookings** — every "Book a call" button (`src/components/ui/BookCall.tsx`) opens the Cal.com pop-up when
  `NEXT_PUBLIC_CAL_LINK` is set, and falls back to email otherwise. Cal.com calls `/api/cal/webhook` (signed with
  `CAL_WEBHOOK_SECRET`) so each booking's name, email and time appear in the dashboard.
- **Contact form** — still emailed via FormSubmit, and also stored through `/api/lead`.
- **Projects** — `/admin/projects/new` takes the details and screenshots; the folder, cards, hover and full
  case-study page are generated in the same design as the built-in projects. Images upload straight to Supabase
  Storage (`project-media` bucket); published projects appear on the site immediately.

### Setup (once)

1. Copy `.env.example` to `.env.local` and fill it in from Supabase → Project Settings → API.
2. Apply the schema: `supabase link --project-ref zebsgybgfmkislypcfbt` then `supabase db push`
   (creates the tables and the storage bucket from `supabase/migrations`).
3. Supabase → Authentication → Users → **Add user** for each email in `ADMIN_EMAILS`, with a password.
4. Cal.com → Settings → Developer → Webhooks: subscriber URL `https://<your-domain>/api/cal/webhook`, the same
   secret as `CAL_WEBHOOK_SECRET`, events *Booking created / rescheduled / cancelled*.
5. Add the same variables in Vercel → Settings → Environment Variables and redeploy.
