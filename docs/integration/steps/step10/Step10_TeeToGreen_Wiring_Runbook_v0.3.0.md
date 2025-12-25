# Step 10 — Wire Tee-to-Green Planner into Unified get_hole_advice

**Contract version:** `0.3.0`  
**Goal:** make `get_hole_advice` return a *real* `TEE_TO_GREEN` plan (instead of a placeholder) by calling a tee-to-green planner service.

This step preserves the Step 9 guarantee:
- The model calls **one tool**: `get_hole_advice`
- The backend routes:
  - OFF_GREEN / TRANSITION → tee-to-green planner
  - ON_GREEN / UNKNOWN → putt solver service

---

## What’s included
### Backend (FastAPI)
- New `TeeToGreenClient` that calls: `{TEE_TO_GREEN_URL}/plan_shot`
- `/api/get_hole_advice` now returns a structured tee-to-green plan when configured
- Falls back to a placeholder plan when `TEE_TO_GREEN_URL` is not set

### Frontend (Next.js)
- `AdvicePanel` renders tee-to-green fields when present:
  - summary
  - recommended_club
  - carry/total (m + yards)
  - bearing (deg)

### Contracts
- New schemas:
  - `tee_to_green.request.schema.json`
  - `tee_to_green.response.schema.json`
- Updated tee-to-green branch of:
  - `get_hole_advice.response.schema.json`
  - `tool.get_hole_advice.output.schema.json`

---

## Service topology
```
AIME Frontend (Realtime tool)
        |
        v
AIME Backend (get_hole_advice router)
   |                     |
   | OFF_GREEN            | ON_GREEN / UNKNOWN
   v                     v
Tee-to-Green Service     PuttSolver Service (DLL-hosted)
POST /plan_shot          POST /solve_putt
```

---

## Run (local dev)

### 1) Start the PuttSolver Service
If using your real DLL-hosted service:
- Ensure it is running (default: `http://localhost:7071`)

### 2) Start Tee-to-Green (use mock for now)
Using the Step 10 mock service:
```bash
cd tee-to-green-service-mock
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 7072
```

### 3) Start AIME backend
Set environment variables:
```bash
export PUTT_SOLVER_URL=http://localhost:7071
export TEE_TO_GREEN_URL=http://localhost:7072
export COURSE_DATA_ROOT=./course_data
```

Run:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4) Start the frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Smoke tests

### Test A — OFF_GREEN should return TEE_TO_GREEN
```bash
curl -s http://localhost:8000/api/get_hole_advice \
  -H "content-type: application/json" \
  -d '{
    "contract_version":"0.3.0",
    "course_id":"riverside",
    "hole_id":1,
    "ball_wgs84":{"lat":40.26835,"lon":-111.65960},
    "cup_wgs84":{"lat":40.268251,"lon":-111.659486}
  }' | python -m json.tool
```

Expected:
- `plan_type = "TEE_TO_GREEN"`
- `plan.summary` present
- optional fields like `recommended_club`, `carry_m`, `bearing_deg` present (from mock)

### Test B — ON_GREEN should return PUTT
Use a ball coordinate known to be on/near green extents:
```bash
curl -s http://localhost:8000/api/get_hole_advice \
  -H "content-type: application/json" \
  -d '{
    "contract_version":"0.3.0",
    "course_id":"riverside",
    "hole_id":1,
    "ball_wgs84":{"lat":40.26826,"lon":-111.65948},
    "cup_wgs84":{"lat":40.268251,"lon":-111.659486},
    "want_plot": true
  }' | python -m json.tool
```

Expected:
- `plan_type = "PUTT"`
- `plan.instruction_text` present (from putt solver)
- `plan.plot` may be present depending on solver support

---

## Known gaps / next improvements
- The tee-to-green service contract is intentionally minimal; you will likely add:
  - hazard / layup targets
  - club filtering by player bag
  - wind/elevation adjustment
- Surface classification still primarily uses extents; you can increase confidence using the green no-data mask once axis/rotation conventions are confirmed.
