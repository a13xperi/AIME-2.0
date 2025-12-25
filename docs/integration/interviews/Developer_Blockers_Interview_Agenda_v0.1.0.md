# Developer Blockers Interview (Phase 0 — Step 4)
**Purpose:** resolve the *BLOCKING unknowns* that determine whether our transforms, server wrapper, and UI overlays will be correct and production-safe.

**Length:** 30–45 minutes  
**Attendees:** Original developer + AIME integration lead + backend engineer (geo) + (optional) UI engineer

---

## 0) Prep (send 24h before)
- Share the Notion “System Boundaries (Decisions)” page + contracts pack
- Ask developer to have:
  - a known-good dataset (Riverside) + any dataset with non-zero rotation (if available)
  - 2–3 example solver outputs (Instruction strings) from real use

---

## 1) Quick context (3 minutes)
- We are wrapping `PuttSolver.dll` as a Windows x64 service.
- AIME backend will own GPS→local transforms, then call solver service with `dtm_id + local points`.
- We need exact conventions so we don’t ship a misaligned overlay or unsafe path handling.

---

## 2) BLOCKER #1 — Coordinate frames & axis conventions (10–15 minutes)
**Goal:** lock the exact definition of `green_local_m`.

Questions to answer (must be explicit):
1. What physical corner of the green/grid is **(0,0)**?
   - SW / SE / NW / NE? Or “designated corner” — which one?
2. What direction is **+X** and **+Y** in the solver’s frame?
   - Does +X correspond to grid rows or columns?
   - Does +Y correspond to rows or columns?
3. Are coordinates measured in **meters** (confirmed by grid spacing), and are they cell-centers or cell-edges?
4. Rotation sign convention:
   - Is positive RotationOffset **clockwise or counterclockwise**?
   - Around what origin point is rotation applied?

✅ Output of this section:
- A single sentence definition like:
  > “green_local_m: (0,0) is the SW corner of the grid, +X increases along rows toward east, +Y increases along columns toward north, rotation is CCW about the origin.”

---

## 3) BLOCKER #2 — DTMPath / dataset format (5–8 minutes)
**Goal:** confirm exactly what file(s) the DLL expects.

Questions:
1. Does `DTMPath` point to a **single file** or a **directory**?
2. What file format(s) are supported?
   - Tab-delimited text grid only?
   - Any required header/metadata file?
3. What does a grid value mean (elevation/slope/etc.) and what does `-1` mean?
4. How is world (x,y) mapped into the grid (row/col ordering, interpolation)?
5. Does the DLL cache the dataset or reload each call?

✅ Output:
- A documented “DTM contract” (supported formats, required metadata, mapping rules).

---

## 4) BLOCKER #3 — Instruction output contract (5–8 minutes)
**Goal:** make Instruction usable and safe.

Questions:
1. What is the exact **format** of the Instruction string?
   - free text vs parseable tokens
2. What units does it encode (degrees, inches, feet, % slope)?
3. What is the **maximum expected length**? Any cases exceeding 512/1024/4096?
4. Is the output always **null-terminated**? How do we detect truncation?
5. Is the format stable across versions?

✅ Output:
- Buffer sizing recommendation + parsing rules (or “display-only” rule).

---

## 5) BLOCKER #4 — Plot output semantics (5–8 minutes)
**Goal:** make `GetPlotLength` and `GetPlotData` unambiguous.

Questions:
1. What does `DLL_GetPlotLength()` return (points? samples? X dimension?)  
2. In `DLL_GetPlotData(PlotX, PlotY, LengthX, LengthY)`:
   - What should `LengthX` and `LengthY` be set to?
   - Is this a 1D polyline (LengthY=1) or 2D grid?
3. What do PlotX/PlotY represent:
   - ball path over time?
   - aim line?
   - multiple candidates?
4. Are plot coordinates in the same frame as inputs?

✅ Output:
- A one-paragraph spec we can bake into the service wrapper.

---

## 6) BLOCKER #5 — Thread safety/statefulness (5–8 minutes)
**Goal:** choose correct server concurrency model.

Questions:
1. Is `DLL_SolveSingle` thread-safe (concurrent calls)?
2. Does the solver store internal state between calls (especially for plot retrieval)?
3. Can two requests interleave safely? (Solve A then Solve B then GetPlotData for A?)
4. What is the recommended hosting approach:
   - serialize calls?
   - one process per request?
   - one process per session?

✅ Output:
- A definitive “safe concurrency model” for Phase 2 service.

---

## 7) Close (2 minutes) — Confirm next artifacts
- Confirm we will codify answers into:
  - `contracts/docs/coordinate-frames.md` updates
  - service wrapper defaults (buffer sizes, LengthX/LengthY)
  - validation tests (tie points + golden vectors)
- Confirm what the developer can provide:
  - golden test vectors
  - dataset with non-zero rotation
  - known-good expected outputs

---

## After-call actions (owner + due date)
- [ ] Update SSOT docs + schemas (Phase 0)
- [ ] Add acceptance tests (see “Acceptance Test Matrix”)
- [ ] Re-run Riverside manifest validation
