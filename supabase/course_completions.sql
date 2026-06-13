-- ───────────────────────────────────────────────────────────────────────────
-- BVN — Course Completion Certificates table
-- Run this once in the Supabase SQL Editor (Dashboard → SQL → New query → Run).
--
-- This is the "who took the course" database. One row is created per certificate
-- claim: PENDING when the student starts checkout, flipped to PAID once payment
-- (PayMongo QR Ph ₱60 or PayPal $1) is confirmed. All reads/writes happen
-- server-side via the service-role admin client, so RLS stays locked down with
-- no public policies (the service role bypasses RLS).
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists public.course_completions (
  id                  uuid primary key default gen_random_uuid(),
  course_slug         text        not null,
  course_title        text        not null,
  student_name        text        not null,
  student_email       text        not null,
  amount              numeric(10,2) not null,
  currency            text        not null,            -- 'PHP' or 'USD'
  provider            text        not null,            -- 'paymongo' | 'paypal'
  provider_ref        text,                            -- PayMongo session id / PayPal capture id
  paid                boolean     not null default false,
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);

-- Helpful indexes for the admin view / lookups
create index if not exists course_completions_email_idx   on public.course_completions (student_email);
create index if not exists course_completions_slug_idx     on public.course_completions (course_slug);
create index if not exists course_completions_paid_idx     on public.course_completions (paid);
create index if not exists course_completions_created_idx  on public.course_completions (created_at desc);

-- Lock the table down. Only the service-role key (used by our server routes)
-- can touch it; the public anon key cannot read or write certificate records.
alter table public.course_completions enable row level security;
-- (No policies = no anon access. The service role bypasses RLS entirely.)
