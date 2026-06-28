# AIme, design study

A reverse-engineering study for **AIme**, the voice-first AI golf caddie. Three things in one
document: a catalog of **our own design in every stage it exists today**, a teardown of the
**24 reference golf apps** in Alex's Dribbble "AIme" collection (style + functionality), and the
**synthesis thesis** that the new unified directions are built from.

The job of the new design: take the amalgam of the best of those 24, fuse it with what we have
already built, and land a single coherent identity + screen system in `~/code/AIME-2.0`, then
build the infrastructure under it (Supabase + ElevenLabs caddie + the putt-solver).

This file is Phase A (study). Phase B (the new directions) lives in `directions/`. Phase C
applies the chosen direction to the real app. Phase D wires the backend.

---

## Part 1, our design in all stages

We are not starting cold. AIme already exists across four stages, strongest in the middle.

| Stage | Where | What is there | What we reuse |
|---|---|---|---|
| **0. Brand seed** | `~/code/amygolf-web/index.html` | Static "coming soon" page. Near-black `#1a1a1a`, forest green `#2d6a4f`, gold `#c9a227`, a topographic-green SVG, tagline **"Trust the read. Speed wins."** | The brand seed: green + gold + topo + the tagline. The emotional core of the whole thing is *the read*. |
| **1. Design tokens** | `AIME-2.0/design-system/tokens.css` + `tokens.ts` | The canonical system: forest-green + GOLD on near-black, golf-semantic score colors (eagle/birdie/par/bogey/double), 8pt grid, radii, elevation, system font stack. Header note says it exists to reconcile a drifted repo palette (Tailwind grays/greens `#4ade80`, blues, amber across 80 CSS files). | The single source of truth to re-skin. One token change cascades. |
| **1b. Hero screens** | `AIME-2.0/design-system/screens/` | 5 reference implementations: **Splash, HoleOverview, PuttRead, PuttReadLive, RoundSummary**. Plus 15 components (AimLinePath, GreenTopoCanvas, ReadMyPuttCTA, RTKStatusDot, ScoreBadge, StatCard, PhoneFrame, BottomNav...). | The PuttRead + AimLinePath + GreenTopoCanvas trio is the signature asset. Direction anchors. |
| **2. The app** | `AIME-2.0/src/` (103 files) | The full round flow is built: round setup, shot guidance, putting, hole stats, round summary, profile, settings, subscription. On a **drifted palette** that needs retoning back onto the tokens. | The real surface to restyle. ~45 screens, the 15-component library. |
| **Spec (Notion)** | "Comprehensive Roadmap" + Phase 4/5 Wireframes + 928-criteria UI Prompts + Investor Demo Plan | 40-screen site map (S-01..S-40), personas, user flows, KPIs, the brand spec (Forest Green `#2d6a4f`, Charcoal `#1a1a1a`, Gold `#c9a227`), and the tone: **"Confident caddie"** ("Aim 2 degrees left, medium pace"). | The screen inventory + the voice/tone definition. The matrix in Part 3 maps to S-01..S-40. |
| **Concept (Figma)** | File "AIme-3.0", 40 AI-rendered screens (`current-figma/` has 5: splash, home, shot-setup, putt-line, hole-stats) | Gemini-rendered concept art of the full flow: dark, green, satellite course maps with gold aim overlays, big numeric readouts, the putt-line hero. Aspirational, not buildable as-is. | The visual ambition + the satellite-map-with-overlays language. |

**Infra today:** React 19 + TS + Express. Voice caddie on **OpenAI GPT-4o Realtime over WebRTC**
(`/api/token`, `/api/realtime`). The `RoundContext` data model (Round / Hole / Shot / Course /
Club / Player / PlayerStats) is held **in memory**. Persistence is via **Notion** (project
management, not golf). A **Python putt-solver** (FastAPI wrapping the Ovation Golf DLL) is
defined but **not wired**. No Supabase. Phase D replaces all of that with Frank infra.

**What this means:** our moat is already built and it is not on the reference board. Nobody in
the 24 shots does a **cm-accurate RTK putt read** (PuttRead + RoboPuck), and almost nobody does a
**real voice caddie**. We have both. The study below is about everything *around* that moat:
making the round flow, the course view, and the data as good as the best apps in the world.

