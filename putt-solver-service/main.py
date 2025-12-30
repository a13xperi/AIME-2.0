"""
PuttSolver Service — FastAPI wrapper around the PuttSolver DLL.

This microservice provides a REST API for physics-based putt solving on golf greens.
It wraps the native PuttSolver DLL and provides coordinate-based putt calculations.

Features:
    - Calculate optimal putting path given ball and cup positions
    - Return aim angle and initial speed recommendations
    - Provide ball trajectory plot points for visualization
    - Support multiple golf course DTM (Digital Terrain Model) datasets

Modes:
    - mock: Returns simulated data for development/testing (default)
    - real: Uses the actual PuttSolver DLL (Windows x64 only)

Environment Variables:
    PUTTSOLVER_MODE: Operating mode - "mock" or "real" (default: "mock")

Running:
    Development:
        $ uvicorn main:app --host 0.0.0.0 --port 8081 --reload
    
    Production:
        $ uvicorn main:app --host 0.0.0.0 --port 8081 --workers 4

API Documentation:
    - Swagger UI: http://localhost:8081/docs
    - ReDoc: http://localhost:8081/redoc

Author: AIME Team
Version: 0.1.0
"""

import os
import time
import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# Initialize FastAPI application with comprehensive metadata
app = FastAPI(
    title="PuttSolver Service",
    description="""
    Physics-based putting solver microservice.
    
    ## Features
    - Calculate optimal putting solutions
    - Return aim angles and speed recommendations
    - Provide trajectory visualization data
    
    ## Modes
    - **mock**: Simulated calculations for development
    - **real**: Native DLL calculations (Windows x64)
    """,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ============================================================
# Pydantic Models (match contracts/schemas/*.json)
# ============================================================

class PointLocal(BaseModel):
    """
    Represents a 2D point in the green-local coordinate system.
    
    The green-local coordinate system has its origin at the corner of the
    green's DTM grid, with X and Y measured in meters.
    
    Attributes:
        x: X coordinate in meters (east-west direction)
        y: Y coordinate in meters (north-south direction)
    
    Example:
        >>> point = PointLocal(x=10.5, y=8.2)
        >>> print(f"Ball at ({point.x}, {point.y}) meters")
    """
    x: float = Field(..., description="X coordinate in green_local_m frame (meters)")
    y: float = Field(..., description="Y coordinate in green_local_m frame (meters)")


class SolvePuttRequest(BaseModel):
    """
    Request model for the solve_putt endpoint.
    
    Contains all information needed to calculate an optimal putting solution
    including ball position, cup position, and green conditions.
    
    Attributes:
        dtm_id: Identifier for the Digital Terrain Model dataset
        ball_local_m: Ball position in green-local coordinates (meters)
        cup_local_m: Cup/hole position in green-local coordinates (meters)
        stimp: Stimpmeter reading indicating green speed (6.0-15.0)
        request_id: Optional client-provided request identifier for tracking
    
    Example:
        >>> request = SolvePuttRequest(
        ...     dtm_id="riverside_2023_20cm",
        ...     ball_local_m=PointLocal(x=10.0, y=8.0),
        ...     cup_local_m=PointLocal(x=10.0, y=11.0),
        ...     stimp=10.5
        ... )
    """
    dtm_id: str = Field(..., example="riverside_2023_20cm", description="DTM dataset identifier")
    ball_local_m: PointLocal = Field(..., description="Ball position in green-local meters")
    cup_local_m: PointLocal = Field(..., description="Cup position in green-local meters")
    stimp: float = Field(..., ge=6.0, le=15.0, example=10.5, description="Stimpmeter reading (6.0-15.0)")
    request_id: Optional[str] = Field(None, description="Optional request tracking ID")


class PlotPoint(BaseModel):
    """
    Represents a point along the predicted ball trajectory.
    
    Used to visualize the ball's path from its initial position to the cup.
    Points are ordered by time (t) from start to finish.
    
    Attributes:
        x: X coordinate in meters
        y: Y coordinate in meters
        t: Time in seconds from the start of the putt
    
    Example:
        >>> trajectory = [
        ...     PlotPoint(x=10.0, y=8.0, t=0.0),   # Start
        ...     PlotPoint(x=10.0, y=9.5, t=1.0),   # Mid-roll
        ...     PlotPoint(x=10.0, y=11.0, t=2.0),  # At cup
        ... ]
    """
    x: float = Field(..., description="X coordinate in meters")
    y: float = Field(..., description="Y coordinate in meters")
    t: float = Field(..., description="Time in seconds along the path")


class SolvePuttResponse(BaseModel):
    """
    Response model for the solve_putt endpoint.
    
    Contains the complete solution for a putt including the aim direction,
    required speed, and trajectory visualization data.
    
    Attributes:
        request_id: Unique identifier for this request
        dtm_id: DTM dataset used for calculation
        success: Whether the calculation succeeded
        instruction_text: Human-readable putting instruction
        aim_line_deg: Aim angle in degrees (0° = north, positive = clockwise)
        initial_speed_mph: Recommended initial ball speed in mph
        plot_points: List of trajectory points for visualization
        solve_time_ms: Calculation time in milliseconds
        error: Error message if success is False
    
    Example:
        >>> response = SolvePuttResponse(
        ...     request_id="abc123",
        ...     dtm_id="riverside_2023_20cm",
        ...     success=True,
        ...     instruction_text="Aim +5.2° right, medium pace",
        ...     aim_line_deg=5.2,
        ...     initial_speed_mph=4.5,
        ...     plot_points=[...],
        ...     solve_time_ms=52.3
        ... )
    """
    request_id: str = Field(..., description="Unique request identifier")
    dtm_id: str = Field(..., description="DTM dataset used")
    success: bool = Field(..., description="Whether calculation succeeded")
    instruction_text: Optional[str] = Field(None, description="Human-readable instruction")
    aim_line_deg: Optional[float] = Field(None, description="Aim angle in degrees")
    initial_speed_mph: Optional[float] = Field(None, description="Initial speed in mph")
    plot_points: List[PlotPoint] = Field(default=[], description="Trajectory points")
    solve_time_ms: float = Field(..., description="Calculation time in ms")
    error: Optional[str] = Field(None, description="Error message if failed")


class DatasetInfo(BaseModel):
    """
    Information about an available DTM dataset.
    
    Each dataset represents the terrain data for a specific golf green,
    including the grid resolution and dimensions.
    
    Attributes:
        dtm_id: Unique identifier for this dataset
        course_id: Golf course identifier
        hole_id: Hole number (1-18)
        grid_spacing_m: Distance between grid points in meters
        grid_rows: Number of rows in the grid
        grid_cols: Number of columns in the grid
    
    Example:
        >>> dataset = DatasetInfo(
        ...     dtm_id="riverside_2023_20cm",
        ...     course_id="riverside_country_club",
        ...     hole_id=1,
        ...     grid_spacing_m=0.20,
        ...     grid_rows=150,
        ...     grid_cols=200
        ... )
    """
    dtm_id: str = Field(..., description="Unique dataset identifier")
    course_id: str = Field(..., description="Golf course identifier")
    hole_id: int = Field(..., description="Hole number (1-18)")
    grid_spacing_m: float = Field(..., description="Grid spacing in meters")
    grid_rows: int = Field(..., description="Number of grid rows")
    grid_cols: int = Field(..., description="Number of grid columns")

# ============================================================
# Dataset Registry (allowlist of valid DTM identifiers)
# ============================================================

MOCK_DATASETS: dict[str, DatasetInfo] = {
    "riverside_2023_20cm": DatasetInfo(
        dtm_id="riverside_2023_20cm",
        course_id="riverside_country_club",
        hole_id=1,
        grid_spacing_m=0.20,
        grid_rows=150,
        grid_cols=200
    )
}
"""
Registry of available DTM datasets.

This dictionary maps dtm_id strings to DatasetInfo objects containing
metadata about each available green terrain model.

In production, this would be populated from a database or configuration
file. Only datasets in this registry can be used for calculations.
"""


# ============================================================
# Solver Implementation
# ============================================================

def mock_solve(req: SolvePuttRequest) -> SolvePuttResponse:
    """
    Mock implementation of the putt solver for development and testing.
    
    This function simulates the behavior of the real PuttSolver DLL by
    calculating a simple straight-line path between the ball and cup.
    It's used when the service is running in mock mode.
    
    The mock solver:
    - Simulates ~50ms compute time for realistic latency
    - Calculates a straight-line trajectory (no terrain consideration)
    - Returns 20 plot points along the path
    - Computes aim angle using simple trigonometry
    
    Args:
        req: SolvePuttRequest containing ball/cup positions and green speed
    
    Returns:
        SolvePuttResponse with mock solving results including:
        - Aim angle calculated as atan2(dy, dx)
        - Fixed initial speed of 4.5 mph
        - Linear trajectory with 20 points over 2 seconds
    
    Example:
        >>> request = SolvePuttRequest(
        ...     dtm_id="riverside_2023_20cm",
        ...     ball_local_m=PointLocal(x=10.0, y=8.0),
        ...     cup_local_m=PointLocal(x=10.0, y=11.0),
        ...     stimp=10.5
        ... )
        >>> response = mock_solve(request)
        >>> print(f"Aim: {response.aim_line_deg}°")
        Aim: 90.0°
    
    Note:
        This is a placeholder implementation. The real DLL-based solver
        considers terrain elevation, green speed, and ball physics.
    """
    start = time.time()

    # Simulate compute time for realistic latency testing
    time.sleep(0.05)

    # Calculate displacement vector from ball to cup
    dx = req.cup_local_m.x - req.ball_local_m.x
    dy = req.cup_local_m.y - req.ball_local_m.y

    # Generate straight-line trajectory points
    num_points = 20
    plot = []
    for i in range(num_points + 1):
        t = i / num_points
        plot.append(PlotPoint(
            x=req.ball_local_m.x + dx * t,
            y=req.ball_local_m.y + dy * t,
            t=t * 2.0  # 2 seconds total roll time (mock)
        ))

    # Calculate aim angle using trigonometry
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
# API Endpoints
# ============================================================

@app.get("/health", tags=["System"])
def health() -> dict:
    """
    Health check endpoint for the PuttSolver service.
    
    Returns comprehensive service status including DLL state and
    available datasets. Use for monitoring and orchestration health checks.
    
    Returns:
        dict: Health status containing:
            - status (str): "ok" if service is running
            - service (str): Service identifier
            - version (str): Service version
            - timestamp (str): Current UTC timestamp (ISO 8601)
            - dll_loaded (bool): Whether the native DLL is loaded
            - datasets_count (int): Number of available datasets
            - mode (str): Current operating mode ("mock" or "real")
    
    Example:
        >>> response = client.get("/health")
        >>> data = response.json()
        >>> print(f"Service: {data['service']}, Mode: {data['mode']}")
        Service: putt-solver-service, Mode: mock
    """
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


@app.get("/datasets", response_model=List[DatasetInfo], tags=["Data"])
def list_datasets() -> List[DatasetInfo]:
    """
    List all available DTM (Digital Terrain Model) datasets.
    
    Returns metadata about each available golf green terrain model that
    can be used for putt calculations. The dtm_id from these datasets
    should be used in solve_putt requests.
    
    Returns:
        List[DatasetInfo]: List of available datasets with metadata
    
    Example:
        >>> response = client.get("/datasets")
        >>> datasets = response.json()
        >>> for ds in datasets:
        ...     print(f"{ds['dtm_id']}: {ds['course_id']} hole {ds['hole_id']}")
        riverside_2023_20cm: riverside_country_club hole 1
    """
    return list(MOCK_DATASETS.values())


@app.post("/solve_putt", response_model=SolvePuttResponse, tags=["Solver"])
def solve_putt(req: SolvePuttRequest) -> SolvePuttResponse:
    """
    Calculate the optimal putting solution for given ball and cup positions.
    
    This endpoint analyzes the green terrain and calculates the ideal aim
    direction and initial speed to sink the putt. Returns a complete
    trajectory for visualization.
    
    Args:
        req: SolvePuttRequest with ball position, cup position, and green speed
    
    Returns:
        SolvePuttResponse containing:
            - success: Whether calculation succeeded
            - aim_line_deg: Aim angle in degrees
            - initial_speed_mph: Recommended initial speed
            - plot_points: Trajectory visualization points
            - instruction_text: Human-readable putting advice
    
    Raises:
        HTTPException (400): If dtm_id is not in the allowed list
        HTTPException (501): If real DLL mode is requested but not available
    
    Example:
        >>> response = client.post("/solve_putt", json={
        ...     "dtm_id": "riverside_2023_20cm",
        ...     "ball_local_m": {"x": 10.0, "y": 8.0},
        ...     "cup_local_m": {"x": 10.0, "y": 11.0},
        ...     "stimp": 10.5
        ... })
        >>> data = response.json()
        >>> print(f"Aim: {data['aim_line_deg']}°, Speed: {data['initial_speed_mph']} mph")
    
    Security Note:
        Only pre-registered dtm_id values are accepted. This prevents
        path traversal attacks - file paths are never accepted.
    """
    # Security: dtm_id allowlist only (no file paths ever)
    if req.dtm_id not in MOCK_DATASETS:
        raise HTTPException(status_code=400, detail=f"Unknown dtm_id: {req.dtm_id}")

    mode = os.getenv("PUTTSOLVER_MODE", "mock").lower()
    if mode != "mock":
        # Placeholder for Phase 2B DLL wiring
        # Enforce Windows-only in real mode
        raise HTTPException(status_code=501, detail="Real DLL mode not implemented yet. Use PUTTSOLVER_MODE=mock.")

    return mock_solve(req)
