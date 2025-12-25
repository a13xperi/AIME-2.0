# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Agent Alex** is a full-stack AI work session and project tracker that integrates with Notion. It helps track multiple projects, log AI coding sessions with context, and resume work exactly where you left off.

**Tech Stack:**
- Frontend: React 19+ with TypeScript (Create React App)
- Backend: Express + Node.js + TypeScript
- Database: Notion API
- Deployment: Vercel (static frontend + serverless functions)

---

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
# Then edit .env with your Notion API credentials

# Validate environment variables
node scripts/validate-env.js
```

### Running the Application
```bash
# Development (runs both frontend and backend)
npm run dev

# Frontend only (port 3000)
npm start

# Backend only (port 3001)
npm run server

# Backend with auto-reload
npm run server:dev
```

### Testing
```bash
# Run all tests
npm test

# Run tests without watch mode (for CI)
npm test -- --watchAll=false
```

### Building
```bash
# Production build
npm run build

# Vercel build (used by CI/CD)
npm run vercel-build
```

### Workflow Scripts
```bash
# Start a new feature branch
./scripts/start-feature.sh <feature-name>

# Deploy to Vercel
./scripts/deploy-vercel.sh

# Create a pull request
./scripts/create-pr.sh
```

---

## Architecture Overview

### Data Flow
1. **Frontend (React)** → Makes API requests to Express backend
2. **Backend (Express)** → Queries/updates Notion databases via @notionhq/client
3. **Notion** → Stores Projects and Sessions databases

### Key Architectural Patterns

**Backend (server/index.ts):**
- Express server with rate limiting (100 req/15min per IP)
- CORS configured for localhost and production origins
- Validates required env vars on startup
- Implements pagination for large Notion queries (fetches ALL projects/sessions)
- Centralized error logging via custom logger

**Frontend (src/):**
- Component-based architecture with route-based code splitting
- React Router for navigation
- ErrorBoundary for graceful error handling
- Centralized type definitions in `src/types/index.ts`

**Component Structure:**
```
src/components/
├── Dashboard/              # Main dashboard view with project cards
├── ProjectDetail/          # Single project view with context
├── ProjectsList/           # All projects list view
├── SessionLogger/          # Form to log new work sessions
├── SessionsList/           # All sessions list view
├── QuickResume/            # Modal for resuming project context
├── TimeTracker/            # Time tracking utilities
├── AnalyticsDashboard/     # Analytics and insights
├── ErrorBoundary/          # Error boundary wrapper
└── Common/                 # Shared/reusable components
```

### Notion Database Schema

**Projects Database** (required properties):
- Name (Title), Description (Rich Text), Status (Select)
- Priority (Select), Tech Stack (Multi-select)
- Current Context (Rich Text), Next Steps (Rich Text), Blockers (Rich Text)
- Repository (URL), Local Path (Text)
- Started (Date), Last Updated (Date)
- Backlog Items (Number), Tags (Multi-select)

**Sessions Database** (required properties):
- Title (Title), Date (Date), Duration (Number)
- Project (Relation to Projects), Summary (Rich Text)
- Files Modified (Rich Text), Next Steps (Rich Text)
- AI Agent (Text), Status (Select), Type (Select)
- Workspace (Select), Tags (Multi-select)

---

## Important Development Notes

### Environment Variables
- Backend requires: `NOTION_TOKEN`, `NOTION_PROJECTS_DATABASE_ID`, `NOTION_SESSIONS_DATABASE_ID`
- Frontend requires: `REACT_APP_API_URL`
- Run `node scripts/validate-env.js` to verify all required vars are set
- NEVER commit `.env` file with real tokens

### Security Considerations
- Server implements CORS restrictions (configure via `ALLOWED_ORIGINS`)
- Rate limiting on all `/api/*` endpoints
- All Notion API calls are proxied through backend (credentials never exposed to frontend)
- Input validation happens on backend before Notion API calls

### Testing Strategy
- Unit tests for utilities (`src/utils/__tests__/`)
- Component tests using React Testing Library
- ErrorBoundary has test coverage
- Run tests before committing: `npm test -- --watchAll=false`

### Pagination Implementation
The backend fetches ALL results from Notion databases using pagination loops:
```typescript
while (hasMore) {
  const response = await notion.databases.query({
    database_id: DB_ID,
    start_cursor: startCursor
  });
  allResults = allResults.concat(response.results);
  hasMore = response.has_more;
  startCursor = response.next_cursor;
}
```
This ensures no projects/sessions are missed even with 100+ entries.

### Logging
- Custom logger utility in `src/utils/logger.ts`
- Structured logging: `logger.info()`, `logger.error()`, `logger.warn()`
- Logs include timestamps and context
- Backend logs all Notion API calls and errors

---

## Git Workflow

### Commit Message Convention
Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test updates
- `refactor:` - Code refactoring
- `style:` - Formatting changes
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### Development Workflow
1. Pull latest: `git pull origin main`
2. Create feature branch: `./scripts/start-feature.sh feature-name` (or `git checkout -b feature/name`)
3. Develop and commit frequently
4. Test: `npm test -- --watchAll=false`
5. Push: `git push`
6. Create PR via `./scripts/create-pr.sh` or GitHub UI

---

## Deployment

### Vercel Configuration
- Frontend builds to `build/` directory (static site)
- Backend deploys as serverless functions from `server/index.ts`
- Automatic deployments on push to main branch
- Environment variables must be set in Vercel dashboard

### Pre-Deployment Checklist
1. All tests passing: `npm test -- --watchAll=false`
2. Build succeeds: `npm run build`
3. Environment variables configured in Vercel
4. Notion databases shared with integration
5. CORS origins include Vercel domain

### Deployment Process
```bash
# Automated deployment (if GitHub connected)
git push origin main

# Manual deployment via script
./scripts/deploy-vercel.sh
```

---

## Common Tasks

### Adding a New Component
1. Create component directory in `src/components/ComponentName/`
2. Add `ComponentName.tsx`, `ComponentName.css`
3. Export from component file
4. Add route in `src/App.tsx` if needed
5. Update types in `src/types/index.ts` if new data structures needed

### Adding a New API Endpoint
1. Add route handler in `server/index.ts`
2. Implement Notion API logic
3. Add error handling with logger
4. Update TypeScript types in `src/types/index.ts`
5. Test endpoint manually before committing

### Debugging Notion API Issues
1. Check `NOTION_TOKEN` is valid and not expired
2. Verify databases are shared with integration (in Notion)
3. Check database IDs match env vars
4. Look at server logs for detailed error messages
5. Test API endpoint directly with curl/Postman
6. Verify Notion API property names match exactly (case-sensitive)

### Running a Single Test
```bash
# Run specific test file
npm test -- SessionLogger.test

# Run tests matching pattern
npm test -- --testNamePattern="ErrorBoundary"
```

---

## Project Context

### Current Status (as of Oct 2025)
- ✅ Core MVP complete (dashboard, project tracking, session logging)
- ✅ Security hardening (CORS, rate limiting, error boundaries)
- ✅ Git version control and GitHub Actions CI/CD
- ✅ Vercel deployment configured
- ⚠️ GitHub remote repository may need setup
- 🔄 Test coverage at ~30% (goal: 60%+)

### Known Technical Debt
1. Create React App (should migrate to Vite for better performance)
2. No linting/formatting (should add ESLint + Prettier)
3. No pre-commit hooks (should add Husky)
4. Limited test coverage (need more component tests)
5. Some Notion API calls could be cached for performance

### Future Enhancement Areas
- Migration to Vite for faster builds
- Add ESLint + Prettier + Husky
- Increase test coverage to 60%+
- Add e2e tests (Playwright/Cypress)
- Implement real-time updates (WebSockets)
- Add search/filter functionality to dashboard
- Dark mode support
