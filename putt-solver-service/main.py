"""
PuttSolver Service — FastAPI wrapper around the PuttSolver DLL.

Phase 2 Scaffold:
- Mocked output by default so the full system can be wired immediately.
- Real DLL wiring comes after the developer blockers call and Windows setup.

Run:
  uvicorn main:app --host 0.0.0.0 --port 8081 --reload
"""

import os
import time
import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="PuttSolver Service",
    version="0.1.0",
    description="Physics-based putting solver (DLL wrapper). Mocked until DLL is wired."
)

# ============================================================
# Models (match contracts/schemas/*.json)
# ============================================================

class PointLocal(BaseModel):
    x: float = Field(..., description="X in green_local_m frame (meters)")
    y: float = Field(..., description="Y in green_local_m frame (meters)")

class SolvePuttRequest(BaseModel):
    dtm_id: str = Field(..., example="riverside_2023_20cm")
    ball_local_m: PointLocal
    cup_local_m: PointLocal
    stimp: float = Field(..., ge=6.0, le=15.0, example=10.5)
    request_id: Optional[str] = None

class PlotPoint(BaseModel):
    x: float
    y: float
    t: float  # seconds along path

class SolvePuttResponse(BaseModel):
    request_id: str
    dtm_id: str
    success: bool
    instruction_text: Optional[str] = None
    aim_line_deg: Optional[float] = None
    initial_speed_mph: Optional[float] = None
    plot_points: List[PlotPoint] = []
    solve_time_ms: float
    error: Optional[str] = None

class DatasetInfo(BaseModel):
    dtm_id: str
    course_id: str
    hole_id: int
    grid_spacing_m: float
    grid_rows: int
    grid_cols: int

# ============================================================
# Mock dataset allowlist (dtm_id allowlist)
# ============================================================

MOCK_DATASETS = {
    "riverside_2023_20cm": DatasetInfo(
        dtm_id="riverside_2023_20cm",
        course_id="riverside_country_club",
        hole_id=1,
        grid_spacing_m=0.20,
        grid_rows=150,
        grid_cols=200
    )
}

# ============================================================
# Mock solver (replace with real DLL calls in Phase 2B)
# ============================================================

def mock_solve(req: SolvePuttRequest) -> SolvePuttResponse:
    start = time.time()

    # Simulate compute time
    time.sleep(0.05)

    # Simple straight-line path for plumbing validation
    dx = req.cup_local_m.x - req.ball_local_m.x
    dy = req.cup_local_m.y - req.ball_local_m.y

    num_points = 20
    plot = []
    for i in range(num_points + 1):
        t = i / num_points
        plot.append(PlotPoint(
            x=req.ball_local_m.x + dx * t,
            y=req.ball_local_m.y + dy * t,
            t=t * 2.0  # 2 seconds total roll time (mock)
        ))

    import math
    aim_deg = math.degrees(math.atan2(dy, dx)) if (dx != 0 or dy != 0) else 0.0

    elapsed_ms = (time.time() - start) * 1000.0

    return SolvePuttResponse(
        request_id=req.request_id or str(uuid.uuid4()),
        dtm_id=req.dtm_id,
        success=True,
        instruction_text=f"Aim {aim_deg:+.1f}° (mock), medium pace",
        aim_line_deg=aim_deg,
        initial_speed_mph=4.5,
        plot_points=plot,
        solve_time_ms=elapsed_ms,
        error=None
    )

# ============================================================
# Endpoints
# ============================================================

@app.get("/health")
def health():
    dll_loaded = False  # will flip to True when DLL is wired on Windows x64
    return {
        "status": "ok",
        "service": "putt-solver-service",
        "version": app.version,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "dll_loaded": dll_loaded,
        "datasets_count": len(MOCK_DATASETS),
        "mode": os.getenv("PUTTSOLVER_MODE", "mock")
    }

@app.get("/datasets", response_model=List[DatasetInfo])
def list_datasets():
    return list(MOCK_DATASETS.values())

@app.post("/solve_putt", response_model=SolvePuttResponse)
def solve_putt(req: SolvePuttRequest):
    # dtm_id allowlist only (no file paths ever)
    if req.dtm_id not in MOCK_DATASETS:
        raise HTTPException(status_code=400, detail=f"Unknown dtm_id: {req.dtm_id}")

    mode = os.getenv("PUTTSOLVER_MODE", "mock").lower()
    if mode != "mock":
        # Placeholder for Phase 2B DLL wiring
        # Enforce Windows-only in real mode
        raise HTTPException(status_code=501, detail="Real DLL mode not implemented yet. Use PUTTSOLVER_MODE=mock.")

    return mock_solve(req)
