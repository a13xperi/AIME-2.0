# AIME Golf AI Migration Status

## ✅ Completed
1. Created SSOT file (`docs/SSOT_AIME_PUTTSOLVER.md`)
2. Created Python FastAPI backend (`backend/main.py`, `backend/requirements.txt`)
3. Added Express routes for OpenAI API proxying (`server/index.ts`)
   - `/api/realtime` - WebRTC SDP proxy
   - `/api/chat` - Chat completions proxy
   - `/api/weather` - Weather API proxy
4. Enhanced logger utility (`src/utils/logger.ts`, `src/lib/logger.ts`)
5. Copied frontend components from original AIME:
   - `src/components/airealtime/` (AIRealtime, WeatherToolPanel, HoleLayoutPanel, etc.)
   - `src/components/controls/` (ChatInterface, ControlButton, ResponseBubble)
   - `src/components/layout/` (AppLayout, MainContent)

## 🔄 Required Adaptations

### 1. API Endpoints
**Current:** Uses Next.js API routes (`/api/token`, `/api/realtime`, `/api/weather`)
**Needed:** Update to Express backend URLs:
- `/api/token` → `http://localhost:3001/api/token` (need to create this route)
- `/api/realtime` → `http://localhost:3001/api/realtime` ✅ (already added)
- `/api/weather` → `http://localhost:3001/api/weather` ✅ (already added)

**Files to update:**
- `src/components/airealtime/AIRealtime.tsx` (lines ~150, ~669)

### 2. Auth Context
**Current:** Uses `useAuth` from `../../context/auth-context`
**Needed:** Create or adapt auth context for Create React App

**Files to create/update:**
- `src/context/auth-context.tsx`

### 3. UI Components
**Current:** Imports from `../ui/logs-view`, `../ui/profile-page`, etc.
**Status:** These components may not exist in AIME-2.0
**Action:** Either create stub components or remove/comment out these imports

**Files to check/create:**
- `src/components/ui/logs-view.tsx`
- `src/components/ui/profile-page.tsx`
- `src/components/ui/settings-page.tsx`
- `src/components/ui/help-support-page.tsx`
- `src/components/ui/subscription-page.tsx`

### 4. Router
**Current:** May use Next.js `useRouter` from `next/navigation`
**Needed:** Replace with React Router if navigation is used

### 5. Environment Variables
**Current:** May use Next.js env vars
**Needed:** Use `REACT_APP_*` prefix for Create React App
- `REACT_APP_API_URL=http://localhost:3001`
- `REACT_APP_OPENAI_API_KEY=...` (if needed client-side)

## 📋 Next Steps

1. **Create `/api/token` route in Express backend** (for OpenAI ephemeral tokens)
2. **Create auth context** (simple mock auth for now)
3. **Update API calls in AIRealtime.tsx** to use Express backend URL
4. **Create stub UI components** or remove unused imports
5. **Test end-to-end flow**
6. **Add PuttSolver integration** (Phase 0 contracts + service)

## 🚀 Quick Start Commands

```bash
# Terminal 1: Express backend (Notion + OpenAI proxy)
cd AIME-2.0
npm run server:dev

# Terminal 2: Python FastAPI backend (Golf AI)
cd AIME-2.0/backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python main.py

# Terminal 3: Frontend
cd AIME-2.0
npm start
```

## 📝 Notes

- The migration preserves the golf AI functionality while adapting to Create React App
- Express backend handles OpenAI API proxying (avoids CORS issues)
- Python FastAPI backend will handle PuttSolver integration
- Both backends run simultaneously (ports 3001 and 8000)

