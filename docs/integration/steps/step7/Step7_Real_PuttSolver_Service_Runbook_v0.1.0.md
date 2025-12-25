# Step 7 Runbook — REAL PuttSolver Service (DLL Wrapper)

This step replaces the **mock** solver (Step 6) with the **real** DLL-hosted solver, while keeping the same API contract:
- `POST /solve_putt` accepts **dtm_id + green_local_m** only.

> Safety note: you are loading a native DLL. Validate provenance and test in an isolated Windows VM first.

---

## 1) Place artifacts (Windows x64)
On the Windows host:
- Copy `PuttSolver.dll` to a dedicated folder, e.g.:
  - `C:\putt-solver\artifacts\PuttSolver.dll`
- Put sidecar files next to it (recommended):
  - `PuttSolver.ini`
  - `PuttSolver.aliases`

## 2) Place datasets (course_data)
Copy your `aime-main/course_data` folder to the host:
- `C:\putt-solver\course_data\datasets.json`
- `C:\putt-solver\course_data\ovation\...`

## 3) Configure env vars
Example:
```bat
set PUTT_SOLVER_DLL_PATH=C:\putt-solver\artifacts\PuttSolver.dll
set PUTT_SOLVER_DATA_ROOT=C:\putt-solver\course_data
set PUTT_SOLVER_DATASET_REGISTRY=C:\putt-solver\course_data\datasets.json
set PUTT_SOLVER_PORT=7071
```

## 4) Run the service
```bat
python -m uvicorn app.main:app --host 0.0.0.0 --port %PUTT_SOLVER_PORT%
```

## 5) Validate health and datasets
```bat
curl http://localhost:7071/health
curl http://localhost:7071/datasets
```

## 6) Test a solve (local coords)
```bat
curl -X POST http://localhost:7071/solve_putt ^
  -H "Content-Type: application/json" ^
  -d "{\"dtm_id\":\"riverside_2023_20cm\",\"ball\":{\"x_m\":22.0,\"y_m\":11.0},\"cup\":{\"x_m\":13.4,\"y_m\":15.0},\"want_plot\":true}"
```

Expected response fields:
- `request_id`
- `dtm_id`
- `instruction_text`
- optional `plot.points[]`
- `raw.dll_return_code`

---

## 7) Point AIME backend at the real service
In AIME backend env:
- `PUTT_SOLVER_URL=http://<windows-host>:7071`

Then run the same Step 6 backend smoke test; it should now return **real** instructions instead of `MOCK SOLVER`.

---

## Known assumptions (verify with developer blockers)
- Plot dims: wrapper passes `LengthX=n` and `LengthY=n` to `DLL_GetPlotData`.
- Error string: wrapper calls `LVDLLStatus` with the loaded module handle.

If either assumption is wrong, update `app/dll_wrapper.py` after the developer call.
