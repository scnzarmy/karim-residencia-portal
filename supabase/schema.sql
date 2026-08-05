-- ============================================================
-- Karim Residencia — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Blocks: A, B, C (all active/open)
create table if not exists blocks (
  id text primary key,          -- 'A' | 'B' | 'C'
  name text not null,
  namaz_venue text not null
);

insert into blocks (id, name, namaz_venue) values
  ('A', 'Block A', 'P1 Musallah'),
  ('B', 'Block B', 'Block B Musallah'),
  ('C', 'Block C', 'Masjid Ayesha')
on conflict (id) do nothing;

-- Profiles: extends Supabase auth.users with role/block/approval info
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('resident', 'committee')),
  block_id text not null references blocks(id),
  house_number text,
  approved boolean not null default false,   -- residents need committee approval
  created_at timestamptz not null default now()
);

-- Notices (pinned announcements)
create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  block_id text not null references blocks(id),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- News updates
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  block_id text not null references blocks(id),
  title text not null,
  body text not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- Live status (water, electricity, parking, gates, etc.)
create table if not exists live_status (
  id uuid primary key default gen_random_uuid(),
  block_id text not null references blocks(id),
  label text not null,           -- e.g. 'Water Supply'
  status text not null,          -- e.g. 'Available', 'Suspended', 'Maintenance'
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

-- Complaints
create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  block_id text not null references blocks(id),
  resident_id uuid not null references profiles(id),
  subject text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  committee_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles enable row level security;
alter table notices enable row level security;
alter table news enable row level security;
alter table live_status enable row level security;
alter table complaints enable row level security;

-- Helper: current user's block + role, read from their own profile row
create or replace function current_block() returns text as $$
  select block_id from profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function current_role_kr() returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

-- Profiles: users see their own row; committee sees all profiles in their block
create policy "profiles_select_own" on profiles for select
  using (id = auth.uid());
create policy "profiles_select_committee" on profiles for select
  using (current_role_kr() = 'committee' and block_id = current_block());
create policy "profiles_insert_self" on profiles for insert
  with check (id = auth.uid());
create policy "profiles_update_committee" on profiles for update
  using (current_role_kr() = 'committee' and block_id = current_block());

-- Notices/news/live_status: anyone approved in the block can read; only committee can write
create policy "notices_select_block" on notices for select
  using (block_id = current_block());
create policy "notices_write_committee" on notices for insert
  with check (current_role_kr() = 'committee' and block_id = current_block());
create policy "notices_update_committee" on notices for update
  using (current_role_kr() = 'committee' and block_id = current_block());
create policy "notices_delete_committee" on notices for delete
  using (current_role_kr() = 'committee' and block_id = current_block());

create policy "news_select_block" on news for select
  using (block_id = current_block());
create policy "news_write_committee" on news for insert
  with check (current_role_kr() = 'committee' and block_id = current_block());
create policy "news_update_committee" on news for update
  using (current_role_kr() = 'committee' and block_id = current_block());
create policy "news_delete_committee" on news for delete
  using (current_role_kr() = 'committee' and block_id = current_block());

create policy "status_select_block" on live_status for select
  using (block_id = current_block());
create policy "status_write_committee" on live_status for insert
  with check (current_role_kr() = 'committee' and block_id = current_block());
create policy "status_update_committee" on live_status for update
  using (current_role_kr() = 'committee' and block_id = current_block());

-- Complaints: residents see/create their own; committee sees/updates all in their block
create policy "complaints_select_own" on complaints for select
  using (resident_id = auth.uid());
create policy "complaints_select_committee" on complaints for select
  using (current_role_kr() = 'committee' and block_id = current_block());
create policy "complaints_insert_resident" on complaints for insert
  with check (resident_id = auth.uid());
create policy "complaints_update_committee" on complaints for update
  using (current_role_kr() = 'committee' and block_id = current_block());

-- blocks table is public read (needed for the block-selection screen)
alter table blocks enable row level security;
create policy "blocks_public_read" on blocks for select using (true);
