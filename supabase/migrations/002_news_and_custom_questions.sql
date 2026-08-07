-- file: supabase/migrations/002_news_and_custom_questions.sql
-- Run in the Supabase Dashboard -> SQL Editor. Idempotent.

-- 1) News posts (published by the admin from /admin/news).
create table if not exists public.news_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  category     text not null default 'Update',
  content      text not null default '',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.news_posts enable row level security;

create policy "Public can read published news"
  on public.news_posts for select
  to anon, authenticated
  using (is_published = true);

-- 2) Custom question requests sent by customers.
create table if not exists public.custom_questions (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  theme          text not null,
  question_count integer not null default 10,
  details        text,
  is_handled     boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table public.custom_questions enable row level security;