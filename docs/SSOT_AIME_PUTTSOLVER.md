# SSOT — AIME PuttSolver Integration (for Warp + Cursor)

## Notion SSOT pages (open in browser)
- Integration Roadmap: https://broadleaf-tune-ba0.notion.site/AIME-Putt-Solver-Integration-Roadmap-fde00c055bc74736af6d620bf8946907
- Runbook v1: https://www.notion.so/02b81bddff3f46369162b6fa2f04f499
- System Boundaries (LOCKED): https://www.notion.so/1949f546dc1e4cd984760a95d0ef2d0f
- Dev Environment Setup: https://www.notion.so/fa9669a12f9c400791a157f532f8d7d6
- Architecture Diagram: https://www.notion.so/59acf2a708424dfcbadb7cd2ddb78078
- API Endpoint Reference: https://www.notion.so/d8152bb7a227437bafd7bf1b821ffb1d
- Code Scaffolding Templates: https://www.notion.so/c12bc658d55540c595b77bc5170c3de2
- JSON Schema Drafts: https://www.notion.so/85282637149d4e7aabf91a87b0153f7e

## Locked architecture decisions (NON-NEGOTIABLE)
1) Transforms live in AIME backend: wgs84 -> projected_m -> green_local_m
   - PuttSolver Service NEVER receives lat/lon.

2) PuttSolver Service accepts ONLY: { dtm_id, ball_local_m, cup_local_m, stimp, request_id }
   - NEVER accept file paths.
   - Unknown dtm_id must be rejected.

3) PuttSolver DLL is Windows x64 only.
   - Provide mock mode for Mac/Linux.

## Repo paths (expected)
- Backend (Python FastAPI): AIME-2.0/backend/main.py
- Backend (Express/Notion): AIME-2.0/server/index.ts
- Frontend: AIME-2.0/src/components/airealtime/AIRealtime.tsx
- Contracts: AIME-2.0/contracts/{docs,schemas,samples}/
- Registry: AIME-2.0/course_data/datasets.json
- Service: AIME-2.0/putt-solver-service/ (real DLL requires Windows x64)

## Dev ports (expected)
- Frontend: 3000
- Express Backend (Notion): 3001
- Python FastAPI Backend (Golf AI): 8000
- PuttSolver Service: 8081

## Endpoints (SSOT)
PuttSolver Service:
- GET /health
- GET /datasets
- POST /solve_putt

AIME Python Backend (FastAPI):
- POST /api/solve_putt (WGS84 in; backend transforms; calls service)

AIME Express Backend:
- POST /api/realtime (OpenAI WebRTC proxy)
- POST /api/chat (OpenAI chat proxy)
- GET /api/weather (Weather API proxy)

## Naming conventions
- course_id: lowercase_snake_case (e.g., riverside_country_club)
- dtm_id: {course}_{year}_{resolution} (e.g., riverside_2023_20cm)
- schemas: {entity}.schema.json in contracts/schemas/

## Developer blockers call (paste these 5 questions)
1) Which corner is (0,0) (SW/SE/NW/NE)? +X/+Y direction? rotation sign convention?
2) DTMPath expected by DLL: file vs directory; exact format?
3) Instruction[] buffer: encoding + max length + truncation rules?
4) GetPlotLength meaning + how to interpret/pass LengthX/LengthY?
5) Thread safety: serialize calls or safe concurrent?

