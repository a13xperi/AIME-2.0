# 🏗️ Agent Alex - Architecture Document

**Date:** October 17, 2025  
**Version:** 1.0 - Initial Design

---

## 🎯 Overview

Agent Alex is a full-stack web application for tracking AI work sessions and managing multiple projects with the ability to resume work with full context.

---

## 🎨 System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Web Browser   │
│  (React/TS UI)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Express API    │
│   (Node.js)     │
└────────┬────────┘
         │ Notion API
         ▼
┌─────────────────┐
│  Notion         │
│  (Database)     │
└─────────────────┘
```

### Component Architecture

```
Frontend (React + TypeScript)
├── Dashboard
│   ├── ProjectCard
│   ├── SessionCard
│   └── QuickActions
├── ProjectView
│   ├── ProjectDetails
│   ├── SessionHistory
│   ├── ContextPanel
│   └── ResumeButton
├── SessionLogger
│   ├── SessionForm
│   ├── FileTracker
│   └── TimeTracker
└── Common
    ├── Navigation
    ├── Search
    └── Filters

Backend (Express)
├── Routes
│   ├── /api/projects
│   ├── /api/sessions
│   └── /api/context
├── Controllers
│   ├── ProjectController
│   ├── SessionController
│   └── ContextController
└── Services
    ├── NotionService
    ├── ContextService
    └── SearchService
```

---

## 🗄️ Data Model

### Notion Database Schemas

#### Projects Database

**Properties:**
- **Name** (Title) - Project name
- **Description** (Rich Text) - Project description
- **Status** (Select) - Active, Paused, Complete, Archived
- **Priority** (Select) - Critical, High, Medium, Low
- **Workspace** (Select) - KAA, Personal, Client Work, etc.
- **Type** (Select) - Web App, Mobile App, API, Infrastructure, etc.
- **Started** (Date) - When project started
- **Last Updated** (Date) - Last activity date
- **Current Context** (Rich Text) - Where you left off
- **Repository** (URL) - GitHub/Git repo link
- **Local Path** (Text) - Local file system path
- **Deployment URL** (URL) - Live application URL
- **Related Sessions** (Relation) - Links to session entries
- **Backlog Items** (Number) - Count of backlog items
- **Status Notes** (Rich Text) - Current status details
- **Next Steps** (Rich Text) - What to do next
- **Blockers** (Rich Text) - Current issues/blockers
- **Tech Stack** (Multi-select) - React, TypeScript, Node.js, etc.
- **Tags** (Multi-select) - Custom tags

#### Sessions Database

**Properties:**
- **Title** (Title) - Session name
- **Date** (Date) - Session date/time
- **Duration** (Number) - Minutes spent
- **Project** (Relation) - Link to project
- **Status** (Select) - In Progress, Completed, Paused
- **Summary** (Rich Text) - What was accomplished
- **Files Modified** (Rich Text) - List of changed files
- **Next Steps** (Rich Text) - What's next
- **Blockers** (Rich Text) - Issues encountered
- **AI Agent** (Text) - Which AI assistant used
- **Workspace** (Select) - Which Notion workspace
- **Type** (Select) - Feature, Bug Fix, Refactor, Documentation, etc.
- **Tags** (Multi-select) - Custom session tags

---

## 🔄 Key User Flows

### 1. View All Projects

```
User → Dashboard → API: GET /api/projects → Notion → Return Projects → Display Cards
```

### 2. Log New Session

```
User → Session Logger → Fill Form → API: POST /api/sessions → Notion → Update Project → Confirm → Dashboard
```

### 3. Resume Project

```
User → Click Project → ProjectView → Load Context → Display:
  - Current Context
  - Last Session
  - Next Steps
  - Blockers
  - Files/Repo Info
