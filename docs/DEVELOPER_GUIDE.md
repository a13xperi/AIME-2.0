# Agent Alex - Developer Guide

> Practical guide for developing with Agent Alex, including common workflows, code examples, and best practices.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Common Workflows](#common-workflows)
- [API Integration](#api-integration)
- [Component Development](#component-development)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd agent-alex

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r backend/requirements.txt
pip install -r putt-solver-service/requirements.txt
```

### Environment Setup

Create `.env` files from examples:

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001

# Server (.env)
NOTION_TOKEN=your_notion_token
NOTION_PROJECTS_DATABASE_ID=your_projects_db_id
NOTION_SESSIONS_DATABASE_ID=your_sessions_db_id
PORT=3001
```

### Running the Application

```bash
# Start all services (recommended for development)
npm run dev        # Frontend (Vite) - port 3000
npm run server     # Express server - port 3001

# Python services (separate terminals)
cd backend && uvicorn main:app --reload --port 8000
cd putt-solver-service && uvicorn main:app --reload --port 8081
```

---

## Project Structure

```
agent-alex/
├── src/                    # React frontend
│   ├── api/               # API client functions
│   ├── components/        # React components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                 # Express backend
├── backend/               # FastAPI backend (AIME)
├── putt-solver-service/   # PuttSolver microservice
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

---

## Common Workflows

### 1. Creating a New Project

**Frontend Component Usage:**

```tsx
import { useState } from 'react';
import ProjectCreator from './components/ProjectCreator/ProjectCreator';

function MyComponent() {
  const [showCreator, setShowCreator] = useState(false);

  const handleProjectCreated = () => {
    setShowCreator(false);
    // Refresh project list
    loadProjects();
  };

  return (
    <>
      <button onClick={() => setShowCreator(true)}>
        Create Project
      </button>
      <ProjectCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onSuccess={handleProjectCreated}
      />
    </>
  );
}
```

**API Usage:**

```typescript
import { createProject } from '../api/notionApi';

async function createNewProject() {
  const response = await createProject({
    name: 'My New Project',
    description: 'A great project',
    status: 'Active',
    priority: 'High',
    type: 'Web Application',
    techStack: ['React', 'TypeScript', 'Node.js']
  });

  if (response.success) {
    console.log('Created project:', response.data);
  } else {
    console.error('Failed:', response.error);
  }
}
```

---

### 2. Logging a Work Session

**Frontend Component Usage:**

```tsx
import SessionLogger from './components/SessionLogger/SessionLogger';

function SessionManager({ projects }) {
  const [showLogger, setShowLogger] = useState(false);

  return (
    <>
      <button onClick={() => setShowLogger(true)}>
        Log Session
      </button>
      <SessionLogger
        isOpen={showLogger}
        onClose={() => setShowLogger(false)}
        onSuccess={() => {
          setShowLogger(false);
          refreshSessions();
        }}
        projects={projects}
        preselectedProjectId="project-123"  // Optional
      />
    </>
  );
}
```

**Direct API Usage:**

```typescript
import { createSession } from '../api/notionApi';

async function logSession() {
  const response = await createSession({
    title: 'Implemented user authentication',
    projectId: 'project-123',
    duration: 120,  // minutes
    summary: 'Added OAuth2 login with Google provider',
    filesModified: 'auth.ts, Login.tsx, api.ts',
    nextSteps: 'Add more OAuth providers',
    aiAgent: 'Claude',
    workspace: 'Cursor',
    type: 'Feature Development'
  });

  if (response.success) {
    console.log('Session logged:', response.data);
  }
}
```

---

### 3. Fetching and Displaying Projects

```tsx
import { useEffect, useState } from 'react';
import { fetchProjects } from '../api/notionApi';
import { Project } from '../types';

function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const response = await fetchProjects();
    
    if (response.success && response.data) {
      setProjects(response.data);
    } else {
      setError(response.error || 'Failed to load projects');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <span className={`status-${project.status.toLowerCase()}`}>
            {project.status}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

### 4. Filtering Data

**With Filters:**

```typescript
import { fetchProjects, fetchSessions } from '../api/notionApi';
import { ProjectFilters, SessionFilters } from '../types';

// Filter projects
async function getActiveHighPriorityProjects() {
  const filters: ProjectFilters = {
    status: ['Active'],
    priority: ['High', 'Critical'],
  };
  
  const response = await fetchProjects(filters);
  return response.success ? response.data : [];
}

// Filter sessions
async function getSessionsForProject(projectId: string) {
  const filters: SessionFilters = {
    projectId,
    status: ['Completed', 'In Progress'],
  };
  
  const response = await fetchSessions(filters);
  return response.success ? response.data : [];
}
```

**Local Filtering:**

```typescript
function filterProjects(
  projects: Project[],
  status: string,
  search: string
): Project[] {
  return projects.filter(project => {
    const matchesStatus = status === 'all' || 
      project.status.toLowerCase().includes(status.toLowerCase());
    
    const matchesSearch = !search || 
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
}
```

---

### 5. Using the Timer Component

```tsx
import { useState } from 'react';
import SessionTimer from './components/SessionTimer/SessionTimer';
import { Session } from '../types';

function SessionWithTimer({ session }: { session: Session }) {
  const [showTimer, setShowTimer] = useState(false);
  const [currentSession, setCurrentSession] = useState(session);

  const handleTimeUpdate = (
    sessionId: string,
    updates: Partial<Session>
  ) => {
    setCurrentSession(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <div>
      <h3>{currentSession.title}</h3>
      <p>Duration: {currentSession.duration} minutes</p>
      
      <button onClick={() => setShowTimer(true)}>
        Start Timer
      </button>
      
      {showTimer && (
        <SessionTimer
          session={currentSession}
          onSessionUpdate={handleTimeUpdate}
          onClose={() => setShowTimer(false)}
        />
      )}
    </div>
  );
}
```

---

### 6. Quick Resume Workflow

```tsx
import { useState } from 'react';
import QuickResume from './components/QuickResume/QuickResume';
import { Project, Session } from '../types';

function ProjectCard({ project }: { project: Project }) {
  const [showResume, setShowResume] = useState(false);
  const [lastSession, setLastSession] = useState<Session | null>(null);

  const handleResumeClick = async () => {
    // Fetch last session for this project
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(
      `${API_URL}/api/sessions?projectId=${encodeURIComponent(project.name)}`
    );
    const data = await response.json();
    
    if (data.success && data.sessions?.length > 0) {
      setLastSession(data.sessions[0]);
    }
    setShowResume(true);
  };

  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <button onClick={handleResumeClick}>
        🚀 Resume Work
      </button>
      
      {showResume && (
        <QuickResume
          project={project}
          lastSession={lastSession || undefined}
          onClose={() => setShowResume(false)}
        />
      )}
    </div>
  );
}
```

---

### 7. Dashboard Statistics

```tsx
import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../api/notionApi';
import { DashboardStats } from '../types';

function StatisticsDisplay() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const response = await fetchDashboardStats();
    if (response.success) {
      setStats(response.data);
    }
  };

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{stats.totalProjects}</div>
        <div className="stat-label">Total Projects</div>
        <div className="stat-detail">{stats.activeProjects} active</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{stats.totalSessions}</div>
        <div className="stat-label">Sessions</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{stats.totalHours}h</div>
        <div className="stat-label">Time Logged</div>
      </div>
    </div>
  );
}
```

---

## API Integration

### Making API Calls

```typescript
// Using the notionApi client (recommended)
import { fetchProjects, createProject } from '../api/notionApi';

// Direct fetch (when needed)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function customApiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
```

### Error Handling Pattern

```typescript
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

async function safeApiCall<T>(
  apiFunction: () => Promise<ApiResponse<T>>
): Promise<T | null> {
  try {
    const response = await apiFunction();
    
    if (response.success && response.data) {
      return response.data;
    } else {
      logger.warn('API call failed:', response.error);
      return null;
    }
  } catch (error) {
    logger.error('API call threw error:', error);
    return null;
  }
}

// Usage
const projects = await safeApiCall(() => fetchProjects());
```

---

## Component Development

### Creating a New Component

1. Create component directory:

```bash
mkdir -p src/components/MyComponent
```

2. Create component file (`MyComponent.tsx`):

```tsx
import React from 'react';
import './MyComponent.css';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
  children
}) => {
  return (
    <div className="my-component">
      <h2 className="my-component-title">{title}</h2>
      <div className="my-component-content">
        {children}
      </div>
      {onAction && (
        <button 
          className="my-component-action"
          onClick={onAction}
        >
          Action
        </button>
      )}
    </div>
  );
};

export default MyComponent;
```

3. Create styles (`MyComponent.css`):

```css
.my-component {
  padding: 1rem;
  border-radius: 8px;
  background: var(--card-bg);
}

.my-component-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.my-component-content {
  margin-bottom: 1rem;
}

.my-component-action {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.my-component-action:hover {
  opacity: 0.9;
}
```

---

### Modal Component Pattern

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

---

## State Management

### Local State Pattern

```tsx
function ProjectManager() {
  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProjects();
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setError(response.error || 'Failed to load');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Derived state
  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter(p => p.status === filter);
  }, [projects, filter]);

  return (
    <div>
      <FilterBar value={filter} onChange={setFilter} />
      {loading && <Loading />}
      {error && <Error message={error} onRetry={loadData} />}
      {!loading && !error && (
        <ProjectList 
          projects={filteredProjects}
          onSelect={setSelectedProject}
        />
      )}
    </div>
  );
}
```

---

## Error Handling

### Using ErrorBoundary

```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* ... other routes */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

### Using Logger

```typescript
import { logger } from '../utils/logger';

// Information
logger.info('Component mounted', { component: 'Dashboard' });

// Warning
logger.warn('Deprecated prop used', { prop: 'oldProp' });

// Error
logger.error('Failed to load data', error);

// Debug (development only)
logger.debug('State updated', { newState });
```

---

## Testing

### Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SessionLogger from './SessionLogger';

describe('SessionLogger', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
    projects: [
      { id: '1', name: 'Project 1', status: 'Active' }
    ]
  };

  it('renders when open', () => {
    render(<SessionLogger {...mockProps} />);
    expect(screen.getByText('Log Work Session')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    render(<SessionLogger {...mockProps} />);
    fireEvent.click(screen.getByText('×'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    render(<SessionLogger {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Log Work Session')).not.toBeInTheDocument();
  });
});
```

### API Testing

```typescript
import { fetchProjects } from '../api/notionApi';

// Mock fetch
global.fetch = jest.fn();

describe('notionApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches projects successfully', async () => {
    const mockProjects = [{ id: '1', name: 'Test' }];
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: mockProjects })
    });

    const result = await fetchProjects();
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockProjects);
  });

  it('handles errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchProjects();
    
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
```

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Vercel)

Set these in Vercel dashboard:

```
NOTION_TOKEN=your_token
NOTION_PROJECTS_DATABASE_ID=your_id
NOTION_SESSIONS_DATABASE_ID=your_id
```

### Docker (for Python services)

```dockerfile
# Dockerfile for PuttSolver Service
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]
```

```bash
# Build and run
docker build -t putt-solver-service .
docker run -p 8081:8081 putt-solver-service
```

---

## Best Practices

### Code Organization

1. **One component per file** - Keep components focused
2. **Co-locate styles** - CSS file next to component
3. **Use TypeScript** - Type all props and state
4. **Handle loading/error states** - Always show feedback

### Performance

1. **Use `useMemo` for expensive computations**
2. **Use `useCallback` for callbacks passed to children**
3. **Implement pagination for large lists**
4. **Use React.lazy for code splitting**

### Security

1. **Never expose API keys in frontend**
2. **Validate all user input**
3. **Use HTTPS in production**
4. **Implement proper CORS**

---

## Troubleshooting

### Common Issues

**API connection fails:**
```bash
# Check server is running
curl http://localhost:3001/health
```

**Notion data not loading:**
```bash
# Verify environment variables
echo $NOTION_TOKEN
echo $NOTION_PROJECTS_DATABASE_ID
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Component Reference](./COMPONENT_REFERENCE.md)
- [Types Reference](./TYPES_REFERENCE.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
