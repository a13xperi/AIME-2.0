# Phase 1 - Getting Started

## Overview

Phase 1 focuses on **Course/Green Data Foundation** - bridging the gap between raw Ovation survey data and AIME's runtime needs.

## Workstream 1A: Green Dataset Registry + Manifest

### Goals
1. Parse Ovation `.ini` files to extract grid metadata
2. Generate `green_manifest.json` for Riverside Hole 1
3. Expand `datasets.json` registry
4. Implement `resolve_dtm_path()` function

### Available Resources

**Ovation Golf Assets:**
- `ovation_golf/dll/PuttSolver.ini` - DLL configuration
- `ovation_golf/dll/Riverside_20cm_Grid.txt` - Grid data
- `ovation_golf/python/transforms/WGS84ToStatePlane.py` - Transform code
- `ovation_golf/python/geodist/GeoDist.py` - Geo distance utilities

**Existing Contracts:**
- `contracts/schemas/green_manifest.schema.json` - Schema for manifest
- `course_data/datasets.json` - Basic registry (needs expansion)

### Next Steps

1. **Examine Ovation Data**
   ```bash
   cd /Users/alex/A13x/AIME/AIME-2.0
   cat ovation_golf/dll/PuttSolver.ini
   head ovation_golf/dll/Riverside_20cm_Grid.txt
   ```

2. **Review Transform Code**
   ```bash
   cat ovation_golf/python/transforms/WGS84ToStatePlane.py
   ```

3. **Create Manifest Generator**
   - Parse `.ini` files
   - Extract grid dimensions, spacing, origin
   - Generate `green_manifest.json` matching schema

4. **Expand Registry**
   - Update `course_data/datasets.json`
   - Add manifest path references
   - Implement path resolution logic

### Blockers

- Need actual Ovation `.ini` file structure/documentation
- Need coordinate transform parameters from Ovation data
- 5 developer blocker questions still need answers (see SSOT)

## Workstream 1B: Coordinate Transform Library

### Goals
1. Replace mock transforms with real pyproj transforms
2. Implement WGS84 → projected_m → green_local_m
3. Test with Riverside data

### Resources
- `ovation_golf/python/transforms/WGS84ToStatePlane.py` - Existing transform code
- `contracts/docs/coordinate-frames.md` - Coordinate system documentation

### Next Steps

1. Review existing transform code
2. Integrate pyproj library
3. Replace mock transforms in `backend/routers/solve_putt.py`
4. Test with Riverside coordinates

## Recommended Starting Point

**Start with Workstream 1A** - Examine the Ovation data we have and create a plan for parsing it.


