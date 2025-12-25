# PuttSolver Service

FastAPI service for physics-based putting solver integration.

## Architecture

- **Phase 0 (Current):** Mocked responses for end-to-end plumbing
- **Phase 1+:** Real PuttSolver DLL integration (Windows x64 only)

## Endpoints

- `GET /health` - Health check
- `GET /datasets` - List available DTM datasets
- `POST /solve_putt` - Solve a putt (accepts only green_local_m coordinates)

## Constraints

- **NEVER** accepts lat/lon coordinates
- **NEVER** accepts file paths
- **ONLY** accepts: `{ dtm_id, ball_local_m, cup_local_m, stimp, request_id }`
- Rejects unknown `dtm_id` with HTTP 400

## Running

```bash
# Install dependencies
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# Set environment
export PUTTSOLVER_MODE=mock  # or "real" when DLL is available

# Run service
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8081 --reload
```

## Environment Variables

- `PUTTSOLVER_MODE` - "mock" (default) or "real" (Phase 1+)
- `PORT` - Service port (default: 8081)

## Mock Mode

In mock mode, the service generates realistic-looking putt solutions based on:
- Distance between ball and cup
- Stimp meter reading
- Simple heuristics for aim and speed

This allows end-to-end testing without the Windows x64 DLL.

