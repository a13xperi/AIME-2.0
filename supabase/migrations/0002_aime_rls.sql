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
