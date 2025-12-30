# Utility Functions & API Client Documentation

## Overview

This document provides comprehensive documentation for all utility functions, hooks, and the API client used throughout the Agent Alex application.

---

## Table of Contents

- [API Client (`notionApi.ts`)](#api-client-notionapits)
- [Logger Utility (`logger.ts`)](#logger-utility-loggerts)
- [Type Definitions (`types/index.ts`)](#type-definitions-typesindexts)
- [Environment Configuration](#environment-configuration)

---

## API Client (`notionApi.ts`)

Location: `src/api/notionApi.ts`

The Notion API client provides functions for interacting with the Express backend, which in turn communicates with Notion databases.

### Configuration

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

**Environment Variable:**
- `VITE_API_URL` - Base URL for the API (default: `http://localhost:3001`)

---

### Projects API Functions

#### fetchProjects

Fetch all projects from Notion with optional filters.

```typescript
fetchProjects(filters?: ProjectFilters): Promise<ApiResponse<Project[]>>
```

**Parameters:**
- `filters` (optional): Object containing filter criteria
  - `search?: string` - Search projects by name
  - `status?: ProjectStatus[]` - Filter by status
  - `workspace?: string[]` - Filter by workspace

**Returns:**
```typescript
Promise<ApiResponse<Project[]>>
```

**Response Structure:**
```typescript
{
  success: boolean;
  data?: Project[];
  error?: string;
}
```

**Example:**
```typescript
import { fetchProjects } from './api/notionApi';

// Fetch all projects
const response = await fetchProjects();
if (response.success && response.data) {
  console.log('Projects:', response.data);
}

// Fetch with filters
const filteredResponse = await fetchProjects({
  status: ['Active', 'Paused'],
  search: 'agent'
});
```

**Error Handling:**
```typescript
const response = await fetchProjects();
if (!response.success) {
  console.error('Error:', response.error);
  // Handle error appropriately
}
```

---

#### fetchProject

Fetch a single project by ID.

```typescript
fetchProject(projectId: string): Promise<ApiResponse<Project>>
```

**Parameters:**
- `projectId: string` - Unique project identifier

**Returns:**
```typescript
Promise<ApiResponse<Project>>
```

**Example:**
```typescript
import { fetchProject } from './api/notionApi';

const response = await fetchProject('abc123...');
if (response.success && response.data) {
  console.log('Project:', response.data);
}
```

---

#### createProject

Create a new project in Notion.

```typescript
createProject(project: Partial<Project>): Promise<ApiResponse<Project>>
```

**Parameters:**
- `project: Partial<Project>` - Project data (see required fields below)

**Required Fields:**
- `name: string` - Project name
- `status: ProjectStatus` - Project status
- `priority: ProjectPriority` - Project priority

**Optional Fields:**
- `description?: string`
- `type?: ProjectType`
- `workspace?: string`
- `repository?: string`
- `currentContext?: string`
- `nextSteps?: string`
- `techStack?: string[]`

**Returns:**
```typescript
Promise<ApiResponse<Project>>
```

**Example:**
```typescript
import { createProject } from './api/notionApi';

const newProject = {
  name: 'My New Project',
  description: 'A revolutionary app',
  status: 'Active',
  priority: 'High',
  type: 'Web Application',
  workspace: '/workspace/my-project',
  repository: 'https://github.com/user/my-project',
  techStack: ['React', 'TypeScript', 'Node.js']
};

const response = await createProject(newProject);
if (response.success) {
  console.log('Project created:', response.data);
  console.log('Message:', response.message); // "Project created successfully"
}
```

---

#### updateProject

Update an existing project.

```typescript
updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<ApiResponse<Project>>
```

**Parameters:**
- `projectId: string` - Project ID to update
- `updates: Partial<Project>` - Fields to update

**Returns:**
```typescript
Promise<ApiResponse<Project>>
```

**Example:**
```typescript
import { updateProject } from './api/notionApi';

const response = await updateProject('abc123...', {
  status: 'Complete',
  nextSteps: 'Archive and document'
});

if (response.success) {
  console.log('Updated:', response.data);
}
```

---

### Sessions API Functions

#### fetchSessions

Fetch sessions with optional filters.

```typescript
fetchSessions(filters?: SessionFilters): Promise<ApiResponse<Session[]>>
```

**Parameters:**
- `filters` (optional): Object containing filter criteria
  - `projectId?: string` - Filter by project
  - `search?: string` - Search sessions
  - `status?: SessionStatus[]` - Filter by status

**Returns:**
```typescript
Promise<ApiResponse<Session[]>>
```

**Example:**
```typescript
import { fetchSessions } from './api/notionApi';

// Fetch all sessions
const response = await fetchSessions();

// Fetch sessions for a project
const projectSessions = await fetchSessions({
  projectId: 'project-id-123'
});

// Fetch with multiple filters
const filteredSessions = await fetchSessions({
  status: ['Completed'],
  search: 'authentication'
});
```

---

#### createSession

Create a new work session.

```typescript
createSession(session: Partial<Session>): Promise<ApiResponse<Session>>
```

**Parameters:**
- `session: Partial<Session>` - Session data

**Required Fields:**
- `title: string` - Session title
- `summary: string` - Session summary
- `sessionType: SessionType` - Type of session
- `aiAgent: string` - AI agent used
- `workspace: string` - Workspace used

**Optional Fields:**
- `projectId?: string`
- `duration?: number`
- `filesModified?: string`
- `nextSteps?: string`
- `blockers?: string`
- `keyDecisions?: string`
- `challenges?: string`
- `solutions?: string`
- `codeChanges?: string`
- `outcomes?: string`
- `learnings?: string`

**Returns:**
```typescript
Promise<ApiResponse<Session>>
```

**Example:**
```typescript
import { createSession } from './api/notionApi';

const newSession = {
  projectId: 'project-123',
  title: 'Implemented user authentication',
  duration: 120,
  sessionType: 'Feature Development',
  aiAgent: 'Claude',
  workspace: 'Cursor',
  summary: 'Built JWT-based authentication system',
  filesModified: 'src/auth.ts, src/middleware.ts',
  nextSteps: 'Add password reset functionality',
  codeChanges: 'Added JWT middleware and auth routes',
  outcomes: 'Fully functional authentication',
  learnings: 'JWT best practices and security considerations'
};

const response = await createSession(newSession);
if (response.success) {
  console.log('Session logged:', response.data);
}
```

---

### Dashboard API Functions

#### getProjectContext

Get project context for resuming work.

```typescript
getProjectContext(projectId: string): Promise<ApiResponse<any>>
```

**Parameters:**
- `projectId: string` - Project ID

**Returns:**
```typescript
Promise<ApiResponse<any>>
```

**Example:**
```typescript
import { getProjectContext } from './api/notionApi';

const response = await getProjectContext('project-123');
if (response.success && response.data) {
  console.log('Context:', response.data);
}
```

---

#### fetchDashboardStats

Get dashboard statistics.

```typescript
fetchDashboardStats(): Promise<ApiResponse<any>>
```

**Returns:**
```typescript
Promise<ApiResponse<DashboardStats>>

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalSessions: number;
  totalHours: number;
  completedSessions?: number;
  technologiesCount?: number;
  sessionsWithFiles?: number;
}
```

**Example:**
```typescript
import { fetchDashboardStats } from './api/notionApi';

const response = await fetchDashboardStats();
if (response.success && response.data) {
  const { totalProjects, totalHours, activeProjects } = response.data;
  console.log(`${totalProjects} projects, ${totalHours} hours logged`);
}
```

---

### Error Handling Pattern

All API functions follow the same error handling pattern:

```typescript
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return {
    success: true,
    data: data.result,
    message: data.message
  };
} catch (error) {
  logger.error('Error message:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

**Best Practice:**
Always check the `success` field before accessing `data`:

```typescript
const response = await fetchProjects();

if (response.success && response.data) {
  // Safe to use response.data
  setProjects(response.data);
} else {
  // Handle error
  console.error(response.error);
  setError(response.error || 'Failed to load projects');
}
```

---

## Logger Utility (`logger.ts`)

Location: `src/utils/logger.ts`

A centralized logging utility that provides consistent logging across the application.

### Class: Logger

```typescript
class Logger {
  private isDevelopment: boolean;
  
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, error?: any): void;
  debug(message: string, meta?: any): void;
}
```

### Methods

#### info

Log informational messages (development only).

```typescript
info(message: string, meta?: any): void
```

**Parameters:**
- `message: string` - Log message
- `meta?: any` - Optional metadata

**Example:**
```typescript
import { logger } from './utils/logger';

logger.info('User logged in', { userId: '123', timestamp: Date.now() });
// Output (dev): [INFO] User logged in { userId: '123', timestamp: 1234567890 }
```

---

#### warn

Log warning messages (development only).

```typescript
warn(message: string, meta?: any): void
```

**Parameters:**
- `message: string` - Warning message
- `meta?: any` - Optional metadata

**Example:**
```typescript
import { logger } from './utils/logger';

logger.warn('API rate limit approaching', { remaining: 10 });
// Output (dev): [WARN] API rate limit approaching { remaining: 10 }
```

---

#### error

Log error messages (always logged, even in production).

```typescript
error(message: string, error?: any): void
```

**Parameters:**
- `message: string` - Error message
- `error?: any` - Optional error object or metadata

**Example:**
```typescript
import { logger } from './utils/logger';

try {
  await riskyOperation();
} catch (err) {
  logger.error('Operation failed:', err);
  // Output: [ERROR] Operation failed: Error: Something went wrong
}
```

---

#### debug

Log debug messages (development only).

```typescript
debug(message: string, meta?: any): void
```

**Parameters:**
- `message: string` - Debug message
- `meta?: any` - Optional metadata

**Example:**
```typescript
import { logger } from './utils/logger';

logger.debug('API request', { url: '/api/projects', method: 'GET' });
// Output (dev): [DEBUG] API request { url: '/api/projects', method: 'GET' }
```

---

### Usage

```typescript
import { logger } from './utils/logger';

// Throughout your application
logger.info('Starting data fetch');
logger.warn('Slow query detected', { duration: 3000 });
logger.error('Failed to save data', error);
logger.debug('Component rendered', { props });
```

### Configuration

The logger automatically detects the environment:

```typescript
private isDevelopment = 
  process.env.NODE_ENV === 'development' || 
  process.env.NODE_ENV === 'test';
```

### Future Enhancements

The logger is designed to be extended with external logging services:

```typescript
// TODO: Send to logging service in production (e.g., Sentry, LogRocket)
```

---

## Type Definitions (`types/index.ts`)

Location: `src/types/index.ts`

Comprehensive TypeScript type definitions for the entire application.

### Core Types

#### ProjectStatus
```typescript
type ProjectStatus = 'Active' | 'Paused' | 'Complete' | 'Archived';
```

#### ProjectPriority
```typescript
type ProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';
```

#### SessionStatus
```typescript
type SessionStatus = 
  | 'In Progress'
  | 'Completed'
  | 'Paused'
  | 'Active'
  | 'Blocked'
  | 'Archived';
```

#### SessionType
```typescript
type SessionType =
  | 'Feature Development'
  | 'Bug Fix'
  | 'Refactoring'
  | 'Documentation'
  | 'Planning'
  | 'Testing'
  | 'Deployment';
```

#### ProjectType
```typescript
type ProjectType =
  | 'Web Application'
  | 'Mobile App'
  | 'API/Backend'
  | 'Infrastructure'
  | 'Documentation'
  | 'Library/Package';
```

---

### Main Interfaces

#### Project

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  workspace: string;
  type: ProjectType;
  startedDate: string;
  lastUpdated: string;
  currentContext: string;
  repository?: string;
  localPath?: string;
  deploymentUrl?: string;
  backlogItems: number;
  statusNotes: string;
  nextSteps: string;
  blockers: string;
  techStack: string[];
  tags: string[];
  relatedSessions?: string[];
}
```

**Example:**
```typescript
const project: Project = {
  id: 'abc123',
  name: 'Agent Alex',
  description: 'AI work session tracker',
  status: 'Active',
  priority: 'High',
  workspace: '/workspace/agent-alex',
  type: 'Web Application',
  startedDate: '2024-01-01',
  lastUpdated: '2024-01-15',
  currentContext: 'Building documentation',
  repository: 'https://github.com/user/agent-alex',
  backlogItems: 5,
  statusNotes: 'On track',
  nextSteps: 'Complete API docs',
  blockers: '',
  techStack: ['React', 'TypeScript', 'Node.js'],
  tags: ['productivity', 'ai']
};
```

---

#### Session

```typescript
interface Session {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  projectId: string;
  projectName?: string;
  status: SessionStatus;
  summary: string;
  filesModified: string;
  nextSteps: string;
  blockers: string;
  aiAgent: string;
  workspace: string;
  type: SessionType;
  tags: string[];
  
  // Extended fields
  keyDecisions?: string;
  challenges?: string;
  solutions?: string;
  codeChanges?: string;
  technologiesUsed?: string[];
  links?: string;
  notes?: string;
  outcomes?: string;
  learnings?: string;
  context?: string;
  toolsUsed?: string;
}
```

**Example:**
```typescript
const session: Session = {
  id: 'session123',
  title: 'Implemented authentication',
  date: '2024-01-15',
  duration: 120,
  projectId: 'project123',
  projectName: 'Agent Alex',
  status: 'Completed',
  summary: 'Built JWT authentication',
  filesModified: 'src/auth.ts, src/middleware.ts',
  nextSteps: 'Add refresh tokens',
  blockers: '',
  aiAgent: 'Claude',
  workspace: 'Cursor',
  type: 'Feature Development',
  tags: ['backend', 'security'],
  keyDecisions: 'Chose JWT over sessions',
  challenges: 'Token expiration handling',
  solutions: 'Sliding session windows',
  codeChanges: 'Added auth middleware',
  outcomes: 'Fully functional auth',
  learnings: 'JWT security best practices'
};
```

---

#### ApiResponse<T>

Generic wrapper for API responses.

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Usage:**
```typescript
// Function return type
function fetchData(): Promise<ApiResponse<Project[]>> {
  // ...
}

// Using the response
const response: ApiResponse<Project[]> = await fetchData();
if (response.success && response.data) {
  response.data.forEach(project => console.log(project.name));
}
```

---

#### DashboardStats

```typescript
interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects?: number;
  totalSessions: number;
  totalHours: number;
  thisWeekSessions?: number;
  thisWeekHours?: number;
  completedSessions?: number;
  technologiesCount?: number;
  sessionsWithFiles?: number;
}
```

---

#### ProjectFilters

```typescript
interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  workspace?: string[];
  type?: ProjectType[];
  tags?: string[];
  search?: string;
}
```

**Example:**
```typescript
const filters: ProjectFilters = {
  status: ['Active', 'Paused'],
  priority: ['High', 'Critical'],
  search: 'agent',
  tags: ['productivity']
};

const response = await fetchProjects(filters);
```

---

#### SessionFilters

```typescript
interface SessionFilters {
  projectId?: string;
  status?: SessionStatus[];
  type?: SessionType[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}
```

**Example:**
```typescript
const filters: SessionFilters = {
  status: ['Completed'],
  type: ['Feature Development'],
  dateRange: {
    start: '2024-01-01',
    end: '2024-01-31'
  }
};

const response = await fetchSessions(filters);
```

---

### Advanced Types

The type system includes many advanced interfaces for:

- **Templates**: ProjectTemplate, SessionTemplate
- **Workflows**: Workflow, WorkflowTrigger, WorkflowStep
- **Automation**: AutomationRule, AutomationCondition
- **Reports**: ReportTemplate, GeneratedReport
- **Analytics**: AIInsight, WorkPattern, PredictiveAnalytics
- **CRM**: Customer, Lead, Opportunity, Deal
- **Marketing**: MarketingCampaign, EmailCampaign
- **Security**: User, UserRole, Permission, AuditLog
- **Compliance**: ComplianceFramework, ComplianceRequirement

See `src/types/index.ts` for complete definitions (2600+ lines).

---

## Environment Configuration

### Frontend Environment Variables

Located in `.env.development`, `.env.production`

```bash
# API Configuration
VITE_API_URL=http://localhost:3001

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CRM=false
```

**Usage:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
```

---

### Backend Environment Variables

Required variables for the Express backend:

```bash
# Notion Integration (REQUIRED)
NOTION_TOKEN=secret_xyz...
NOTION_PROJECTS_DATABASE_ID=abc123...
NOTION_SESSIONS_DATABASE_ID=def456...

# Server Configuration
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Optional
NODE_ENV=development
```

---

## Best Practices

### 1. Always Use Type Definitions

```typescript
// Good
import { Project, Session } from './types';
const project: Project = {...};

// Bad
const project = {...}; // No type checking
```

### 2. Handle API Errors Properly

```typescript
// Good
const response = await fetchProjects();
if (response.success && response.data) {
  setProjects(response.data);
} else {
  logger.error('Failed to fetch projects:', response.error);
  setError(response.error || 'Unknown error');
}

// Bad
const response = await fetchProjects();
setProjects(response.data); // Could be undefined!
```

### 3. Use the Logger

```typescript
// Good
import { logger } from './utils/logger';
logger.error('Operation failed:', error);

// Bad
console.error('Operation failed:', error);
```

### 4. Leverage TypeScript Features

```typescript
// Use optional chaining
const projectName = project?.name ?? 'Untitled';

// Use type guards
function isProject(obj: any): obj is Project {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

// Use discriminated unions
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

---

## Testing Utilities

### Mock Data

Create mock data for testing:

```typescript
import { Project, Session } from './types';

export const mockProject: Project = {
  id: 'test-project-1',
  name: 'Test Project',
  description: 'A test project',
  status: 'Active',
  priority: 'Medium',
  workspace: '/test',
  type: 'Web Application',
  startedDate: '2024-01-01',
  lastUpdated: '2024-01-01',
  currentContext: 'Testing',
  backlogItems: 0,
  statusNotes: '',
  nextSteps: '',
  blockers: '',
  techStack: [],
  tags: []
};

export const mockSession: Session = {
  id: 'test-session-1',
  title: 'Test Session',
  date: '2024-01-01',
  duration: 60,
  projectId: 'test-project-1',
  status: 'Completed',
  summary: 'Test summary',
  filesModified: '',
  nextSteps: '',
  blockers: '',
  aiAgent: 'Claude',
  workspace: 'Cursor',
  type: 'Feature Development',
  tags: []
};
```

### API Mocking

Mock API calls in tests:

```typescript
import { fetchProjects } from './api/notionApi';

jest.mock('./api/notionApi');

test('loads projects', async () => {
  (fetchProjects as jest.Mock).mockResolvedValue({
    success: true,
    data: [mockProject]
  });
  
  const response = await fetchProjects();
  expect(response.success).toBe(true);
  expect(response.data).toHaveLength(1);
});
```

---

## Common Patterns

### Async Data Loading

```typescript
const [data, setData] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadData() {
    setLoading(true);
    setError(null);
    
    const response = await fetchProjects();
    
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to load data');
    }
    
    setLoading(false);
  }
  
  loadData();
}, []);
```

### Form Handling

```typescript
const [formData, setFormData] = useState({
  name: '',
  description: ''
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await createProject(formData);
  
  if (response.success) {
    onSuccess();
  } else {
    setError(response.error);
  }
};
```

---

## Support

For questions about utilities and types:
- Review source code and comments
- Check TypeScript compiler errors
- Refer to the [API documentation](./API_DOCUMENTATION.md)
- See [Components documentation](./COMPONENTS_DOCUMENTATION.md)
