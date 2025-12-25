#!/bin/bash
# Helper script to start all AIME-2.0 services
# Note: This runs services in background. Use separate terminals for better control.

echo "🚀 AIME-2.0 Service Starter"
echo "==========================="
echo ""
echo "This script will start services. For better control, use separate terminals."
echo "See START_SERVICES.md for manual commands."
echo ""
read -p "Start services now? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled. Use START_SERVICES.md for manual commands."
    exit 1
fi

# Start Express Backend
echo "Starting Express Backend (port 3001)..."
cd /Users/alex/A13x/AIME/AIME-2.0
npm run server:dev > /tmp/aime-express.log 2>&1 &
EXPRESS_PID=$!
echo "✅ Express Backend started (PID: $EXPRESS_PID, log: /tmp/aime-express.log)"

# Start Python FastAPI Backend
echo "Starting Python FastAPI Backend (port 8000)..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 > /tmp/aime-fastapi.log 2>&1 &
FASTAPI_PID=$!
echo "✅ FastAPI Backend started (PID: $FASTAPI_PID, log: /tmp/aime-fastapi.log)"
deactivate
cd ..

# Start PuttSolver Service
echo "Starting PuttSolver Service (port 8081)..."
cd putt-solver-service
source venv/bin/activate
export PUTTSOLVER_MODE=mock
uvicorn main:app --host 0.0.0.0 --port 8081 --reload > /tmp/aime-puttsolver.log 2>&1 &
PUTTSOLVER_PID=$!
echo "✅ PuttSolver Service started (PID: $PUTTSOLVER_PID, log: /tmp/aime-puttsolver.log)"
deactivate
cd ..

# Start Frontend
echo "Starting Frontend (port 3000)..."
npm start > /tmp/aime-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID, log: /tmp/aime-frontend.log)"

echo ""
echo "✅ All services starting!"
echo ""
echo "Service PIDs:"
echo "  Express:    $EXPRESS_PID"
echo "  FastAPI:    $FASTAPI_PID"
echo "  PuttSolver: $PUTTSOLVER_PID"
echo "  Frontend:   $FRONTEND_PID"
echo ""
echo "Logs:"
echo "  /tmp/aime-express.log"
echo "  /tmp/aime-fastapi.log"
echo "  /tmp/aime-puttsolver.log"
echo "  /tmp/aime-frontend.log"
echo ""
echo "To stop services:"
echo "  kill $EXPRESS_PID $FASTAPI_PID $PUTTSOLVER_PID $FRONTEND_PID"
echo ""
echo "Open: http://localhost:3000/golf"
