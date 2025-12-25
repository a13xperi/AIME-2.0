# Notion Task Checklist

## Status Updates

### Phase 0: Contracts & Mocked E2E Plumbing
- [x] **Create SSOT file** - `docs/SSOT_AIME_PUTTSOLVER.md`
- [x] **Create contracts directory** - `contracts/{docs,schemas,samples}/`
- [x] **Create JSON schemas** - All 5 schemas created
- [x] **Create sample JSONs** - Request and response samples
- [x] **Create coordinate-frames.md** - Documentation
- [x] **Create versioning.md** - API versioning strategy
- [x] **Create course_data registry** - `course_data/datasets.json`
- [x] **Create PuttSolver service** - Mocked FastAPI service
- [x] **Create backend router** - POST /api/solve_putt
- [x] **Integrate frontend tool** - solve_putt in AIRealtime.tsx
- [x] **Create runbook** - Service startup and validation

### Migration Tasks
- [x] **Migrate Python FastAPI backend** - `backend/main.py`
- [x] **Add Express OpenAI routes** - `/api/realtime`, `/api/chat`, `/api/weather`, `/api/token`
- [x] **Migrate AIRealtime.tsx** - Golf AI chat component
- [x] **Migrate supporting components** - WeatherToolPanel, HoleLayoutPanel, etc.
- [x] **Create auth context** - `src/context/auth-context.tsx`
- [x] **Enhance logger** - Added `createLogger` method
- [x] **Update dependencies** - js-cookie, lucide-react, webrtc-adapter

## Developer Blocker Questions

**Paste these 5 questions to the PuttSolver developer:**

1. **Which corner is (0,0)?** (SW/SE/NW/NE) + **+X/+Y direction?** + **rotation sign convention?**

2. **DTMPath expected by DLL:** file vs directory; exact format?

3. **Instruction[] buffer:** encoding + max length + truncation rules?

4. **GetPlotLength meaning** + how to interpret/pass LengthX/LengthY?

5. **Thread safety:** serialize calls or safe concurrent?

## Current Status

**Status:** ✅ Phase 0 Complete - Ready for Testing

**Branch:** `feat/migrate-aime-golf-ai`

**Next Actions:**
1. Test end-to-end flow (see `docs/RUNBOOK_PUTTSOLVER.md`)
2. Verify all services start correctly
3. Test solve_putt tool in AI chat interface
4. Address any integration issues
5. Proceed to Phase 1 (real coordinate transforms + DLL integration)

## Files Created/Modified

### New Files
- `docs/SSOT_AIME_PUTTSOLVER.md`
- `docs/RUNBOOK_PUTTSOLVER.md`
- `contracts/docs/coordinate-frames.md`
- `contracts/versioning.md`
- `contracts/schemas/*.json` (5 files)
- `contracts/samples/*.json` (2 files)
- `course_data/datasets.json`
- `putt-solver-service/main.py`
- `putt-solver-service/requirements.txt`
- `putt-solver-service/README.md`
- `backend/main.py`
- `backend/requirements.txt`
- `backend/routers/solve_putt.py`
- `src/context/auth-context.tsx`
- `src/lib/logger.ts`

### Modified Files
- `server/index.ts` - Added OpenAI proxy routes
- `src/utils/logger.ts` - Added createLogger method
- `src/components/airealtime/AIRealtime.tsx` - Added solve_putt tool
- `package.json` - Added dependencies

## Architecture Compliance

✅ **Transforms live in AIME backend:** WGS84 -> projected_m -> green_local_m
✅ **PuttSolver Service NEVER receives lat/lon**
✅ **PuttSolver Service ONLY accepts:** { dtm_id, ball_local_m, cup_local_m, stimp, request_id }
✅ **PuttSolver Service NEVER accepts file paths**
✅ **Unknown dtm_id rejected** (HTTP 400)
✅ **Mock mode for Mac/Linux** (PUTTSOLVER_MODE=mock)

