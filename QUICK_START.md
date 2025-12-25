# 🚀 Quick Start Guide - AIME-2.0

## Prerequisites Check

First, verify you have the required tools:
```bash
node --version    # Should be 18.x or 22.x
python3 --version # Should be 3.8+
npm --version     # Should be installed
```

## Step 1: Install Dependencies (5-10 minutes)

### Frontend & Express Backend
```bash
cd /Users/alex/A13x/AIME/AIME-2.0
npm install
```

### Python FastAPI Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### PuttSolver Service
```bash
cd ../putt-solver-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Step 2: Set Up Environment Variables

### Root `.env` (Express Backend)
```bash
cd /Users/alex/A13x/AIME/AIME-2.0
cat > .env << 'EOF'
PORT=3001
NOTION_TOKEN=your_notion_token_here
NOTION_PROJECTS_DATABASE_ID=your_projects_db_id
NOTION_SESSIONS_DATABASE_ID=your_sessions_db_id
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o
OPEN_WEATHER_API_KEY=your_weather_key_here
EOF
```

### Backend `.env` (Python FastAPI)
```bash
cat > backend/.env << 'EOF'
FRONTEND_URL=http://localhost:3000
DEBUG=True
HOST=0.0.0.0
PORT=8000
PUTTSOLVER_SERVICE_URL=http://localhost:8081
AIME_TRANSFORM_MODE=mock
EOF
```

### PuttSolver Service `.env`
```bash
cat > putt-solver-service/.env << 'EOF'
PUTTSOLVER_MODE=mock
EOF
```

### Frontend `.env.local` (Optional)
```bash
cat > .env.local << 'EOF'
REACT_APP_API_URL=http://localhost:3001
REACT_APP_PYTHON_API_URL=http://localhost:8000
EOF
```

## Step 3: Start All Services

You'll need **4 terminal windows/panes**:

### Terminal 1: Express Backend (Port 3001)
```bash
cd /Users/alex/A13x/AIME/AIME-2.0
npm run server:dev
# Or: node server/index.ts
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

## Step 4: Verify Everything Works

### Health Checks
```bash
# PuttSolver Service
curl http://localhost:8081/health

# Python FastAPI Backend
curl http://localhost:8000/

# Express Backend
curl http://localhost:3001/health || curl http://localhost:3001/
```

### Test PuttSolver Endpoint
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

### Open in Browser
Navigate to: `http://localhost:3000/golf`

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :8000
lsof -i :8081

# Kill the process if needed
kill -9 <PID>
```

### Python Virtual Environment Issues
```bash
# Recreate venv
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Missing Dependencies
```bash
# Frontend
npm install

# Python
pip install -r requirements.txt
```

## Next Steps After Setup

1. ✅ **Test End-to-End** - Follow validation steps above
2. 🚀 **Start Phase 1** - Begin Course/Green Data Foundation work
3. 📝 **Update Notion** - Mark Phase 0 as complete