---

## Part 2, the 24-shot reference corpus

All 24 shots are in `inspiration/` (contact sheet + per-shot "what to steal" in
`inspiration/INDEX.md`). Grouped by what they teach:

### Cluster A, on-course / map / shot guidance (the core caddie surface)
- **01 GolfX dashboard** — dark glassy aerial course, a sparkle **"AI Tip" card**. The single
  most AIme-like shot: an AI caddie overlaid on a real course. Lime accent.
- **16 Golf Course Tracking UI** — light, stylized **3D hole render**, glass distance chips
  (Remain / Plane / wind), an AR putting view with big green arrows on real grass.
- **17 ShotScope mobile** — photoreal aerial, **dotted yardage path** (242 / 231 / 182 yds), a
  circular wind control, a glass "Distances" bottom sheet (Short / Medium / Long).
- **02 Shot Tracking iWatch** — dark navy + blue, Apple Watch companion, **"Plays Like"**
  adjusted distance, a sparkle **"Press for optimal strategy"** AI hint.
- **18 TAG Heuer** (3D hole) — luxury **3D hole render with a target reticle**, club-on-the-tag
  yardage tags, "Record Shot" bar. The most premium course render of the set.

### Cluster B, analytics dashboards (post-round + stats)
- **20 ShotScope dashboard** — light web app, dotted shot dispersion, radial stat dials.
- **13 Golfee analytics** + **21 Golfee dashboard** — glass data cards over a course, dark with
  a yellow accent, big stat bubbles.
- **11 Puttly insights** — clean light forest-green, a **radar chart**. Closest palette to ours.
- **19 Golf app web** — light desktop dashboard, Last-5-rounds bar chart, a fairways-hit
  semicircle gauge, a beautiful **3D rendered hole** with front/center/back yardages.
- **12 Best AI Golf** — pose-estimation swing analysis (a different AI: vision, not caddie).
- **09 Golfy** — coach-client CRM, a **pentagon radar** athlete chart, a numbered lesson-zone map.

### Cluster C, scoring / round setup
- **10 Holeswing** — bright green, **score-entry steppers** (strokes / putts / sand / penalties),
  a directional fairway-miss control, round setup with a course card (CR / SR / Par) + players +
  format toggle.
- **08 Leaderboard stroke-play + map** — score entry with directional GIR/fairway miss arrows, a
  mini leaderboard, a satellite hole map with a distance pill.

### Cluster D, leaderboard / social / leagues
- **07 / 14 Leaderboard** — score-to-par rows, handicap, position chips.
- **04 Avid League** + **06 Avid Mobile** + **05 / 15 Avid collages** — a full **social golf
  network**: feed, posts, followers (PRO / Patron badges), leagues, events, a big circular
  **score ring "85"**, a handicap-index trend line. Acid-lime on dark green.
- **03 Golf Pro** — club/coach management: a "Swing Mastery" hero, a practice-time bar chart,
  game **bookings** with PAID / UNPAID badges. Orange/coral accent (an outlier).

### Cluster E, brand / identity systems
- **22 / 23 / 24 Knife & Fox brand kits** ("GreenZone") — **acid/electric lime + near-black**
  identity, a geometric "G" mark, **3D Memoji-style golfer avatars**, a **GPS-coordinate motif**
  (`N 33.7175 W 117.8311`), grain textures, boarding-pass graphics. The most complete brand
  system on the board, and the clearest statement of the "golf-tech 2025" look.

---

## Part 3, style synthesis

What the 24 actually agree on, and where they fork. This is the amalgam.

### The palette fork (the single biggest brand decision)
Three camps, by frequency:
1. **Acid-lime on near-black** (GreenZone 22/23/24, GolfX 01, Avid 04/06). The modern
   "golf-tech" signal. Energetic, app-native, distinctly *not* country-club.
2. **Light + forest-green** (Puttly 11, Golfy 09, ShotScope 20, golf-app-web 19, TAG 18,
   Holeswing 10). The clean-analytics camp. Calm, data-first, premium-clinical.
3. **Dark + a single bright accent** that is not lime: blue (iWatch 02), yellow (Golfee 13/21),
   brand red+green (TAG 18). Instrument-like.

