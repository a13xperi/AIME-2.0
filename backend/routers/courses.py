"""
AIME Backend — /api/courses endpoint

Returns all available courses from course_data/datasets.json
"""

import json
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["courses"])

# ------------------------------------------------------------
# Config
# ------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[2]  # .../backend/routers -> .../backend -> repo root
DATASETS_PATH = REPO_ROOT / "course_data" / "datasets.json"

# ------------------------------------------------------------
# Models
# ------------------------------------------------------------

class CourseDataset(BaseModel):
    dtm_id: str
    course_id: str
    hole_id: int
    grid_spacing_m: float
    grid_rows: int
    grid_cols: int

class CoursesResponse(BaseModel):
    datasets: List[CourseDataset]

# ------------------------------------------------------------
# Endpoint
# ------------------------------------------------------------

@router.get("/courses", response_model=CoursesResponse)
async def get_courses():
    """
    Returns all available courses from the datasets registry.

    Returns:
        CoursesResponse: List of all course datasets with their metadata
    """
    try:
        if not DATASETS_PATH.exists():
            raise HTTPException(
                status_code=500,
                detail=f"Datasets registry not found: {DATASETS_PATH}"
            )

        with open(DATASETS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        return CoursesResponse(datasets=data.get("datasets", []))

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON in datasets file: {e}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading courses: {e}"
        )
