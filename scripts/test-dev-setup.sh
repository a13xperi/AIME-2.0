#!/bin/bash

set -e

echo "======================================"
echo "Testing dev-setup.sh"
echo "======================================"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

FAILED_TESTS=0
PASSED_TESTS=0

test_passed() {
    echo "✓ $1"
    ((PASSED_TESTS++))
}

test_failed() {
    echo "✗ $1"
    ((FAILED_TESTS++))
}

echo "Cleaning up any existing virtual environments..."
rm -rf backend/venv putt-solver-service/venv
echo ""

echo "Running dev-setup.sh..."
echo "--------------------------------------"
./scripts/dev-setup.sh
echo "--------------------------------------"
echo ""

echo "Running tests..."
echo ""

echo "Test 1: Check backend virtual environment exists"
if [ -d "backend/venv" ]; then
    test_passed "Backend venv directory exists"
else
    test_failed "Backend venv directory does not exist"
fi

echo "Test 2: Check putt-solver-service virtual environment exists"
if [ -d "putt-solver-service/venv" ]; then
    test_passed "Putt-solver-service venv directory exists"
else
    test_failed "Putt-solver-service venv directory does not exist"
fi

echo "Test 3: Check backend Python executable exists"
if [ -f "backend/venv/bin/python" ]; then
    test_passed "Backend Python executable exists"
else
    test_failed "Backend Python executable does not exist"
fi

echo "Test 4: Check putt-solver-service Python executable exists"
if [ -f "putt-solver-service/venv/bin/python" ]; then
    test_passed "Putt-solver-service Python executable exists"
else
    test_failed "Putt-solver-service Python executable does not exist"
fi

echo "Test 5: Check backend dependencies installed"
if backend/venv/bin/python -c "import fastapi, uvicorn, httpx, pydantic" 2>/dev/null; then
    test_passed "Backend dependencies installed correctly"
else
    test_failed "Backend dependencies not installed correctly"
fi

echo "Test 6: Check putt-solver-service dependencies installed"
if putt-solver-service/venv/bin/python -c "import fastapi, uvicorn, pydantic" 2>/dev/null; then
    test_passed "Putt-solver-service dependencies installed correctly"
else
    test_failed "Putt-solver-service dependencies not installed correctly"
fi

echo "Test 7: Check backend pip is upgraded"
BACKEND_PIP_VERSION=$(backend/venv/bin/pip --version | grep -oE '[0-9]+\.[0-9]+' | head -1)
if [ ! -z "$BACKEND_PIP_VERSION" ]; then
    test_passed "Backend pip version: $BACKEND_PIP_VERSION"
else
    test_failed "Could not determine backend pip version"
fi

echo "Test 8: Check putt-solver-service pip is upgraded"
PUTT_PIP_VERSION=$(putt-solver-service/venv/bin/pip --version | grep -oE '[0-9]+\.[0-9]+' | head -1)
if [ ! -z "$PUTT_PIP_VERSION" ]; then
    test_passed "Putt-solver-service pip version: $PUTT_PIP_VERSION"
else
    test_failed "Could not determine putt-solver-service pip version"
fi

echo "Test 9: Re-run setup script (should handle existing venvs)"
if ./scripts/dev-setup.sh >/dev/null 2>&1; then
    test_passed "Script handles re-running correctly"
else
    test_failed "Script failed when re-run"
fi

echo ""
echo "======================================"
echo "Test Results"
echo "======================================"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "✓ All tests passed!"
    exit 0
else
    echo "✗ Some tests failed"
    exit 1
fi
