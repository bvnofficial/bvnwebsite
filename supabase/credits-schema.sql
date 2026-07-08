-- ============================================================================
-- BVN Credits / Wallet system
-- Run this ONCE in Supabase → SQL Editor (New query → paste → Run).
-- Safe to re-run. 1 credit = $1 USD.
-- ============================================================================

-- 1. Wallets — one row per user, cached balance (never negative).
create table if not exists public.wallets (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  balance    integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

-- 2. Ledger — every credit movement (audit trail).
create table if not exists public.credit_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  amount      integer not null,                 -- +topup / -spend
  kind        text not null check (kind in ('topup','spend','adjust')),
  description text,
  reference   text,                             -- PayPal capture id (idempotency)
  created_at  timestamptz not null default now()
);
create index if not exists credit_tx_user_idx on public.credit_transactions(user_id, created_at desc);
-- Never credit the same payment twice.
create unique index if not exists credit_tx_ref_uniq
  on public.credit_transactions(reference) where reference is not null;

-- 3. Entitlements — what a user has unlocked with credits.
create table if not exists public.entitlements (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  item_id       text not null,
  credits_spent integer not null default 0,
  created_at    timestamptz not null default now(),
  unique (user_id, item_id)
);

-- ----------------------------------------------------------------------------
-- Row Level Security: users can READ their own rows only.
-- All WRITES happen through our service-role API routes (which bypass RLS),
-- so there are deliberately NO insert/update policies for normal users.
-- ----------------------------------------------------------------------------
alter table public.wallets              enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.entitlements         enable row level security;

drop policy if exists "own wallet" on public.wallets;
create policy "own wallet" on public.wallets
  for select using (auth.uid() = user_id);

drop policy if exists "own tx" on public.credit_transactions;
create policy "own tx" on public.credit_transactions
  for select using (auth.uid() = user_id);

drop policy if exists "own entitlements" on public.entitlements;
create policy "own entitlements" on public.entitlements
  for select using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4. Atomic top-up (idempotent on PayPal capture reference).
-- ----------------------------------------------------------------------------
create or replace function public.topup_credits(
  p_user uuid, p_amount integer, p_desc text, p_ref text
) returns integer
language plpgsql security definer set search_path = public as $$
declare v_balance integer;
begin
  if p_amount <= 0 then raise exception 'amount must be positive'; end if;

  -- Already credited this payment? Return current balance, do nothing.
  if p_ref is not null and exists (
    select 1 from credit_transactions where reference = p_ref
  ) then
    select balance into v_balance from wallets where user_id = p_user;
    return coalesce(v_balance, 0);
  end if;

  insert into wallets(user_id, balance) values (p_user, p_amount)
    on conflict (user_id) do update
      set balance = wallets.balance + p_amount, updated_at = now()
    returning balance into v_balance;

  insert into credit_transactions(user_id, amount, kind, description, reference)
    values (p_user, p_amount, 'topup', p_desc, p_ref);

  return v_balance;
end; $$;

-- ----------------------------------------------------------------------------
-- 5. Atomic spend (checks balance + blocks duplicate ownership).
-- ----------------------------------------------------------------------------
create or replace function public.spend_credits(
  p_user uuid, p_item text, p_amount integer, p_desc text
) returns json
language plpgsql security definer set search_path = public as $$
declare v_balance integer;
begin
  if p_amount <= 0 then raise exception 'amount must be positive'; end if;

  if exists (select 1 from entitlements where user_id = p_user and item_id = p_item) then
    return json_build_object('ok', false, 'error', 'already_owned');
  end if;

  select balance into v_balance from wallets where user_id = p_user for update;
  if coalesce(v_balance, 0) < p_amount then
    return json_build_object('ok', false, 'error', 'insufficient', 'balance', coalesce(v_balance,0));
  end if;

  update wallets set balance = balance - p_amount, updated_at = now()
    where user_id = p_user
    returning balance into v_balance;

  insert into credit_transactions(user_id, amount, kind, description)
    values (p_user, -p_amount, 'spend', p_desc);

  insert into entitlements(user_id, item_id, credits_spent)
    values (p_user, p_item, p_amount);

  return json_build_object('ok', true, 'balance', v_balance);
end; $$;

-- Only the service role (our API) may execute these — NOT logged-in users
-- directly (otherwise anyone could grant themselves free credits via the REST API).
revoke all on function public.topup_credits(uuid,integer,text,text) from public;
revoke all on function public.spend_credits(uuid,text,integer,text) from public;
grant execute on function public.topup_credits(uuid,integer,text,text) to service_role;
grant execute on function public.spend_credits(uuid,text,integer,text) to service_role;

-- ----------------------------------------------------------------------------
-- 6. Admin manual adjustment (+/-). Used by the admin panel (service role only).
--    Positive adds credits, negative removes them; balance never goes below 0.
-- ----------------------------------------------------------------------------
create or replace function public.admin_adjust_credits(
  p_user uuid, p_amount integer, p_desc text
) returns integer
language plpgsql security definer set search_path = public as $$
declare v_balance integer;
begin
  if p_amount = 0 then raise exception 'amount must be non-zero'; end if;

  insert into wallets(user_id, balance) values (p_user, greatest(p_amount, 0))
    on conflict (user_id) do update
      set balance = greatest(wallets.balance + p_amount, 0), updated_at = now()
    returning balance into v_balance;

  insert into credit_transactions(user_id, amount, kind, description)
    values (p_user, p_amount, 'adjust', p_desc);

  return v_balance;
end; $$;

revoke all on function public.admin_adjust_credits(uuid,integer,text) from public;
grant execute on function public.admin_adjust_credits(uuid,integer,text) to service_role;
