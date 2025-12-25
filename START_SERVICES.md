# 🚀 Start All Services

## Quick Start Commands

Copy and paste these into **4 separate terminal windows** in Cursor:

### Terminal 1: Express Backend (Port 3001)
```bash
cd /Users/alex/A13x/AIME/AIME-2.0
npm run server:dev
```

### Terminal 2: Python FastAPI Backend (Port 8000)
```bash
cd /Users/alex/A13x/AIME/AIME-2.0/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Terminal 3: PuttSolver Service (Port 8081)
```bash
cd /Users/alex/A13x/AIME/AIME-2.0/putt-solver-service
source venv/bin/activate
export PUTTSOLVER_MODE=mock
uvicorn main:app --host 0.0.0.0 --port 8081 --reload
```

### Terminal 4: Frontend (Port 3000)
```bash
cd /Users/alex/A13x/AIME/AIME-2.0
npm start
```

## Verify Services Are Running

Once all services start, test them:

```bash
# PuttSolver Service
curl http://localhost:8081/health

# Python FastAPI Backend
curl http://localhost:8000/

# Express Backend
curl http://localhost:3001/health || curl http://localhost:3001/
```

## Open in Browser

Navigate to: **http://localhost:3000/golf**

## Expected Output

### Terminal 1 (Express)
```
Agent Alex API server running on port 3001
```

### Terminal 2 (Python FastAPI)
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 3 (PuttSolver)
```
INFO:     Uvicorn running on http://0.0.0.0:8081
INFO:     Application startup complete.
```

### Terminal 4 (Frontend)
```
Compiled successfully!
You can now view the app in the browser.
  Local:            http://localhost:3000
```

## Troubleshooting

If a port is already in use:
```bash
lsof -i :3000  # Find what's using port 3000
kill -9 <PID>  # Kill the process
```



