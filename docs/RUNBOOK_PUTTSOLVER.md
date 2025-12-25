# PuttSolver Integration Runbook

## Overview

This runbook provides commands to start all services and validate the end-to-end PuttSolver integration.

## Architecture

- **Frontend (React):** Port 3000
- **Express Backend (Notion + OpenAI proxy):** Port 3001
- **Python FastAPI Backend (Golf AI + PuttSolver):** Port 8000
- **PuttSolver Service:** Port 8081

## Prerequisites

1. Node.js 22.x installed
2. Python 3.8+ installed
3. Environment variables configured (see below)

## Environment Setup

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:3001
```

### Express Backend (.env in root)
```env
PORT=3001
NOTION_TOKEN=your_notion_token
NOTION_PROJECTS_DATABASE_ID=your_projects_db_id
NOTION_SESSIONS_DATABASE_ID=your_sessions_db_id
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o
OPEN_WEATHER_API_KEY=your_weather_key
```

### Python FastAPI Backend (backend/.env)
```env
FRONTEND_URL=http://localhost:3000
DEBUG=True
HOST=0.0.0.0
PORT=8000
PUTTSOLVER_SERVICE_URL=http://localhost:8081
AIME_TRANSFORM_MODE=mock
```

### PuttSolver Service (putt-solver-service/.env)
```env
PUTTSOLVER_MODE=mock
PORT=8081
```

## Starting Services

### Terminal 1: Express Backend (Notion + OpenAI Proxy)
```bash
cd AIME-2.0
npm install  # First time only
npm run server:dev
```

Expected output:
```
Agent Alex API server running on port 3001
Health check: http://localhost:3001/health
Golf AI routes: /api/realtime, /api/chat, /api/weather ✅
```

### Terminal 2: Python FastAPI Backend
```bash
cd AIME-2.0/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt  # First time only
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 3: PuttSolver Service
```bash
cd AIME-2.0/putt-solver-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt  # First time only
export PUTTSOLVER_MODE=mock  # On Windows: set PUTTSOLVER_MODE=mock
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8081
INFO:     Application startup complete.
```

### Terminal 4: Frontend
```bash
cd AIME-2.0
npm start
```

Expected output:
```
Compiled successfully!
You can now view agent-alex in the browser.
  Local:            http://localhost:3000
```

## Validation Commands

### 1. Health Checks

#### Express Backend
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","message":"Agent Alex API is running"}
```

#### Python FastAPI Backend
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "status": "ok",
  "message": "AIME Golf AI Backend API is running",
  "version": "0.2.0",
  "environment": "development"
}
```

#### PuttSolver Service
```bash
curl http://localhost:8081/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "putt-solver-service",
  "version": "0.1.0",
  "mode": "mock"
}
```

### 2. PuttSolver Service Endpoints

#### Get Available Datasets
```bash
curl http://localhost:8081/datasets
```

Expected response:
```json
{
  "success": true,
  "datasets": [
    {
      "dtm_id": "riverside_2023_20cm",
      "course_id": "riverside_country_club",
      "hole_id": 1
    }
  ]
}
```

#### Solve Putt (Direct to Service)
```bash
curl -X POST http://localhost:8081/solve_putt \
  -H "Content-Type: application/json" \
  -d '{
    "dtm_id": "riverside_2023_20cm",
    "ball_local_m": {"x": 12.5, "y": 8.3},
    "cup_local_m": {"x": 15.2, "y": 10.1},
    "stimp": 10.5,
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

Expected response:
```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "instruction_text": "Aim 2.5° left of the cup, hit with 8.3 mph initial speed...",
  "aim_line_deg": -2.5,
  "initial_speed_mph": 8.3,
  "plot_points_local": [...]
}
```

#### Test Unknown DTM ID (Should Fail)
```bash
curl -X POST http://localhost:8081/solve_putt \
  -H "Content-Type: application/json" \
  -d '{
    "dtm_id": "unknown_dtm",
    "ball_local_m": {"x": 12.5, "y": 8.3},
    "cup_local_m": {"x": 15.2, "y": 10.1},
    "stimp": 10.5,
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

Expected response (HTTP 400):
```json
{
  "detail": "Unknown dtm_id: unknown_dtm. Allowed DTM IDs: ['riverside_2023_20cm']"
}
```

### 3. AIME Backend Endpoint (Full Pipeline)

#### Solve Putt (WGS84 Input)
```bash
curl -X POST http://localhost:8000/api/solve_putt \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "riverside_country_club",
    "hole_id": 1,
    "ball_wgs84": {"lat": 37.774929, "lon": -122.419416},
    "cup_wgs84": {"lat": 37.774850, "lon": -122.419300},
    "stimp": 10.5
  }'
```

Expected response:
```json
{
  "success": true,
  "instruction_text": "Aim 2.5° left of the cup, hit with 8.3 mph initial speed...",
  "aim_line_deg": -2.5,
  "initial_speed_mph": 8.3,
  "plot_points_local": [...]
}
```

#### Test Unknown Course/Hole (Should Fail)
```bash
curl -X POST http://localhost:8000/api/solve_putt \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "unknown_course",
    "hole_id": 99,
    "ball_wgs84": {"lat": 37.774929, "lon": -122.419416},
    "cup_wgs84": {"lat": 37.774850, "lon": -122.419300},
    "stimp": 10.5
  }'
```

Expected response (HTTP 404):
```json
{
  "detail": "No DTM found for course_id=unknown_course, hole_id=99"
}
```

## End-to-End Test Flow

1. **Start all services** (Terminals 1-4)
2. **Verify health checks** (all services respond)
3. **Test PuttSolver service directly** (with green_local_m)
4. **Test AIME backend** (with WGS84, full pipeline)
5. **Open frontend** (http://localhost:3000)
6. **Start AI session** and ask: "Solve a putt from ball at 37.774929, -122.419416 to cup at 37.774850, -122.419300 on Riverside Country Club hole 1 with 10.5 stimp"

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3001  # or :8000, :8081
# Kill process
kill -9 <PID>
```

### Python Import Errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
# Reinstall dependencies
pip install -r requirements.txt
```

### CORS Errors
- Ensure Express backend CORS allows `http://localhost:3000`
- Check that Python FastAPI backend CORS allows frontend origin

### PuttSolver Service Not Found
- Verify `PUTTSOLVER_SERVICE_URL=http://localhost:8081` in `backend/.env`
- Check that PuttSolver service is running on port 8081

## Next Steps

Once all validations pass:
1. Test in frontend AI chat interface
2. Verify coordinate transformations (check logs)
3. Test with different courses/holes (add to `course_data/datasets.json`)
4. Proceed to Phase 1 (real DLL integration)

