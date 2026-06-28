# AIme go-live runbook (Phase D)

Ordered checklist to take Phase D from "code complete + verified" to "live in the
running app." Operator steps are the only blockers; each is followed by the code
step it unblocks. Local-dev first (per the approved plan); Vercel deploy is a
later pass.

Status at time of writing (branch `feat/aime-design-system`, PR #7):

- Putt-solver: wired into the putt-read screen, verified live (mock engine).
- Persistence: client + typed schema + rounds repo + `RoundContext` wiring +
  Supabase-backed anonymous auth (`auth-context.tsx`). Build-verified and
  runtime-proven against a local Postgres (schema + mapping + `round_statistics`
  view + RLS isolation all pass).
- Voice: ElevenLabs path built alongside OpenAI: server `GET
  /api/elevenlabs/signed-url` + the `/caddie` screen (`@elevenlabs/react`).
  Build-verified.

## Track A: persistence live (local)

Operator (Supabase dashboard, project `aime-golf` = `truyhpzlkatsoccmzyew`):

1. **Restore** the project (it is paused). [Blocked for the agent by the safety
   classifier; one click here.]
2. **Enable Anonymous sign-ins**: Authentication > Sign In / Providers >
   Anonymous > enable. (Without this, every write fails RLS.)
3. **Apply migrations**: SQL editor, paste `supabase/migrations/0001_aime_core.sql`
   then `0002_aime_rls.sql` (idempotent, proven to apply clean). Or
   `supabase link --project-ref truyhpzlkatsoccmzyew && supabase db push`.
4. Copy **Project URL** + **anon (publishable) key** and hand them over.

Agent (me), once 1-4 are done:

5. Create `.env.local` with `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY`.
6. Regenerate `src/lib/database.types.ts` from the live DB
   (`supabase gen types typescript --project-id truyhpzlkatsoccmzyew`).
7. `npm start`, play a round, confirm rows in `rounds` / `round_holes` / `shots`
   / `putt_reads` and correct `round_statistics`; confirm an incognito window
   (different anon uid) sees none (RLS). Refresh mid-round to confirm persistence.
8. Build the W2 "save your account" UI on the Profile screen (wire it to the real
   auth user + `signup()` upgrade). Deferred until now so it can be tested against
   a live anonymous session rather than the current static mock.

## Track B: voice caddie live

Operator:

1. Tune the `aime-caddie` agent via battlestation `scripts/aime-agent.sh` (never
   raw-PATCH the shared Frank account): system prompt, the `solve_putt` client
   tool (args per `contracts/schemas/tool.solve_putt.args.schema.json`), Frank
   voice id.
2. Set `ELEVENLABS_API_KEY` + `ELEVENLABS_AGENT_ID` in the server env.

Agent (me), once 1-2 are done:

3. Runtime-test `/caddie`: talk to it, ask for a club / putt read, confirm the
   `solve_putt` client tool calls the backend and the caddie speaks the read.
4. Author + run a Switchboard `/scenario` for the caddie; iterate to PASS.
5. Cutover: point `/golf` + `/aime` at `ElevenLabsCaddie`, delete `/api/token` +
   `/api/realtime` from `server/index.ts`, retire `src/components/airealtime/*`.

Operator, after cutover:

6. **Rotate `OPENAI_API_KEY`** (it was exposed via the old `/api/token`). Hand
   over the new value if anything still needs OpenAI; otherwise drop it.

## Later (out of scope for this pass)

- Deploy to Vercel: set the same env vars in the Vercel dashboard, `vercel --prod`.
  Frontend -> Supabase works on Vercel; the Python putt-solver still needs a
  production host (Dockerfile + Railway/Render) before live reads work off-localhost.

## Verification gates

- Build: `react-scripts build` exit 0; `tsc --noEmit` shows only the pre-existing
  `server/` + `ErrorBoundary` test errors.
- Persistence: a played round survives a refresh and is visible only to its owner.
- Voice: caddie answers + speaks a solver read; a `/scenario` PASSes; the browser
  never receives a raw API key (Network tab) after the cutover.
