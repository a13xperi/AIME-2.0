# AIme backend (FastAPI, :8000). Transforms WGS84 -> green-local and proxies the
# PuttSolver engine; this is the host for the voice caddie's solve_putt SERVER
# tool (today it is an app-side client tool). Build from the repo root:
# docker build -f backend/Dockerfile .
FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY course_data/ ./course_data/

WORKDIR /app/backend
ENV AIME_TRANSFORM_MODE=mock \
    PORT=8000 \
    PUTTSOLVER_SERVICE_URL=http://puttsolver:8081
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
