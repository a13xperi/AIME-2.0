# Developer Blockers — Answer Capture Template
Use this page during the call. The goal is to capture **explicit conventions** and **testable acceptance criteria**.

---

## Meta
- **Date:**
- **Developer:**
- **Attendees:**
- **Recording link (if any):**
- **Dataset(s) referenced:**
- **Contract version impacted:** 0.1.0

---

# A) Coordinate Frames (green_local_m)
## A1) Origin corner (0,0)
- **Answer:**
- **Evidence / how developer knows:**
- **Decision text (copy into coordinate-frames.md):**
- **Acceptance test:**
  - Provide a known point (sprinkler or pin) that should map to (x,y) ~ ______.

## A2) Axis directions (+X, +Y)
- **Answer:**
- **Row/col mapping:**
- **Acceptance test:**
  - Tie points in Riverside should fall within bounds and match expected relative positions.

## A3) Rotation sign convention
- **Answer:**
- **Rotation pivot:**
- **Acceptance test:**
  - A dataset with non-zero RotationOffset: confirm tie points land correctly.

## A4) Units + coordinate meaning
- **Answer (meters? cell centers?):**
- **Interpolation method:**
- **Acceptance test:**
  - Known points match within tolerance (e.g., <= 0.2m).

---

# B) Dataset / DTM Contract
## B1) DTMPath meaning
- **Single file or directory:**
- **Allowed formats:**
- **Required metadata files:**

## B2) Grid semantics
- **What a cell value means:**
- **No-data value meaning (e.g., -1):**
- **Expected dims/spacing rules:**

## B3) Performance and caching
- **Reload per call or cached:**
- **Warmup requirements:**

**Acceptance tests:**
- Loading invalid/missing dtm_id produces clean error (no crash).
- Valid dataset resolves and solves successfully.

---

# C) Instruction Output Contract
## C1) Format
- **Format description:**
- **Example outputs (paste):**
- **Stable parseable structure?** yes/no

## C2) Buffer sizing
- **Max observed length:**
- **Null-termination guarantee:** yes/no
- **Truncation detection method:**

**Acceptance tests:**
- Instruction returned is not truncated for max-length examples.
- If buffer too small, solver returns error code or truncation is detectable.

---

# D) Plot Output Contract
## D1) GetPlotLength meaning
- **What it returns:**

## D2) GetPlotData dims
- **How to set LengthX/LengthY:**
- **Are PlotX/PlotY 1D polyline or 2D grid:**

## D3) Plot semantics + frame
- **What points represent:**
- **Coordinate frame (same as inputs?):**

**Acceptance tests:**
- Plot points count matches GetPlotLength.
- Points are within dataset extents and render correctly on UI overlay.

---

# E) Thread Safety / Statefulness
## E1) Is solver thread-safe?
- **Answer:**
- **Any global state shared across calls?**

## E2) Recommended hosting pattern
- **Single-thread serialize? multiprocess? session-per-worker?**

**Acceptance tests:**
- Concurrent requests do not cross-contaminate outputs (or service enforces serialization).
- Worker hang/crash is recoverable (if multiprocess).

---

# F) Follow-ups / Artifacts Requested
- [ ] Golden test vectors (inputs + expected outputs)
- [ ] Dataset with non-zero rotation
- [ ] Error code mapping (return_code meanings)
- [ ] Known limitations / edge cases

---

# G) Decisions to update (checklist)
- [ ] Update `contracts/docs/coordinate-frames.md`
- [ ] Update `contracts/docs/putt-solver-service.md`
- [ ] Update schema fields (if needed)
- [ ] Add/modify validation tests in Phase 1/2/3
