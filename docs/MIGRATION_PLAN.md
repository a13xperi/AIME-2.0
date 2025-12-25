# AIME Golf AI Migration Plan

## Overview
Migrating golf AI functionality from original AIME (Next.js) to AIME-2.0 (Create React App + Express).

## Architecture Changes

### Original AIME
- Next.js frontend with API routes (`/api/realtime`, `/api/chat`, `/api/weather`)
- Python FastAPI backend (port 8000)
- Next.js App Router with `useRouter` from `next/navigation`

### AIME-2.0 (Target)
- Create React App frontend (port 3000)
- Express backend for Notion + OpenAI proxy (port 3001)
- Python FastAPI backend for Golf AI + PuttSolver (port 8000)
- React Router for navigation

## Migration Steps

### ✅ Completed
1. Created SSOT file (`docs/SSOT_AIME_PUTTSOLVER.md`)
2. Created Python FastAPI backend structure (`backend/main.py`)
3. Added Express routes for OpenAI API proxying (`server/index.ts`)
4. Created directory structure for components

### 🔄 In Progress
5. Migrate frontend components:
   - `AIRealtime.tsx` - Main golf AI chat component
   - `WeatherToolPanel.tsx` - Weather display component
   - `HoleLayoutPanel.tsx` - Hole layout display
   - Supporting components (EventLog, SessionControls, etc.)

### ⏳ Pending
6. Create logger utility (`src/lib/logger.ts`)
7. Create/adapt auth context (`src/context/auth-context.tsx`)
8. Create layout components (`src/components/layout/`)
9. Create control components (`src/components/controls/`)
10. Update API calls to use Express backend (`http://localhost:3001/api/...`)
11. Replace Next.js router with React Router
12. Add PuttSolver integration

## Key Adaptations Needed

### API Routes
- Change from `/api/...` (Next.js API routes) to `http://localhost:3001/api/...` (Express backend)
- Or use proxy configuration in `package.json`

### Router
- Replace `useRouter` from `next/navigation` with `useNavigate` from `react-router-dom`

### Imports
- Update all relative imports to match Create React App structure
- Remove Next.js-specific imports

### Environment Variables
- Use `REACT_APP_*` prefix for Create React App
- Update API URLs to point to Express backend

## Files to Migrate

### Core Components
- `src/components/airealtime/AIRealtime.tsx` (main component, ~1000 lines)
- `src/components/airealtime/WeatherToolPanel.tsx`
- `src/components/airealtime/HoleLayoutPanel.tsx`
- `src/components/airealtime/EventLog.tsx`
- `src/components/airealtime/SessionControls.tsx`

### Supporting Components
- `src/components/controls/ChatInterface.tsx`
- `src/components/controls/ControlButton.tsx`
- `src/components/controls/ResponseBubble.tsx`
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/MainContent.tsx`

### Utilities & Context
- `src/lib/logger.ts`
- `src/context/auth-context.tsx`

## Next Steps
1. Create logger utility
2. Create auth context (or adapt existing)
3. Migrate AIRealtime component (adapt for Create React App)
4. Migrate supporting components
5. Test end-to-end flow
6. Add PuttSolver integration

