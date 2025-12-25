"""
Coordinate Transform Utilities

Implements WGS84 → projected_m → green_local_m transformations.
"""
import os
import sys
from typing import Dict, Tuple, Optional
import pyproj
from pyproj import Transformer
import math


def wgs84_to_state_plane(
    lat: float,
    lon: float,
    epsg_code: int
) -> Tuple[float, float]:
    """
    Transform WGS84 coordinates to State Plane projection.
    
    Args:
        lat: Latitude (degrees)
        lon: Longitude (degrees)
        epsg_code: EPSG code for State Plane projection (e.g., 3675 for Utah North)
        
    Returns:
        Tuple of (x_m, y_m) in State Plane meters
    """
    wgs84 = pyproj.CRS('EPSG:4326')
    state_plane = pyproj.CRS(f'EPSG:{epsg_code}')
    
    transformer = Transformer.from_crs(wgs84, state_plane, always_xy=True)
    x_m, y_m = transformer.transform(lon, lat)
    
    return (x_m, y_m)


def projected_to_green_local(
    x_projected: float,
    y_projected: float,
    green_origin_projected_m: Dict[str, float],
    green_rotation_deg: float
) -> Tuple[float, float]:
    """
    Transform projected coordinates to green-local coordinates.
    
    Args:
        x_projected: X coordinate in projected meters
        y_projected: Y coordinate in projected meters
        green_origin_projected_m: Green origin in projected coordinates {"x": float, "y": float}
        green_rotation_deg: Rotation of green relative to projected system (degrees, CCW positive)
        
    Returns:
        Tuple of (x_local, y_local) in green-local meters
    """
    # Translate to origin
    dx = x_projected - green_origin_projected_m["x"]
    dy = y_projected - green_origin_projected_m["y"]
    
    # Rotate (negative rotation because we're rotating the coordinate system)
    rotation_rad = math.radians(-green_rotation_deg)
    cos_r = math.cos(rotation_rad)
    sin_r = math.sin(rotation_rad)
    
    x_local = dx * cos_r - dy * sin_r
    y_local = dx * sin_r + dy * cos_r
    
    return (x_local, y_local)


def wgs84_to_green_local(
    lat: float,
    lon: float,
    green_origin_projected_m: Dict[str, float],
    green_rotation_deg: float,
    state_plane_epsg: int
) -> Tuple[float, float]:
    """
    Complete transform chain: WGS84 → projected_m → green_local_m.
    
    Args:
        lat: Latitude (degrees)
        lon: Longitude (degrees)
        green_origin_projected_m: Green origin in projected coordinates
        green_rotation_deg: Rotation of green relative to projected system
        state_plane_epsg: EPSG code for State Plane projection
        
    Returns:
        Tuple of (x_local, y_local) in green-local meters
    """
    # Step 1: WGS84 → State Plane
    x_proj, y_proj = wgs84_to_state_plane(lat, lon, state_plane_epsg)
    
    # Step 2: State Plane → Green Local
    x_local, y_local = projected_to_green_local(
        x_proj, y_proj, green_origin_projected_m, green_rotation_deg
    )
    
    return (x_local, y_local)


def green_local_to_projected(
    x_local: float,
    y_local: float,
    green_origin_projected_m: Dict[str, float],
    green_rotation_deg: float
) -> Tuple[float, float]:
    """
    Inverse transform: green-local → projected.
    
    Args:
        x_local: X coordinate in green-local meters
        y_local: Y coordinate in green-local meters
        green_origin_projected_m: Green origin in projected coordinates
        green_rotation_deg: Rotation of green relative to projected system
        
    Returns:
        Tuple of (x_projected, y_projected) in projected meters
    """
    # Rotate back (positive rotation)
    rotation_rad = math.radians(green_rotation_deg)
    cos_r = math.cos(rotation_rad)
    sin_r = math.sin(rotation_rad)
    
    dx = x_local * cos_r - y_local * sin_r
    dy = x_local * sin_r + y_local * cos_r
    
    # Translate back
    x_projected = dx + green_origin_projected_m["x"]
    y_projected = dy + green_origin_projected_m["y"]
    
    return (x_projected, y_projected)


if __name__ == '__main__':
    # Test with mock Riverside data
    print("Testing Coordinate Transforms")
    print("=" * 50)
    
    # Mock WGS84 coordinates (Riverside Country Club area)
    test_lat = 40.268240
    test_lon = -111.659520
    
    # Mock green origin and rotation
    green_origin = {"x": 600123.45, "y": 4000567.89}
    green_rotation = 0.0
    epsg = 3675  # Utah North
    
    print(f"Input WGS84: ({test_lat}, {test_lon})")
    
    # Transform to State Plane
    x_proj, y_proj = wgs84_to_state_plane(test_lat, test_lon, epsg)
    print(f"State Plane: ({x_proj:.2f}, {y_proj:.2f})")
    
    # Transform to Green Local
    x_local, y_local = wgs84_to_green_local(
        test_lat, test_lon, green_origin, green_rotation, epsg
    )
    print(f"Green Local: ({x_local:.2f}, {y_local:.2f})")
    
    # Test inverse transform
    x_proj_back, y_proj_back = green_local_to_projected(
        x_local, y_local, green_origin, green_rotation
    )
    print(f"Inverse (Green Local → Projected): ({x_proj_back:.2f}, {y_proj_back:.2f})")
    print(f"Round-trip error: {abs(x_proj - x_proj_back):.6f}, {abs(y_proj - y_proj_back):.6f}")


