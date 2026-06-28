-- ============================================================================
-- AIme schema, PASTE-ONCE bundle (PER-623). Generated from the two migrations
-- 0001_aime_core.sql + 0002_aime_rls.sql (the source of truth). Idempotent:
-- safe to run on the restored aime-golf project via the Supabase SQL editor.
-- ============================================================================

-- ============================================================================
-- AIme Golf, core schema (Phase D, draft, NOT yet applied)
-- Derived 1:1 from src/types/round.ts (Course / HoleInfo / Player / Shot /
-- Hole / Club / RoundSettings / Round). Replaces the in-memory RoundContext
-- and the Notion project store for golf data.
--
-- Apply to the new AIme Supabase project (gated). Idempotent: safe to re-run.
-- RLS lives in 0002_aime_rls.sql. Derived stats live in the round_statistics view.
-- ============================================================================

create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ---- enums (mirror the TS string unions) ----------------------------------
do $$ begin
  create type shot_condition as enum ('Tee','Fairway','Rough','Bunker','Penalty','Green');
exception when duplicate_object then null; end $$;

do $$ begin
  create type shot_result as enum ('Good','Fair','Poor','Out of Bounds','Water','Hazard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type club_type as enum ('Driver','Fairway Wood','Hybrid','Iron','Wedge','Putter');
exception when duplicate_object then null; end $$;

do $$ begin
  create type round_format as enum ('Stroke Play','Match Play','Scramble','Best Ball');
exception when duplicate_object then null; end $$;

do $$ begin
  create type round_status as enum ('in_progress','complete','abandoned');
exception when duplicate_object then null; end $$;

-- ---- shared updated_at trigger --------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

-- ---- profiles (one per auth user) -----------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  handicap    numeric(4,1),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ---- clubs (the bag, per profile) -----------------------------------------
-- maps Club + ClubBag. average/min/max distance in yards.
create table if not exists clubs (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references profiles(id) on delete cascade,
  name             text not null,
  type             club_type not null,
  average_distance int  not null,
  min_distance     int,
  max_distance     int,
  sort_order       int  not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_clubs_profile on clubs(profile_id);
drop trigger if exists trg_clubs_updated on clubs;
create trigger trg_clubs_updated before update on clubs
  for each row execute function set_updated_at();

-- ---- courses + holes_info (reference data, shared read) --------------------
-- maps Course + HoleInfo. external_ref is the upstream course-data id
-- (e.g. the putt-solver course_id in course_data/datasets.json).
create table if not exists courses (
  id           uuid primary key default gen_random_uuid(),
  external_ref text unique,
  name         text not null,
  location     text,
  total_par    int,
  total_yards  int,
  created_at   timestamptz not null default now()
);

create table if not exists holes_info (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references courses(id) on delete cascade,
  number     int  not null check (number between 1 and 36),
  par        int  not null,
  yards      int,
  handicap   int,
  unique (course_id, number)
);
create index if not exists idx_holes_info_course on holes_info(course_id);

-- ---- rounds ---------------------------------------------------------------
-- maps Round + RoundSettings. Statistics are DERIVED (see round_statistics view).
create table if not exists rounds (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references profiles(id) on delete cascade,
  course_id        uuid references courses(id) on delete set null,
  format           round_format not null default 'Stroke Play',
  gps_enabled      boolean not null default true,
  puck_enabled     boolean not null default false,
  auto_track_shots boolean not null default false,
  start_time       timestamptz not null default now(),
  end_time         timestamptz,
  current_hole     int not null default 1,
  status           round_status not null default 'in_progress',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_rounds_profile on rounds(profile_id);
create index if not exists idx_rounds_status  on rounds(profile_id, status);
drop trigger if exists trg_rounds_updated on rounds;
create trigger trg_rounds_updated before update on rounds
  for each row execute function set_updated_at();

-- ---- round_holes ----------------------------------------------------------
-- maps Hole + HoleStats (per played hole in a round).
create table if not exists round_holes (
  id                   uuid primary key default gen_random_uuid(),
  round_id             uuid not null references rounds(id) on delete cascade,
  number               int  not null check (number between 1 and 36),
  par                  int  not null,
  score                int,
  fairway_hit          boolean,
  green_in_regulation  boolean,
  putts                int not null default 0,
  penalties            int not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (round_id, number)
);
create index if not exists idx_round_holes_round on round_holes(round_id);
drop trigger if exists trg_round_holes_updated on round_holes;
create trigger trg_round_holes_updated before update on round_holes
  for each row execute function set_updated_at();

-- ---- shots ----------------------------------------------------------------
-- maps Shot. gps split to columns; carry/total/remaining in yards.
create table if not exists shots (
  id            uuid primary key default gen_random_uuid(),
  round_id      uuid not null references rounds(id) on delete cascade,
  round_hole_id uuid references round_holes(id) on delete cascade,
  hole_number   int  not null,
  shot_number   int  not null,
  club          text,
  distance      int,
  condition     shot_condition,
  result        shot_result,
  gps_lat       double precision,
  gps_lon       double precision,
  carry         int,
  total         int,
  remaining     int,
  taken_at      timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index if not exists idx_shots_round on shots(round_id);
create index if not exists idx_shots_hole  on shots(round_id, hole_number);

-- ---- putt_reads -----------------------------------------------------------
-- logs every putt-solver call (POST /api/solve_putt). Ties the signature
-- screen to persistence; plot_points stored as jsonb [{x,y}, ...].
create table if not exists putt_reads (
  id                uuid primary key default gen_random_uuid(),
  round_id          uuid references rounds(id) on delete cascade,
  round_hole_id     uuid references round_holes(id) on delete cascade,
  ball_lat          double precision not null,
  ball_lon          double precision not null,
  cup_lat           double precision not null,
  cup_lon           double precision not null,
  stimp             numeric(4,1) not null,
  aim_line_deg      numeric(6,2),
  initial_speed_mph numeric(6,2),
  instruction_text  text,
  plot_points       jsonb,
  solver_request_id text,
  created_at        timestamptz not null default now()
);
create index if not exists idx_putt_reads_round on putt_reads(round_id);

-- ---- round_players (forward-looking, multiplayer) -------------------------
-- maps RoundSettings.players[] for Match/Scramble/Best Ball. Solo rounds use
-- rounds.profile_id and need no rows here. guest_name covers non-app players.
create table if not exists round_players (
  id          uuid primary key default gen_random_uuid(),
  round_id    uuid not null references rounds(id) on delete cascade,
  profile_id  uuid references profiles(id) on delete set null,
  guest_name  text,
  scores      int[] not null default '{}',
  created_at  timestamptz not null default now(),
  check (profile_id is not null or guest_name is not null)
);
create index if not exists idx_round_players_round on round_players(round_id);

-- ---- derived statistics (maps RoundStatistics, computed not stored) --------
create or replace view round_statistics as
select
  r.id as round_id,
  r.profile_id,
  coalesce(sum(rh.score), 0)                                              as total_score,
  coalesce(sum(rh.par), 0)                                                as total_par,
  coalesce(sum(rh.score), 0) - coalesce(sum(rh.par), 0)                   as score_to_par,
  coalesce(sum(rh.score) filter (where rh.number <= 9), 0)                as front_nine_score,
  coalesce(sum(rh.score) filter (where rh.number > 9), 0)                 as back_nine_score,
  count(*) filter (where rh.fairway_hit)                                  as fairways_hit,
  count(*) filter (where rh.par >= 4)                                     as fairways_total,
  count(*) filter (where rh.green_in_regulation)                         as greens_in_regulation,
  count(*) filter (where rh.score is not null)                           as greens_total,
  coalesce(sum(rh.putts), 0)                                              as total_putts,
  coalesce(sum(rh.penalties), 0)                                         as total_penalties,
  count(*) filter (where rh.score = rh.par - 1)                          as birdies,
  count(*) filter (where rh.score = rh.par)                              as pars,
  count(*) filter (where rh.score = rh.par + 1)                          as bogeys,
  count(*) filter (where rh.score >= rh.par + 2)                         as double_bogeys_plus
from rounds r
left join round_holes rh on rh.round_id = r.id
group by r.id, r.profile_id;


-- ============================================================================
-- AIme Golf, row-level security (Phase D, draft, NOT yet applied)
-- Every per-user table: the owner (auth.uid()) can do everything with their
-- own rows and nothing with anyone else's. Reference data (courses, holes_info)
-- is world-readable to authenticated users; only the service role writes it.
-- Run AFTER 0001_aime_core.sql. Idempotent.
-- ============================================================================

-- Make the derived view respect the caller's RLS (PG15+ / Supabase default).
alter view round_statistics set (security_invoker = true);

-- ---- enable RLS -----------------------------------------------------------
alter table profiles      enable row level security;
alter table clubs         enable row level security;
alter table courses       enable row level security;
alter table holes_info    enable row level security;
alter table rounds        enable row level security;
alter table round_holes   enable row level security;
alter table shots         enable row level security;
alter table putt_reads    enable row level security;
alter table round_players enable row level security;

-- ---- profiles: owner only -------------------------------------------------
drop policy if exists profiles_self on profiles;
create policy profiles_self on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- ---- clubs: owner via profile_id -----------------------------------------
drop policy if exists clubs_owner on clubs;
create policy clubs_owner on clubs
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---- courses + holes_info: authenticated read, service-role write ----------
drop policy if exists courses_read on courses;
create policy courses_read on courses
  for select using (auth.role() = 'authenticated');

drop policy if exists holes_info_read on holes_info;
create policy holes_info_read on holes_info
  for select using (auth.role() = 'authenticated');
-- (no insert/update/delete policy => only the service role can write reference data)

-- ---- rounds: owner via profile_id ----------------------------------------
drop policy if exists rounds_owner on rounds;
create policy rounds_owner on rounds
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---- child tables: owner via the parent round -----------------------------
drop policy if exists round_holes_owner on round_holes;
create policy round_holes_owner on round_holes
  for all using (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()))
  with check (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()));

drop policy if exists shots_owner on shots;
create policy shots_owner on shots
  for all using (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()))
  with check (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()));

drop policy if exists putt_reads_owner on putt_reads;
create policy putt_reads_owner on putt_reads
  for all using (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()))
  with check (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()));

drop policy if exists round_players_owner on round_players;
create policy round_players_owner on round_players
  for all using (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()))
  with check (exists (select 1 from rounds r where r.id = round_id and r.profile_id = auth.uid()));

-- Notes:
--   - The PuttSolver write path (server logging putt_reads, seeding courses)
--     uses the SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. Keep that key
--     server-side only (never in REACT_APP_* or the client bundle).
--   - Multiplayer read for non-owner participants is intentionally NOT granted
--     here; add a participant-aware policy when multiplayer ships.
