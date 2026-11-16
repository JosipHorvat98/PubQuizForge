-- file: supabase/migrations/004_pack_overrides.sql
-- Admin-editable overrides for packs. Run in Supabase Dashboard -> SQL Editor.

create table if not exists public.pack_overrides (
  pack_id     text primary key,
  tier        text,
  price       text,
  title       text,
  pdf_path    text,
  is_hidden   boolean not null default false,
  updated_at  timestamptz not null default now()
);

alter table public.pack_overrides enable row level security;

-- Only the server (service role) reads/writes this table; no public access.
