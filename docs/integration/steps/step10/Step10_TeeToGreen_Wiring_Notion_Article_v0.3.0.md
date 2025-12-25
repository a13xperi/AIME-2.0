# Step 10 — Tee-to-Green Integration (Unified Hole Advice)

**Contract version:** `0.3.0`

## Summary
We now have a complete *single-entry* hole guidance flow:
- AIME model calls **one tool**: `get_hole_advice`
- The backend routes based on hole state:
  - **OFF_GREEN / TRANSITION** → tee-to-green planner
  - **ON_GREEN / UNKNOWN** → putt solver service (DLL-hosted)

This removes the last major integration “gap” between **tee-to-green** and **green-to-cup**.

---

## Why this matters
Before this step:
- `get_hole_advice` could only return real putt plans
- tee-to-green was a placeholder message

After this step:
- `TEE_TO_GREEN` plans can come from a real engine/service
- the UI can render the tee-to-green output immediately
- the tool contract remains stable even as the tee-to-green engine evolves

---

## Architecture (high level)
### Components
1. **AIME Frontend**
   - Realtime tool: `get_hole_advice`
   - Renders unified Advice panel

2. **AIME Backend (FastAPI)**
   - `POST /api/get_hole_advice`
   - Computes transforms + surface classification
   - Calls downstream services

3. **Tee-to-Green Service**
   - `POST /plan_shot`
   - Returns at minimum `summary`, plus optional structured fields

4. **PuttSolver Service**
   - `POST /solve_putt`
   - DLL-hosted; returns instruction text + optional plot

---

## Contracts
### New schemas
- `tee_to_green.request.schema.json`
- `tee_to_green.response.schema.json`

### Updated schemas
- `get_hole_advice.response.schema.json`
- `tool.get_hole_advice.output.schema.json`

### Required minimum tee-to-green output
To be compatible with AIME, tee-to-green must return:
- `summary` (string)

Everything else is optional but recommended:
- `recommended_club`
- `carry_m`, `total_m`
- `bearing_deg`
- `target_wgs84`

---

## Implementation notes
### Backend routing behavior
- If `TEE_TO_GREEN_URL` is set, `/api/get_hole_advice` calls:
  - `{TEE_TO_GREEN_URL}/plan_shot`
- If not set, returns a placeholder plan + a `next_actions` hint.

### UI behavior
- AdvicePanel displays:
  - Tee-to-green summary + structured recommendation fields (if present)
  - Putt instruction text (for PUTT)

---

## Verification checklist
- [ ] OFF_GREEN inputs produce `plan_type=TEE_TO_GREEN`
- [ ] ON_GREEN inputs produce `plan_type=PUTT`
- [ ] With mock tee-to-green service running, `plan.recommended_club` shows in UI
- [ ] With DLL-hosted putt service running, `instruction_text` shows in UI

---

## Next step (Step 11)
**Stateful Hole Sessions + On-Green Masking**
- Add a backend session model:
  - `set_ball_location`, `set_cup_location`, `get_current_hole_state`
- Upgrade surface classification from “extents only” to:
  - extents + no-data mask check (higher confidence)
- This unlocks stable real-time integration with AIME app UX and reduces “edge-of-green” misroutes.
