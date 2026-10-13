-- Content management: editable home-page sections, custom sections and lead follow-up.

-- Overrides for the built-in home sections (hero, services, faqs, …), keyed by section id.
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Sections added from the admin panel, built from templates in the site's design.
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  template text not null check (template in ('features', 'media', 'stats', 'quote', 'logos', 'cta')),
  name text not null,
  data jsonb not null default '{}'::jsonb
);

-- Lead follow-up.
alter table public.leads add column if not exists status text not null default 'new'
  check (status in ('new', 'contacted', 'won', 'archived'));
alter table public.leads add column if not exists notes text;

alter table public.site_content enable row level security;
alter table public.sections enable row level security;
