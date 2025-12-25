# Step 9 — Unified Hole Advice Router (Tee-to-Green ⇄ Green-to-Cup)

**Why this exists:** We want AIME to feel like *one continuous caddie loop*, not two disconnected solvers. Step 9 introduces a single entrypoint that chooses the right solver based on where the ball is.

---

## The Mental Model

Think of the system as three layers:

1. **State inputs**
   - Ball position (WGS84 lat/lon)
   - Cup/pin position (WGS84 lat/lon) — required to solve a putt
   - Course + hole identifiers
   - Green speed (stimp)

2. **A routing “brain”**
   - Converts WGS84 → green-local meters (using the dataset manifest transform)
   - Classifies whether the ball is **on green**
   - Chooses which solver to call
     - **OFF_GREEN → tee-to-green**
     - **ON_GREEN → putt solver**

3. **Solver services**
   - Tee-to-green engine (already working elsewhere in AIME)
   - Green-to-cup putt solver (DLL hosted behind an HTTP server)

---

## What We Shipped

### 1) Unified Backend Endpoint
**`POST /api/get_hole_advice`**

Input (router request):
- `course_id`, `hole_id`
- `ball_wgs84` {lat, lon}
- `cup_wgs84` {lat, lon} *(optional, but required for on-green putts)*
- `stimp` *(optional)*
- `want_plot` *(optional)*

Output (unified response):
- `plan_type`: `TEE_TO_GREEN` | `PUTT` | `ERROR`
- `hole_state`: snapshot with surface_state + confidence
- `plan`: solver output payload (shape depends on plan_type)
- `warnings`, `next_actions`

### 2) Unified Frontend Tool
**Realtime function:** `get_hole_advice`

- The model calls one tool.
- The tool hits `/api/get_hole_advice`.
- UI renders:
  - A **Hole Advice** panel (plan type + summary + next actions)
  - If plan_type is PUTT: a **Putt Solver** panel for detailed instruction/plot/debug

### 3) Playback Harness
A small script to replay ball positions into the router and observe transitions:
- `backend/scripts/playback_get_hole_advice.py`
- `backend/scripts/playback_sequence.sample.json`

---

## Routing Rules (v0)

Routing is conservative and deterministic. We only use:
- The manifest extents (x_max_m, y_max_m)
- The computed `ball_local_green` point

Rules:
- Inside extents → `surface_state=ON_GREEN` → `plan_type=PUTT`
- Near extents (±UNKNOWN_MARGIN_M) → `surface_state=UNKNOWN` → try PUTT with warnings
- Outside extents → `surface_state=OFF_GREEN` → `plan_type=TEE_TO_GREEN` *(placeholder until we wire the planner)*

---

## How This Integrates With “Tee-to-Green + Green-to-Cup”

### Before Step 9
- AIME asked tee-to-green questions in one place.
- Putting was a separate tool/flow.

### After Step 9
- AIME calls **one tool**:
  - If the ball is off green → tee-to-green planning output (next step to wire)
  - If on green → putt solver output (already wired)

This is the seam where we “host the DLL as a server” and the app simply treats it as another solver behind the router.

---

## What’s Still Missing (Intentional)
- Tee-to-green planner output is not yet wired into `/api/get_hole_advice`.  
  Step 10 is to plug the existing tee-to-green engine into this router using a confirmed contract.

- Surface detection uses extents only.  
  We can upgrade to mask-based detection once coordinate frames are proven correct.

---

## Definition of Done for Step 9
✅ You can call `/api/get_hole_advice` with ball/cup and get a PUTT plan.  
✅ The frontend exposes `get_hole_advice` as a tool.  
✅ The UI shows a consistent plan panel.  
✅ A playback script exists for OFF_GREEN → ON_GREEN transitions.

---

## Next Step
**Wire tee-to-green into the router**, so `plan_type=TEE_TO_GREEN` returns real shots/targets, and we have true tee-to-cup continuity.
