# Step 7 — REAL PuttSolver Service (DLL Wrapper)
**Contract version:** 0.1.0  
**Goal:** Replace the Step 6 mock solver with a real Windows service that safely wraps `PuttSolver.dll` behind an HTTP API.

---

## Deliverables
- ✅ A FastAPI service that exposes:
  - `GET /health`
  - `GET /datasets`
  - `POST /solve_putt`
- ✅ Dataset allowlisting:
  - Request takes `dtm_id` only (no file paths)
  - Service resolves `dtm_id → grid_path` using `course_data/datasets.json`
- ✅ Conservative safety defaults:
  - Global lock serializes DLL calls
  - Optional bounds check using `green_manifest.extents_m`

---

## Download
- Service code pack: `putt-solver-service-real_step7_v0.1.0.zip`

---

## Required inputs
- Windows x64 host
- `PuttSolver.dll` + sidecar files (`PuttSolver.ini`, `PuttSolver.aliases`) placed next to the DLL
- `course_data/` folder containing `datasets.json` and the DTM grid file(s)

---

## Environment variables
- `PUTT_SOLVER_DLL_PATH` — full path to `PuttSolver.dll`
- `PUTT_SOLVER_DATA_ROOT` — path to `course_data/`
- `PUTT_SOLVER_DATASET_REGISTRY` — optional, defaults to `DATA_ROOT/datasets.json`
- `PUTT_SOLVER_PORT` — default `7071`
- `PUTT_SOLVER_INSTRUCTION_BUF_LEN` — default `4096`
- `PUTT_SOLVER_ALLOW_NO_DLL` — if `true`, service can start without DLL (for contract testing only)

---

## How it integrates with AIME (Step 6 scaffold)
Set in AIME backend:
- `PUTT_SOLVER_URL=http://<windows-host>:7071`

No code changes required—Step 6 already calls `/solve_putt` with the correct JSON contract.

---

## Known assumptions to confirm in the developer blockers call
1) Plot array dims: `GetPlotData(xs, ys, n, n)`  
2) Error strings: `LVDLLStatus(buf, len, module_handle)`  
3) DTMPath: we pass the **grid file path** from registry (not a directory)

Convert confirmations into acceptance tests + update `dll_wrapper.py` if needed.
