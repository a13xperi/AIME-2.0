# Step 12 — Productionized Sessions (Redis + Hysteresis + S2S Auth + Debug Bundles)

**API/tool contract version:** `0.5.0`  
**Dataset manifest contract version:** `0.1.0`

## Summary
Step 12 hardens the Step 11 “stateful session” design so it can run as a real backend service:

- **Optional Redis-backed sessions** so multiple backend instances share state
- **Hysteresis** so surface state (ON_GREEN/OFF_GREEN) doesn’t flicker from a single sample near the boundary
- **Service-to-service API keys** for backend → solver calls
- **Debug bundles** for reproducible integration troubleshooting
- A simple **/health** endpoint for ops / monitoring

---

## Why this matters

### 1) Scaling the backend safely
In Step 11, sessions are in-memory. That’s fine for a single process, but it breaks when:
- you restart the backend (sessions vanish)
- you run multiple replicas behind a load balancer (a request can hit a different instance)

Redis solves the multi-instance problem by moving session state into a shared store.

### 2) Preventing routing jitter
Surface classification drives the entire “single entry point” router:
- `ON_GREEN` → `PUTT`
- `OFF_GREEN` → `TEE_TO_GREEN`

Near the boundary, a single measurement can toggle ON↔OFF and produce a bad user experience. Hysteresis makes the classification “sticky” unless the new state is consistent across multiple updates.

### 3) Security & observability for integration
Once the DLL solver is hosted behind HTTP, we need:
- a minimal auth mechanism between services (API key header)
- a way to diagnose coordinate and routing issues quickly (debug bundles)

---

## Architecture (high level)

### Components
1) **AIME Frontend**
   - starts/updates sessions
   - calls unified `get_hole_advice({ session_id })`
2) **AIME Backend (FastAPI)**
   - stores sessions (memory OR redis)
   - transforms WGS84 → green-local meters
   - classifies surface + applies hysteresis
   - routes requests to downstream services
   - optionally writes debug bundles
3) **Putt Solver Service** (DLL-hosted)
   - `POST /solve_putt`
4) **Tee-to-Green Service** (optional)
   - `POST /plan_shot`

---

## Entity flow diagram

```
[UI selects course/hole]
        |
        v
POST /api/session/start  ------------------>  session_id
        |
        +--> (optional) POST /api/session/set_cup_location
        |
        +--> (stream)   POST /api/session/set_ball_location
        |                     |
        |                     v
        |             surface candidate (mask/extents)
        |                     |
        |              hysteresis commit
        |                     |
        v                     v
POST /api/get_hole_advice { session_id }
        |
        +--> if ON_GREEN/UNKNOWN -> call PuttSolver Service (X-API-Key optional)
        |
        +--> if OFF_GREEN        -> call Tee-to-Green Service (X-API-Key optional)
        |
        +--> (optional) write debug bundle to disk
```

---

## What changed from Step 11

### 1) Session store backend selection
- Default: **memory** (dev-friendly)
- Optional: **redis** (production)
- Safe fallback: if redis is requested but unavailable, the backend falls back to memory and reports a warning in `/health`.

### 2) Surface hysteresis
The session now tracks a small amount of memory:
- last candidate surface state
- consecutive count (“streak”)

A state change only commits after N consistent observations.

### 3) Service-to-service auth
Backend clients can send:
- `X-API-Key: <token>` to PuttSolver and Tee-to-Green services

This is intentionally minimal; it’s a stepping stone toward stronger internal auth (mTLS, IAM, etc.) later.

### 4) Debug bundles
When enabled, each `/api/get_hole_advice` call writes a JSON artifact that contains:
- resolved dataset IDs
- ball/cup transforms (local coordinates)
- surface classification + hysteresis decision notes
- routing decision
- downstream latency + error info

These bundles are meant for engineers, not end users.

---

## Operational notes
- **Redis is optional**, but required for true multi-instance deployments.
- Debug bundles should be treated as sensitive and rotated/cleaned.
- Hysteresis parameters (`SURFACE_COMMIT_*`) can be tuned after field testing.

---

## What we should validate next
1) Run with real Redis and confirm:
   - sessions survive backend restart
   - sessions work behind a load balancer
2) Confirm the coordinate frame conventions with the original DLL developer:
   - axis mapping and origin
   - rotation sign
3) Add production logging/metrics (request IDs, downstream latencies, error rates)
