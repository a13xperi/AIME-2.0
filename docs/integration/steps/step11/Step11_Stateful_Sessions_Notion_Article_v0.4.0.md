# Step 11 — Stateful Hole Sessions + Mask-Based Surface Detection

**Contract version:** `0.4.0`

## Summary
Step 11 introduces **stateful hole sessions** and improves ON_GREEN detection using the DTM’s **no-data mask**.

This removes a major integration friction point:
- the UI can stream ball/pin updates efficiently
- the model/tool call can be simplified to **session_id only**
- ON_GREEN detection becomes more faithful to the actual green boundary than a simple rectangle

---

## Why this matters
### 1) Integration simplicity
Without sessions, every tool call must include:
- `course_id`, `hole_id`, `ball_wgs84`, and sometimes `cup_wgs84`
…and the model must reliably supply them.

With sessions:
- the UI streams updates once (`set_ball_location`, `set_cup_location`)
- the tool call can be:
  - `get_hole_advice({ session_id })`

### 2) Correct routing
Our entire “single-entry” design depends on routing:
- OFF_GREEN → tee-to-green
- ON_GREEN → putt solver

Mask-based classification reduces misroutes caused by the extents rectangle including fringe/outside-green areas.

---

## Architecture (high level)

### Components
1. **AIME Frontend**
   - Calls session endpoints (via Next.js proxy routes)
   - Calls unified `get_hole_advice`
2. **AIME Backend (FastAPI)**
   - Stores session state (TTL in-memory)
   - Transforms WGS84 → green-local meters
   - Classifies ON_GREEN/OFF_GREEN
   - Calls downstream services
3. **Putt Solver Service**
   - DLL hosted behind HTTP
4. **Tee-to-Green Service** (optional)
   - Used when ball is OFF_GREEN

---

## Entity flow

```
[UI selects course/hole]
        |
        v
POST /api/session/start  ------------------>  session_id
        |
        +--> (optional) POST /api/session/set_cup_location
        |
        +--> (stream)   POST /api/session/set_ball_location  ---> surface_state
        |
        v
POST /api/get_hole_advice { session_id }
        |
        +--> if ON_GREEN/UNKNOWN -> call PuttSolver Service
        |
        +--> if OFF_GREEN        -> call Tee-to-Green Service (if configured)
```

---

## New APIs (backend)

### POST /api/session/start
Creates a session for a given course/hole.

### POST /api/session/set_ball_location
Updates ball position and computes:
- `ball_local_green`
- `surface_state` + `surface_confidence`

### POST /api/session/set_cup_location
Updates cup/pin position and computes:
- `cup_local_green`

### GET /api/session/{session_id}
Returns current `HoleStateSnapshot`.

---

## Surface classification logic
Priority:
1) **Grid mask** (valid if cell value != `no_data_value`)
2) **Extents fallback** if mask cannot be used
3) Near-boundary `UNKNOWN` band to avoid flicker

### Data dependencies
- `green_manifest.json`
  - `grid.file` (DTM)
  - `grid.no_data_value`
  - `grid.spacing_m`
  - `grid.axis_mapping` (convention hint)

---

## Operational notes
- Sessions are TTL-based (default 2 hours).
- Current store is in-memory for Phase 0–1. For production:
  - replace with Redis for multi-instance safety
  - add authentication / user scoping if required

---

## What we should validate next
- Confirm `grid.axis_mapping` matches the DLL and the path solver’s expectations.
- Spot-check ON_GREEN/OFF_GREEN routing with known positions near the boundary.
- Decide whether we need session persistence across restarts.
