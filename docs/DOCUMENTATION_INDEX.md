# Documentation Index

## Welcome to Agent Alex Documentation

This comprehensive documentation covers all public APIs, functions, components, and utilities in the Agent Alex application - an AI-powered work session and project tracker with Notion integration.

---

## 📚 Documentation Guide

### Quick Links

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete REST API reference for both backends
- **[Components Documentation](./COMPONENTS_DOCUMENTATION.md)** - All React components with props and examples
- **[Utilities Documentation](./UTILITIES_DOCUMENTATION.md)** - Utility functions, API client, and type definitions

### Additional Resources

- **[Quick Start Guide](../QUICK_START.md)** - Get up and running quickly
- **[Setup Guide](../SETUP_GUIDE.md)** - Detailed installation and configuration
- **[Architecture](../ARCHITECTURE.md)** - System architecture and design
- **[Troubleshooting](../TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js and Python required
node --version  # v18+
python --version  # 3.8+
```

### Quick Setup

```bash
# Install dependencies
npm install
pip install -r backend/requirements.txt

# Configure environment
cp .env.example .env.development
# Edit .env.development with your Notion credentials

# Start development servers
npm run dev           # Frontend + Express backend
python backend/main.py  # FastAPI backend (separate terminal)
```

### First API Call

```bash
# Test the APIs
curl http://localhost:3001/health
curl http://localhost:8000/api/health
```

---

## 📖 Documentation Structure

### 1. API Documentation (`API_DOCUMENTATION.md`)

Complete reference for all API endpoints:

#### FastAPI Backend (Python)
- **Health Check Endpoints** - Service status and monitoring
- **Courses API** - Golf course data management
- **Putt Solver API** - Golf putt calculation engine

#### Express Backend (TypeScript)
- **Projects API** - Project CRUD operations
- **Sessions API** - Work session tracking
- **Dashboard API** - Statistics and analytics

**Features:**
- Request/response examples
- Parameter validation
- Error codes and handling
- Rate limiting details
- Authentication setup

**Quick Example:**
```bash
# Create a new project
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "status": "Active",
    "priority": "High",
    "description": "A new project"
  }'
```

---

### 2. Components Documentation (`COMPONENTS_DOCUMENTATION.md`)

Complete guide to all React components:

#### Component Categories
- **Core Components** - Dashboard, App, ErrorBoundary
- **Project Management** - ProjectsList, ProjectCreator, ProjectDetail
- **Session Management** - SessionLogger, SessionTimer, SessionCard
- **Analytics & Insights** - AnalyticsDashboard, ProductivityInsights
- **Collaboration & Tools** - TeamCollaboration, CustomerCRM
- **Utilities** - QuickResume, TimeTracker, NotificationSystem

**Each component includes:**
- Props interface with TypeScript definitions
- Usage examples
- Feature descriptions
- State management details
- API integration points

**Quick Example:**
```tsx
import SessionLogger from './components/SessionLogger/SessionLogger';

<SessionLogger
  isOpen={true}
  onClose={() => setShowLogger(false)}
  onSuccess={() => refreshData()}
  projects={projects}
/>
```

---

### 3. Utilities Documentation (`UTILITIES_DOCUMENTATION.md`)

In-depth guide to utility functions and shared code:

#### Covered Topics
- **API Client** - Notion API integration functions
- **Logger Utility** - Centralized logging system
- **Type Definitions** - Comprehensive TypeScript types
- **Environment Configuration** - Setup and variables

**Key Features:**
- Function signatures with TypeScript
- Error handling patterns
- Usage examples
- Best practices
- Testing utilities

**Quick Example:**
```typescript
import { fetchProjects } from './api/notionApi';
import { logger } from './utils/logger';

const response = await fetchProjects({ status: ['Active'] });

if (response.success && response.data) {
  logger.info('Projects loaded', { count: response.data.length });
  setProjects(response.data);
} else {
  logger.error('Failed to load projects:', response.error);
}
```

---

## 🎯 Common Use Cases

### Use Case 1: Creating a Project

**Backend (Express):**
```typescript
// API Endpoint: POST /api/projects
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Project',
    status: 'Active',
    priority: 'High',
    type: 'Web Application'
  })
});
```

**Frontend (React):**
```tsx
import { createProject } from './api/notionApi';

const response = await createProject({
  name: 'New Project',
  status: 'Active',
  priority: 'High',
  type: 'Web Application'
});

if (response.success) {
  console.log('Project created!', response.data);
}
```

---

### Use Case 2: Logging a Work Session

**Backend API:**
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "abc123",
    "title": "Built authentication",
    "duration": 120,
    "sessionType": "Feature Development",
    "aiAgent": "Claude",
    "workspace": "Cursor",
    "summary": "Implemented JWT authentication"
  }'
```

