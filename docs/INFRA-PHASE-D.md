# AIme infrastructure, Phase D (Frank infra)

The backend behind the new design. Three workstreams, all reverse-engineered from
what is already in this repo. This is the **plan plus the drafted artifacts**. Nothing
here creates a live Supabase project or an ElevenLabs agent yet; those steps are marked
**GATED** and need an explicit go.

Locked decisions (with Alex): caddie voice moves to **ElevenLabs**, persistence moves to
**Supabase**, replacing the OpenAI Realtime + in-memory + Notion stack.

## Where we are today (the seam)

| Concern | Today | Files | Phase D |
|---|---|---|---|
| Round data | in-memory `RoundContext`, lost on refresh | `src/context/RoundContext.tsx`, `src/types/round.ts` | Supabase tables + a thin client |
| App "DB" | Notion (project/session mgmt, not golf) | `server/index.ts` | retire for golf; Supabase is the store |
| Caddie voice | OpenAI GPT-4o Realtime over WebRTC | `src/components/airealtime/*`, `server/index.ts` `/api/token` + `/api/realtime` | ElevenLabs conversational agent |
| Putt solver | **built**, not wired to the app | `backend/` (FastAPI :8000), `putt-solver-service/` (DLL :8081) | call `POST /api/solve_putt` from the Putt-read screen + caddie tool |
| Course/GPS | mock registry | `course_data/datasets.json` | seed `courses` / `holes_info`, keep solver registry for DTM |

Security note found in the seam: `GET /api/token` currently returns the **raw**
`OPENAI_API_KEY` as `client_secret` (`server/index.ts`). That key is shipped to the
browser. The ElevenLabs migration removes this path; until then treat the key as burned
and rotate it. The replacement (`/api/elevenlabs/signed-url`) never exposes a key.

## Workstream 1, Supabase persistence

**Drafted:** `supabase/migrations/0001_aime_core.sql` (schema) + `0002_aime_rls.sql` (RLS).

Schema is 1:1 from `src/types/round.ts`:

```
profiles ──< clubs                         (the bag)
profiles ──< rounds ──< round_holes ──< shots
                   │            └──< putt_reads   (every solve_putt call)
                   ├──< round_players            (forward-looking, multiplayer)
                   └─ course_id ─> courses ──< holes_info   (reference data)
round_statistics (VIEW: RoundStatistics, computed from round_holes, not stored)
```

Design choices:
- `RoundStatistics` and `PlayerStats` are **derived** in the `round_statistics` view
  (score to par, fairways, GIR, putts, birdies/pars/bogeys/doubles), so they never drift
  from the holes. No stored aggregates to keep in sync.
- The TS string unions become Postgres **enums** (`shot_condition`, `shot_result`,
  `club_type`, `round_format`, `round_status`).
- **RLS**: every per-user table is owner-only via `auth.uid()`; `courses` / `holes_info`
  are authenticated-read, service-role-write. `putt_reads` are logged server-side with the
  service-role key.
- `courses.external_ref` ties a course row to the solver's `course_id` in
  `course_data/datasets.json`, so the app and the solver agree on identity.

