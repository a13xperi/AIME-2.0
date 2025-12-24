"""
Solve Putt Router - AIME Backend
Handles WGS84 -> green_local_m transformation and calls PuttSolver service.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
import os
import json
import httpx
from pathlib import Path
import uuid

router = APIRouter(prefix="/api", tags=["putt-solver"])

# Load environment variables
PUTTSOLVER_SERVICE_URL = os.getenv("PUTTSOLVER_SERVICE_URL", "http://localhost:8081")
AIME_TRANSFORM_MODE = os.getenv("AIME_TRANSFORM_MODE", "mock")
REGISTRY_PATH = Path(__file__).parent.parent.parent / "course_data" / "datasets.json"

# Pydantic models
class PointWGS84(BaseModel):
    lat: float = Field(..., ge=-90, le=90, description="Latitude in decimal degrees")
    lon: float = Field(..., ge=-180, le=180, description="Longitude in decimal degrees")

class PointLocalM(BaseModel):
    x: float = Field(..., description="X coordinate in meters")
    y: float = Field(..., description="Y coordinate in meters")

class SolvePuttToolRequest(BaseModel):
    course_id: str = Field(..., description="Course identifier")
    hole_id: int = Field(..., ge=1, le=18, description="Hole number")
    ball_wgs84: PointWGS84 = Field(..., description="Ball position in WGS84")
    cup_wgs84: PointWGS84 = Field(..., description="Cup position in WGS84")
    stimp: float = Field(..., ge=0, le=20, description="Green stimp meter reading")

class SolvePuttToolResponse(BaseModel):
    success: bool
    instruction_text: Optional[str] = None
    aim_line_deg: Optional[float] = None
    initial_speed_mph: Optional[float] = None
    plot_points_local: Optional[List[PointLocalM]] = None
    error: Optional[str] = None

def load_dtm_registry():
    """Load DTM registry from course_data/datasets.json"""
    try:
        if REGISTRY_PATH.exists():
            with open(REGISTRY_PATH, 'r') as f:
                data = json.load(f)
                return data.get("datasets", [])
        else:
            # Fallback to default
            return [{
                "dtm_id": "riverside_2023_20cm",
                "course_id": "riverside_country_club",
                "hole_id": 1,
                "green_origin_projected_m": {"x": 600123.45, "y": 4000567.89},
                "green_rotation_deg": 0
            }]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load DTM registry: {str(e)}"
        )

def resolve_dtm_id(course_id: str, hole_id: int) -> dict:
    """
    Resolve dtm_id and green metadata from course_id and hole_id.
    Returns the dataset entry from the registry.
    """
    datasets = load_dtm_registry()
    
    for dataset in datasets:
        if (dataset.get("course_id") == course_id and 
            dataset.get("hole_id") == hole_id):
            return dataset
    
    raise HTTPException(
        status_code=404,
        detail=f"No DTM found for course_id={course_id}, hole_id={hole_id}"
    )

def transform_wgs84_to_projected_m(lat: float, lon: float) -> dict:
    """
    Transform WGS84 coordinates to projected meters.
    
    Phase 0: Mocked transformation
    Phase 1+: Real geographic transformation (State Plane or UTM)
    
    Returns: {x: float, y: float} in projected_m
    """
    if AIME_TRANSFORM_MODE == "mock":
        # Mock transformation: simple offset from a reference point
        # In production, this would use pyproj or similar
        ref_lat = 37.7749  # San Francisco reference
        ref_lon = -122.4194
        
        # Approximate meters per degree (varies by latitude)
        meters_per_deg_lat = 111320.0
        meters_per_deg_lon = 111320.0 * abs(1.0 / (1.0 + lat * 0.00001))
        
        x = (lon - ref_lon) * meters_per_deg_lon + 600000.0
        y = (lat - ref_lat) * meters_per_deg_lat + 4000000.0
        
        return {"x": x, "y": y}
    else:
        # Phase 1+: Real transformation
        # TODO: Implement with pyproj
        raise NotImplementedError("Real WGS84->projected_m transformation not yet implemented")

def transform_projected_m_to_green_local_m(
    point_projected_m: dict,
    green_origin_projected_m: dict,
    green_rotation_deg: float
) -> dict:
    """
    Transform projected_m coordinates to green_local_m coordinates.
    
    Phase 0: Mocked transformation
    Phase 1+: Real transformation with rotation
    
    Returns: {x: float, y: float} in green_local_m
    """
    if AIME_TRANSFORM_MODE == "mock":
        # Mock transformation: simple translation (no rotation in Phase 0)
        dx = point_projected_m["x"] - green_origin_projected_m["x"]
        dy = point_projected_m["y"] - green_origin_projected_m["y"]
        
        # TODO: Apply rotation when rotation convention is known
        # For now, just translate
        return {"x": dx, "y": dy}
    else:
        # Phase 1+: Real transformation with rotation
        # TODO: Implement rotation
        raise NotImplementedError("Real projected_m->green_local_m transformation not yet implemented")

@router.post("/solve_putt", response_model=SolvePuttToolResponse)
async def solve_putt(request: SolvePuttToolRequest):
    """
    Solve a putt given ball and cup positions in WGS84 coordinates.
    
    This endpoint:
    1. Resolves dtm_id from course_id and hole_id
    2. Transforms WGS84 -> projected_m -> green_local_m (in backend)
    3. Calls PuttSolver service with green_local_m coordinates
    4. Returns tool-friendly JSON response
    
    Architecture constraint: Transforms MUST occur in AIME backend.
    PuttSolver service NEVER receives lat/lon.
    """
    try:
        # Step 1: Resolve DTM ID
        dataset = resolve_dtm_id(request.course_id, request.hole_id)
        dtm_id = dataset["dtm_id"]
        green_origin = dataset["green_origin_projected_m"]
        green_rotation = dataset.get("green_rotation_deg", 0)
        
        # Step 2: Transform WGS84 -> projected_m
        ball_projected_m = transform_wgs84_to_projected_m(
            request.ball_wgs84.lat,
            request.ball_wgs84.lon
        )
        cup_projected_m = transform_wgs84_to_projected_m(
            request.cup_wgs84.lat,
            request.cup_wgs84.lon
        )
        
        # Step 3: Transform projected_m -> green_local_m
        ball_local_m = transform_projected_m_to_green_local_m(
            ball_projected_m,
            green_origin,
            green_rotation
        )
        cup_local_m = transform_projected_m_to_green_local_m(
            cup_projected_m,
            green_origin,
            green_rotation
        )
        
        # Step 4: Call PuttSolver service
        request_id = str(uuid.uuid4())
        puttsolver_request = {
            "dtm_id": dtm_id,
            "ball_local_m": ball_local_m,
            "cup_local_m": cup_local_m,
            "stimp": request.stimp,
            "request_id": request_id
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    f"{PUTTSOLVER_SERVICE_URL}/solve_putt",
                    json=puttsolver_request
                )
                response.raise_for_status()
                puttsolver_response = response.json()
                
                # Step 5: Format response for tool
                if puttsolver_response.get("success"):
                    return SolvePuttToolResponse(
                        success=True,
                        instruction_text=puttsolver_response.get("instruction_text"),
                        aim_line_deg=puttsolver_response.get("aim_line_deg"),
                        initial_speed_mph=puttsolver_response.get("initial_speed_mph"),
                        plot_points_local=[
                            PointLocalM(x=p["x"], y=p["y"])
                            for p in puttsolver_response.get("plot_points_local", [])
                        ]
                    )
                else:
                    return SolvePuttToolResponse(
                        success=False,
                        error=puttsolver_response.get("error", "Unknown error from PuttSolver service")
                    )
            except httpx.HTTPStatusError as e:
                return SolvePuttToolResponse(
                    success=False,
                    error=f"PuttSolver service error: {e.response.status_code} - {e.response.text}"
                )
            except httpx.RequestError as e:
                return SolvePuttToolResponse(
                    success=False,
                    error=f"Failed to connect to PuttSolver service: {str(e)}"
                )
    
    except HTTPException:
        raise
    except Exception as e:
        return SolvePuttToolResponse(
            success=False,
            error=f"Internal error: {str(e)}"
        )

