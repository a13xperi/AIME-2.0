# Step 12 — Productionize Sessions (Redis + Hysteresis + S2S Auth + Debug Bundles)

**API/tool contract version:** `0.5.0`  
**Dataset manifest contract version:** `0.1.0`  
**Goal:** make hole sessions safe for **multi-instance** backend deployments, reduce ON↔OFF flicker, add basic service-to-service auth, and add debuggability for integration.

This step builds on Step 11 (stateful sessions + mask-based surface detection).

---

## What’s included

### Backend (FastAPI)
1) **Session store backend selection** (`memory` default, `redis` optional)
- In-memory store remains the default for local dev.
- Redis-backed store is **opt-in** via env vars.
- Safe fallback: if Redis is requested but not available (e.g., missing `redis-py`), the backend **falls back to memory** and reports a warning in `/health`.

2) **Surface-state hysteresis (debounce)**
- Adds a “commit streak” mechanism to prevent jitter:
  - switching `ON_GREEN → OFF_GREEN` requires N consistent `OFF_GREEN` candidates
  - switching `OFF_GREEN → ON_GREEN` requires N consistent `ON_GREEN` candidates
- Defaults: `SURFACE_COMMIT_ON_STREAK=2`, `SURFACE_COMMIT_OFF_STREAK=2`

3) **Service-to-service API key support** (backend → downstream services)
- PuttSolver calls may include `X-API-Key` if `PUTT_SOLVER_API_KEY` is set.
- Tee-to-green calls may include `X-API-Key` if `TEE_TO_GREEN_API_KEY` is set.

4) **Debug bundle writer** (optional)
- When enabled, each `/api/get_hole_advice` request writes a JSON bundle to disk.
- Useful for diagnosing:
  - coordinate transforms
  - surface classification
  - routing decisions
  - downstream service latencies/errors

5) **Health endpoint**
- `GET /health` returns:
  - dataset registry status
  - session store backend + warnings
  - debug bundle configuration

---

## Service topology

```
AIME Frontend (Realtime tools + UI)
        |
        v
AIME Backend (FastAPI)
  - session store (memory OR redis)
  - get_hole_advice (unified)
  - surface classification + hysteresis
  - debug bundle writer (optional)
        |                         \
        |                          \
        v                           v
Putt Solver Service              Tee-to-Green Service (optional)
(DLL hosted server)              /plan_shot
```

---

## Environment variables

### A) Backend core
- `COURSE_DATA_ROOT` (default: `../course_data`)
- `DATASET_REGISTRY_PATH` (default: `../course_data/datasets.json`)
- `SESSION_TTL_S` (default: `7200` seconds)

### B) Session store backend
- `SESSION_STORE_BACKEND` = `memory` | `redis` (default `memory`)
- `REDIS_URL` (example: `redis://localhost:6379/0`)
- `REDIS_SESSION_PREFIX` (default: `aime:hole_session`)

### C) Surface hysteresis
- `SURFACE_COMMIT_ON_STREAK` (default: `2`)
- `SURFACE_COMMIT_OFF_STREAK` (default: `2`)

### D) Downstream services
- `PUTT_SOLVER_URL` (required for PUTT)
- `PUTT_SOLVER_TIMEOUT_S` (default `4.0`)
- `PUTT_SOLVER_API_KEY` (optional)

- `TEE_TO_GREEN_URL` (optional)
- `TEE_TO_GREEN_TIMEOUT_S` (default `3.0`)
- `TEE_TO_GREEN_API_KEY` (optional)

### E) Debug bundles
- `DEBUG_BUNDLE_ENABLED` = `true` | `false` (default `false`)
- `DEBUG_BUNDLE_DIR` (default: `backend/debug_bundles`)

---

## Setup & run

### 1) Start downstream services
- **Putt Solver Service** (required for `PUTT`):
  - Should implement `POST /solve_putt`
  - If you enable API keys, it must accept `X-API-Key: <token>`

- **Tee-to-green Service** (optional):
  - Should implement `POST /plan_shot`

> For production: run these behind internal-only networking (private subnets / internal LB), and treat the API keys as secrets.

### 2) Start Redis (optional)
If you want sessions shared across instances, run Redis.

