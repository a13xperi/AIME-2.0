"""
AIME Backend - Main Application Entry Point

This module provides the FastAPI application for the AIME (AI-powered Golf Assistant)
backend service. It handles coordination between the frontend and the PuttSolver
microservice.

Features:
    - Health check endpoints for monitoring
    - Course data retrieval
    - Putt solving with coordinate transformation

Environment Variables:
    PUTTSOLVER_SERVICE_URL: URL of the PuttSolver service (default: http://localhost:8081)

Example:
    Run the server with uvicorn:
    
    $ uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Author: AIME Team
Version: 0.1.0
"""

import os
from typing import Dict, Any

import httpx
from fastapi import FastAPI, Response
from routers import solve_putt, courses

# Initialize FastAPI application with metadata
app = FastAPI(
    title="AIME Backend",
    description="AI-powered Golf Assistant Backend API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration from environment
PUTTSOLVER_SERVICE_URL = os.getenv("PUTTSOLVER_SERVICE_URL", "http://localhost:8081")


@app.get("/api/health")
def health() -> Dict[str, str]:
    """
    Basic health check endpoint.
    
    Returns the service status, name, and version. Use this for simple
    liveness checks in container orchestration.
    
    Returns:
        dict: Health status object containing:
            - status (str): "ok" if service is running
            - service (str): Service identifier
            - version (str): Current version number
    
    Example:
        >>> response = client.get("/api/health")
        >>> response.json()
        {"status": "ok", "service": "aime-backend", "version": "0.1.0"}
    """
    return {"status": "ok", "service": "aime-backend", "version": app.version}

@app.get("/api/health/full")
async def health_full(response: Response) -> Dict[str, Any]:
    """
    Comprehensive health check for the backend and all dependent services.
    
    Performs deep health checks on all services in the system, including
    connectivity tests to the PuttSolver microservice. Use this for
    readiness checks and debugging service connectivity issues.
    
    Args:
        response: FastAPI Response object for setting status codes
    
    Returns:
        dict: Comprehensive health status containing:
            - status (str): Overall status ("ok", "degraded", or "down")
            - services (dict): Individual service statuses
                - backend (dict): Backend service health
                    - status (str): Backend status
                    - version (str): Backend version
                - puttsolver (dict): PuttSolver service health
                    - status (str): Service status
                    - reachable (bool): Whether service is reachable
                    - dll_loaded (bool): Whether DLL is loaded
    
    Status Codes:
        200: All services healthy
        503: One or more services unavailable
    
    Example:
        >>> response = client.get("/api/health/full")
        >>> data = response.json()
        >>> data["status"]
        "ok"
        >>> data["services"]["puttsolver"]["reachable"]
        True
    
    Note:
        The PuttSolver service check has a 2-second timeout to prevent
        hanging requests from blocking the health endpoint.
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
