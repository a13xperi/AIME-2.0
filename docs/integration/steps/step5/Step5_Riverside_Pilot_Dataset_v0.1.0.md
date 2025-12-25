# Step 5 — Riverside Pilot Dataset (Validated Asset)
**Contract version:** 0.1.0  
**Dataset:** `riverside_2023_20cm`

## Goal
Create a first “known-good” dataset pack that every layer can use (AIME backend transforms, PuttSolver Service, UI overlay).

## What was produced
### Drop-in `course_data/` pack
- `course_data/datasets.json` — allowlisted dataset registry
- `course_data/ovation/riverside/hole_01/green/green_manifest.json` — generated manifest (schema-valid)
- `course_data/ovation/riverside/hole_01/green/dtm/Riverside_20cm_Grid.txt` — tab-delimited grid file
- `course_data/ovation/riverside/hole_01/green/source/Riverside_2023.ini` — original Ovation metadata
- `course_data/ovation/riverside/hole_01/green/validation_report.json` — computed dims/extents/stats + notes

### Key derived facts (for debugging)
- Grid: 215 rows × 128 cols
- Spacing: 0.2m
- Extents: x_max=42.8m, y_max=25.4m
- no_data_ratio ≈ 0.121003
- valid_min=1.0, valid_max=4.22
- EPSG: 3675 (from ini)

## Important note
`axis_convention` (origin corner, x/y directions, rotation sign) remains **UNCONFIRMED** until the original developer answers the blockers. The dataset is still usable for scaffolding and testing plumbing, but overlays should be treated as “debug” until confirmed.

## How to use
1. Unzip the dataset pack into the root of your AIME repo so you have `aime-main/course_data/...`
2. Configure AIME backend to read `course_data/datasets.json`
3. Ensure PuttSolver Service host has the same dataset pack deployed (or shared storage)
4. Use `dtm_id="riverside_2023_20cm"` in PuttSolver service calls (local frame inputs only)

## Artifacts
- `course_data_riverside_pilot_v0.1.0.zip` (drop-in pack)
- `aime-main_with_contracts_and_course_data_v0.1.0.zip` (repo zip with contracts + course_data included)
