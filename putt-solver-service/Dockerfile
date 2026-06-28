# PuttSolver engine service (FastAPI, :8081). Mock physics by default; the real
# read is a Windows x64 DLL (Phase 1+), so production runs mock until that lands.
# Build from the repo root: docker build -f putt-solver-service/Dockerfile .
FROM python:3.12-slim

WORKDIR /app
COPY putt-solver-service/requirements.txt ./putt-solver-service/requirements.txt
RUN pip install --no-cache-dir -r putt-solver-service/requirements.txt

COPY putt-solver-service/ ./putt-solver-service/
COPY course_data/ ./course_data/

WORKDIR /app/putt-solver-service
ENV PUTTSOLVER_MODE=mock
EXPOSE 8081
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]
