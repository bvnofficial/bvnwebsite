-- ============================================================================
-- BVN Blog posts
-- Run this ONCE in Supabase → SQL Editor (New query → paste → Run).
-- Safe to re-run. Backs the /blog section and the auto-publishing pipeline.
--
-- Content model mirrors lib/blog-posts.ts:
--   keywords  = string[]            (stored as jsonb)
--   sections  = ContentSection[]    (stored as jsonb: paragraph|h2|h3|list|
--                                     numbered|callout|cta)
-- ============================================================================

create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  meta_title       text not null,
  meta_description text not null,
  category         text not null default 'Marketing',   -- Marketing | Operations | (future: Virtual Assistants)
  read_time        text,                                 -- e.g. "8 min read"
  excerpt          text not null default '',
  keywords         jsonb not null default '[]'::jsonb,   -- string[]
  sections         jsonb not null default '[]'::jsonb,   -- ContentSection[]
  status           text not null default 'draft'
                     check (status in ('draft','scheduled','published')),
  scheduled_for    timestamptz,                          -- when a scheduled post should go live
  published_at     timestamptz,                          -- when it actually went live
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists blog_posts_status_idx    on public.blog_posts(status);
create index if not exists blog_posts_category_idx  on public.blog_posts(category);
create index if not exists blog_posts_published_idx on public.blog_posts(published_at desc);
create index if not exists blog_posts_schedule_idx  on public.blog_posts(scheduled_for)
  where status = 'scheduled';

-- Keep updated_at fresh on every write.
create or replace function public.touch_blog_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch before update on public.blog_posts
  for each row execute function public.touch_blog_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security: the public may READ published posts only.
-- Drafts and scheduled posts stay private. All WRITES happen through our
-- service-role API routes (which bypass RLS), so there are deliberately NO
-- insert/update/delete policies for anon or logged-in users.
-- ----------------------------------------------------------------------------
alter table public.blog_posts enable row level security;

drop policy if exists "published posts are public" on public.blog_posts;
create policy "published posts are public" on public.blog_posts
  for select using (status = 'published');

-- ----------------------------------------------------------------------------
-- Publish any scheduled posts whose time has arrived. The cron / API route
-- calls this each run. Returns the slugs that just went live so the caller
-- can revalidate exactly those pages.
-- ----------------------------------------------------------------------------
create or replace function public.publish_due_blog_posts()
returns table (slug text)
language plpgsql security definer set search_path = public as $$
begin
  return query
  update public.blog_posts
     set status = 'published',
         published_at = coalesce(published_at, now())
   where status = 'scheduled'
     and scheduled_for is not null
     and scheduled_for <= now()
  returning blog_posts.slug;
end; $$;

revoke all on function public.publish_due_blog_posts() from public;
grant execute on function public.publish_due_blog_posts() to service_role;
