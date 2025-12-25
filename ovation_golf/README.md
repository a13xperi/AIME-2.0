# Ovation Golf Integration

This directory contains all Ovation Golf components integrated into the AIME 2.0 architecture. Ovation Golf provides the **PuttSolver** technology - a physics-based putting solver that uses Digital Terrain Model (DTM) data to calculate optimal putting paths.

## Directory Structure

```
ovation_golf/
├── README.md                    # This file
├── docs/                        # Documentation and specifications
│   ├── OvationGolf_Demo_SystemSpecification_20230831.docx
│   ├── How to Install the Path solver application.docx
│   ├── Python Setup Instructions.docx
│   └── LabVIEW Development Setup Instructions.docx
├── dll/                         # PuttSolver DLL (Windows x64)
│   ├── PuttSolver.dll          # Main solver DLL
│   ├── PuttSolver.h            # C header file
│   ├── PuttSolver.lib          # Import library
│   ├── PuttSolver.ini          # Configuration
│   ├── PuttSolver.aliases      # LabVIEW aliases
│   └── Riverside_20cm_Grid.txt # Sample DTM data (Riverside CC)
├── python/                      # Python utilities
│   ├── geodist/                # Geodesic distance calculator
│   │   └── GeoDist.py          # WGS84 distance to meters
│   └── transforms/             # Coordinate transforms
│       └── WGS84ToStatePlane.py # WGS84 → State Plane projection
├── builds/                      # Compiled applications
│   ├── OvationGolfPython.zip   # Python executables (Windows)
│   └── PathSolverPlusRTE.zip   # LabVIEW runtime (288 MB)
└── labview/                     # LabVIEW source code
    ├── PathSolverSourceCode.zip
    └── Public Documents Data.zip
```

---

## PuttSolver DLL Interface

The core of Ovation Golf is the **PuttSolver.dll** - a Windows x64 DLL built from LabVIEW.

### DLL Functions

#### 1. `DLL_SolveSingle` - Main Solver Function

```c
int32_t DLL_SolveSingle(
    double HoleX,              // Cup X position (meters, green-local)
    double HoleY,              // Cup Y position (meters, green-local)
    double BallX,              // Ball X position (meters, green-local)
    double BallY,              // Ball Y position (meters, green-local)
    double StimpFt,            // Stimpmeter reading (feet)
    double StimpIn,            // Stimpmeter reading (inches)
    char Instruction[],        // Output: Instruction text (e.g., "Aim 2 feet left")
    int32_t InstructionLength, // Size of Instruction buffer
    char DTMPath[]             // Path to DTM file (e.g., "Riverside_20cm_Grid.txt")
);
```

**Returns**: Status code (0 = success, non-zero = error)

**Coordinates**: All X/Y coordinates are in **meters** in the **green-local frame**:
- Origin is at one corner of the DTM grid (convention TBD - see blockers)
- X/Y axes align with DTM grid rows/columns
- No rotation or offset

#### 2. `DLL_GetPlotLength` - Get Plot Point Count

```c
int32_t DLL_GetPlotLength(void);
```

Returns the number of plot points available after calling `DLL_SolveSingle`.

#### 3. `DLL_GetPlotData` - Retrieve Plot Points

```c
void DLL_GetPlotData(
    double PlotX[],    // Output: X coordinates of plot points
    double PlotY[],    // Output: Y coordinates of plot points
    int32_t LengthX,   // Size of PlotX array
    int32_t LengthY    // Size of PlotY array
);
```

Call after `DLL_SolveSingle` to retrieve the ball path visualization points.

---

## Integration with AIME 2.0

### Architecture Overview

```
AIME Backend (FastAPI)
  ├─ Coordinate Transform Layer
  │   └─ WGS84 → projected_m → green_local_m
  │
  └─ PuttSolver Service (Windows)
      ├─ HTTP Wrapper around PuttSolver.dll
      ├─ Accepts: dtm_id, ball_local_m, cup_local_m, stimp
      └─ Returns: instruction_text, plot_points, return_code
```

### Data Flow

1. **Frontend** sends GPS coordinates (WGS84) to AIME Backend
2. **AIME Backend** transforms WGS84 → green_local_m
3. **AIME Backend** calls **PuttSolver Service** with local coordinates
4. **PuttSolver Service** loads DLL, calls `DLL_SolveSingle`
5. **PuttSolver Service** retrieves plot data via `DLL_GetPlotData`
6. **PuttSolver Service** returns instruction + plot to backend
7. **AIME Backend** sends result to frontend with green_frame metadata

### Security Model

- **NO RAW FILE PATHS**: PuttSolver Service uses allowlisted `dtm_id` strings
- **DTM Registry**: `dtm_id → dtm_path` mapping maintained internally
- **Sandboxed**: DLL only accesses files in configured `DATA_ROOT`