Our equity sits between camps 1 and 2: **forest green + gold on near-black**. Gold is ours and
almost nobody else uses it. The open question the directions answer: do we **keep green+gold**,
**adopt acid-lime as the live/AI signal**, or **go light analytics**. We build one of each so the
choice is visible, not argued.

### Layout systems (ranked by how universal they are)
1. **Course imagery as the hero canvas, data floated on top.** Nearly every on-course shot.
   Two sub-styles: **photoreal satellite** (01, 17, 08) vs **stylized 3D render** (16, 18, 19).
   Ours (Figma) is satellite + heat-zones. We should support both: satellite for real GPS,
   stylized 3D for the hero/marketing read.
2. **Glassmorphism chips over the course** (01, 13, 16, 17, 21). Frosted cards carrying one
   number each (distance, wind, slope). This is the cheapest, highest-impact upgrade to our
   current flat-dark cards.
3. **Big numeric readouts** with a unit subscript. Universal. We have this.
4. **Dotted / dashed yardage path** tee-to-target with distance pills (17, 19, 08). We have the
   *putt* version (AimLinePath); we lack the *shot* version.
5. **Stat-tile grids** (GIR / fairways / putts / penalties). Universal in post-round. We have it.
6. **Radial / pentagon performance charts** (11, 09, 19). We do not have any radar; it is the
   most recognizable "serious stats" motif and we should add one.
7. **Score-entry steppers + directional miss inputs** (10, 08, 02, 18). We have scoring; the
   directional fairway/GIR miss control is a nice, learnable detail to adopt.
8. **Pill bottom nav** (16, many). We have it (BottomNav).

