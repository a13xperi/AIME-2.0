# Step 11 — Executed Smoke Test Results (Stateful Sessions + Mask-Based ON_GREEN)

**Executed in:** sandbox environment (local TestClient for AIME backend + real HTTP call to mock PuttSolver service)  
**DLL execution:** **NO** (mock solver used)  
**Date:** 2025-12-24T18:43:22.922869Z

## Components used
- **AIME backend:** from `aime-main_step11_stateful_sessions_mask_v0.4.0.zip`
- **PuttSolver:** Step 6 **mock** service (FastAPI) on `http://127.0.0.1:7071`
- **Dataset:** `riverside_2023_20cm` from `course_data/`

## Test inputs
We used two ball positions derived from manifest tie points:

### Case A — Ball on valid mask cell (expected: ON_GREEN → PUTT)
- Ball local (green_local_m): `23.840, 3.837` (Sprinkler1)
- Ball WGS84: `40.26828524, -111.65920520`
- Cup local (green_local_m): `29.150, 24.428` (Sprinkler2)
- Cup WGS84: `40.26847078, -111.65914320`

### Case B — Ball in no-data region (expected: OFF_GREEN → TEE_TO_GREEN placeholder)
- Ball local (green_local_m): `16.945, 0.479` (Sprinkler4)
- Ball WGS84: `40.26825489, -111.65928619`

## Execution summary

### 1) Start session
**POST** `/api/session/start`  
Response (subset):
```json
{
  "session_id": "71bd3df7-4708-434e-a3ee-f68efca7da14",
  "hole_state": {
    "dtm_id": "riverside_2023_20cm",
    "green_frame": {
      "extents_m": {"x_max_m": 42.8, "y_max_m": 25.4}
    }
  }
}
```

### 2) Case A — Set ball location (valid cell)
**POST** `/api/session/set_ball_location`  
Expected: `surface_state=ON_GREEN`  
Observed:
```json
{
  "ball_local_green": {"x_m": 23.839999999618158, "y_m": 3.837000000756234},
  "surface_state": "ON_GREEN",
  "warnings": []
}
```

### 3) Case A — Set cup location
**POST** `/api/session/set_cup_location`  
Observed:
```json
{
  "cup_local_green": {"x_m": 29.149999999732245, "y_m": 24.42799999937415},
  "surface_state": "ON_GREEN"
}
```

### 4) Case A — Get unified advice (session_id only)
**POST** `/api/get_hole_advice`  
Expected: `plan_type=PUTT`  
Observed:
```json
{
  "plan_type": "PUTT",
  "plan": {
    "instruction_text_prefix": "MOCK SOLVER (not DLL): Distance 21.26 m. Direction 75.5\u00b0 in green_local_m. Aim straight to...",
    "plot_points_count": 50
  },
  "error": null
}
```

### 5) Case B — Set ball location in no-data region
Expected: `surface_state=OFF_GREEN` with warning about no-data  
Observed:
```json
{
  "ball_local_green": {"x_m": 16.945000000472646, "y_m": 0.4790000016801059},
  "surface_state": "OFF_GREEN",
  "warnings": ["ball inside extents but maps to no-data region; treating as OFF_GREEN"]
}
```

### 6) Case B — Get unified advice
Expected: `plan_type=TEE_TO_GREEN` (placeholder since TEE_TO_GREEN_URL not configured)  
Observed:
```json
{
  "plan_type": "TEE_TO_GREEN",
  "plan": {
  "summary": "Ball is off green; tee-to-green planner not configured.",
  "debug": {
    "surface_state": "OFF_GREEN",
    "ball_wgs84": {
      "lat": 40.26825488706772,
      "lon": -111.65928619479662
    }
  }
},
  "next_actions": ["Configure TEE_TO_GREEN_URL to enable tee-to-green planning."]
}
```

## Key validations passed
- ✅ Session lifecycle endpoints exist and return stable shapes (`start`, `set_ball_location`, `set_cup_location`)
- ✅ Mask-based classification works:
  - Valid cell → `ON_GREEN`
  - No-data cell inside extents → `OFF_GREEN` + warning
- ✅ `get_hole_advice` works with **session_id only**
- ✅ Router switches between `PUTT` vs `TEE_TO_GREEN` based on surface_state
- ✅ Putt path output is in `green_local_m` and includes plot points

## What’s still “unknown until developer confirms”
- Local axis convention + rotation sign convention (should be locked by the developer blockers interview)
- DLL plot semantics (LengthX/LengthY) — not exercised here because mock solver uses 1D polyline

