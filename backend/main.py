import os
from typing import Dict, Any

import httpx
from fastapi import FastAPI, Response
from routers import solve_putt, courses

app = FastAPI(title="AIME Backend", version="0.1.0")

PUTTSOLVER_SERVICE_URL = os.getenv("PUTTSOLVER_SERVICE_URL", "http://localhost:8081")

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "aime-backend", "version": app.version}

@app.get("/api/health/full")
async def health_full(response: Response) -> Dict[str, Any]:
    """
    Comprehensive health check for backend and PuttSolver service.

    Returns:
        - 200 if both services are healthy
        - 503 if PuttSolver service is unreachable
    """
    # Backend health - always succeeds
    backend_health = {
        "status": "ok",
        "version": app.version
    }

    # Check PuttSolver service health
    puttsolver_health = {
        "status": "unknown",
        "reachable": False,
        "dll_loaded": False
    }

    overall_status = "ok"

    try:
        timeout = httpx.Timeout(2.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.get(f"{PUTTSOLVER_SERVICE_URL}/health")
            resp.raise_for_status()
            puttsolver_data = resp.json()

            puttsolver_health["status"] = "ok"
            puttsolver_health["reachable"] = True
            puttsolver_health["dll_loaded"] = puttsolver_data.get("dll_loaded", False)

    except httpx.TimeoutException:
        puttsolver_health["status"] = "timeout"
        overall_status = "degraded"
        response.status_code = 503

    except httpx.HTTPStatusError as e:
        puttsolver_health["status"] = "error"
        puttsolver_health["reachable"] = True
        overall_status = "degraded"
        response.status_code = 503

    except httpx.RequestError:
        puttsolver_health["status"] = "unreachable"
        overall_status = "down"
        response.status_code = 503

    except Exception as e:
        puttsolver_health["status"] = "error"
        overall_status = "degraded"
        response.status_code = 503

    return {
        "status": overall_status,
        "services": {
            "backend": backend_health,
            "puttsolver": puttsolver_health
        }
    }

app.include_router(solve_putt.router)
app.include_router(courses.router)
