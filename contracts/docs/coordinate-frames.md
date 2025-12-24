# Coordinate Frames (SSOT)

## Frames
- **wgs84**: { lat, lon } in EPSG:4326
- **projected_m**: { x_m, y_m } in course-specific EPSG (example shown in docs: EPSG:3675)
- **green_local_m**: { x, y } meters in the solver's green-local grid

## Locked Decision
All transforms live in the **AIME backend**.
The PuttSolver Service only receives **green_local_m**.

## BLOCKED (needs developer call)
1) Which corner is (0,0): SW / SE / NW / NE?
2) Which direction is +X / +Y?
3) Rotation sign convention (clockwise positive vs negative)?

Once confirmed, update this doc and the `green_manifest` schema accordingly.
