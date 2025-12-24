# Suggested Git Commit Messages

## Conventional Commits Format

### Main Migration Commit
```
feat: migrate golf AI from original AIME to AIME-2.0

- Migrate Python FastAPI backend structure
- Add Express routes for OpenAI API proxying (/api/realtime, /api/chat, /api/weather, /api/token)
- Copy and adapt AIRealtime.tsx and supporting components
- Create auth context for Create React App
- Enhance logger utility with createLogger method
- Update API calls to use Express backend
- Add missing dependencies (js-cookie, lucide-react, webrtc-adapter)

BREAKING CHANGE: Frontend now requires Express backend running on port 3001
```

### PuttSolver Integration Commit
```
feat: add PuttSolver integration (Phase 0 - mocked)

- Create SSOT documentation (docs/SSOT_AIME_PUTTSOLVER.md)
- Create Phase 0 contracts (schemas, samples, docs)
- Create course_data registry (datasets.json)
- Create PuttSolver service with mocked endpoints
- Create Python backend router for POST /api/solve_putt
- Integrate solve_putt tool into AIRealtime.tsx
- Create runbook with validation commands

Architecture:
- PuttSolver service accepts ONLY green_local_m (never lat/lon)
- All coordinate transforms occur in AIME backend
- Mock mode for Mac/Linux development
```

## Alternative: Split into Multiple Commits

### Commit 1: Migration
```
feat: migrate golf AI components from original AIME

- Copy AIRealtime.tsx and supporting components
- Add Express routes for OpenAI API proxying
- Create auth context and enhance logger
- Update dependencies
```

### Commit 2: Backend Setup
```
feat: add Python FastAPI backend for golf AI

- Create backend/main.py with FastAPI structure
- Add requirements.txt with dependencies
- Configure CORS for frontend integration
```

### Commit 3: PuttSolver Contracts
```
feat: create PuttSolver Phase 0 contracts

- Add JSON schemas for requests/responses
- Create coordinate frames documentation
- Add versioning strategy
- Create sample request/response files
```

### Commit 4: PuttSolver Service
```
feat: add PuttSolver service (mocked)

- Create FastAPI service with /health, /datasets, /solve_putt endpoints
- Implement DTM ID validation
- Generate mock putt solutions
- Add course_data registry
```

### Commit 5: Backend Integration
```
feat: integrate PuttSolver into AIME backend

- Create solve_putt router with WGS84->green_local_m transforms
- Add DTM registry resolution
- Call PuttSolver service via httpx
- Return tool-friendly JSON responses
```

### Commit 6: Frontend Integration
```
feat: add solve_putt tool to AI chat interface

- Register solve_putt tool in AIRealtime.tsx
- Add handler for solve_putt function calls
- Call Python FastAPI backend endpoint
- Display putt solution in chat
```

### Commit 7: Documentation
```
docs: add PuttSolver runbook and migration docs

- Create runbook with service startup commands
- Add curl validation commands
- Document migration plan and status
- Add SSOT context file
```

## PR Body Template

```markdown
## Summary
Migrates golf AI functionality from original AIME to AIME-2.0 and integrates PuttSolver (Phase 0 - mocked).

## Changes
- ✅ Migrated Python FastAPI backend structure
- ✅ Added Express routes for OpenAI API proxying
- ✅ Migrated AIRealtime.tsx and supporting components
- ✅ Created PuttSolver service with mocked endpoints
- ✅ Integrated solve_putt tool into frontend
- ✅ Created Phase 0 contracts and documentation

## Architecture
- Frontend (React): Port 3000
- Express Backend (Notion + OpenAI): Port 3001
- Python FastAPI Backend (Golf AI): Port 8000
- PuttSolver Service: Port 8081

## Testing
See `docs/RUNBOOK_PUTTSOLVER.md` for validation commands.

## Next Steps
- Test end-to-end flow
- Add real coordinate transformations (Phase 1)
- Integrate real PuttSolver DLL (Phase 1+)
```

