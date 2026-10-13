-- Clentr website: analytics, leads, bookings and admin-managed projects.
-- Row level security is on everywhere with no public policies: the site writes and the
-- admin reads only through server code holding the service-role key.

create table if not exists public.events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  type text not null check (type in ('page_view', 'click')),
  label text,             -- what was clicked, e.g. "book_call:hero" or "project:episode"
  path text not null,     -- page the event happened on
  referrer text,
  country text,
  device text check (device in ('mobile', 'tablet', 'desktop')),
  session text            -- random per-tab id; not a cookie and not linked to a person
);
create index if not exists events_created_at on public.events (created_at desc);
create index if not exists events_type_label on public.events (type, label);

create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  building text,
  budget text,
  details text,
  path text,
  country text
);
create index if not exists leads_created_at on public.leads (created_at desc);

create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  uid text unique,        -- Cal.com booking uid
  status text not null,   -- created | rescheduled | cancelled
  name text,
  email text,
  start_time timestamptz,
  end_time timestamptz,
  title text,
  notes text
);
create index if not exists bookings_created_at on public.bookings (created_at desc);

create table if not exists public.projects (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published boolean not null default false,
  sort integer not null default 100,
  data jsonb not null     -- the same fields as the built-in projects (see src/content/projects.ts)
);

alter table public.events enable row level security;
alter table public.leads enable row level security;
alter table public.bookings enable row level security;
alter table public.projects enable row level security;

-- Public bucket for project icons and screenshots uploaded from the admin panel.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-media', 'project-media', true, 8388608, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
