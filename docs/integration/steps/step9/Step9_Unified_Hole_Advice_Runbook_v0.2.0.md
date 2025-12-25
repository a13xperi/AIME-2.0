# Step 9 — Unified Hole Advice Router (Tee-to-Green ⇄ Putting)

**Contract version:** `0.2.0`  
**Goal:** expose a *single* integration surface (`get_hole_advice`) that decides whether to:
- return a **TEE_TO_GREEN** plan (ball off green), or
- return a **PUTT** plan (ball on/near green, with a cup location)

This step is designed to let AIME treat “tee-to-green + green-to-cup” as one continuous user workflow, while keeping the DLL-hosted putt solver behind a stable server API.

---

## What’s Included

### Backend (FastAPI)
- **New endpoint:** `POST /api/get_hole_advice`
  - Resolves dataset via `course_id + hole_id`
  - Converts `ball_wgs84` (and `cup_wgs84` if provided) into `green_local_m`
  - Classifies `surface_state` using **manifest extents** (safe & deterministic)
  - Routes:
    - `ON_GREEN` → PUTT solver call (requires `cup_wgs84`)
    - `OFF_GREEN` → Tee-to-green **placeholder** (scaffold; needs upstream planner contract)
    - `UNKNOWN` → Treated as PUTT-capable (with warnings) if cup is provided; otherwise returns next-actions

- **Playback harness:** `backend/scripts/playback_get_hole_advice.py`
  - Replays a sequence of ball positions into the router and prints plan-type transitions

### Frontend (Next.js + Realtime)
- **New Next.js proxy route:** `POST /api/get_hole_advice` → forwards to backend `/api/get_hole_advice`
- **New Realtime tool:** `get_hole_advice`
- **New UI panel:** `AdvicePanel` (high-level plan/surface status)
- **Optional UI panel:** `PuttSolutionPanel` (detailed putt output when plan_type=PUTT)
- `MainContent` now supports `overlayPanels` (generic overlay slot)

### Contracts
- New schemas:
  - `tool.get_hole_advice.args.schema.json`
  - `tool.get_hole_advice.output.schema.json`
  - `get_hole_advice.request.schema.json`
  - `get_hole_advice.response.schema.json`
- Samples:
  - `tool.get_hole_advice.args.sample.json`
  - `tool.get_hole_advice.output.sample.json`
- Existing schemas/samples bumped to contract_version `0.2.0`

---

## How Routing Works (Current Scaffold)

**Evidence path (in code):** backend uses only:
- `manifest.extents_m` (x_max_m, y_max_m)
- the computed `ball_local_green` point

### Rule (v0)
- If `ball_local_green` ∈ [0..x_max] × [0..y_max] → `surface_state=ON_GREEN` → `plan_type=PUTT`
- Else if within ±`UNKNOWN_MARGIN_M` of the extents → `surface_state=UNKNOWN` → try PUTT (warn)
- Else → `surface_state=OFF_GREEN` → `plan_type=TEE_TO_GREEN` (placeholder)

> This is intentionally conservative because coordinate-frame uncertainty is common early in integration.

---

## Run It

### 1) Start backend + frontend
From repo root:
```bash
python start.py
```

Backend:
- http://localhost:8000
- http://localhost:8000/docs

Frontend:
- http://localhost:3000

### 2) Start putt solver service
Run whichever you have wired:
- mock: `putt-solver-service-mock_step6_v0.1.0.zip`
- real: `putt-solver-service-real_step7_v0.1.0.zip`

Set:
- `PUTT_SOLVER_URL=http://localhost:7071` (or your service host)

### 3) Confirm datasets are loaded
```bash
curl http://localhost:8000/api/datasets
```

---

## Test 1 — Direct API Call

```bash
curl -X POST http://localhost:8000/api/get_hole_advice \
  -H "Content-Type: application/json" \
  -d '{
    "contract_version": "0.2.0",
    "course_id": "riverside",
    "hole_id": 1,
    "ball_wgs84": {"lat": 40.268260, "lon": -111.659480},
    "cup_wgs84": {"lat": 40.268251, "lon": -111.659486},
    "want_plot": true
  }'
```

Expected:
- `plan_type` should be `PUTT` if the transformed ball point lands inside extents
- otherwise `TEE_TO_GREEN` (placeholder) with `next_actions`

---

## Test 2 — Playback Harness

```bash
python backend/scripts/playback_get_hole_advice.py \
  --backend-url http://localhost:8000 \
  --course-id riverside --hole-id 1 \
  --sequence backend/scripts/playback_sequence.sample.json \
  --cup-lat 40.268251 --cup-lon -111.659486
```

---

## Known Gaps (By Design)
- **TEE_TO_GREEN is scaffold-only.** We included a placeholder plan to keep the unified API stable.
  - Next step is to confirm the upstream tee-to-green planner contract and implement the service call inside `/api/get_hole_advice`.

- **Surface classification uses extents only.**
  - If you want higher confidence, add a mask check against the DTM grid (no-data areas) *after* confirming coordinate frame correctness.

---

## Next Step (after this)
Wire the existing tee-to-green engine into the router so that:
- `plan_type=TEE_TO_GREEN` returns real shot planning output
- the frontend can render a consistent “plan card” for both phases
