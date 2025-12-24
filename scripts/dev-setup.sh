#!/bin/bash

set -e

echo "======================================"
echo "AIME 2.0 Development Setup"
echo "======================================"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "Project root: $PROJECT_ROOT"
echo ""

setup_service() {
    local service_name=$1
    local service_path=$2

    echo "--------------------------------------"
    echo "Setting up $service_name..."
    echo "--------------------------------------"

    if [ ! -d "$service_path" ]; then
        echo "Error: $service_path directory not found!"
        exit 1
    fi

    cd "$service_path"

    if [ -d "venv" ]; then
        echo "Virtual environment already exists for $service_name"
        echo "Removing old virtual environment..."
        rm -rf venv
    fi

    echo "Creating virtual environment for $service_name..."
    python3 -m venv venv

    echo "Activating virtual environment..."
    source venv/bin/activate

    echo "Upgrading pip..."
    pip install --upgrade pip

    if [ -f "requirements.txt" ]; then
        echo "Installing dependencies for $service_name..."
        pip install -r requirements.txt
        echo "✓ Dependencies installed successfully"
    else
        echo "Warning: No requirements.txt found for $service_name"
    fi

    deactivate
    echo "✓ $service_name setup complete"
    echo ""

    cd "$PROJECT_ROOT"
}

echo "Setting up Python services..."
echo ""

setup_service "Backend" "backend"
setup_service "Putt Solver Service" "putt-solver-service"

echo "======================================"
echo "✓ Development setup complete!"
echo "======================================"
echo ""
echo "To activate virtual environments:"
echo "  Backend:             source backend/venv/bin/activate"
echo "  Putt Solver Service: source putt-solver-service/venv/bin/activate"
echo ""
echo "To run services:"
echo "  Backend:             cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000"
echo "  Putt Solver Service: cd putt-solver-service && source venv/bin/activate && uvicorn main:app --reload --port 8001"
echo ""
