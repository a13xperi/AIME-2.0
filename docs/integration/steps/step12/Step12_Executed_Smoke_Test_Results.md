# Step 12 — Executed Smoke Test Results (Productionized Sessions)

**Executed in:** sandbox environment (FastAPI TestClient + local mock solver)  
**DLL execution:** **NO** (mock solver used)  
**Date:** 2025-12-24T20:14:30.769621+00:00

## Components used

- **AIME backend:** Step 12 working tree (v0.5.0)

- **PuttSolver:** mock service w/ API-key enforcement on `http://127.0.0.1:7071`

- **Dataset:** `riverside_2023_20cm` from `course_data/`

## Pre-flight validation

- Solver rejects missing API key: HTTP `401` (expected 401)

## Health check (verifies Redis fallback)

**GET** `/health` (subset):

```json
{
  "status": "ok",
  "session_store": {
    "backend": "memory",
    "ttl_seconds": 7200,
    "warning": "Redis session store unavailable; falling back to memory: redis-py not installed; add `redis` to requirements"
  },
  "debug_bundle": {
    "enabled": true,
    "dir": "/mnt/data/step12_debug_bundles"
  }
}
```

## Test inputs (derived from tie_points local_m → inverse transform)

- Sprinkler1 local: 23.840,3.837 → WGS84: 40.26828524, -111.65920520

- Sprinkler2 local: 29.150,24.428 → WGS84: 40.26847078, -111.65914320

- Sprinkler4 local: 16.945,0.479 → WGS84: 40.26825489, -111.65928619

## Execution summary

### 1) Start session

**POST** `/api/session/start`

Response (subset):

```json
{
  "session_id": "22c22fa1-c735-4d06-bbc9-96054823b28a",
  "hole_state": {
    "dtm_id": "riverside_2023_20cm",
    "green_frame": {
      "frame": "green_local_m",
      "extents_m": {
        "x_max_m": 42.8,
        "y_max_m": 25.4
      },
      "grid": {
        "cols": 128,
        "file": "dtm/Riverside_20cm_Grid.txt",
        "format": "tab_delimited_txt",
        "no_data_value": -1.0,
        "rows": 215,
        "spacing_m": 0.2,
        "value_semantics": "UNCONFIRMED (appears to be elevation or derived surface value)",
        "axis_mapping": "x_row_y_col"
      }
    }
  }
}
```

### 2) Set cup location (Sprinkler2)

**POST** `/api/session/set_cup_location`

Observed (subset):

```json
{
  "cup_local_green": {
    "x_m": 29.149999999732245,
    "y_m": 24.42799999937415
  },
  "surface_state": "UNKNOWN"
}
```

### 3) Set ball location (valid mask cell: Sprinkler1)

Expected: `surface_state=ON_GREEN`

Observed (subset):

```json
{
  "ball_local_green": {
    "x_m": 23.839999999618158,
    "y_m": 3.837000000756234
  },
  "surface_state": "ON_GREEN",
  "warnings": []
}
```

### 4) get_hole_advice (session_id only)

Expected: `plan_type=PUTT` and solver instruction text

Observed (subset):

```json
{
  "request_id": "f1225c2d-3ac9-48d9-930c-892a1329990c",
  "plan_type": "PUTT",
  "instruction_text_prefix": "MOCK SOLVER (API-key enforced): Distance 21.26 m. Direction 75.5° in green_local_m.",
  "debug_bundle_written": "/mnt/data/step12_debug_bundles/f1225c2d-3ac9-48d9-930c-892a1329990c.json"
}
```

### 5) Hysteresis check — move ball to no-data region ONCE (Sprinkler4)

Expected: candidate OFF_GREEN but stable should **hold** ON_GREEN (1/2 observations)

Observed (subset):

```json
{
  "ball_local_green": {
    "x_m": 16.945000000472646,
    "y_m": 0.4790000016801059
  },
  "surface_state": "ON_GREEN",
  "warnings": [
    "ball inside extents but maps to no-data region; treating as OFF_GREEN",
    "hysteresis: candidate OFF_GREEN observed 1/2; holding ON_GREEN"
  ]
}
```

### 6) Hysteresis commit — move ball to no-data region AGAIN

Expected: stable switches to `OFF_GREEN` after 2 consistent observations

Observed (subset):

```json
{
  "surface_state": "OFF_GREEN",
  "warnings": [
    "ball inside extents but maps to no-data region; treating as OFF_GREEN",
    "hysteresis: switched surface_state ON_GREEN→OFF_GREEN after 2 consistent observations"
  ]
}
```

### 7) get_hole_advice after OFF_GREEN

Expected: `plan_type=TEE_TO_GREEN` placeholder (planner not configured)

Observed (subset):

```json
{
  "request_id": "0415e773-12f7-4993-ae2c-c94350d33dbe",
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
  "next_actions": [
    "Configure TEE_TO_GREEN_URL to enable tee-to-green planning."
  ],
  "debug_bundle_written": "/mnt/data/step12_debug_bundles/0415e773-12f7-4993-ae2c-c94350d33dbe.json"
}
```

## Key validations passed

- ✅ Backend remains functional even if Redis is requested but unavailable (fallback to memory store)

- ✅ Service-to-service auth header works (solver rejects missing key; backend call succeeds)

- ✅ Hysteresis reduces surface_state flicker (requires 2 consistent OFF_GREEN observations)

- ✅ Debug bundles written for get_hole_advice calls when enabled

## Notes / remaining unknowns

- Redis persistence + multi-instance behavior is not validated in this sandbox (no redis-server / redis-py installed).

- Local axis convention + rotation sign convention still require developer confirmation.