---

## Python Utilities

### GeoDist.py - Geodesic Distance Calculator

Calculates distance between two WGS84 points with X/Y components.

**Usage**:
```bash
python GeoDist.py <lat1> <lon1> <lat2> <lon2>
```

**Output**:
```
X(m): 213.88
Y(m): -83.65
Magnitude(m): 229.66
```

**Note**: X/Y signs are calculated for North America. Positive X = East, Positive Y = North.

### WGS84ToStatePlane.py - Coordinate Transform

Transforms WGS84 coordinates to State Plane projection.

**Usage**:
```bash
python WGS84ToStatePlane.py <EPSG_code> <latitude> <longitude>
```

**Example**:
```bash
python WGS84ToStatePlane.py 3675 40.268240 -111.659520
# Output: X(m): 425123.45, Y(m): 4467890.12
```

**Dependencies**: `pyproj`

---

## DTM File Format

DTM (Digital Terrain Model) files store elevation data in a grid format.

### Example: Riverside_20cm_Grid.txt

- **Resolution**: 20cm (0.2m) grid spacing
- **Format**: Plain text ASCII grid
- **Dimensions**: Defined in green manifest
- **Elevation Units**: Meters (relative to grid base)

### Green Manifest Schema

Each course/hole/green has a manifest (JSON) with:

```json
{
  "dtm_id": "riverside_2023_hole1_green",
  "grid_spacing_m": 0.2,
  "rows": 845,
  "cols": 423,
  "no_data_value": -9999,
  "epsg": 3675,
  "transform": {
    "corner_lat": 40.268251,
    "corner_lon": -111.659486,
    "origin_corner": "SW",  // [BLOCKED] - needs confirmation
    "rotation_deg": 0.0     // [BLOCKED] - needs confirmation
  }
}
```

---

## Coordinate Frames Reference

Three coordinate frames are used in the AIME 2.0 system:

### 1. WGS84 (GPS Coordinates)
- **Format**: `{lat: float, lon: float}`
- **EPSG**: 4326
- **Units**: Decimal degrees
- **Source**: Frontend (phone GPS)

### 2. Projected Meters (State Plane)
- **Format**: `{x_m: float, y_m: float}`
- **EPSG**: Course-specific (e.g., 3675 for Utah North)
- **Units**: Meters
- **Purpose**: Intermediate projection step

### 3. Green-Local Meters (DTM Frame)
- **Format**: `{x: float, y: float}`
- **Units**: Meters
- **Origin**: One corner of DTM grid **[BLOCKED - which corner?]**
- **Axes**: Aligned with DTM rows/columns **[BLOCKED - which is X, which is Y?]**
- **Purpose**: DLL input coordinates

### Transform Chain

```
WGS84 (lat/lon)
  └─> [pyproj] State Plane (x_m, y_m)
      └─> [offset + rotation] Green-Local (x, y)
          └─> [PuttSolver.dll] Solution
```

**CRITICAL**: All transforms happen in **AIME Backend**, not in PuttSolver Service or Frontend.

---

## Known Blockers & Open Questions

These items require clarification from the Ovation Golf developer:

### 1. ❌ Origin Corner Convention
- **Question**: Which corner of the DTM grid is (0,0)?
- **Options**: SW, SE, NW, NE
- **Impact**: Affects all coordinate transforms

### 2. ❌ Axis Directions
- **Question**: Which axis (+X or +Y) corresponds to rows vs columns?
- **Question**: Are +Y values "up" or "down" in the grid?
- **Impact**: Determines rotation matrix

### 3. ❌ Rotation Sign Convention
- **Question**: Is rotation clockwise or counter-clockwise positive?
- **Impact**: Green alignment with true north

### 4. ❌ DTMPath Format
- **Question**: What is the expected format of `DTMPath` parameter?
- **Options**: Absolute path, relative path, filename only?
- **Current Approach**: Pass absolute path to DTM file

### 5. ❌ Instruction Buffer Length
- **Question**: What is the maximum instruction text length?
- **Question**: What happens if instruction exceeds buffer?
- **Current Approach**: Allocate 256 bytes

### 6. ❌ Plot Data Length
- **Question**: What is the max plot length returned?
- **Question**: Does `LengthX` == `LengthY` always?
- **Impact**: Buffer allocation for plot arrays

### 7. ❌ Thread Safety
- **Question**: Is the DLL thread-safe?
- **Question**: Can multiple calls to `DLL_SolveSingle` run concurrently?
- **Impact**: Service concurrency model

### 8. ❌ DLL State Management
- **Question**: Is there internal state between calls?
- **Question**: Must we call functions in specific order?
- **Current Assumption**: Each `DLL_SolveSingle` is independent

