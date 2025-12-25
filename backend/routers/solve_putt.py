"""
AIME Backend — /api/solve_putt endpoint

Phase 3 Scaffold:
- Resolves dtm_id from course_data/datasets.json
- Transforms WGS84 → green_local_m (MOCK until blocker answers)
- Calls PuttSolver Service via httpx with timeouts
- Normalizes output into tool-friendly JSON
"""

import json
import os
import uuid
from pathlib import Path
from typing import Optional, List

import httpx
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["putt-solver"])

# ------------------------------------------------------------
# Config
# ------------------------------------------------------------

PUTTSOLVER_SERVICE_URL = os.getenv("PUTTSOLVER_SERVICE_URL", "http://localhost:8081")
AIME_TRANSFORM_MODE = os.getenv("AIME_TRANSFORM_MODE", "mock").lower()

REPO_ROOT = Path(__file__).resolve().parents[2]  # .../backend/routers -> .../backend -> repo root
DATASETS_PATH = REPO_ROOT / "course_data" / "datasets.json"

# ------------------------------------------------------------
# Models (match API Endpoint Reference)
# ------------------------------------------------------------

class WGS84Point(BaseModel):
    lat: float
    lon: float

class SolvePuttAPIRequest(BaseModel):
    course_id: str
    hole_id: int = Field(..., ge=1, le=18)
    ball_wgs84: WGS84Point
    cup_wgs84: WGS84Point
    stimp: float = Field(..., ge=6.0, le=15.0)

class PlotPoint(BaseModel):
    x: float
    y: float
    t: float

class SolvePuttServiceResponse(BaseModel):
    request_id: str
    dtm_id: str
    success: bool
    instruction_text: Optional[str] = None
    aim_line_deg: Optional[float] = None
    initial_speed_mph: Optional[float] = None
    plot_points: List[PlotPoint] = []
    solve_time_ms: float
    error: Optional[str] = None

class SolvePuttAPIResponse(BaseModel):
    success: bool
    instruction_text: Optional[str] = None
    aim_line_deg: Optional[float] = None
    initial_speed_mph: Optional[float] = None
    plot_points_local: List[PlotPoint] = []
    error: Optional[str] = None

# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

def load_datasets_registry() -> dict:
    if not DATASETS_PATH.exists():
        raise RuntimeError(f"Missing datasets registry: {DATASETS_PATH}")
    with open(DATASETS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def resolve_dtm_id(course_id: str, hole_id: int) -> str:
    reg = load_datasets_registry()
    datasets = reg.get("datasets", [])
    for d in datasets:
        if d.get("course_id") == course_id and int(d.get("hole_id")) == int(hole_id):
            return d["dtm_id"]
    raise ValueError(f"Unknown course_id/hole_id: {course_id} hole {hole_id}")

def wgs84_to_green_local_mock(ball: WGS84Point, cup: WGS84Point) -> tuple[dict, dict]:
    """
    MOCK ONLY. SSOT says transforms must live here (backend), but exact conventions are BLOCKED.
    For fastest E2E, return stable demo coords that match golden samples.
    """
    ball_local = {"x": 10.0, "y": 8.0}
    cup_local = {"x": 10.0, "y": 11.0}
    return ball_local, cup_local

# ------------------------------------------------------------
# Endpoint
# ------------------------------------------------------------

@router.post("/solve_putt", response_model=SolvePuttAPIResponse)
async def solve_putt(req: SolvePuttAPIRequest):
    request_id = str(uuid.uuid4())

    try:
        dtm_id = resolve_dtm_id(req.course_id, req.hole_id)
    except Exception as e:
        return SolvePuttAPIResponse(
            success=False,
            plot_points_local=[],
            error=f"AB_001 Unknown course/hole mapping: {e}"
        )

    # Transform: WGS84 -> green_local_m (MOCK until dev blockers answered)
    if AIME_TRANSFORM_MODE == "mock":
        ball_local_m, cup_local_m = wgs84_to_green_local_mock(req.ball_wgs84, req.cup_wgs84)
    else:
        return SolvePuttAPIResponse(
            success=False,
            plot_points_local=[],
            error="AB_002 Transform not implemented (needs developer blockers answers). Set AIME_TRANSFORM_MODE=mock for now."
        )

    payload = {
        "dtm_id": dtm_id,
        "ball_local_m": ball_local_m,
        "cup_local_m": cup_local_m,
        "stimp": req.stimp,
        "request_id": request_id
    }

    try:
        timeout = httpx.Timeout(5.0, connect=2.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            r = await client.post(f"{PUTTSOLVER_SERVICE_URL}/solve_putt", json=payload)
            r.raise_for_status()
            svc = SolvePuttServiceResponse.model_validate(r.json())
    except httpx.HTTPStatusError as e:
        return SolvePuttAPIResponse(
            success=False,
            plot_points_local=[],
            error=f"AB_003 PuttSolver error: {e.response.status_code} {e.response.text}"
        )
    except httpx.RequestError as e:
        return SolvePuttAPIResponse(
            success=False,
            plot_points_local=[],
            error=f"AB_003 PuttSolver unreachable: {e}"
        )
    except Exception as e:
        return SolvePuttAPIResponse(
            success=False,
            plot_points_local=[],
            error=f"AB_004 Unexpected error: {e}"
        )

    return SolvePuttAPIResponse(
        success=svc.success,
        instruction_text=svc.instruction_text,
        aim_line_deg=svc.aim_line_deg,
        initial_speed_mph=svc.initial_speed_mph,
        plot_points_local=svc.plot_points,
        error=svc.error
    )
