#!/bin/bash
# AIME-2.0 Setup Script

set -e

echo "🚀 AIME-2.0 Setup"
echo "=================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null || { echo "❌ Node.js not found. Install from nodejs.org"; exit 1; }
command -v python3 >/dev/null || { echo "❌ Python 3 not found. Install from python.org"; exit 1; }
command -v npm >/dev/null || { echo "❌ npm not found"; exit 1; }

echo "✅ Prerequisites OK"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Setup Python backend
echo "🐍 Setting up Python FastAPI backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
echo "✅ Backend setup complete"
echo ""

# Setup PuttSolver service
echo "🔧 Setting up PuttSolver service..."
cd putt-solver-service
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
echo "✅ PuttSolver service setup complete"
echo ""

# Create .env files if they don't exist
echo "⚙️  Checking environment files..."
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << 'EOF'
FRONTEND_URL=http://localhost:3000
DEBUG=True
HOST=0.0.0.0
PORT=8000
PUTTSOLVER_SERVICE_URL=http://localhost:8081
AIME_TRANSFORM_MODE=mock
EOF
    echo "✅ Created backend/.env"
fi

if [ ! -f "putt-solver-service/.env" ]; then
    cat > putt-solver-service/.env << 'EOF'
PUTTSOLVER_MODE=mock
EOF
    echo "✅ Created putt-solver-service/.env"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env files with your API keys (if needed)"
echo "2. Run: ./start-all.sh (or start services manually)"
echo "3. Open: http://localhost:3000/golf"
