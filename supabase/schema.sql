-- Elim Medical Consultancy — Supabase schema
-- Run this in the Supabase SQL editor (or via the Supabase CLI).

create extension if not exists "pgcrypto";

create table if not exists public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  hospital_name text not null,
  phone        text not null,
  email        text not null,
  message      text not null,
  source       text default 'website',
  user_agent   text,
  ip           text,
  created_at   timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_email_idx on public.enquiries (email);

-- Row level security: writes happen from the service role only (server side).
alter table public.enquiries enable row level security;

-- Deny anonymous reads/writes by default. The service role bypasses RLS.
drop policy if exists "no anon access" on public.enquiries;
create policy "no anon access"
  on public.enquiries
  for all
  to anon
  using (false)
  with check (false);

-- Optional: allow authenticated dashboard users to read.
-- create policy "authenticated read" on public.enquiries
--   for select to authenticated using (true);
