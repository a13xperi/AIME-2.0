# Coordinate Frames Documentation

## Overview

The PuttSolver integration uses three coordinate systems for transforming golf ball and cup positions from GPS coordinates to the solver's local coordinate frame.

## Coordinate Systems

### 1. WGS84 (GPS Coordinates)
- **Format:** Latitude and Longitude (decimal degrees)
- **Usage:** Input from user/frontend
- **Example:** `{ lat: 37.774929, lon: -122.419416 }`
- **Source:** GPS devices, mapping services

### 2. Projected Meters (State Plane or UTM)
- **Format:** Meters in a projected coordinate system
- **Usage:** Intermediate transformation step
- **Example:** `{ x: 600000.0, y: 4000000.0 }` (State Plane California Zone 3)
- **Source:** Geographic transformation from WGS84
- **Purpose:** Provides accurate distance calculations in meters

### 3. Green Local Meters (`green_local_m`)
- **Format:** Meters relative to green origin
- **Usage:** Input to PuttSolver service
- **Example:** `{ x: 5.2, y: 3.8 }` (5.2m east, 3.8m north of green origin)
- **Source:** Transformation from projected_m using green origin and rotation
- **Purpose:** Solver's native coordinate frame

## Transformation Pipeline

```
WGS84 (lat/lon)
    ↓
    [Geographic Transform]
    ↓
Projected Meters (projected_m)
    ↓
    [Green Origin + Rotation]
    ↓
Green Local Meters (green_local_m)
    ↓
    [PuttSolver Service]
```

## Green Origin

The green origin is the reference point (0, 0) in the `green_local_m` coordinate system. It is typically:
- Located at a specific corner of the green (SW, SE, NW, or NE)
- Defined in the `course_data/datasets.json` registry
- Used to transform all ball and cup positions to the solver's frame

## Rotation Convention

The green may be rotated relative to the projected coordinate system. Rotation is specified as:
- **Angle:** Degrees (typically 0-360)
- **Direction:** Clockwise or counterclockwise (TBD - developer blocker question)
- **Reference:** North (0°) in projected coordinate system

## Implementation Notes

- All transformations occur in the **AIME backend** (Python FastAPI)
- PuttSolver service **NEVER** receives lat/lon coordinates
- PuttSolver service **ONLY** receives `green_local_m` coordinates
- Transformations are mocked in Phase 0 but signatures must remain correct

## Developer Blockers

1. Which corner is (0,0)? (SW/SE/NW/NE)
2. What is the +X/+Y direction convention?
3. What is the rotation sign convention? (clockwise positive or negative?)

