-- file: supabase/migrations/003_newsletter_and_audit.sql
-- Run in the Supabase Dashboard -> SQL Editor. Idempotent.

-- 1) Newsletter subscribers (opt-in list built from the site footer).
create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  is_active       boolean not null default true,
  source          text not null default 'footer',
  created_at      timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.newsletter_subscribers enable row level security;

-- Only the server (service role) manages subscribers; no public/client access.

-- 2) Admin audit log: who did what, when (server-written only).
create table if not exists public.admin_audit_log (
  id           uuid primary key default gen_random_uuid(),
  admin_email  text not null,
  action       text not null,
  entity_type  text,
  entity_id    text,
  meta         jsonb,
  created_at   timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;
