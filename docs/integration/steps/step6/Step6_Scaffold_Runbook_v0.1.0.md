# Step 6 — Scaffold Services (No DLL Execution)
**Objective:** validate the full plumbing (dataset allowlisting, transforms, API boundaries) **without** loading/execing `PuttSolver.dll`.

This step produces:
1) a **Mock PuttSolver Service** (FastAPI) that implements the service contract and returns deterministic mock output
2) an **Updated AIME backend** that resolves `course_id + hole_id → dtm_id`, performs WGS84→green_local transforms, and calls the solver service

---

## Artifacts
- `putt-solver-service-mock_step6_v0.1.0.zip`
- `aime-main_step6_scaffold_v0.1.0.zip`

---

## A) Run the Mock PuttSolver Service
1. Unzip `putt-solver-service-mock_step6_v0.1.0.zip`
2. Create venv and install deps:
   ```bash
   cd putt-solver-service-mock
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set `DATA_ROOT` to the AIME repo `course_data` folder:
   ```powershell
   $env:DATA_ROOT="C:\path\to\aime-main\course_data"
   ```
4. Start:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 7071 --reload
   ```
Endpoints:
- `GET /health`
- `GET /datasets`
- `POST /solve_putt`

---

## B) Run the AIME Backend (with Step 6 scaffold)
1. Unzip `aime-main_step6_scaffold_v0.1.0.zip`
2. Install backend deps:
   ```bash
   cd aime-main/backend
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set environment:
   ```powershell
   $env:COURSE_DATA_ROOT="..\course_data"
   $env:PUTT_SOLVER_URL="http://localhost:7071"
   ```
4. Start:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

---

## C) Smoke Test
```bash
curl -X POST http://localhost:8000/api/solve_putt \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "riverside",
    "hole_id": 1,
    "ball_wgs84": {"lat": 40.268251, "lon": -111.659486},
    "cup_wgs84": {"lat": 40.268260, "lon": -111.659470},
    "want_plot": true
  }'
```

Expected:
- `dtm_id` = `riverside_2023_20cm`
- `instruction_text` starts with `MOCK SOLVER`
- `plot.points` length = 50
- `ball_local` and `cup_local` returned for overlay debugging

---

## Notes / Known limitations (intentional)
- Rotation sign + axis conventions are still **UNCONFIRMED** until the developer blockers call.
- The mock solver validates extents strictly and returns 400 if out of bounds.
- This step is about **plumbing correctness**, not solver correctness.
