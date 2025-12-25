# System Boundaries (Decisions)
**Version:** 0.1.0  
**Owner:** _TBD_  
**Last updated:** _TBD_  

## Purpose
This page locks the *non‑negotiable system boundaries* for integrating:
- **AIME** (tool orchestration + UX)
- **Ovation / course datasets** (DTM + metadata + transforms)
- **PuttSolver.dll** (green‑to‑cup solver hosted as a service)
- **Tee‑to‑Green** planner (already working)

These decisions exist to prevent integration drift (mismatched coordinate frames, unsafe file access, wrong tool routing, fragile UI logic).

---

## The 3 hard boundaries (TL;DR)

| Boundary | Decision | Why it matters |
|---|---|---|
| **Transforms live in AIME backend** | All WGS84 → projected → green_local conversions happen in the **AIME backend**. The frontend and PuttSolver Service do *not* perform coordinate transforms. | Prevents multiple “truths” and ensures one place to debug correctness. |
| **PuttSolver Service is local‑frame only** | PuttSolver Service accepts only: `{ dtm_id, ball_local_m, cup_local_m, stimp }`. It must **never** accept raw filesystem paths or lat/lon. | Eliminates path injection risk and keeps solver service simple and deterministic. |
| **One model tool for routing** | The model calls a single tool: `get_hole_advice` (not “tee_to_green” vs “solve_putt”). Backend routes based on hole state. | Removes “model picked wrong solver” failure mode and creates one coherent UX. |

---

# Decision 1 — Coordinate transforms live in AIME backend
## Status
**LOCKED (P0)**

## Decision statement
All coordinate transformations are performed in the **AIME FastAPI backend**:
- `wgs84 (lat/lon)` → `projected_m (x/y meters in dataset CRS)` → `green_local_m (x/y meters in DTM frame)`

The AIME frontend and PuttSolver Service must treat these transforms as *already resolved*.

## Scope
Applies to:
- `solve_putt` tool calls
- `get_hole_advice` routing
- UI overlays that consume `green_local_m` points

## Rationale
- Centralizes correctness (one truth)
- Easier debugging (backend logs can include `request_id`, `dtm_id`, transform version)
- Keeps PuttSolver Service “pure” and safe (no geospatial libs required there)
- Prevents frontend coordinate drift and duplicated logic

## Alternatives considered
- **Transforms in frontend:** rejected (harder to debug, many sources of truth)
- **Transforms in PuttSolver Service:** rejected (mixes concerns + increases attack surface)

## Consequences / tradeoffs
- Backend becomes the “geo authority” and must be robust
- Backend must ship/maintain geospatial deps (`pyproj`, etc.)
- All downstream consumers must accept backend outputs as canonical

## Acceptance criteria (how we know we followed the boundary)
- [ ] PuttSolver Service request schema contains only `green_local_m` points (no lat/lon)
- [ ] AIME frontend never calls PuttSolver Service directly with lat/lon
- [ ] All UI overlays render using backend‑provided `green_frame` metadata

## References
- `contracts/docs/coordinate-frames.md`
- `contracts/schemas/tool.solve_putt.args.schema.json`
- `contracts/schemas/solve_putt.request.schema.json`

---

# Decision 2 — PuttSolver Service accepts only dtm_id + green_local_m (no raw paths)
## Status
**LOCKED (P0)**

## Decision statement
The PuttSolver Service **never** accepts:
- raw file paths
- URLs
- user-supplied directory paths
- arbitrary “DTMPath” strings

It accepts only:
- `dtm_id` (allowlisted key)
- `ball`/`cup` in `green_local_m`
- optional `stimp`
- optional `want_plot`

The service resolves `dtm_id → dtm_path` internally using an allowlist registry.

## Rationale
- Prevents filesystem attacks (path traversal, reading unexpected files)
- Makes deployments reproducible and auditable
- Allows integrity checks (hash verify on startup)

## Alternatives considered
- **Client passes DTMPath:** rejected (unsafe + brittle)
- **Client passes dataset URL:** rejected (adds network risk + unpredictable)

## Consequences / tradeoffs
- Requires maintaining a dataset registry on the service host
- Requires dataset deployment workflow (Phase 7)

## Acceptance criteria
- [ ] Service rejects any request containing path-like fields (e.g., “DTMPath”)
- [ ] `dtm_id` must exist in registry; unknown IDs return a clean 4xx error
- [ ] Service verifies resolved file is inside `DATA_ROOT`

## References
- `contracts/schemas/solve_putt.request.schema.json`
- Phase 2 “dataset allowlisting” requirements

---

# Decision 3 — The model calls ONE tool: get_hole_advice (backend routes)
## Status
**LOCKED (P0)**

## Decision statement
The model does not decide between solvers. The model calls:
- `get_hole_advice`

The AIME backend:
- computes hole state (ball position, cup position, on-green detection, dataset selection)
- routes to:
  - Tee‑to‑Green planner when OFF_GREEN
  - PuttSolver Service when ON_GREEN
- returns a unified `AdviceResponse`

## Rationale
- Reduces tool misuse
- Creates one coherent assistant experience
- Allows centralized policy (timeouts, validation, telemetry)

## Alternatives considered
- **Expose separate tools (`tee_to_green`, `solve_putt`) to model:** rejected for production (model will occasionally pick wrong tool)
- **Frontend decides which tool to call:** rejected (duplicated logic and inconsistent state)

## Consequences / tradeoffs
- Backend must implement a state machine and “on green detection”
- Tool payloads must be expressive enough to cover both plan types

## Acceptance criteria
- [ ] Realtime session exposes `get_hole_advice` as the primary golf tool
- [ ] Backend returns `plan_type: "TEE_TO_GREEN" | "PUTT"` and a valid payload
- [ ] AIME UI switches rendering based on `plan_type`

## References
- Phase 5 “Unified Hole Flow”
- `contracts/schemas/hole_state.schema.json`

---

# Implementation checklist (apply boundaries across code)
## Backend (FastAPI)
- [ ] `/api/get_hole_advice` exists and performs routing
- [ ] `/api/solve_putt` (if kept) transforms WGS84 → local and calls PuttSolver Service
- [ ] Dataset selection happens via registry (course_id/hole_id → dtm_id)

## PuttSolver Service (Windows)
- [ ] Only accepts dtm_id + local coords
- [ ] Rejects any path fields
- [ ] Uses allowlist registry
- [ ] Adds request_id + dll_return_code in responses

## Frontend (AIME)
- [ ] Model tools include `get_hole_advice` (and optionally `get_current_hole_state`)
- [ ] Frontend calls only Next.js routes (never direct PuttSolver Service)
- [ ] UI uses `green_frame` metadata for overlays

---

# Open questions (BLOCKING if not answered by developer)
- Origin corner for `green_local_m` (which corner is 0,0)
- Axis directions (does +x map to rows or columns; is +y “up”)
- Rotation sign convention (CW vs CCW)
- Plot output semantics: `GetPlotLength` and `LengthX/LengthY`
- Instruction format + maximum required buffer length
- Thread safety / statefulness (safe concurrency model)

> Track answers in the “Developer Blockers” page and convert them into acceptance tests.