→ User has everything to resume work
```

### 4. Search Projects

```
User → Search Bar → API: GET /api/projects?search=query → Notion Search → Return Results → Display Filtered
```

---

## 🎨 UI/UX Design Principles

### Design System

**Colors:**
- Primary: Blue (#2563eb)
- Success: Green (#16a34a)
- Warning: Orange (#ea580c)
- Danger: Red (#dc2626)
- Dark Mode: Support from day 1

**Typography:**
- Headings: Inter (sans-serif)
- Body: System font stack

**Components:**
- Material Design inspired
- Clean, minimal interface
- Mobile-first responsive

### Key Screens

1. **Dashboard**
   - Grid of project cards
   - Filter by status, workspace, type
   - Search bar
   - "New Project" and "Log Session" buttons

2. **Project Detail**
   - Project header (name, status, dates)
   - Context panel (where you left off)
   - Session history
   - Quick actions (Resume, Edit, Archive)
   - Files and links

3. **Session Logger**
   - Form to log new session
   - Auto-link to project
   - File change tracker
   - Time duration
   - Summary notes

---

## 🔐 Security & Authentication

### Phase 1 (MVP)
- No user authentication
- Single-user application
- Notion API key in environment variables
- Backend validates all requests

### Phase 2 (Future)
- User authentication (Auth0 or similar)
- Multi-user support
- OAuth for Notion
- Role-based access control

---

## 🚀 Deployment Strategy

### Development
- Frontend: `localhost:3000` (React dev server)
- Backend: `localhost:3001` (Express)
- Database: Notion API

### Production
- Frontend: Vercel (static hosting)
- Backend: Vercel Serverless Functions
- Database: Notion API
- CI/CD: GitHub Actions

### Environment Configuration

**Development:**
```env
REACT_APP_API_URL=http://localhost:3001
NOTION_API_KEY=secret_xxx
```

**Production:**
```env
REACT_APP_API_URL=https://agent-alex-api.vercel.app
NOTION_API_KEY=secret_xxx (from Vercel env vars)
```

---

## 📊 Performance Considerations

### Frontend Optimization
- Code splitting by route
- Lazy loading components
- React.memo for expensive components
- useMemo/useCallback for performance
- Image optimization
- Service worker for PWA

### Backend Optimization
- Caching Notion API responses (5-minute TTL)
- Request batching
- Pagination for large datasets
- Compression (gzip)

### Notion API Limits
- Rate limit: 3 requests per second
- Implement request queuing
- Cache frequently accessed data

---

## 🧪 Testing Strategy

### Unit Tests
- Jest + React Testing Library
- Test utilities and helpers
- Component testing
- API client testing

### Integration Tests
- Test API endpoints
- Test Notion integration
- Test data flow

### E2E Tests (Future)
- Playwright or Cypress
- Critical user flows
- Cross-browser testing

---

## 📈 Scalability

### Current Scale (MVP)
- Single user
- ~10-50 projects
- ~100-500 sessions
- Good enough for personal use

### Future Scale
- Multi-user support
- ~1000+ projects per user
- ~10,000+ sessions per user
- Need database migration (PostgreSQL?)

---

## 🔄 Integration Points

### Notion Integration
- Read projects and sessions
- Write new sessions
- Update project context
- Search across workspace

### Git Integration (Future)
- Auto-detect file changes
- Commit message integration
- Branch tracking

### Calendar Integration (Future)
- Sync sessions to calendar
- Time tracking
- Work schedule optimization

---

## 🎯 Success Metrics

### MVP Success Criteria
- ✅ Can view all projects
- ✅ Can log new sessions
- ✅ Can resume project with full context
- ✅ Mobile responsive
- ✅ < 2 second page load

### Phase 2 Goals
- Track 10+ concurrent projects
- Log 5+ sessions per week
- Resume project in < 30 seconds
- 99% uptime

---

## 🗺️ Technology Choices

### Why React?
- Component reusability
- Rich ecosystem
- TypeScript support
- Fast development

### Why Notion as Database?
- Already using Notion
- Rich API
- No database setup needed
- Great for MVP

### Why Vercel?
- Free tier
- Automatic deployments
- Serverless functions
- Great DX

### Future Considerations
- If scale becomes issue, migrate to PostgreSQL
- If Notion API limits hit, add caching layer
- If need real-time, add WebSockets

---

## 📋 Development Phases

### Phase 1: MVP (Weeks 1-2)
- Basic UI
- Project dashboard
- Session logging
- Notion integration
- Core functionality

### Phase 2: Enhancement (Weeks 3-4)
- Search and filters
- Mobile optimization
- Dark mode
- Testing
- Polish

### Phase 3: Intelligence (Future)
- Smart recommendations
- Context summarization
- Pattern analysis
- Automation

---

## 🔗 Related Documents

- README.md - Getting started guide
- CONTRIBUTING.md - Contribution guidelines (to be created)
- API.md - API documentation (to be created)

---

**Architecture Version:** 1.0  
**Last Updated:** October 17, 2025  
**Status:** Initial Design - Ready for Implementation

