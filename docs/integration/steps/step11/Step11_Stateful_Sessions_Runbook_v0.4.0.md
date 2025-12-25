# Step 11 — Stateful Hole Sessions + Mask-Based ON_GREEN Classification

**Contract version:** `0.4.0`  
**Goal:** introduce **hole sessions** so the client can stream ball/cup updates with minimal payloads, and improve ON_GREEN detection using the **DTM no-data mask** (not just extents).

This step builds on Step 10 (unified hole advice + tee-to-green + putt solver).

---

## What’s included

### Backend (FastAPI)
- **In-memory Hole Session Store** (TTL-based)
  - `POST /api/session/start`
  - `POST /api/session/set_ball_location`
  - `POST /api/session/set_cup_location`
  - `GET /api/session/{session_id}`
- `get_hole_advice` now supports **session mode**
  - You can call it with `{ "session_id": "..." }`
- Improved **surface classification**
  - Uses DTM **grid no-data mask** (valid cell ≠ `no_data_value`)
  - Falls back to extents-only if mask is unavailable

### Frontend (Next.js proxy routes)
- Added proxy routes under:
  - `/api/session/start`
  - `/api/session/set_ball_location`
  - `/api/session/set_cup_location`
  - `/api/session/[session_id]` (GET)

### Contracts
- New schemas:
  - `session.start.request.schema.json`
  - `session.start.response.schema.json`
  - `session.set_ball_location.request.schema.json`
  - `session.set_cup_location.request.schema.json`
  - `session.set_location.response.schema.json`
- Updated schemas:
  - `get_hole_advice.request.schema.json` (supports `session_id`)
  - `tool.get_hole_advice.args.schema.json` (supports `session_id`)
  - `green_manifest.schema.json` (adds `grid.axis_mapping` hint)

### Scripts
- New playback harness:
  - `backend/scripts/playback_session_stream.py`

---

## Service topology

```
AIME Frontend (Realtime tools + UI)
        |
        v
AIME Backend (FastAPI)
  - get_hole_advice (unified)
  - session store (in-memory TTL)
        |                         \
        |                          \
        v                           v
Putt Solver Service              Tee-to-Green Service (optional)
(DLL hosted server)              /plan_shot
```

---

## Setup & run

### 1) Start downstream services
- **Putt Solver Service** (required)
- **Tee-to-Green Service** (optional; only needed for OFF_GREEN tee-to-green planning)

### 2) Start AIME Backend
From repo root:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export COURSE_DATA_ROOT="../course_data"
export PUTT_SOLVER_URL="http://localhost:9000"
export TEE_TO_GREEN_URL="http://localhost:9100"   # optional
export SESSION_TTL_S="7200"                       # optional (default 7200)

uvicorn main:app --reload --port 8000
```

### 3) Start AIME Frontend
From repo root:
```bash
cd frontend
npm install
export BACKEND_URL="http://localhost:8000"
npm run dev
```

---

## Manual API validation (curl)

### A) Start a session
```bash
curl -s http://localhost:8000/api/session/start \
  -H 'Content-Type: application/json' \
  -d '{"contract_version":"0.4.0","course_id":"riverside","hole_id":1}'
```
✅ Expect: `{ session_id, hole_state, ... }`

### B) Set pin/cup location (optional but needed for PUTT)
```bash
curl -s http://localhost:8000/api/session/set_cup_location \
  -H 'Content-Type: application/json' \
  -d '{
    "contract_version":"0.4.0",
    "session_id":"<paste>",
    "cup_wgs84":{"lat":40.268251,"lon":-111.659486}
  }'
```

### C) Stream ball updates
```bash
curl -s http://localhost:8000/api/session/set_ball_location \
  -H 'Content-Type: application/json' \
  -d '{
    "contract_version":"0.4.0",
    "session_id":"<paste>",
    "ball_wgs84":{"lat":40.268240,"lon":-111.659520}
  }'
```
✅ Expect: `hole_state.surface_state` + `surface_confidence`

### D) Get advice using **session_id only**
```bash
curl -s http://localhost:8000/api/get_hole_advice \
  -H 'Content-Type: application/json' \
  -d '{"contract_version":"0.4.0","session_id":"<paste>","want_plot":false}'
```

---

## Automated playback test

```bash
python backend/scripts/playback_session_stream.py \
  --backend-url http://localhost:8000 \
  --course-id riverside --hole-id 1 \
  --sequence backend/scripts/playback_sequence.sample.json \
  --cup-lat 40.268251 --cup-lon -111.659486
```

---

## Expected outcomes / acceptance criteria
- Session endpoints return 200 and update state correctly.
- `get_hole_advice` can be called with **session_id only**.
- Surface classification uses mask when grid is available:
  - Valid cell → `ON_GREEN`
  - No-data cell inside extents → `OFF_GREEN` (or `UNKNOWN` if near valid neighbor)
  - Mask missing/unreadable → fallback warning + extents-only behavior
- Sessions expire by TTL (return 404 for old `session_id`).

---

## Known limitations (by design for Phase 0–1)
- Session store is **in-memory**:
  - Not shared across backend instances
  - Reset on restart
  - Replace with Redis for production scaling