GATED apply (the agent path, per the fleet's migration rule):
1. Create the AIme Supabase project (separate from Sage).
2. Apply `0001` then `0002` via the Supabase MCP (or `supabase db push`).
3. `supabase gen types typescript` into `src/types/supabase.ts`.
4. Add a `src/lib/supabase.ts` client and swap `RoundContext` writes from in-memory to
   Supabase (reads stay optimistic/local, writes persist).

Env added (see `.env.example`): `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`
(client), `SUPABASE_SERVICE_ROLE_KEY` (server only, bypasses RLS, never bundled).

## Workstream 2, ElevenLabs caddie voice

Replaces the OpenAI Realtime WebRTC path with an ElevenLabs **conversational agent**, so
the caddie has one voice that is testable before it ships (via `/switchboard` + a
`/scenario` regression, the same way every Frank voice agent is gated).

### The agent: "AIme Caddie"
- **Persona** (from the Notion brand spec, "Confident caddie"): decisive, concise, golf
  literate. One club, one read, one reason. Never rambles. Example cadence: "162 to the
  center, playing 168 into the wind. Smooth 7 iron. Favor the left side, the bunker right
  is the only real miss." On the green: "Aim 2 inches left, medium pace. It breaks right
  4 inches over the last third."
- **Voice:** a calm, grounded male caddie voice (pick in ElevenLabs, store as
  `ELEVENLABS_VOICE_ID`). Not hyped, not a hype-man. Trust, not noise.
- **Server tools** (the agent calls these; they hit the AIme backend + Supabase, the same
  `/ground` + server-tool pattern Frank uses):
  - `solve_putt(course_id, hole_id, ball_wgs84, cup_wgs84, stimp)` -> `POST /api/solve_putt`.
    Returns `aim_line_deg`, `initial_speed_mph`, `instruction_text`, `plot_points`. **The
    signature tool.** The agent speaks `instruction_text`; the screen draws `plot_points`.
  - `get_shot_guidance(hole_number, lie)` -> distances (front/center/back), wind and
    elevation adjusted "plays like", and a club pick from the player's `clubs` bag.
  - `log_shot(...)` -> insert into `shots`.
  - `record_score(hole_number, strokes, putts, fairway_hit, gir, penalties)` -> upsert
    `round_holes`.
  - `get_round_state()` -> current hole, score to par, from `round_statistics`.
- **Grounding:** the active round (course, the player's bag, current hole, recent shots).

### Voice migration steps (GATED at step 1)
1. **GATED**: create the ElevenLabs agent, capture `ELEVENLABS_AGENT_ID`.
2. Add `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`, `ELEVENLABS_VOICE_ID` to env.
3. Server: add `GET /api/elevenlabs/signed-url` that mints a short-lived conversation URL
   server-side (key never leaves the server). This is the secure replacement for the
   leaking `/api/token`.
4. Client: replace the `airealtime` WebRTC component with the ElevenLabs React SDK
   (`@elevenlabs/react` `useConversation`) pointed at the signed URL.
5. Wire the five server tools to the backend + Supabase.
6. **Alias** the agent in battlestation `switchboard/agents.json` as `aime-caddie` so it is
   testable: `/switchboard aime-caddie` and a `--scenario` with PASS/FAIL asserts (club
   pick sane, putt read returned, score recorded).
7. Only after a `/scenario` PASS: delete `/api/token`, `/api/realtime`, and `src/components/
   airealtime/*`. Rotate the exposed OpenAI key.

Env added: `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`, `ELEVENLABS_VOICE_ID`.

## Workstream 3, wire the putt solver

The solver is done and has a clean contract; this is a frontend + agent wiring job, no new
Python.

`POST /api/solve_putt` (FastAPI on :8000, which calls the DLL service on :8081):
```
request : { course_id, hole_id (1..18), ball_wgs84{lat,lon}, cup_wgs84{lat,lon}, stimp (0..20) }
response: { success, instruction_text, aim_line_deg, initial_speed_mph, plot_points_local[{x,y}], error }
```
Architecture constraint (keep it): WGS84 -> green-local transforms happen in the AIme
backend only; the DLL service never receives lat/lon.

Wiring:
1. `src/lib/puttSolver.ts`: typed client for `POST /api/solve_putt` (proxy through the
   Express server or call FastAPI directly per `REACT_APP_PUTT_API_URL`).
2. Putt-read screen (`design-system/screens/PuttReadLive`, the signature): on RTK
   ball+cup fix, call it, render `aim_line_deg` as the aim line and `plot_points_local` as
   the break path, speak `instruction_text` through the caddie.
3. Log each call to `putt_reads`.
4. Flip `AIME_TRANSFORM_MODE` from `mock` to real (pyproj) once a course DTM is registered
   in `course_data/datasets.json`.

Local run (dev): `uvicorn main:app` in `backend/` (:8000) + the DLL wrapper in
`putt-solver-service/` (:8081, Windows or the documented shim). See
`docs/RUNBOOK_PUTTSOLVER.md` and `docs/SSOT_AIME_PUTTSOLVER.md`.

Env added: `REACT_APP_PUTT_API_URL`, `PUTTSOLVER_SERVICE_URL`, `AIME_TRANSFORM_MODE`.

## Go-live gates (the proof, from the plan)

- **Persistence:** start a round, refresh, the round is still there (rows in `rounds` /
  `round_holes` / `shots`); `round_statistics` matches the summary screen.
- **Voice:** ask the ElevenLabs caddie a club question, get a spoken answer; a `/scenario`
  run PASSes. OpenAI Realtime path removed, key rotated.
- **Putt read:** trigger a read, the solver returns aim and speed and break, the screen
  draws the path and the caddie speaks it, a row lands in `putt_reads`.

## What is NOT done here (gated on a go)

Creating the Supabase project, creating the ElevenLabs agent, applying the migrations,
editing battlestation's `switchboard/agents.json`, and rotating the OpenAI key. Say go and
I take them one at a time.
