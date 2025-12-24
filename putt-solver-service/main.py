"""
PuttSolver Service - Mocked FastAPI service for Phase 0
Provides endpoints for putt solving with mocked responses.
Real DLL integration will be added in Phase 1+.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import json
import uuid
from pathlib import Path

# Load environment variables
PUTTSOLVER_MODE = os.getenv("PUTTSOLVER_MODE", "mock")

app = FastAPI(
    title="PuttSolver Service",
    description="Physics-based putting solver service (mocked for Phase 0)",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load allowed DTM IDs from registry
REGISTRY_PATH = Path(__file__).parent.parent / "course_data" / "datasets.json"
ALLOWED_DTM_IDS = set()

def load_dtm_registry():
    """Load allowed DTM IDs from the registry."""
    global ALLOWED_DTM_IDS
    try:
        if REGISTRY_PATH.exists():
            with open(REGISTRY_PATH, 'r') as f:
                data = json.load(f)
                ALLOWED_DTM_IDS = {ds["dtm_id"] for ds in data.get("datasets", [])}
        else:
            # Fallback: use default DTM ID
            ALLOWED_DTM_IDS = {"riverside_2023_20cm"}
    except Exception as e:
        print(f"Warning: Could not load DTM registry: {e}")
        ALLOWED_DTM_IDS = {"riverside_2023_20cm"}

# Load registry on startup
load_dtm_registry()

# Pydantic models
class PointLocalM(BaseModel):
    x: float = Field(..., description="X coordinate in meters")
    y: float = Field(..., description="Y coordinate in meters")

class SolvePuttRequest(BaseModel):
    dtm_id: str = Field(..., description="DTM identifier")
    ball_local_m: PointLocalM = Field(..., description="Ball position in green_local_m")
    cup_local_m: PointLocalM = Field(..., description="Cup position in green_local_m")
    stimp: float = Field(..., ge=0, le=20, description="Green stimp meter reading")
    request_id: str = Field(..., description="Unique request identifier")

class SolvePuttResponse(BaseModel):
    success: bool
    request_id: str
    instruction_text: Optional[str] = None
    aim_line_deg: Optional[float] = None
    initial_speed_mph: Optional[float] = None
    plot_points_local: Optional[List[PointLocalM]] = None
    error: Optional[str] = None

def generate_mock_putt_solution(request: SolvePuttRequest) -> SolvePuttResponse:
    """
    Generate a mocked putt solution for Phase 0.
    In Phase 1+, this will call the real PuttSolver DLL.
    """
    # Calculate distance
    dx = request.cup_local_m.x - request.ball_local_m.x
    dy = request.cup_local_m.y - request.ball_local_m.y
    distance = (dx**2 + dy**2)**0.5
    
    # Mock calculations
    # Simple heuristic: aim slightly left for right-to-left break
    aim_deg = -2.5 if distance > 3.0 else -1.0
    
    # Speed based on distance and stimp
    base_speed = distance * 0.6 + 2.0
    stimp_factor = request.stimp / 10.0
    initial_speed_mph = base_speed * stimp_factor
    
    # Generate mock path points
    num_points = max(10, int(distance * 2))
    plot_points = []
    for i in range(num_points + 1):
        t = i / num_points
        x = request.ball_local_m.x + dx * t
        y = request.ball_local_m.y + dy * t
        # Add slight curve (mock break)
        if t > 0.5:
            x += (t - 0.5) * 0.1 * aim_deg
        plot_points.append(PointLocalM(x=x, y=y))
    
    # Add final point at cup
    plot_points.append(PointLocalM(x=request.cup_local_m.x, y=request.cup_local_m.y))
    
    instruction_text = (
        f"Aim {abs(aim_deg):.1f}° {'left' if aim_deg < 0 else 'right'} of the cup, "
        f"hit with {initial_speed_mph:.1f} mph initial speed. "
        f"The putt will break slightly as it approaches the hole."
    )
    
    return SolvePuttResponse(
        success=True,
        request_id=request.request_id,
        instruction_text=instruction_text,
        aim_line_deg=aim_deg,
        initial_speed_mph=initial_speed_mph,
        plot_points_local=plot_points
    )

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "putt-solver-service",
        "version": "0.1.0",
        "mode": PUTTSOLVER_MODE
    }

@app.get("/datasets")
def get_datasets():
    """Get list of available DTM datasets."""
    try:
        if REGISTRY_PATH.exists():
            with open(REGISTRY_PATH, 'r') as f:
                data = json.load(f)
                return {
                    "success": True,
                    "datasets": [
                        {
                            "dtm_id": ds["dtm_id"],
                            "course_id": ds["course_id"],
                            "hole_id": ds["hole_id"]
                        }
                        for ds in data.get("datasets", [])
                    ]
                }
        else:
            return {
                "success": True,
                "datasets": [
                    {
                        "dtm_id": "riverside_2023_20cm",
                        "course_id": "riverside_country_club",
                        "hole_id": 1
                    }
                ]
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/solve_putt", response_model=SolvePuttResponse)
def solve_putt(request: SolvePuttRequest):
    """
    Solve a putt given ball and cup positions in green_local_m coordinates.
    
    Architecture constraints:
    - NEVER accepts lat/lon
    - NEVER accepts file paths
    - ONLY accepts dtm_id, ball_local_m, cup_local_m, stimp, request_id
    - Rejects unknown dtm_id with HTTP 400
    """
    # Validate DTM ID
    if request.dtm_id not in ALLOWED_DTM_IDS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown dtm_id: {request.dtm_id}. Allowed DTM IDs: {sorted(ALLOWED_DTM_IDS)}"
        )
    
    # Validate stimp range (optional, could be per-DTM)
    if request.stimp < 0 or request.stimp > 20:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid stimp value: {request.stimp}. Must be between 0 and 20."
        )
    
    # Generate mock solution
    if PUTTSOLVER_MODE == "mock":
        return generate_mock_putt_solution(request)
    else:
        # Phase 1+: Call real PuttSolver DLL here
        # For now, return mock
        return generate_mock_putt_solution(request)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8081"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