**Frontend Component:**
```tsx
import SessionLogger from './components/SessionLogger/SessionLogger';

<SessionLogger
  isOpen={showLogger}
  onClose={() => setShowLogger(false)}
  onSuccess={() => {
    setShowLogger(false);
    refreshDashboard();
  }}
  projects={projects}
/>
```

---

### Use Case 3: Fetching Dashboard Statistics

**API Client:**
```typescript
import { fetchDashboardStats } from './api/notionApi';

const response = await fetchDashboardStats();

if (response.success && response.data) {
  const { 
    totalProjects, 
    activeProjects, 
    totalSessions, 
    totalHours 
  } = response.data;
  
  console.log(`${totalProjects} projects, ${totalHours} hours logged`);
}
```

**Component:**
```tsx
import Dashboard from './components/Dashboard/Dashboard';

// Dashboard component automatically fetches and displays stats
<Dashboard />
```

---

### Use Case 4: Solving a Golf Putt

**API Call:**
```typescript
const response = await fetch('/api/solve_putt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    course_id: 'riverside_country_club',
    hole_id: 1,
    ball_wgs84: { lat: 37.774929, lon: -122.419416 },
    cup_wgs84: { lat: 37.77485, lon: -122.4193 },
    stimp: 10.5
  })
});

const data = await response.json();
console.log(data.instruction_text); // "Aim 2.5 degrees left of cup, hit at 8.2 mph"
```

**Component:**
```tsx
import PuttSolverDemo from './components/PuttSolverDemo/PuttSolverDemo';

<Route path="/demo/putt-solver" element={<PuttSolverDemo />} />
```

---

## 🔑 Key Concepts

### 1. Type Safety

All APIs and components use TypeScript for type safety:

```typescript
import { Project, Session, ApiResponse } from './types';

// Function with typed parameters and return
async function loadProject(id: string): Promise<ApiResponse<Project>> {
  return await fetchProject(id);
}
```

### 2. Error Handling

Consistent error handling pattern across the application:

```typescript
const response = await fetchProjects();

if (response.success && response.data) {
  // Success - use response.data
  setProjects(response.data);
} else {
  // Error - handle response.error
  logger.error('Failed:', response.error);
  setError(response.error || 'Unknown error');
}
```

### 3. Notion Integration

Backend syncs with Notion databases:

```
Express Backend → Notion API → Notion Databases
                    ↓
Frontend ← API Client ← Express Backend
```

### 4. Component Patterns

Common patterns used throughout:

- **Modal Pattern** - `isOpen`, `onClose`, `onSuccess` props
- **Loading States** - Loading/error/success states
- **Data Fetching** - Centralized API client
- **Type Safety** - TypeScript interfaces for all data

---

## 📊 API Overview

### FastAPI Backend

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Basic health check |
| `/api/health/full` | GET | Comprehensive health check |
| `/api/courses` | GET | List all golf courses |
| `/api/solve_putt` | POST | Calculate optimal putt path |

### Express Backend

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/projects` | GET | List all projects |
| `/api/projects/:id` | GET | Get single project |
| `/api/projects` | POST | Create new project |
| `/api/projects/:id` | PATCH | Update project |
| `/api/sessions` | GET | List all sessions |
| `/api/sessions/:id` | GET | Get single session |
| `/api/sessions` | POST | Create new session |
| `/api/sessions/:id` | PATCH | Update session |
| `/api/dashboard/stats` | GET | Get dashboard statistics |
| `/api/dashboard/categories` | GET | Get project categories |

---

## 🧩 Component Overview

### Core Components (3)
- Dashboard, App, ErrorBoundary

### Project Management (9)
- ProjectsList, ProjectDetail, ProjectCreator, ProjectTemplates, ProjectBacklog, ProjectHealth, ProjectMilestones, ProjectDependencies, ProjectHandoff

### Session Management (10)
- SessionsList, SessionDetail, SessionLogger, SessionCard, SessionTimer, SessionStatusBadge, SessionStatusFilter, SessionStatusManager, SessionDuplicator, SessionTemplates

### Analytics & Insights (4)
- AnalyticsDashboard, ProductivityInsights, SmartRecommendations, DailySummary

### Collaboration & Tools (5)
- TeamCollaboration, CustomerCRM, IntegrationManagement, WorkflowAutomation, TemplateBuilder

### Utilities (8)
- QuickResume, TimeTracker, IntervalTracker, BreakReminder, NotificationSystem, OfflineMode, DataExport, ReportGenerator

### Demos (1)
- PuttSolverDemo

**Total: 40+ React Components**

---

## 🛠️ Development Workflow

### 1. Start Development Servers

```bash
# Terminal 1 - Frontend + Express backend
npm run dev

