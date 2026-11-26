-- BVN HQ remote door: one row holding the PC's current tunnel address.
-- Run once in the Supabase SQL editor. Row level security is on with no
-- policies, so only the server (service role) can read or write it.
create table if not exists public.hq_beacon (
  id integer primary key,
  url text not null,
  seen_at timestamptz not null default now()
);
alter table public.hq_beacon enable row level security;
