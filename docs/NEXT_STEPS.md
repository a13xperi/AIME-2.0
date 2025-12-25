# Next Steps - AIME Golf AI Migration

## ✅ Completed Migration Tasks

1. ✅ Created SSOT file (`docs/SSOT_AIME_PUTTSOLVER.md`)
2. ✅ Created Python FastAPI backend structure (`backend/main.py`, `backend/requirements.txt`)
3. ✅ Added Express routes for OpenAI API proxying:
   - `/api/token` - Ephemeral token endpoint
   - `/api/realtime` - WebRTC SDP proxy
   - `/api/chat` - Chat completions proxy
   - `/api/weather` - Weather API proxy
4. ✅ Enhanced logger utility with `createLogger` method
5. ✅ Copied frontend components from original AIME
6. ✅ Created auth context (`src/context/auth-context.tsx`)
7. ✅ Updated API calls in AIRealtime.tsx to use Express backend
8. ✅ Added missing dependencies to package.json (js-cookie, lucide-react, webrtc-adapter)

## 🔄 Remaining Tasks

### 1. Create Stub UI Components (or remove imports)
The following UI components are imported but may not exist:
- `src/components/ui/logs-view.tsx`
- `src/components/ui/profile-page.tsx`
- `src/components/ui/settings-page.tsx`
- `src/components/ui/help-support-page.tsx`
- `src/components/ui/subscription-page.tsx`

**Action:** Either create stub components or comment out these imports in AIRealtime.tsx

### 2. Install Dependencies
```bash
cd AIME-2.0
npm install
```

### 3. Set Up Environment Variables
Create `.env` file in root:
```env
# Express Backend
PORT=3001
NOTION_TOKEN=your_notion_token
NOTION_PROJECTS_DATABASE_ID=your_projects_db_id
NOTION_SESSIONS_DATABASE_ID=your_sessions_db_id
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o
OPEN_WEATHER_API_KEY=your_weather_key

# Python FastAPI Backend (create backend/.env)
FRONTEND_URL=http://localhost:3000
DEBUG=True
HOST=0.0.0.0
PORT=8000
PUTTSOLVER_SERVICE_URL=http://localhost:8081
AIME_TRANSFORM_MODE=mock
```

Create `.env.local` for frontend:
```env
REACT_APP_API_URL=http://localhost:3001
```

### 4. Test the Migration
1. Start Express backend: `npm run server:dev`
2. Start Python backend: `cd backend && python main.py`
3. Start frontend: `npm start`
4. Navigate to the AIRealtime component and test:
   - WebRTC connection
   - Weather tool
   - Hole layout tool

### 5. Add PuttSolver Integration (Phase 0)
Once migration is tested, proceed with PuttSolver integration:
1. Create contracts directory structure
2. Create course_data registry
3. Create PuttSolver service
4. Create backend router for solve_putt
5. Integrate solve_putt tool into AIRealtime.tsx

## 🐛 Known Issues to Fix

1. **UI Component Imports:** Some UI components may not exist - need to create stubs or remove imports
2. **Asset Paths:** Hole layout images may need path adjustments (`/assets/courses/...`)
3. **CORS:** Ensure Express backend CORS allows frontend origin
4. **Auth:** Current auth is mock - may need real auth integration later

## 📝 Notes

- The migration preserves all golf AI functionality
- Express backend handles OpenAI API proxying (avoids CORS and API key exposure)
- Python FastAPI backend ready for PuttSolver integration
- Both backends run simultaneously (ports 3001 and 8000)

