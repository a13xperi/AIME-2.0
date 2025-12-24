# AIME 2.0 — PuttSolver Integration

End-to-end scaffolding for the AIME ↔ PuttSolver integration following the SSOT architecture from Notion.

## Architecture

- **Contracts** (`contracts/`): JSON schemas and samples defining all interfaces
- **Backend** (`backend/`): FastAPI service handling coordinate transforms and routing
- **PuttSolver Service** (`putt-solver-service/`): FastAPI wrapper around PuttSolver DLL (mocked for dev)
- **Course Data** (`course_data/`): Dataset registry mapping course/hole to dtm_id

## Quick Start

### 1. PuttSolver Service (Terminal 1)
```bash
cd putt-solver-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export PUTTSOLVER_MODE=mock
uvicorn main:app --host 127.0.0.1 --port 8081 --reload
```

### 2. AIME Backend (Terminal 2)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export PUTTSOLVER_SERVICE_URL=http://127.0.0.1:8081
export AIME_TRANSFORM_MODE=mock
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Test E2E
```bash
# Health check
curl http://127.0.0.1:8081/health

# Solve putt
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

## Status

- ✅ Contracts: SSOT schemas + samples created
- ✅ PuttSolver Service: mock mode working
- ✅ Backend: WGS84 → mock transforms + httpx client
- ⏳ Frontend: tool scaffold ready, UI integration pending
- 🚧 Real DLL: blocked on developer call (coordinate frames, DLL interface)

## Developer Blockers

1. Which corner is local (0,0): SW/SE/NW/NE? +X/+Y direction?
2. DTMPath format expected by DLL
3. Instruction buffer format/max length
4. GetPlotLength meaning + LengthX/LengthY usage
5. Thread safety / concurrency model

## Next Steps

1. Developer call to unblock transforms + DLL interface
2. Implement real WGS84 → green_local_m in backend
3. Wire real DLL calls (Windows x64 only)
4. UI integration for plot overlay
