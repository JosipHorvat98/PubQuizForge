-- file: supabase/migrations/001_pack_pdf_storage.sql
-- Run in the Supabase Dashboard -> SQL Editor. Idempotent.

-- 1) Private Storage bucket for pack PDFs (files moved out of public/packs).
insert into storage.buckets (id, name, public)
values ('pack-pdfs', 'pack-pdfs', false)
on conflict (id) do nothing;

-- No public read policy: objects are only reachable via signed URLs, which the
-- server creates with the service-role key. Nothing extra needed here.

-- 2) Credits ledger used by the tier subscription model.
create table if not exists public.membership_credits (
  email             text primary key,
  plan_id           text not null,
  monthly_credits   integer not null default 0,
  credits_available integer not null default 0,
  max_rollover      integer not null default 0,
  last_period_start text,
  created_at        timestamptz,
  updated_at        timestamptz
);

alter table public.membership_credits enable row level security;

-- 3) Distinguish purchased vs membership downloads in the legacy counter.
alter table public.downloads add column if not exists source text;
