"""
Manifest Generator for Green DTMs

Generates green_manifest.json files from grid data and course metadata.
"""
import json
import os
from typing import Dict, Optional
from .grid_parser import parse_grid_file, estimate_green_size


def generate_manifest(
    dtm_id: str,
    course_id: str,
    hole_id: int,
    grid_file_path: str,
    green_origin_projected_m: Dict[str, float],
    green_rotation_deg: float = 0.0,
    state_plane_epsg: Optional[int] = None,
    stimp_range: Optional[Dict[str, float]] = None,
    description: Optional[str] = None
) -> Dict:
    """
    Generate a green manifest from grid data and metadata.
    
    Args:
        dtm_id: Unique identifier for the DTM (e.g., "riverside_2023_20cm")
        course_id: Course identifier (e.g., "riverside_country_club")
        hole_id: Hole number (1-18)
        grid_file_path: Path to the grid file
        green_origin_projected_m: Origin in projected coordinates {"x": float, "y": float}
        green_rotation_deg: Rotation of green relative to projected system (degrees)
        state_plane_epsg: EPSG code for State Plane projection (optional)
        stimp_range: Valid stimp range {"min": float, "max": float} (optional)
        description: Human-readable description (optional)
        
    Returns:
        Dictionary matching green_manifest.schema.json
    """
    # Parse grid file to get dimensions
    grid_metadata = parse_grid_file(grid_file_path)
    green_size = estimate_green_size(grid_metadata)
    
    # Build manifest
    manifest = {
        "dtm_id": dtm_id,
        "course_id": course_id,
        "hole_id": hole_id,
        "green_origin_projected_m": green_origin_projected_m,
        "green_rotation_deg": green_rotation_deg,
        "green_size_m": green_size,
        "grid_spacing_m": grid_metadata["grid_spacing_m"],
        "grid_dimensions": {
            "rows": grid_metadata["rows"],
            "cols": grid_metadata["cols"]
        },
        "elevation_range": grid_metadata["elevation_range"],
        "data_coverage_pct": round(grid_metadata["data_coverage"], 2)
    }
    
    # Add optional fields
    if state_plane_epsg:
        manifest["state_plane_epsg"] = state_plane_epsg
    
    if stimp_range:
        manifest["stimp_range"] = stimp_range
    else:
        # Default stimp range
        manifest["stimp_range"] = {"min": 8.0, "max": 14.0}
    
    if description:
        manifest["description"] = description
    else:
        manifest["description"] = f"{course_id.replace('_', ' ').title()} - Hole {hole_id} - {grid_metadata['grid_spacing_m']*100}cm resolution DTM"
    
    # Add grid file path (relative to course_data)
    manifest["grid_file_path"] = os.path.relpath(grid_file_path, start=os.path.dirname(grid_file_path))
    
    return manifest


def save_manifest(manifest: Dict, output_path: str) -> None:
    """
    Save manifest to JSON file.
    
    Args:
        manifest: Manifest dictionary
        output_path: Path to output JSON file
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"✅ Saved manifest to: {output_path}")


if __name__ == '__main__':
    # Generate manifest for Riverside Hole 1
    grid_file = 'ovation_golf/dll/Riverside_20cm_Grid.txt'
    
    if os.path.exists(grid_file):
        manifest = generate_manifest(
            dtm_id="riverside_2023_20cm",
            course_id="riverside_country_club",
            hole_id=1,
            grid_file_path=grid_file,
            green_origin_projected_m={"x": 600123.45, "y": 4000567.89},  # Mock - needs real data
            green_rotation_deg=0.0,  # Mock - needs real data
            state_plane_epsg=3675,  # Utah North (example)
            stimp_range={"min": 8.0, "max": 14.0},
            description="Riverside Country Club - Hole 1 - 20cm resolution DTM from 2023 survey"
        )
        
        # Print manifest
        print("Generated Manifest:")
        print(json.dumps(manifest, indent=2))
        
        # Save to course_data/manifests/
        output_dir = 'course_data/manifests'
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{manifest['dtm_id']}.json")
        save_manifest(manifest, output_path)
    else:
        print(f"Grid file not found: {grid_file}")


