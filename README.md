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

- `src/content/` — all copy: site info, services, process, stack, projects
- `src/components/sections/` — page sections (Hero, Work, Process, Contact…)
- `src/components/work/` — project visuals (device screens, video, illustrations)
- `src/components/ui/` — shared primitives (Button, Reveal, Magnetic, ThemeToggle)
- `public/work/` — optimised project screenshots and clips.

The contact form validates input and posts it to FormSubmit, which emails it to the studio inbox (`site.email`). The first submission triggers a one-time activation email to that inbox. No environment variables are required.