Example (local):
```bash
# Your choice of redis setup; keep it private (localhost) for dev.
# In production, use managed redis with TLS/VPC.
redis-server
```

### 3) Start AIME Backend
From repo root:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export COURSE_DATA_ROOT="../course_data"
export PUTT_SOLVER_URL="http://localhost:9000"
export PUTT_SOLVER_API_KEY="<optional>"

# Optional: tee-to-green
export TEE_TO_GREEN_URL="http://localhost:9100"
export TEE_TO_GREEN_API_KEY="<optional>"

# Session store (optional)
export SESSION_STORE_BACKEND="redis"
export REDIS_URL="redis://localhost:6379/0"

# Hysteresis
export SURFACE_COMMIT_ON_STREAK="2"
export SURFACE_COMMIT_OFF_STREAK="2"

# Debug bundles (optional)
export DEBUG_BUNDLE_ENABLED="true"
export DEBUG_BUNDLE_DIR="./debug_bundles"

uvicorn main:app --reload --port 8000
```

### 4) Start AIME Frontend
From repo root:
```bash
cd frontend
npm install
export BACKEND_URL="http://localhost:8000"
npm run dev
```

---

## Manual API validation (curl)

### A) Health
```bash
curl -s http://localhost:8000/health | jq
```
✅ Expect: `dataset_registry.loaded=true` and `session_store.backend` is `memory` or `redis`

### B) Start a session
```bash
curl -s http://localhost:8000/api/session/start \
  -H 'Content-Type: application/json' \
  -d '{"contract_version":"0.5.0","course_id":"riverside","hole_id":1}' | jq
```
✅ Expect: `{ session_id, hole_state }`

### C) Set cup location
```bash
curl -s http://localhost:8000/api/session/set_cup_location \
  -H 'Content-Type: application/json' \
  -d '{
    "contract_version":"0.5.0",
    "session_id":"<paste>",
    "cup_wgs84":{"lat":40.268251,"lon":-111.659486}
  }' | jq
```

### D) Stream ball updates
```bash
curl -s http://localhost:8000/api/session/set_ball_location \
  -H 'Content-Type: application/json' \
  -d '{
    "contract_version":"0.5.0",
    "session_id":"<paste>",
    "ball_wgs84":{"lat":40.268240,"lon":-111.659520}
  }' | jq
```
✅ Expect: `hole_state.surface_state` + `surface_confidence`

### E) Verify hysteresis (optional but recommended)
Make two consecutive updates into an OFF_GREEN candidate area and confirm the first **holds**, the second **switches**.

### F) Get advice using session_id only
```bash
curl -s http://localhost:8000/api/get_hole_advice \
  -H 'Content-Type: application/json' \
  -d '{"contract_version":"0.5.0","session_id":"<paste>","want_plot":false}' | jq
```
✅ Expect:
- `plan_type=PUTT` when ON_GREEN
- `plan_type=TEE_TO_GREEN` when OFF_GREEN (and TEE_TO_GREEN_URL configured)

---

## Automated smoke test

A safe, no-DLL smoke test is included:
```bash
cd backend
python scripts/smoke_step12.py
```
It will:
- start a local mock PuttSolver that **requires** `X-API-Key`
- run session + advice calls via TestClient
- validate hysteresis switching behavior
- validate debug bundle writing

Report output:
- `/mnt/data/Step12_Executed_Smoke_Test_Results.md` (in this sandbox)

---

## Acceptance criteria
- Backend functions normally with `SESSION_STORE_BACKEND=memory`.
- If Redis is requested but unavailable, backend still starts and `/health` reports a fallback warning.
- With Redis configured properly, sessions persist across backend restart and are shared across instances.
- Hysteresis prevents single-sample flicker for ON↔OFF decisions.
- When API keys are configured, downstream calls include `X-API-Key`.
- Debug bundles are written when enabled and can be used to reproduce integration issues.

---

## Known limitations / follow-ups
- Redis mode requires adding `redis-py` and provisioning Redis (managed preferred).
- Coordinate frame + rotation sign convention still needs developer confirmation.
- Debug bundle storage should be treated as sensitive and rotated/cleaned in production.
