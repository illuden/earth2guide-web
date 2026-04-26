-- ================================================
-- earth2guide.com — Initial Schema Migration
-- 001_initial_schema.sql
-- ================================================

-- ------------------------------------------------
-- 1. discord_messages
-- ------------------------------------------------
create table if not exists discord_messages (
  id              uuid primary key default gen_random_uuid(),
  message_id      text unique not null,
  channel         text,
  category        text,
  source_lang     text default 'en',
  copyright_restricted boolean default false,
  author_id       text,
  author_username text,
  content         text,
  attachments     jsonb,
  embeds          jsonb,
  published_at    timestamptz,
  slug_base       text,
  created_at      timestamptz default now()
);

create index if not exists idx_discord_messages_channel    on discord_messages(channel);
create index if not exists idx_discord_messages_category   on discord_messages(category);
create index if not exists idx_discord_messages_published  on discord_messages(published_at desc);
create index if not exists idx_discord_messages_fts
  on discord_messages using gin(to_tsvector('english', coalesce(content, '')));

-- ------------------------------------------------
-- 2. posts
-- ------------------------------------------------
create table if not exists posts (
  id                  uuid primary key default gen_random_uuid(),
  message_id          uuid references discord_messages(id) on delete set null,
  slug                text unique not null,
  category            text not null check (category in ('news','announcement','official_news','update','promotion','dev_qa')),
  title_ko            text,
  title_zh            text,
  body_ko             text,
  body_zh             text,
  body_original       text,
  summary_ko          text,
  summary_zh          text,
  source_url          text,
  cover_image_url     text,
  status              text not null default 'draft' check (status in ('draft','published','archived')),
  source              text not null default 'manual' check (source in ('manual','bot','gemini')),
  translation_status  text not null default 'pending' check (translation_status in ('pending','done','failed')),
  published_at        timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists idx_posts_slug       on posts(slug);
create index if not exists idx_posts_category   on posts(category);
create index if not exists idx_posts_status     on posts(status);
create index if not exists idx_posts_published  on posts(published_at desc) where status = 'published';
create index if not exists idx_posts_fts_ko
  on posts using gin(to_tsvector('simple', coalesce(title_ko, '') || ' ' || coalesce(body_ko, '')));
create index if not exists idx_posts_fts_zh
  on posts using gin(to_tsvector('simple', coalesce(title_zh, '') || ' ' || coalesce(body_zh, '')));

-- updated_at 자동 갱신 함수
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at_column();

-- ------------------------------------------------
-- 3. wiki_pages
-- ------------------------------------------------
create table if not exists wiki_pages (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  category            text check (category in ('account','essence','jewel','raid','general')),
  title_ko            text,
  title_zh            text,
  body_ko             text,
  body_zh             text,
  status              text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order          int default 0,
  translation_status  text not null default 'pending' check (translation_status in ('pending','done','failed')),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists idx_wiki_slug      on wiki_pages(slug);
create index if not exists idx_wiki_category  on wiki_pages(category);
create index if not exists idx_wiki_status    on wiki_pages(status);
create index if not exists idx_wiki_fts_ko
  on wiki_pages using gin(to_tsvector('simple', coalesce(title_ko, '') || ' ' || coalesce(body_ko, '')));

create or replace trigger wiki_pages_updated_at
  before update on wiki_pages
  for each row execute function update_updated_at_column();

-- ------------------------------------------------
-- 4. RLS (Row Level Security)
-- ------------------------------------------------

-- posts: anon은 published만 읽기 가능
alter table posts enable row level security;

create policy "posts_public_read"
  on posts for select
  to anon, authenticated
  using (status = 'published');

create policy "posts_service_all"
  on posts for all
  to service_role
  using (true)
  with check (true);

-- wiki_pages: anon은 published만 읽기 가능
alter table wiki_pages enable row level security;

create policy "wiki_public_read"
  on wiki_pages for select
  to anon, authenticated
  using (status = 'published');

create policy "wiki_service_all"
  on wiki_pages for all
  to service_role
  using (true)
  with check (true);

-- discord_messages: service_role만 접근
alter table discord_messages enable row level security;

create policy "discord_service_all"
  on discord_messages for all
  to service_role
  using (true)
  with check (true);
