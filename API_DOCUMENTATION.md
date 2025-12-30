# API & Component Documentation

Comprehensive documentation for all public APIs, functions, and components in the Agent Alex codebase.

## Table of Contents

1. [Backend APIs](#backend-apis)
   - [Express/Node.js Server](#expressnodejs-server)
   - [Python FastAPI Backend (AIME)](#python-fastapi-backend-aime)
   - [PuttSolver Service](#puttsolver-service)
2. [Frontend API Client](#frontend-api-client)
3. [React Components](#react-components)
4. [Utility Functions](#utility-functions)
5. [Type Definitions](#type-definitions)

---

## Backend APIs

### Express/Node.js Server

Base URL: `http://localhost:3001` (development) or configured via `VITE_API_URL`

#### Health Check

**GET** `/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Agent Alex API is running"
}
```

**Example:**
```bash
curl http://localhost:3001/health
```

---

#### Projects API

##### Get All Projects

**GET** `/api/projects`

Fetch all projects from Notion with optional filtering.

**Query Parameters:**
- `search` (string, optional): Search term to filter projects
- `status` (string, optional): Filter by status
- `workspace` (string, optional): Filter by workspace

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "project-id",
      "name": "Project Name",
      "description": "Project description",
      "status": "Active",
      "priority": "Medium",
      "type": "Web Application",
      "workspace": "/path/to/workspace",
      "startedDate": "2024-01-01",
      "lastUpdated": "2024-01-15",
      "currentContext": "Current project context",
      "repository": "https://github.com/user/repo",
      "techStack": ["React", "TypeScript"],
      "backlogItems": 5,
      "statusNotes": "Status notes",
      "nextSteps": "Next steps",
      "blockers": "Current blockers",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3001/api/projects?status=Active
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch projects"
}
```

---

##### Get Single Project

**GET** `/api/projects/:id`

Fetch a single project by ID.

**Path Parameters:**
- `id` (string, required): Project ID

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "project-id",
    "name": "Project Name",
    // ... same structure as above
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/projects/project-id-123
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Project not found"
}
```

---

##### Create Project

**POST** `/api/projects`

Create a new project in Notion.

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "status": "Active",
  "priority": "Medium",
  "type": "Web Application",
  "workspace": "/path/to/workspace",
  "repository": "https://github.com/user/repo",
  "currentContext": "Current context",
  "nextSteps": "Next steps",
  "techStack": "React, TypeScript, Node.js"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "new-project-id",
    // ... project data
  },
  "message": "Project created successfully!"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Project",
    "description": "A new project",
    "status": "Active",
    "priority": "Medium",
    "type": "Web Application"
  }'
```

---

##### Update Project

**PATCH** `/api/projects/:id`

Update an existing project.

**Path Parameters:**
- `id` (string, required): Project ID

**Request Body:**
```json
{
  "status": "Complete",
  "nextSteps": "Updated next steps"
}
```

**Response:**
```json
{
  "success": true,
  "project": null,
  "message": "Update project endpoint - to be implemented"
}
```

**Note:** This endpoint is currently a placeholder and needs implementation.

---

##### Get Project Context

**GET** `/api/projects/:id/context`

Get project context for resuming work.

**Path Parameters:**
- `id` (string, required): Project ID

**Response:**
```json
{
  "success": true,
  "context": null,
  "message": "Project context endpoint - to be implemented"
}
```

**Note:** This endpoint is currently a placeholder and needs implementation.

---

#### Sessions API

##### Get All Sessions

**GET** `/api/sessions`

Fetch all sessions from Notion with optional filtering.

**Query Parameters:**
- `projectId` (string, optional): Filter by project ID
- `search` (string, optional): Search term
- `status` (string, optional): Filter by status

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session-id",
      "title": "Session Title",
      "date": "2024-01-15",
      "duration": 120,
      "status": "Completed",
      "summary": "Session summary",
      "filesModified": "file1.ts, file2.tsx",
      "aiAgent": "Claude",
      "projectId": "project-id",
      "projectName": "Project Name",
      "nextSteps": "Next steps",
      "blockers": "Blockers",
      "workspace": "Cursor",
      "type": "Feature Development",
      "tags": ["tag1"],
      "keyDecisions": "Key decisions made",
      "challenges": "Challenges faced",
      "solutions": "Solutions implemented",
      "codeChanges": "Code changes summary",
      "technologiesUsed": ["React", "TypeScript"],
      "links": "Related links",
      "notes": "Additional notes",
      "outcomes": "Session outcomes",
      "learnings": "Key learnings",
      "context": "Session context",
      "toolsUsed": "Tools used"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3001/api/sessions?projectId=project-123
```

---

##### Get Single Session

**GET** `/api/sessions/:id`

Fetch a single session by ID.

**Path Parameters:**
- `id` (string, required): Session ID

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session-id",
    // ... same structure as above
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/sessions/session-id-123
```

---

##### Create Session

**POST** `/api/sessions`

Create a new session in Notion.

**Request Body:**
```json
{
  "title": "Session Title",
  "aiAgent": "Claude",
  "workspace": "Cursor",
  "sessionType": "Feature Development",
  "summary": "Session summary",
  "filesModified": "file1.ts",
  "nextSteps": "Next steps",
  "blockers": "Blockers",
  "projectId": "project-id",
  "keyDecisions": "Key decisions",
  "challenges": "Challenges",
  "solutions": "Solutions",
  "codeChanges": "Code changes",
  "outcomes": "Outcomes",
  "learnings": "Learnings"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "new-session-id",
    // ... session data
  },
  "message": "Session logged successfully!"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Session",
    "summary": "Worked on feature X",
    "aiAgent": "Claude"
  }'
```

---

##### Update Session Status

**PATCH** `/api/sessions/:id`

Update a session's status.

**Path Parameters:**
- `id` (string, required): Session ID

**Request Body:**
```json
{
  "status": "Completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session status updated successfully",
  "session": {
    "id": "session-id",
    "status": "Completed"
  }
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3001/api/sessions/session-id \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed"}'
```

---

#### Dashboard API

##### Get Dashboard Statistics

**GET** `/api/dashboard/stats`

Get comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalProjects": 10,
    "activeProjects": 5,
    "totalSessions": 150,
    "totalHours": 300,
    "completedSessions": 120,
    "technologiesCount": 15,
    "sessionsWithFiles": 100
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/dashboard/stats
```

---

##### Get Category Statistics

**GET** `/api/dashboard/categories`

Get statistics grouped by project category/type.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "name": "React",
      "projectCount": 5,
      "activeProjects": 3,
      "sessionCount": 50,
      "totalHours": 100
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3001/api/dashboard/categories
```

---

### Python FastAPI Backend (AIME)

Base URL: Configured via environment or default `http://localhost:8000`

#### Health Check

**GET** `/api/health`

Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "aime-backend",
  "version": "0.1.0"
}
```

---

**GET** `/api/health/full`

Comprehensive health check including PuttSolver service status.

**Response:**
```json
{
  "status": "ok",
  "services": {
    "backend": {
      "status": "ok",
      "version": "0.1.0"
    },
    "puttsolver": {
      "status": "ok",
      "reachable": true,
      "dll_loaded": false
    }
  }
}
```

**Status Codes:**
- `200`: All services healthy
- `503`: PuttSolver service unreachable or degraded

---

#### Courses API

**GET** `/api/courses`

Get all available courses from the datasets registry.

**Response:**
```json
{
  "datasets": [
    {
      "dtm_id": "riverside_2023_20cm",
      "course_id": "riverside_country_club",
      "hole_id": 1,
      "grid_spacing_m": 0.20,
      "grid_rows": 150,
      "grid_cols": 200
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:8000/api/courses
```

**Error Response (500):**
```json
{
  "detail": "Datasets registry not found: /path/to/datasets.json"
}
```

---

#### Solve Putt API

**POST** `/api/solve_putt`

Solve a putting problem using the PuttSolver service.

**Request Body:**
```json
{
  "course_id": "riverside_country_club",
  "hole_id": 1,
  "ball_wgs84": {
    "lat": 40.7128,
    "lon": -74.0060
  },
  "cup_wgs84": {
    "lat": 40.7130,
    "lon": -74.0062
  },
  "stimp": 10.5
}
```

**Response:**
```json
{
  "success": true,
  "instruction_text": "Aim 45.0° (mock), medium pace",
  "aim_line_deg": 45.0,
  "initial_speed_mph": 4.5,
  "plot_points_local": [
    {
      "x": 10.0,
      "y": 8.0,
      "t": 0.0
    }
  ],
  "error": null
}
```

**Error Responses:**

**AB_001 - Unknown course/hole:**
```json
{
  "success": false,
  "plot_points_local": [],
  "error": "AB_001 Unknown course/hole mapping: ..."
}
```

**AB_002 - Transform not implemented:**
```json
{
  "success": false,
  "plot_points_local": [],
  "error": "AB_002 Transform not implemented (needs developer blockers answers). Set AIME_TRANSFORM_MODE=mock for now."
}
```

**AB_003 - PuttSolver error:**
```json
{
  "success": false,
  "plot_points_local": [],
  "error": "AB_003 PuttSolver error: 500 ..."
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/solve_putt \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "riverside_country_club",
    "hole_id": 1,
    "ball_wgs84": {"lat": 40.7128, "lon": -74.0060},
    "cup_wgs84": {"lat": 40.7130, "lon": -74.0062},
    "stimp": 10.5
  }'
```

---

### PuttSolver Service

Base URL: `http://localhost:8081` (default)

#### Health Check

**GET** `/health`

Check PuttSolver service health.

**Response:**
```json
{
  "status": "ok",
  "service": "putt-solver-service",
  "version": "0.1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "dll_loaded": false,
  "datasets_count": 1,
  "mode": "mock"
}
```

---

#### List Datasets

**GET** `/datasets`

Get list of available datasets.

**Response:**
```json
[
  {
    "dtm_id": "riverside_2023_20cm",
    "course_id": "riverside_country_club",
    "hole_id": 1,
    "grid_spacing_m": 0.20,
    "grid_rows": 150,
    "grid_cols": 200
  }
]
```

---

#### Solve Putt

**POST** `/solve_putt`

Solve a putting problem (internal service endpoint).

**Request Body:**
```json
{
  "dtm_id": "riverside_2023_20cm",
  "ball_local_m": {
    "x": 10.0,
    "y": 8.0
  },
  "cup_local_m": {
    "x": 10.0,
    "y": 11.0
  },
  "stimp": 10.5,
  "request_id": "optional-request-id"
}
```

**Response:**
```json
{
  "request_id": "uuid",
  "dtm_id": "riverside_2023_20cm",
  "success": true,
  "instruction_text": "Aim 90.0° (mock), medium pace",
  "aim_line_deg": 90.0,
  "initial_speed_mph": 4.5,
  "plot_points": [
    {
      "x": 10.0,
      "y": 8.0,
      "t": 0.0
    }
  ],
  "solve_time_ms": 50.0,
  "error": null
}
```

**Error Response (400):**
```json
{
  "detail": "Unknown dtm_id: invalid_id"
}
```

**Error Response (501):**
```json
{
  "detail": "Real DLL mode not implemented yet. Use PUTTSOLVER_MODE=mock."
}
```

---

## Frontend API Client

The frontend uses a centralized API client located at `src/api/notionApi.ts`.

### Configuration

The API URL is configured via environment variable:
- Development: `http://localhost:3001` (default)
- Production: Set via `VITE_API_URL` environment variable

---

### Functions

#### `fetchProjects(filters?: ProjectFilters): Promise<ApiResponse<Project[]>>`

Fetch all projects with optional filters.

**Parameters:**
- `filters` (optional): Filter options
  - `search?: string` - Search term
  - `status?: ProjectStatus[]` - Filter by status
  - `workspace?: string[]` - Filter by workspace

**Returns:**
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

const result = await fetchProjects({ status: ['Active'] });
if (result.success) {
  console.log(result.data); // Project[]
}
```

---

#### `fetchProject(projectId: string): Promise<ApiResponse<Project>>`

Fetch a single project by ID.

**Parameters:**
- `projectId` (string): Project ID

**Returns:**
```typescript
{
  success: boolean;
  data?: Project;
  error?: string;
}
```

**Example:**
```typescript
const result = await fetchProject('project-123');
if (result.success) {
  console.log(result.data);
}
```

---

#### `createProject(project: Partial<Project>): Promise<ApiResponse<Project>>`

Create a new project.

**Parameters:**
- `project` (Partial<Project>): Project data

**Returns:**
```typescript
{
  success: boolean;
  data?: Project;
  message?: string;
  error?: string;
}
```

**Example:**
```typescript
const result = await createProject({
  name: 'New Project',
  description: 'Description',
  status: 'Active',
  priority: 'Medium',
  type: 'Web Application'
});

if (result.success) {
  console.log('Project created:', result.data);
}
```

---

#### `updateProject(projectId: string, updates: Partial<Project>): Promise<ApiResponse<Project>>`

Update an existing project.

**Parameters:**
- `projectId` (string): Project ID
- `updates` (Partial<Project>): Fields to update

**Returns:**
```typescript
{
  success: boolean;
  data?: Project;
  message?: string;
  error?: string;
}
```

**Example:**
```typescript
const result = await updateProject('project-123', {
  status: 'Complete'
});
```

---

#### `fetchSessions(filters?: SessionFilters): Promise<ApiResponse<Session[]>>`

Fetch sessions with optional filters.

**Parameters:**
- `filters` (optional): Filter options
  - `projectId?: string` - Filter by project ID
  - `search?: string` - Search term
  - `status?: SessionStatus[]` - Filter by status

**Returns:**
```typescript
{
  success: boolean;
  data?: Session[];
  error?: string;
}
```

**Example:**
```typescript
const result = await fetchSessions({ projectId: 'project-123' });
```

---

#### `createSession(session: Partial<Session>): Promise<ApiResponse<Session>>`

Create a new session.

**Parameters:**
- `session` (Partial<Session>): Session data

**Returns:**
```typescript
{
  success: boolean;
  data?: Session;
  message?: string;
  error?: string;
}
```

**Example:**
```typescript
const result = await createSession({
  title: 'New Session',
  summary: 'Worked on feature X',
  aiAgent: 'Claude'
});
```

---

#### `getProjectContext(projectId: string): Promise<ApiResponse<any>>`

Get project context for resuming work.

**Parameters:**
- `projectId` (string): Project ID

**Returns:**
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

**Note:** Currently returns placeholder data.

---

#### `fetchDashboardStats(): Promise<ApiResponse<any>>`

Fetch dashboard statistics.

**Returns:**
```typescript
{
  success: boolean;
  data?: DashboardStats;
  error?: string;
}
```

**Example:**
```typescript
const result = await fetchDashboardStats();
if (result.success) {
  console.log(result.data);
}
```

---

## React Components

### Dashboard

**Location:** `src/components/Dashboard/Dashboard.tsx`

Main dashboard component displaying projects, sessions, and statistics.

**Props:** None (uses React Router and internal state)

**Features:**
- Displays project statistics
- Shows current sessions
- Project categories breakdown
- Quick actions (create project, log session, etc.)
- Auto-refresh every 30 seconds

**Usage:**
```tsx
import Dashboard from './components/Dashboard/Dashboard';

<Dashboard />
```

**State Management:**
- `projects`: Project[]
- `stats`: DashboardStats | null
- `categories`: CategoryStats[]
- `currentSessions`: Session[]
- `allSessions`: Session[]

**Key Methods:**
- `loadDashboard()`: Fetches all dashboard data
- `handleResumeProject()`: Handles project resume action
- `handleSessionTimeUpdate()`: Updates session time tracking

---

### ProjectCreator

**Location:** `src/components/ProjectCreator/ProjectCreator.tsx`

Modal form for creating new projects.

**Props:**
```typescript
interface ProjectCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Usage:**
```tsx
import ProjectCreator from './components/ProjectCreator/ProjectCreator';

<ProjectCreator
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => {
    // Refresh projects list
    loadProjects();
  }}
/>
```

**Form Fields:**
- Name (required)
- Description (required)
- Status (required): Active | Paused | Complete | Archived
- Priority (required): Critical | High | Medium | Low
- Type (required): Web Application | Mobile App | API/Backend | Infrastructure | Documentation | Library/Package
- Workspace (optional)
- Repository URL (optional)
- Tech Stack (optional, comma-separated)
- Current Context (optional)
- Next Steps (optional)

---

### SessionLogger

**Location:** `src/components/SessionLogger/SessionLogger.tsx`

Modal form for logging work sessions.

**Props:**
```typescript
interface SessionLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projects: Project[];
}
```

**Usage:**
```tsx
import SessionLogger from './components/SessionLogger/SessionLogger';

<SessionLogger
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => {
    // Refresh sessions
    loadSessions();
  }}
  projects={projects}
/>
```

**Form Fields:**
- Title
- Project (dropdown)
- AI Agent
- Workspace
- Session Type
- Summary
- Files Modified
- Next Steps
- Blockers
- Extended fields (key decisions, challenges, solutions, etc.)

---

### QuickResume

**Location:** `src/components/QuickResume/QuickResume.tsx`

Component for quickly resuming work on a project.

**Props:**
```typescript
interface QuickResumeProps {
  project: Project;
  lastSession?: Session;
  onClose: () => void;
}
```

**Usage:**
```tsx
import QuickResume from './components/QuickResume/QuickResume';

<QuickResume
  project={project}
  lastSession={lastSession}
  onClose={() => setResumeProject(null)}
/>
```

---

### SessionTimer

**Location:** `src/components/SessionTimer/SessionTimer.tsx`

Timer component for tracking session duration.

**Props:**
```typescript
interface SessionTimerProps {
  session: Session;
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
  onClose: () => void;
}
```

**Usage:**
```tsx
import SessionTimer from './components/SessionTimer/SessionTimer';

<SessionTimer
  session={session}
  onSessionUpdate={(id, updates) => {
    // Update session duration
  }}
  onClose={() => setSessionToTrack(null)}
/>
```

---

### ProjectsList

**Location:** `src/components/ProjectsList/ProjectsList.tsx`

Component for displaying a list of projects.

**Props:**
```typescript
interface ProjectsListProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  filters?: ProjectFilters;
}
```

**Usage:**
```tsx
import ProjectsList from './components/ProjectsList/ProjectsList';

<ProjectsList
  projects={projects}
  onProjectClick={(project) => navigate(`/project/${project.id}`)}
/>
```

---

### SessionsList

**Location:** `src/components/SessionsList/SessionsList.tsx`

Component for displaying a list of sessions.

**Props:**
```typescript
interface SessionsListProps {
  sessions: Session[];
  onSessionClick?: (session: Session) => void;
  filters?: SessionFilters;
}
```

**Usage:**
```tsx
import SessionsList from './components/SessionsList/SessionsList';

<SessionsList
  sessions={sessions}
  onSessionClick={(session) => navigate(`/session/${session.id}`)}
/>
```

---

### ProjectDetail

**Location:** `src/components/ProjectDetail/ProjectDetail.tsx`

Detailed view of a single project.

**Props:**
```typescript
interface ProjectDetailProps {
  projectId: string;
}
```

**Usage:**
```tsx
import ProjectDetail from './components/ProjectDetail/ProjectDetail';

<ProjectDetail projectId="project-123" />
```

---

### SessionDetail

**Location:** `src/components/SessionDetail/SessionDetail.tsx`

Detailed view of a single session.

**Props:**
```typescript
interface SessionDetailProps {
  sessionId: string;
}
```

**Usage:**
```tsx
import SessionDetail from './components/SessionDetail/SessionDetail';

<SessionDetail sessionId="session-123" />
```

---

### ErrorBoundary

**Location:** `src/components/ErrorBoundary/ErrorBoundary.tsx`

React Error Boundary component for catching errors.

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}
```

**Usage:**
```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

### NotificationSystem

**Location:** `src/components/NotificationSystem/NotificationSystem.tsx`

System for displaying notifications.

**Props:**
```typescript
interface NotificationSystemProps {
  sessions: Session[];
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
}
```

**Usage:**
```tsx
import NotificationSystem from './components/NotificationSystem/NotificationSystem';

<NotificationSystem
  sessions={sessions}
  onSessionUpdate={(id, updates) => {
    // Handle session update
  }}
/>
```

---

### BreakReminder

**Location:** `src/components/BreakReminder/BreakReminder.tsx`

Component for reminding users to take breaks.

**Props:**
```typescript
interface BreakReminderProps {
  isVisible: boolean;
  onClose: () => void;
  onTakeBreak: () => void;
  workDuration: number; // minutes
}
```

**Usage:**
```tsx
import BreakReminder from './components/BreakReminder/BreakReminder';

<BreakReminder
  isVisible={showBreakReminder}
  onClose={() => setShowBreakReminder(false)}
  onTakeBreak={() => {
    // Pause current session
  }}
  workDuration={30}
/>
```

---

### DailySummary

**Location:** `src/components/DailySummary/DailySummary.tsx`

Component for displaying daily work summary.

**Props:**
```typescript
interface DailySummaryProps {
  sessions: Session[];
  isVisible: boolean;
  onClose: () => void;
}
```

**Usage:**
```tsx
import DailySummary from './components/DailySummary/DailySummary';

<DailySummary
  sessions={sessions}
  isVisible={showDailySummary}
  onClose={() => setShowDailySummary(false)}
/>
```

---

### AnalyticsDashboard

**Location:** `src/components/AnalyticsDashboard/AnalyticsDashboard.tsx`

Analytics and insights dashboard.

**Props:** None (fetches own data)

**Usage:**
```tsx
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';

<AnalyticsDashboard />
```

---

### ProductivityInsights

**Location:** `src/components/ProductivityInsights/ProductivityInsights.tsx`

Component for displaying productivity insights.

**Props:** None

**Usage:**
```tsx
import ProductivityInsights from './components/ProductivityInsights/ProductivityInsights';

<ProductivityInsights />
```

---

### ProjectTemplates

**Location:** `src/components/ProjectTemplates/ProjectTemplates.tsx`

Component for managing project templates.

**Props:**
```typescript
interface ProjectTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: any) => void;
  onApplyTemplate: (template: any, projectData: any) => void;
}
```

**Usage:**
```tsx
import ProjectTemplates from './components/ProjectTemplates/ProjectTemplates';

<ProjectTemplates
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onTemplateSelect={(template) => {}}
  onApplyTemplate={(template, data) => {}}
/>
```

---

### TemplateBuilder

**Location:** `src/components/TemplateBuilder/TemplateBuilder.tsx`

Component for building project templates.

**Props:**
```typescript
interface TemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: any) => void;
}
```

**Usage:**
```tsx
import TemplateBuilder from './components/TemplateBuilder/TemplateBuilder';

<TemplateBuilder
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSave={(template) => {
    // Save template
  }}
/>
```

---

### Additional Components

- **ProjectBacklog**: Manage project backlog items
- **ProjectDependencies**: View and manage project dependencies
- **ProjectHealth**: Display project health metrics
- **ProjectMilestones**: Manage project milestones
- **ProjectHandoff**: Handoff documentation component
- **SessionCard**: Card component for displaying sessions
- **SessionStatusBadge**: Badge component for session status
- **SessionStatusFilter**: Filter component for sessions
- **SessionStatusManager**: Manage session statuses
- **SessionDuplicator**: Duplicate existing sessions
- **SessionTemplates**: Manage session templates
- **TimeTracker**: Time tracking component
- **IntervalTracker**: Interval tracking component
- **DataExport**: Export data component
- **ReportGenerator**: Generate reports
- **SmartRecommendations**: AI-powered recommendations
- **TeamCollaboration**: Team collaboration features
- **WorkflowAutomation**: Workflow automation
- **IntegrationManagement**: Manage integrations
- **OfflineMode**: Offline mode handling
- **CustomerCRM**: Customer relationship management (disabled)
- **PuttSolverDemo**: Demo component for PuttSolver

---

## Utility Functions

### Logger

**Location:** `src/utils/logger.ts`

Centralized logging utility.

**Methods:**

#### `logger.info(message: string, meta?: any): void`

Log informational messages.

**Example:**
```typescript
import { logger } from './utils/logger';

logger.info('User logged in', { userId: '123' });
```

---

#### `logger.warn(message: string, meta?: any): void`

Log warning messages.

**Example:**
```typescript
logger.warn('API rate limit approaching', { remaining: 10 });
```

---

#### `logger.error(message: string, error?: any): void`

Log error messages.

**Example:**
```typescript
logger.error('Failed to fetch projects', error);
```

---

#### `logger.debug(message: string, meta?: any): void`

Log debug messages (only in development).

**Example:**
```typescript
logger.debug('Component rendered', { props });
```

---

## Type Definitions

All TypeScript types are defined in `src/types/index.ts`. Key types include:

### Project

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

### Session

```typescript
interface Session {
  id: string;
  title: string;
  date: string;
  duration: number;
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

### DashboardStats

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

### ApiResponse

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Enums

```typescript
type ProjectStatus = 'Active' | 'Paused' | 'Complete' | 'Archived';
type ProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';
type SessionStatus = 'In Progress' | 'Completed' | 'Paused' | 'Active' | 'Blocked' | 'Archived';
type SessionType = 'Feature Development' | 'Bug Fix' | 'Refactoring' | 'Documentation' | 'Planning' | 'Testing' | 'Deployment';
type ProjectType = 'Web Application' | 'Mobile App' | 'API/Backend' | 'Infrastructure' | 'Documentation' | 'Library/Package';
```

---

## Rate Limiting

The Express server implements rate limiting on all `/api/` endpoints:

- **Window:** 15 minutes
- **Max Requests:** 100 per IP per window
- **Headers:** Standard rate limit headers included

When rate limit is exceeded:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## CORS Configuration

CORS is configured with restricted origins:

**Default Allowed Origins:**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `http://localhost:3003`

**Custom Origins:**
Set via `ALLOWED_ORIGINS` environment variable (comma-separated).

**Methods:** GET, POST, PUT, PATCH, DELETE

**Credentials:** Enabled

---

## Environment Variables

### Express Server

- `NOTION_TOKEN` (required): Notion API token
- `NOTION_PROJECTS_DATABASE_ID` (required): Notion projects database ID
- `NOTION_SESSIONS_DATABASE_ID` (required): Notion sessions database ID
- `PORT` (optional): Server port (default: 3001)
- `ALLOWED_ORIGINS` (optional): Comma-separated list of allowed CORS origins

### Frontend

- `VITE_API_URL` (optional): API base URL (default: `http://localhost:3001`)

### Python Backend (AIME)

- `PUTTSOLVER_SERVICE_URL` (optional): PuttSolver service URL (default: `http://localhost:8081`)
- `AIME_TRANSFORM_MODE` (optional): Transform mode (default: `mock`)

### PuttSolver Service

- `PUTTSOLVER_MODE` (optional): Service mode (default: `mock`)

---

## Error Handling

### API Error Responses

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable

### Frontend Error Handling

The API client functions return `ApiResponse<T>` with:
- `success: boolean` - Indicates if the request succeeded
- `data?: T` - Response data (if successful)
- `error?: string` - Error message (if failed)

**Example:**
```typescript
const result = await fetchProjects();
if (!result.success) {
  console.error(result.error);
  // Handle error
} else {
  console.log(result.data);
}
```

---

## Authentication

Currently, the API does not implement authentication. All endpoints are publicly accessible. Authentication should be added for production use.

---

## Pagination

The Projects and Sessions APIs fetch ALL records using pagination internally. The frontend receives complete datasets.

For large datasets, consider implementing client-side pagination or adding pagination parameters to the API.

---

## Examples

### Complete Project Creation Flow

```typescript
import { createProject, fetchProjects } from './api/notionApi';

// Create project
const createResult = await createProject({
  name: 'My New Project',
  description: 'Project description',
  status: 'Active',
  priority: 'Medium',
  type: 'Web Application',
  workspace: '/path/to/workspace',
  techStack: 'React, TypeScript, Node.js'
});

if (createResult.success) {
  console.log('Project created:', createResult.data);
  
  // Refresh projects list
  const projectsResult = await fetchProjects();
  if (projectsResult.success) {
    console.log('All projects:', projectsResult.data);
  }
}
```

### Complete Session Logging Flow

```typescript
import { createSession, fetchSessions } from './api/notionApi';

// Create session
const sessionResult = await createSession({
  title: 'Work Session',
  summary: 'Implemented feature X',
  aiAgent: 'Claude',
  workspace: 'Cursor',
  sessionType: 'Feature Development',
  projectId: 'project-123',
  filesModified: 'src/components/Feature.tsx',
  nextSteps: 'Add tests',
  keyDecisions: 'Decided to use React hooks',
  challenges: 'State management complexity',
  solutions: 'Used Context API',
  outcomes: 'Feature completed successfully'
});

if (sessionResult.success) {
  console.log('Session logged:', sessionResult.data);
  
  // Fetch all sessions
  const sessionsResult = await fetchSessions({ projectId: 'project-123' });
  if (sessionsResult.success) {
    console.log('Project sessions:', sessionsResult.data);
  }
}
```

---

## Testing

### API Testing

Use tools like `curl`, Postman, or `httpie` to test endpoints:

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test projects endpoint
curl http://localhost:3001/api/projects

# Create project
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Project", "description": "Test", "status": "Active", "priority": "Medium", "type": "Web Application"}'
```

### Frontend Testing

Components can be tested using React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from './components/Dashboard/Dashboard';

test('renders dashboard', () => {
  render(<Dashboard />);
  expect(screen.getByText('Agent Alex')).toBeInTheDocument();
});
```

---

## Contributing

When adding new APIs or components:

1. **Document the API endpoint** with:
   - HTTP method and path
   - Request parameters
   - Request body schema
   - Response schema
   - Example requests/responses
   - Error responses

2. **Document React components** with:
   - Props interface
   - Usage examples
   - State management
   - Key methods

3. **Update this documentation** when making changes

4. **Add TypeScript types** to `src/types/index.ts`

5. **Add error handling** and logging

---

## Support

For issues or questions:
1. Check the error messages in API responses
2. Review server logs for detailed error information
3. Check environment variables are set correctly
4. Verify Notion API credentials and database IDs

---

## Version History

- **v0.1.0**: Initial API documentation
  - Express/Node.js server APIs
  - Python FastAPI backend APIs
  - PuttSolver service APIs
  - Frontend API client
  - React components documentation
  - Utility functions
  - Type definitions