# Terminal 2 - FastAPI backend
cd backend
uvicorn main:app --reload
```

### 2. Make Changes

```bash
# Edit files
vim src/components/MyComponent/MyComponent.tsx

# Hot reload automatically applies changes
```

### 3. Test Your Changes

```bash
# Run tests
npm test

# Test specific component
npm test -- SessionLogger

# Run linter
npm run lint
```

### 4. Document Your Changes

Update appropriate documentation:
- API changes → `API_DOCUMENTATION.md`
- Component changes → `COMPONENTS_DOCUMENTATION.md`
- Utility changes → `UTILITIES_DOCUMENTATION.md`

---

## 🔒 Security & Best Practices

### Environment Variables

Never commit secrets to git:

```bash
# .env.development (not committed)
NOTION_TOKEN=secret_xyz123...
NOTION_PROJECTS_DATABASE_ID=abc123...
NOTION_SESSIONS_DATABASE_ID=def456...
```

### CORS Configuration

Configure allowed origins:

```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Rate Limiting

API is rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP
- Returns 429 status when exceeded

### Input Validation

All API endpoints validate input:
- Type checking with Pydantic (FastAPI)
- Request validation (Express)
- Client-side validation (React forms)

---

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import SessionCard from './SessionCard';

test('displays session title', () => {
  const session = {
    id: '1',
    title: 'Test Session',
    // ... other required fields
  };
  
  render(<SessionCard session={session} />);
  expect(screen.getByText('Test Session')).toBeInTheDocument();
});
```

---

## 📝 Contributing

### Adding New Features

1. **Plan** - Review architecture and existing patterns
2. **Implement** - Follow TypeScript and React best practices
3. **Test** - Write tests for new functionality
4. **Document** - Update relevant documentation files
5. **Review** - Submit PR with clear description

### Documentation Updates

When adding or modifying features:

1. **API Changes** - Update `API_DOCUMENTATION.md`
2. **Component Changes** - Update `COMPONENTS_DOCUMENTATION.md`
3. **Utility Changes** - Update `UTILITIES_DOCUMENTATION.md`
4. **Type Changes** - Document in `UTILITIES_DOCUMENTATION.md`

### Code Style

Follow existing patterns:
- Use TypeScript for type safety
- Use functional React components
- Use hooks for state management
- Use CSS modules for styling
- Use centralized logger for logging
- Use API client for data fetching

---

## 🐛 Troubleshooting

### Common Issues

**1. Notion API Not Working**
```bash
# Check environment variables
echo $NOTION_TOKEN
echo $NOTION_PROJECTS_DATABASE_ID

# Verify Notion integration has access
# See SETUP_GUIDE.md for details
```

**2. CORS Errors**
```bash
# Add your frontend URL to ALLOWED_ORIGINS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**3. Port Already in Use**
```bash
# Change port in .env
PORT=3002
```

**4. Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

See [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) for more solutions.

---

## 📚 Additional Resources

### Internal Documentation
- [Architecture Overview](../ARCHITECTURE.md)
- [Setup Guide](../SETUP_GUIDE.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [GitHub Workflow](../WORKFLOW.md)

### External Resources
- [Notion API Documentation](https://developers.notion.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## 🤝 Support

### Getting Help

1. **Check Documentation** - Review this index and linked docs
2. **Search Issues** - Check GitHub issues for similar problems
3. **Ask Questions** - Create a new GitHub issue
4. **Contact Team** - Reach out to the development team

### Reporting Issues

When reporting issues, include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Error messages and logs

---

## 📄 License

See LICENSE file for details.

---

## 🎉 Quick Reference Card

### Most Common Operations

```bash
# Start development
npm run dev

# Create project (API)
POST /api/projects

# Log session (API)
POST /api/sessions

# Get dashboard stats
GET /api/dashboard/stats

# Solve putt
POST /api/solve_putt
```

### Most Used Components

```tsx
import Dashboard from './components/Dashboard/Dashboard';
import SessionLogger from './components/SessionLogger/SessionLogger';
import ProjectCreator from './components/ProjectCreator/ProjectCreator';
import PuttSolverDemo from './components/PuttSolverDemo/PuttSolverDemo';
```

### Most Used Utilities

```typescript
import { fetchProjects, createProject, fetchSessions } from './api/notionApi';
import { logger } from './utils/logger';
import { Project, Session, ApiResponse } from './types';
```

---

**Last Updated:** December 2024  
**Version:** 0.1.0  
**Documentation Complete:** Yes ✅

---

Happy coding! 🚀