### Data-viz motifs to adopt
Radar/pentagon (skills), semicircle gauge (fairways-hit %), score-distribution bars
(eagle..triple, color-coded, which maps perfectly onto our existing score-semantic tokens), a
handicap-index trend line, and the **circular score ring** (Avid's "85"). We already have the
score-semantic colors; these charts are mostly missing and cheap to add.

### Type + iconography
The board is almost entirely clean geometric sans (system / Inter-like), big condensed numerics
for distances, thin line icons. TAG uses a touch of brand seriffishness; GreenZone a geometric
"G". Our system font stack is fine; the directions test one display face (condensed numeric) for
the hero reads to push past "default."

### Signature details worth stealing outright
- The **sparkle AI-tip card** (01, 02). This is literally our voice caddie, given a visual home.
- **"Plays Like"** adjusted distance (02). High-value caddie intelligence, trivially ours.
- The **target reticle** on the green (18) for the aim point.
- The **GPS-coordinate motif** (24) as a quiet identity texture (we already capture cm-GPS).
- The **3D avatar** identity (24) for the profile, if we ever want personality.

---

## Part 4, functionality matrix (the Phase D / screen spec)

Feature seen on the board, how common, whether AIme has it, and the gap. Ordered by build value.

| Feature | Refs | AIme today | Gap / action |
|---|---|---|---|
| **cm-accurate putt read (RTK)** | ~0 | **PuttRead + PuttReadLive + RoboPuck + AimLinePath** | **Our moat.** Wire the putt-solver (Phase D3). Make it the hero of every direction. |
| **Voice / AI caddie** | 2 (01, 02 hint only) | OpenAI Realtime (working), to move to 11Labs | **Our differentiator.** Give it a real visual state (idle / listening / answering) in every direction. Phase D2. |
| Course hero map + overlays | ~10 | GreenTopoCanvas + Figma satellite concept | Partial. Add glass chips + dotted shot path. |
| Glass stat chips over course | ~6 | flat dark cards | Add. Highest-impact visual upgrade. |
| Big numeric distance/score | universal | StatCard, hero numbers | Have. |
| "Plays Like" adjusted distance | 1 (02) | none | **Add.** Wind + elevation correction. High caddie value. |
| Dotted shot-path + distance pills | ~4 | putt only (AimLinePath) | Add shot-path variant. |
| Stat-tile grid (GIR/fairways/putts) | ~8 | StatCard, RoundSummary, HoleStats | Have. |
| Radar / pentagon perf chart | ~3 | none | Add (post-round / profile). |
| Semicircle gauge + bars + trend | ~4 | none | Add (stats screens). |
| Score-entry steppers + miss arrows | ~4 | scoring screens | Partial. Adopt directional miss control. |
| Round setup (course CR/SR/Par + players + format) | ~3 | RoundSettings model + setup | Have. |
| Circular score ring | ~2 | ScoreBadge (not a ring) | Optional. Nice for round summary. |
| Bottom-sheet distances | ~2 | none | Optional. |
| Leaderboard / multiplayer | ~5 | single-player focus | **Decision needed.** Caddie is solo today; multiplayer is a real expansion. |
| Watch companion | ~4 | none | Future. The caddie on the wrist is a strong story. |
| Handicap index + trend | ~3 | PlayerStats (data) | Partial. Surface it. |
| Subscription tiers | 1 (18) | subscription-page (stub) | Have stub. TAG shows the model ($/yr, $/mo). |
| 3D avatar / profile identity | 1 (24) | profile-page | Optional personality. |
| GPS-coordinate motif | 1 (24) | we capture cm-GPS | Free identity texture. |
| Social feed / posts / followers | ~5 (Avid) | none | **Out of scope** for the caddie. Note as a later platform play. |
| League / events / bookings | ~3 | none | **Out of scope** now. |
| Coaching CRM / lesson zones | 1 (09) | none | **Out of scope** now. |
| Swing vision analysis | 1 (12) | none | Different AI. Out of scope. |

**Read of the matrix:** we already own the two things the whole board mostly lacks (the putt
read and the voice caddie) plus a complete round flow. The honest gap is **presentation**, not
features: glass course treatment, a real charts kit, "Plays Like" intelligence, and a shot-path.
Those, plus making the voice caddie *visible*, are what the new design has to nail. Multiplayer,
social, coaching, and watch are real but deliberately later.

---

## Part 5, the synthesis thesis (what the new design is)

One sentence: **AIme is an instrument, not a scorecard.** The board's best work treats the
course as a living canvas and floats precise, glanceable numbers on it; the worst work buries a
caddie inside a social app. We lean all the way into the instrument: the course is the canvas,
the read is the hero, the caddie has a voice and a face, and every number is a clean, confident,
tabular reading. "Trust the read" is the whole product in three words.

What the new design fuses:
- **From us:** green + gold + topo, the cm putt read, "Trust the read," the score-semantic colors.
- **From the board:** glass chips over a real course (01/17), the sparkle AI-tip as the caddie's
  visual home (01/02), "Plays Like" (02), the 3D-render + reticle for the hero read (16/18), a
  real charts kit (11/19/09), the GPS-coordinate texture (24), and the option of an acid-lime
  "live" signal color for the AI state (the GreenZone/GolfX/Avid trend).

### The three directions we build (Phase B, in `directions/`)
Each is a full identity (brand is open to a refresh), each covers the same core screens (Splash,
Round setup, Shot guidance, **Putt read** = the signature, Round summary/stats, and the **voice
caddie state**), each opens standalone. We recommend one; Alex picks.

1. **Fairway** — the heritage evolved. Green + gold on near-black, photoreal course + gold aim
   lines, the topo motif as signature, warm and premium. True to "Trust the read." Lowest brand
   risk, closest to what is already built.
2. **Caddie** — the instrument (recommended candidate). Near-black, **acid-lime as the live/AI
   signal** (the caddie listening/answering glows lime), gold reserved for the hero read, glass
   chips over a satellite map, TAG-grade numeric precision. The voice caddie is the star. This is
   the most differentiated and the most "2025."
3. **Daylight** — clean analytics. Light, white, dense data-viz (radar + gauge + bars), forest
   green accent, ShotScope/Golfy/TAG rigor. Best-in-class stats. The biggest departure from the
   dark app we have, strongest for the post-round / web story.

The brand fork (keep green+gold vs adopt lime vs go light) is exactly the axis these three span,
so picking a direction *is* deciding the brand.

---

## How to view

```bash
cd ~/code/AIME-2.0/design-study
python3 -m http.server 8912     # then open http://127.0.0.1:8912/
```

`inspiration/` is the reference board (+ `INDEX.md` contact sheet). `current-figma/` is our
concept art. `directions/` is the new work (Phase B).

---

*Phase A built 2026-06-27 from the 24-shot Dribbble "AIme" collection + our four design stages.
Reference shots are Alex's curated collection; treat the source pixels as private.*
