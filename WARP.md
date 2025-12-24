# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AIME 2.0 is an end-to-end integration between AIME and PuttSolver, following a Single Source of Truth (SSOT) architecture. The system solves golf putting physics problems by transforming GPS coordinates to green-local coordinates and running them through a physics solver.

**Current Status**: Mock mode operational. Real DLL integration blocked pending developer call to clarify coordinate frame conventions and DLL interface details.

## Architecture

This is a **microservices architecture** with three layers:

1. **Contracts** (`contracts/`): SSOT JSON schemas defining all interfaces between services
2. **AIME Backend** (`backend/`): FastAPI service that handles WGS84 coordinate transforms and orchestrates requests
3. **PuttSolver Service** (`putt-solver-service/`): FastAPI wrapper around the PuttSolver DLL (currently mocked)
4. **Course Data** (`course_data/`): Dataset registry mapping `course_id/hole_id` → `dtm_id`

### Data Flow
```
Frontend → AIME Backend (/api/solve_putt)
  ├─ Validates course_id/hole_id
  ├─ Resolves dtm_id from course_data/datasets.json
  ├─ Transforms WGS84 → green_local_m (MOCK until blockers resolved)
  └─ Calls PuttSolver Service (/solve_putt)
      └─ Returns physics solution (path, aim, speed)
```

### Coordinate Frames
Three frames exist in this system:
- **wgs84**: `{lat, lon}` in EPSG:4326 (GPS coordinates)
- **projected_m**: `{x_m, y_m}` in course-specific EPSG (e.g., EPSG:3675 for state plane)
- **green_local_m**: `{x, y}` in meters, green-local grid used by solver

**Transform responsibility**: All transforms happen in the AIME Backend. PuttSolver Service only receives `green_local_m` coordinates.

## Development Commands

### Initial Setup

**PuttSolver Service** (Terminal 1):
```bash
cd putt-solver-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export PUTTSOLVER_MODE=mock
uvicorn main:app --host 127.0.0.1 --port 8081 --reload
```

**AIME Backend** (Terminal 2):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export PUTTSOLVER_SERVICE_URL=http://127.0.0.1:8081
export AIME_TRANSFORM_MODE=mock
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Testing

**Health checks**:
```bash
# PuttSolver Service
curl http://127.0.0.1:8081/health

# AIME Backend
curl http://127.0.0.1:8000/api/health
```

**End-to-end solve request**:
```bash
curl -X POST http://127.0.0.1:8000/api/solve_putt \
  -H 'Content-Type: application/json' \
  -d '{
    "course_id": "riverside_country_club",
    "hole_id": 1,
    "ball_wgs84": {"lat": 37.774929, "lon": -122.419416},
    "cup_wgs84": {"lat": 37.77485, "lon": -122.4193},
    "stimp": 10.5
  }'
```

**Test with sample contracts**:
```bash
# Test PuttSolver Service directly
curl -X POST http://127.0.0.1:8081/solve_putt \
  -H 'Content-Type: application/json' \
  -d @contracts/samples/riverside_solve_putt.request.json
```

### Running Services

Both services use **uvicorn** with `--reload` for development:
- PuttSolver Service: port **8081**
- AIME Backend: port **8000**

To run without auto-reload (production-like):
```bash
uvicorn main:app --host 0.0.0.0 --port <PORT>
```

## Key Files and Patterns

### Contract Schema Management
- **Location**: `contracts/schemas/*.json`
- **Versioning**: Follow semantic versioning in `contracts/versioning.md`
- **BLOCKED fields**: Several schema fields marked with `[BLOCKED]` awaiting developer call (coordinate origin corner, rotation conventions, etc.)
- **Rule**: Any schema change MUST update both schemas and golden samples in `contracts/samples/`

### Adding New Courses/Holes
1. Add entry to `course_data/datasets.json` with `dtm_id`, `course_id`, `hole_id`, grid parameters
2. PuttSolver Service validates `dtm_id` against its allowlist (currently `MOCK_DATASETS` dict in `putt-solver-service/main.py`)
3. No file paths are ever passed—only allowlisted `dtm_id` strings for security

### Error Code Conventions
- **AB_xxx**: AIME Backend errors (AB_001 = unknown course, AB_002 = transform not implemented, AB_003 = PuttSolver unreachable, AB_004 = unexpected)
- **PS_xxx**: PuttSolver Service errors (not yet defined; currently returns 400/501 HTTP codes)

### Backend Structure
- `backend/main.py`: FastAPI app initialization with health endpoint
- `backend/routers/solve_putt.py`: Main endpoint logic
  - Resolves `dtm_id` from course registry
  - Transforms coordinates (currently mock)
  - Calls PuttSolver Service via `httpx` with 5s timeout
  - Normalizes response for tool/UI consumption

### PuttSolver Service Structure
- `putt-solver-service/main.py`: Complete service with `/health`, `/datasets`, `/solve_putt` endpoints
- Mock mode: Returns straight-line paths for plumbing validation
- Real mode: Not implemented (requires Windows x64 DLL, blocked pending developer call)

## Environment Variables

### PuttSolver Service
- `PUTTSOLVER_MODE`: Set to `mock` (only supported mode currently)

### AIME Backend
- `PUTTSOLVER_SERVICE_URL`: PuttSolver Service URL (default: `http://localhost:8081`)
- `AIME_TRANSFORM_MODE`: Set to `mock` for development (real transforms not implemented)

## Developer Blockers

These items block full implementation and are awaiting a developer call:

1. **Coordinate frame origin**: Which corner is local (0,0)? SW/SE/NW/NE? What is +X/+Y direction?
2. **DTMPath format**: Expected format for DLL calls
3. **Instruction buffer**: Format and max length for instruction text
4. **GetPlotLength**: Meaning of this DLL function and usage of LengthX/LengthY
5. **Thread safety**: DLL concurrency model and thread safety guarantees

Once resolved, update:
- `contracts/docs/coordinate-frames.md`
- `contracts/schemas/green_manifest.schema.json` (remove `[BLOCKED]` markers)
- `backend/routers/solve_putt.py` (implement real transforms)
- `putt-solver-service/main.py` (wire real DLL calls)

## Contracts as SSOT

All JSON schemas in `contracts/` are the **Single Source of Truth**. Both services must match these exactly.

**When modifying contracts**:
1. Update schema in `contracts/schemas/*.json`
2. Update at least one golden sample in `contracts/samples/*.json`
3. Update corresponding Pydantic models in both services
4. Follow versioning rules in `contracts/versioning.md` (MAJOR for breaking changes, MINOR for backward-compatible additions)

See `contracts/docs/coordinate-frames.md` for detailed coordinate system documentation.