**See**: `docs/integration/interviews/Developer_Blockers_Interview_Agenda_v0.1.0.md` for full question list.

---

## Platform Requirements

### PuttSolver DLL
- **OS**: Windows x64
- **Runtime**: LabVIEW Runtime Engine (included in PathSolverPlusRTE.zip)
- **Dependencies**: None (self-contained)

### Python Utilities
- **OS**: Cross-platform (Windows, macOS, Linux)
- **Python**: 3.11+
- **Dependencies**:
  - `geopy` (for GeoDist)
  - `pyproj` (for WGS84ToStatePlane)

### AIME Backend
- **OS**: Cross-platform (dev: macOS, prod: Linux recommended)
- **Python**: 3.11+
- **Dependencies**: See `backend/requirements.txt`

---

## Deployment Strategy

### Development (Current)
- **PuttSolver Service**: Mock mode (no DLL)
- **Transforms**: Mock data for plumbing validation
- **Platform**: macOS for AIME Backend

### Staging (Post-blocker resolution)
- **PuttSolver Service**: Real DLL on Windows VM or container
- **Transforms**: Real pyproj-based transforms
- **Platform**: Windows for PuttSolver Service, Linux for AIME Backend

### Production
- **PuttSolver Service**: Dedicated Windows server with DLL
- **Transforms**: AIME Backend with pyproj + EPSG database
- **Security**: Internal-only networking, API keys, allowlisted DTMs
- **Scalability**: Load balancer → multiple AIME Backend instances → single PuttSolver Service

---

## Testing

### Unit Tests
- `backend/aime/geo/transforms.py` - Transform logic
- `backend/aime/clients/putt_solver_client.py` - Service client

### Integration Tests
- End-to-end: Frontend → Backend → Service → DLL
- Coordinate accuracy: Known GPS → expected local coords
- Plot rendering: Verify path visualization correctness

### Smoke Tests
Available in `docs/integration/steps/`:
- Step 7: Real PuttSolver Service smoke test
- Step 11: Stateful sessions smoke test
- Step 12: Production features smoke test

---

## Reference Documentation

### Internal Docs
- `docs/integration/decisions/System_Boundaries_Decisions_v0.1.0.md` - Architecture decisions
- `contracts/docs/coordinate-frames.md` - Coordinate system specification
- `WARP.md` - Current system state and blockers

### Ovation Docs (in `ovation_golf/docs/`)
- `OvationGolf_Demo_SystemSpecification_20230831.docx` - System specification
- `How to Install the Path solver application.docx` - Installation guide
- `Python Setup Instructions.docx` - Python utility setup
- `LabVIEW Development Setup Instructions.docx` - LabVIEW development guide

---

## Maintenance Notes

### DTM File Management
- **Location**: Course-specific DTMs stored outside repo (too large)
- **Deployment**: Copy DTM files to Windows service host
- **Registry**: Update `course_data/datasets.json` with new `dtm_id` entries
- **Validation**: Verify DTM file hash on service startup

### DLL Updates
If Ovation Golf provides a new DLL version:
1. Replace `ovation_golf/dll/PuttSolver.dll`
2. Update `ovation_golf/dll/PuttSolver.h` if interface changed
3. Test with all registered DTMs
4. Update version in PuttSolver Service
5. Document breaking changes (if any)

### Python Utilities
- These are **reference implementations** only
- AIME Backend uses `pyproj` + custom transform logic
- Keep utilities for debugging and validation

---

## Future Enhancements

### Short Term (Post-blocker resolution)
- [ ] Implement real coordinate transforms in AIME Backend
- [ ] Deploy PuttSolver Service on Windows with real DLL
- [ ] Add DTM integrity checking (hash verification)
- [ ] Add comprehensive error handling for DLL return codes

### Medium Term
- [ ] Support multiple DTMs per green (e.g., seasonal variations)
- [ ] Add DTM preprocessing pipeline (validation, format conversion)
- [ ] Implement DLL warm-up / keep-alive for faster response times
- [ ] Add telemetry for solver performance metrics

### Long Term
- [ ] Explore native Linux solver (avoid Windows dependency)
- [ ] Add ML-based solver fallback for missing DTMs
- [ ] Support dynamic DTM updates without service restart
- [ ] Add solver result caching for common positions

---

## Contact & Support

For questions about Ovation Golf components:
- **DLL Interface**: Contact Ovation Golf developer (see interview agenda)
- **AIME Integration**: See `INTEGRATION_SUMMARY.md`
- **Architecture**: See `docs/integration/decisions/`

---

## License & Intellectual Property

**Ovation Golf** technology (DLL, LabVIEW source, DTMs) is proprietary.

**AIME 2.0** integration code (transforms, clients, wrappers) is separate.

Coordinate transform utilities (Python scripts) are reference implementations.
