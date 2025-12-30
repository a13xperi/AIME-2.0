# Agent Alex Documentation

> Comprehensive documentation for the Agent Alex AI-powered Work Session & Project Tracker.

## 📚 Documentation Overview

| Document | Description |
|----------|-------------|
| [API Documentation](./API_DOCUMENTATION.md) | Complete API reference for all backend services |
| [Component Reference](./COMPONENT_REFERENCE.md) | Detailed React component documentation |
| [Types Reference](./TYPES_REFERENCE.md) | TypeScript types and interfaces |
| [Developer Guide](./DEVELOPER_GUIDE.md) | Practical development guide with examples |
| [Environment Setup](./ENVIRONMENT_SETUP.md) | Environment configuration guide |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
pip install -r backend/requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Notion credentials
```

### 3. Start Development Servers

```bash
npm run dev      # Frontend (port 3000)
npm run server   # Backend (port 3001)
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Dashboard  │  │   Session   │  │   Project   │  ...    │
│  │  Component  │  │   Logger    │  │   Creator   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                           │                                  │
│                    notionApi.ts                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Server (Node.js)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  /projects  │  │  /sessions  │  │  /dashboard │  ...    │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                           │                                  │
│                     Notion SDK                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Notion Database                           │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  Projects Database  │  │  Sessions Database  │          │
│  └─────────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Key Files

### Frontend

| Path | Description |
|------|-------------|
| `src/App.tsx` | Root application component |
| `src/api/notionApi.ts` | API client functions |
| `src/types/index.ts` | TypeScript type definitions |
| `src/utils/logger.ts` | Logging utility |
| `src/components/` | React components |

### Backend

| Path | Description |
|------|-------------|
| `server/index.ts` | Express server entry point |
| `backend/main.py` | FastAPI AIME backend |
| `putt-solver-service/main.py` | PuttSolver microservice |

---

## 🔌 API Endpoints

### Express Server (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project |
| GET | `/api/sessions` | List all sessions |
| POST | `/api/sessions` | Create session |
| GET | `/api/dashboard/stats` | Dashboard statistics |

### AIME Backend (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/health/full` | Full health check |
| GET | `/api/courses` | List courses |
| POST | `/api/solve_putt` | Solve putting path |

### PuttSolver Service (Port 8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/datasets` | List datasets |
| POST | `/solve_putt` | Solve putt (local coords) |

---

## 🧩 Core Components

| Component | Location | Description |
|-----------|----------|-------------|
| `Dashboard` | `src/components/Dashboard/` | Main dashboard view |
| `SessionLogger` | `src/components/SessionLogger/` | Log work sessions |
| `ProjectCreator` | `src/components/ProjectCreator/` | Create new projects |
| `ProjectsList` | `src/components/ProjectsList/` | View all projects |
| `SessionsList` | `src/components/SessionsList/` | View all sessions |
| `ErrorBoundary` | `src/components/ErrorBoundary/` | Error handling |

---

## 📝 Key Types

```typescript
// Project
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Paused' | 'Complete' | 'Archived';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  techStack: string[];
  // ... see Types Reference
}

// Session
interface Session {
  id: string;
  title: string;
  date: string;
  duration: number;
  projectId: string;
  status: SessionStatus;
  summary: string;
  // ... see Types Reference
}

// API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## 🔧 Common Tasks

### Create a Project

```typescript
import { createProject } from './api/notionApi';

const response = await createProject({
  name: 'My Project',
  status: 'Active',
  priority: 'High'
});
```

### Log a Session

```typescript
import { createSession } from './api/notionApi';

const response = await createSession({
  title: 'Implemented feature',
  projectId: 'project-123',
  duration: 120,
  summary: 'Added authentication'
});
```

### Fetch Data

```typescript
import { fetchProjects, fetchSessions } from './api/notionApi';

const projects = await fetchProjects();
const sessions = await fetchSessions({ projectId: 'project-123' });
```

---

## 🐛 Troubleshooting

### Server Not Starting

```bash
# Check if port is in use
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

### API Errors

```bash
# Check server health
curl http://localhost:3001/health

# Check logs
npm run server 2>&1 | tee server.log
```

### Notion Connection Issues

1. Verify `NOTION_TOKEN` is set correctly
2. Check database IDs are valid
3. Ensure Notion integration has access to databases

---

## 📖 Further Reading

- **API Documentation**: Full API reference with request/response examples
- **Component Reference**: All React components with props and usage
- **Types Reference**: Complete TypeScript type definitions
- **Developer Guide**: Step-by-step development workflows

---

## 📄 License

See [LICENSE](../LICENSE) file for details.
