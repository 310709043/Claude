-- =============================================================
-- Focus Town – Supabase Schema
-- Run this in Supabase SQL Editor (Settings → SQL Editor → New query)
-- =============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────────
create table if not exists profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  username            text unique not null,
  display_name        text not null default '',
  avatar_url          text,
  role                text not null default 'Student',
  car_color           text not null default '#6c5ce7',
  car_skin            text not null default 'default',
  is_pro              boolean not null default false,
  focus_minutes_today integer not null default 0,
  tomato_count        integer not null default 0,
  streak_days         integer not null default 0,
  bio                 text,
  last_active_date    date default current_date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- FOCUS SESSIONS
-- ─────────────────────────────────────────────────────────────
create table if not exists focus_sessions (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete cascade,
  partner_id       uuid references profiles(id) on delete set null,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  duration_minutes integer not null default 0,
  session_type     text not null default 'solo' check (session_type in ('solo','paired')),
  status           text not null default 'active' check (status in ('active','paused','completed','cancelled')),
  tomatoes_earned  integer not null default 0,
  notes            text,
  created_at       timestamptz not null default now()
);

alter table focus_sessions enable row level security;

create policy "Users can view their own sessions"
  on focus_sessions for select using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can create their own sessions"
  on focus_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on focus_sessions for update using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- MESSAGES (real-time chat in focus rooms)
-- ─────────────────────────────────────────────────────────────
create table if not exists messages (
  id         uuid primary key default uuid_generate_v4(),
  session_id uuid not null references focus_sessions(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  content    text not null check (length(content) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

create policy "Session participants can read messages"
  on messages for select
  using (
    exists (
      select 1 from focus_sessions fs
      where fs.id = messages.session_id
        and (fs.user_id = auth.uid() or fs.partner_id = auth.uid())
    )
  );

create policy "Session participants can send messages"
  on messages for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from focus_sessions fs
      where fs.id = messages.session_id
        and (fs.user_id = auth.uid() or fs.partner_id = auth.uid())
    )
  );

-- Enable Realtime for messages
alter publication supabase_realtime add table messages;

-- ─────────────────────────────────────────────────────────────
-- GARAGE (owned items)
-- ─────────────────────────────────────────────────────────────
create table if not exists garage (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  item_id     text not null,
  item_type   text not null check (item_type in ('car_skin','weather_theme','avatar_frame')),
  unlocked_at timestamptz not null default now(),
  unique (user_id, item_id)
);

alter table garage enable row level security;

create policy "Users can view their own garage"
  on garage for select using (auth.uid() = user_id);

create policy "Service role can manage garage"
  on garage for all using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────
-- AWARDS
-- ─────────────────────────────────────────────────────────────
create table if not exists awards (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  award_type  text not null,
  value       integer not null default 0,
  earned_at   timestamptz not null default now()
);

alter table awards enable row level security;

create policy "Users can view their own awards"
  on awards for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- DAILY RESET (reset focus_minutes_today each day)
-- Call this via a Supabase Edge Function cron or pg_cron
-- ─────────────────────────────────────────────────────────────
create or replace function reset_daily_focus()
returns void language plpgsql as $$
begin
  update profiles
  set focus_minutes_today = 0,
      streak_days = case
        when last_active_date = current_date - interval '1 day' then streak_days + 1
        when last_active_date = current_date then streak_days
        else 0
      end,
      last_active_date = current_date
  where last_active_date < current_date;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- HELPFUL VIEWS
-- ─────────────────────────────────────────────────────────────
create or replace view focus_leaderboard as
select
  p.id,
  p.username,
  p.display_name,
  p.car_color,
  p.role,
  p.tomato_count,
  p.focus_minutes_today,
  p.streak_days,
  rank() over (order by p.tomato_count desc, p.focus_minutes_today desc) as rank
from profiles p
where p.last_active_date = current_date
order by rank;

-- ─────────────────────────────────────────────────────────────
-- STORAGE BUCKET for avatars
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
