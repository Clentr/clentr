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
