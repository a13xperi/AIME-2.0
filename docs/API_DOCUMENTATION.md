# Agent Alex - API Documentation

> Comprehensive documentation for all public APIs, functions, and components in the Agent Alex codebase.

## Table of Contents

- [Backend APIs (Python/FastAPI)](#backend-apis-pythonfastapi)
  - [AIME Backend API](#aime-backend-api)
  - [PuttSolver Service API](#puttsolver-service-api)
- [Server APIs (Node.js/Express)](#server-apis-nodejsexpress)
  - [Projects API](#projects-api)
  - [Sessions API](#sessions-api)
  - [Dashboard API](#dashboard-api)
- [Frontend API Client](#frontend-api-client)
- [React Components](#react-components)
- [TypeScript Types](#typescript-types)
- [Utility Functions](#utility-functions)

---

## Backend APIs (Python/FastAPI)

### AIME Backend API

The AIME Backend is a FastAPI application that serves as the main backend service for the golf putt solving system.

**Base URL:** `http://localhost:8000` (development)

#### Health Check

```http
GET /api/health
```

Returns basic health status of the backend service.

**Response:**

```json
{
  "status": "ok",
  "service": "aime-backend",
  "version": "0.1.0"
}
```

---

#### Full Health Check

```http
GET /api/health/full
```

Comprehensive health check that verifies connectivity to all dependent services including the PuttSolver service.

**Response (200 OK - All healthy):**

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

**Response (503 Service Unavailable - Degraded):**

```json
{
  "status": "degraded",
  "services": {
    "backend": {
      "status": "ok",
      "version": "0.1.0"
    },
    "puttsolver": {
      "status": "unreachable",
      "reachable": false,
      "dll_loaded": false
    }
  }
}
```

---

#### Get Courses

```http
GET /api/courses
```

Returns all available golf course datasets from the datasets registry.

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

---

#### Solve Putt

```http
POST /api/solve_putt
```

Calculates the optimal putting solution given ball and cup positions.

**Request Body:**

```json
{
  "course_id": "riverside_country_club",
  "hole_id": 1,
  "ball_wgs84": {
    "lat": 37.774929,
    "lon": -122.419416
  },
  "cup_wgs84": {
    "lat": 37.77485,
    "lon": -122.4193
  },
  "stimp": 10.5
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `course_id` | string | Yes | Course identifier |
| `hole_id` | integer | Yes | Hole number (1-18) |
| `ball_wgs84` | object | Yes | Ball position in WGS84 coordinates |
| `ball_wgs84.lat` | float | Yes | Latitude |
| `ball_wgs84.lon` | float | Yes | Longitude |
| `cup_wgs84` | object | Yes | Cup position in WGS84 coordinates |
| `cup_wgs84.lat` | float | Yes | Latitude |
| `cup_wgs84.lon` | float | Yes | Longitude |
| `stimp` | float | Yes | Stimpmeter reading (6.0-15.0) |

**Response (Success):**

```json
{
  "success": true,
  "instruction_text": "Aim +45.0° (mock), medium pace",
  "aim_line_deg": 45.0,
  "initial_speed_mph": 4.5,
  "plot_points_local": [
    { "x": 10.0, "y": 8.0, "t": 0.0 },
    { "x": 10.0, "y": 9.5, "t": 1.0 },
    { "x": 10.0, "y": 11.0, "t": 2.0 }
  ],
  "error": null
}
```

**Response (Error):**

```json
{
  "success": false,
  "instruction_text": null,
  "aim_line_deg": null,
  "initial_speed_mph": null,
  "plot_points_local": [],
  "error": "AB_001 Unknown course/hole mapping: ..."
}
```

**Error Codes:**
- `AB_001`: Unknown course/hole mapping
- `AB_002`: Transform not implemented
- `AB_003`: PuttSolver service error or unreachable
- `AB_004`: Unexpected error

---

### PuttSolver Service API

The PuttSolver Service is a FastAPI microservice that wraps the physics-based PuttSolver DLL.

**Base URL:** `http://localhost:8081` (development)

#### Health Check

```http
GET /health
```

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

```http
GET /datasets
```

Returns all available DTM datasets.

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

#### Solve Putt (Service Level)

```http
POST /solve_putt
```

Direct putt solving using local green coordinates.

**Request Body:**

```json
{
  "dtm_id": "riverside_2023_20cm",
  "ball_local_m": { "x": 10.0, "y": 8.0 },
  "cup_local_m": { "x": 10.0, "y": 11.0 },
  "stimp": 10.5,
  "request_id": "optional-uuid"
}
```

**Response:**

```json
{
  "request_id": "uuid-here",
  "dtm_id": "riverside_2023_20cm",
  "success": true,
  "instruction_text": "Aim +90.0° (mock), medium pace",
  "aim_line_deg": 90.0,
  "initial_speed_mph": 4.5,
  "plot_points": [
    { "x": 10.0, "y": 8.0, "t": 0.0 },
    { "x": 10.0, "y": 11.0, "t": 2.0 }
  ],
  "solve_time_ms": 52.3,
  "error": null
}
```

---

## Server APIs (Node.js/Express)

The Express server provides the Notion-integrated API for project and session management.

**Base URL:** `http://localhost:3001` (development)

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "message": "Agent Alex API is running"
}
```

---

### Projects API

#### Get All Projects

```http
GET /api/projects
```

Fetches all projects from the Notion database with pagination support.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Filter by search term |
| `status` | string | Filter by status (comma-separated) |
| `workspace` | string | Filter by workspace (comma-separated) |

**Response:**

```json
{
  "success": true,
  "projects": [
    {
      "id": "notion-page-id",
      "name": "Project Name",
      "description": "Project description",
      "status": "Active",
      "priority": "High",
      "type": "Web Application",
      "workspace": "/path/to/workspace",
      "startedDate": "2024-01-01",
      "lastUpdated": "2024-01-15",
      "currentContext": "Working on feature X",
      "repository": "https://github.com/...",
      "techStack": ["React", "TypeScript", "Node.js"],
      "backlogItems": 5,
      "statusNotes": "On track",
      "nextSteps": "Implement authentication",
      "blockers": "None",
      "tags": ["frontend", "priority"]
    }
  ]
}
```

---

#### Get Single Project

```http
GET /api/projects/:id
```

**Parameters:**
- `id`: Project ID (Notion page ID)

**Response:**

```json
{
  "success": true,
  "project": {
    "id": "project-id",
    "name": "Project Name",
    // ... full project object
  }
}
```

---

#### Create Project

```http
POST /api/projects
```

**Request Body:**

```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "Active",
  "priority": "Medium",
  "type": "Web Application",
  "workspace": "/path/to/workspace",
  "repository": "https://github.com/...",
  "currentContext": "Initial setup",
  "nextSteps": "Set up project structure",
  "techStack": "React, TypeScript, Node.js"
}
```

**Response:**

```json
{
  "success": true,
  "project": {
    "id": "new-project-id",
    "name": "New Project"
  },
  "message": "Project created successfully!"
}
```

---

#### Update Project

```http
PATCH /api/projects/:id
```

**Request Body:** Partial project object with fields to update.

---

### Sessions API

#### Get All Sessions

```http
GET /api/sessions
```

Fetches all work sessions with pagination support.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | string | Filter by project ID or name |
| `search` | string | Filter by search term |
| `status` | string | Filter by status (comma-separated) |

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
      "summary": "Session summary...",
      "filesModified": "file1.ts, file2.tsx",
      "aiAgent": "Claude",
      "projectId": "project-id",
      "projectName": "Project Name",
      "nextSteps": "Continue with...",
      "blockers": "None",
      "workspace": "Cursor",
      "type": "Feature Development",
      "tags": ["feature", "frontend"],
      "keyDecisions": "Decided to use...",
      "challenges": "Faced issue with...",
      "solutions": "Resolved by...",
      "codeChanges": "Added new component...",
      "technologiesUsed": ["React", "TypeScript"],
      "outcomes": "Successfully implemented...",
      "learnings": "Learned about..."
    }
  ]
}
```

---

#### Get Single Session

```http
GET /api/sessions/:id
```

**Response:**

```json
{
  "success": true,
  "session": {
    // ... full session object
  }
}
```

---

#### Create Session

```http
POST /api/sessions
```

**Request Body:**

```json
{
  "projectId": "project-id",
  "title": "Session Title",
  "duration": 120,
  "sessionType": "Feature Development",
  "aiAgent": "Claude",
  "workspace": "Cursor",
  "summary": "Session summary",
  "filesModified": "file1.ts, file2.tsx",
  "nextSteps": "Continue with...",
  "blockers": "None",
  "keyDecisions": "Decided to...",
  "challenges": "Faced...",
  "solutions": "Resolved by...",
  "codeChanges": "Added...",
  "outcomes": "Successfully...",
  "learnings": "Learned..."
}
```

**Response:**

```json
{
  "success": true,
  "session": {
    "id": "new-session-id"
  },
  "message": "Session logged successfully!"
}
```

---

#### Update Session Status

```http
PATCH /api/sessions/:id
```

**Request Body:**

```json
{
  "status": "Completed"
}
```

---

### Dashboard API

#### Get Dashboard Statistics

```http
GET /api/dashboard/stats
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalProjects": 25,
    "activeProjects": 10,
    "totalSessions": 150,
    "totalHours": 300,
    "completedSessions": 120,
    "technologiesCount": 15,
    "sessionsWithFiles": 100
  }
}
```

---

#### Get Category Statistics

```http
GET /api/dashboard/categories
```

**Response:**

```json
{
  "success": true,
  "categories": [
    {
      "name": "Web Application",
      "projectCount": 10,
      "activeProjects": 5,
      "sessionCount": 50,
      "totalHours": 100.5
    }
  ]
}
```

---

## Frontend API Client

The frontend API client (`src/api/notionApi.ts`) provides type-safe functions for interacting with the backend.

### fetchProjects

```typescript
import { fetchProjects } from '../api/notionApi';

// Fetch all projects
const response = await fetchProjects();
if (response.success) {
  const projects = response.data;
}

// Fetch with filters
const response = await fetchProjects({
  status: ['Active', 'Paused'],
  workspace: ['Cursor'],
  search: 'agent'
});
```

**Signature:**

```typescript
function fetchProjects(filters?: ProjectFilters): Promise<ApiResponse<Project[]>>
```

---

### fetchProject

```typescript
import { fetchProject } from '../api/notionApi';

const response = await fetchProject('project-id');
if (response.success) {
  const project = response.data;
}
```

**Signature:**

```typescript
function fetchProject(projectId: string): Promise<ApiResponse<Project>>
```

---

### createProject

```typescript
import { createProject } from '../api/notionApi';

const response = await createProject({
  name: 'New Project',
  description: 'Description',
  status: 'Active',
  priority: 'High'
});

if (response.success) {
  console.log('Created:', response.data);
}
```

**Signature:**

```typescript
function createProject(project: Partial<Project>): Promise<ApiResponse<Project>>
```

---

### updateProject

```typescript
import { updateProject } from '../api/notionApi';

const response = await updateProject('project-id', {
  status: 'Complete',
  nextSteps: 'Deployment'
});
```

**Signature:**

```typescript
function updateProject(projectId: string, updates: Partial<Project>): Promise<ApiResponse<Project>>
```

---

### fetchSessions

```typescript
import { fetchSessions } from '../api/notionApi';

// Fetch all sessions
const response = await fetchSessions();

// Fetch sessions for a specific project
const response = await fetchSessions({
  projectId: 'project-id',
  status: ['Completed']
});
```

**Signature:**

```typescript
function fetchSessions(filters?: SessionFilters): Promise<ApiResponse<Session[]>>
```

---

### createSession

```typescript
import { createSession } from '../api/notionApi';

const response = await createSession({
  title: 'Implemented authentication',
  projectId: 'project-id',
  duration: 120,
  summary: 'Added OAuth2 login...'
});
```

**Signature:**

```typescript
function createSession(session: Partial<Session>): Promise<ApiResponse<Session>>
```

---

### getProjectContext

```typescript
import { getProjectContext } from '../api/notionApi';

const response = await getProjectContext('project-id');
if (response.success) {
  const context = response.data;
}
```

**Signature:**

```typescript
function getProjectContext(projectId: string): Promise<ApiResponse<any>>
```

---

### fetchDashboardStats

```typescript
import { fetchDashboardStats } from '../api/notionApi';

const response = await fetchDashboardStats();
if (response.success) {
  const stats = response.data;
}
```

**Signature:**

```typescript
function fetchDashboardStats(): Promise<ApiResponse<any>>
```

---

## React Components

### Dashboard

Main dashboard component displaying projects, sessions, and statistics.

**Location:** `src/components/Dashboard/Dashboard.tsx`

**Usage:**

```tsx
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return <Dashboard />;
}
```

**Features:**
- Displays project statistics
- Shows today's active sessions
- Category breakdown with charts
- Quick actions (new project, log session)
- Auto-refresh every 30 seconds

---

### SessionLogger

Modal form for logging new work sessions.

**Location:** `src/components/SessionLogger/SessionLogger.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | () => void | Yes | Callback when modal closes |
| `onSuccess` | () => void | Yes | Callback on successful submission |
| `projects` | Project[] | Yes | List of available projects |
| `preselectedProjectId` | string | No | Pre-select a project |

**Usage:**

```tsx
import SessionLogger from './components/SessionLogger/SessionLogger';

function ParentComponent() {
  const [showLogger, setShowLogger] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  return (
    <>
      <button onClick={() => setShowLogger(true)}>Log Session</button>
      <SessionLogger
        isOpen={showLogger}
        onClose={() => setShowLogger(false)}
        onSuccess={() => {
          setShowLogger(false);
          // Refresh data
        }}
        projects={projects}
        preselectedProjectId="project-id"
      />
    </>
  );
}
```

---

### ProjectCreator

Modal form for creating new projects.

**Location:** `src/components/ProjectCreator/ProjectCreator.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | () => void | Yes | Callback when modal closes |
| `onSuccess` | () => void | Yes | Callback on successful creation |

**Usage:**

```tsx
import ProjectCreator from './components/ProjectCreator/ProjectCreator';

<ProjectCreator
  isOpen={showCreator}
  onClose={() => setShowCreator(false)}
  onSuccess={loadProjects}
/>
```

---

### ProjectsList

Full list view of all projects with filtering.

**Location:** `src/components/ProjectsList/ProjectsList.tsx`

**Usage:**

```tsx
import ProjectsList from './components/ProjectsList/ProjectsList';

<Route path="/projects" element={<ProjectsList />} />
```

**Features:**
- Filter by status (All, Active, Complete, Paused)
- Click to navigate to project details
- Shows priority and last updated date

---

### SessionsList

Timeline view of all work sessions.

**Location:** `src/components/SessionsList/SessionsList.tsx`

**Usage:**

```tsx
import SessionsList from './components/SessionsList/SessionsList';

<Route path="/sessions" element={<SessionsList />} />
```

---

### ProjectDetail

Detailed view of a single project.

**Location:** `src/components/ProjectDetail/ProjectDetail.tsx`

**Usage:**

```tsx
import ProjectDetail from './components/ProjectDetail/ProjectDetail';

<Route path="/project/:id" element={<ProjectDetail />} />
```

---

### SessionDetail

Detailed view of a single session.

**Location:** `src/components/SessionDetail/SessionDetail.tsx`

**Usage:**

```tsx
import SessionDetail from './components/SessionDetail/SessionDetail';

<Route path="/session/:id" element={<SessionDetail />} />
```

---

### ErrorBoundary

Global error boundary for catching and displaying React errors.

**Location:** `src/components/ErrorBoundary/ErrorBoundary.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | ReactNode | Yes | Child components to wrap |

**Usage:**

```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

**Features:**
- Catches JavaScript errors in child components
- Shows user-friendly error message
- Displays stack trace in development mode
- Provides "Try Again" and "Go to Dashboard" buttons

---

### QuickResume

Modal for quickly resuming work on a project.

**Location:** `src/components/QuickResume/QuickResume.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `project` | Project | Yes | Project to resume |
| `lastSession` | Session | No | Last session for context |
| `onClose` | () => void | Yes | Callback when modal closes |

---

### SessionTimer

Timer component for tracking session duration.

**Location:** `src/components/SessionTimer/SessionTimer.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `session` | Session | Yes | Session to track |
| `onSessionUpdate` | (id, updates) => void | Yes | Callback for time updates |
| `onClose` | () => void | Yes | Callback when timer closes |

---

### BreakReminder

Notification component reminding users to take breaks.

**Location:** `src/components/BreakReminder/BreakReminder.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isVisible` | boolean | Yes | Controls visibility |
| `onClose` | () => void | Yes | Callback to dismiss |
| `onTakeBreak` | () => void | Yes | Callback when taking break |
| `workDuration` | number | Yes | Minutes worked |

---

### NotificationSystem

Component for managing and displaying notifications.

**Location:** `src/components/NotificationSystem/NotificationSystem.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sessions` | Session[] | Yes | Sessions to monitor |
| `onSessionUpdate` | (id, updates) => void | Yes | Callback for updates |

---

### DailySummary

Modal showing daily work summary.

**Location:** `src/components/DailySummary/DailySummary.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sessions` | Session[] | Yes | Sessions to summarize |
| `isVisible` | boolean | Yes | Controls visibility |
| `onClose` | () => void | Yes | Callback to close |

---

### AnalyticsDashboard

Analytics and reporting dashboard.

**Location:** `src/components/AnalyticsDashboard/AnalyticsDashboard.tsx`

**Usage:**

```tsx
<Route path="/analytics" element={<AnalyticsDashboard />} />
```

---

### TeamCollaboration

Team collaboration and sharing features.

**Location:** `src/components/TeamCollaboration/TeamCollaboration.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projects` | Project[] | Yes | Available projects |
| `sessions` | Session[] | Yes | Available sessions |
| `currentUserId` | string | Yes | Current user ID |

---

### ProjectTemplates

Modal for selecting project templates.

**Location:** `src/components/ProjectTemplates/ProjectTemplates.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls visibility |
| `onClose` | () => void | Yes | Callback to close |
| `onTemplateSelect` | (template) => void | Yes | Selection callback |
| `onApplyTemplate` | (template, data) => void | Yes | Apply callback |

---

### TemplateBuilder

Component for creating custom templates.

**Location:** `src/components/TemplateBuilder/TemplateBuilder.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls visibility |
| `onClose` | () => void | Yes | Callback to close |
| `onSave` | (template) => void | Yes | Save callback |

---

### PuttSolverDemo

Demo component for the PuttSolver API.

**Location:** `src/components/PuttSolverDemo/PuttSolverDemo.tsx`

**Usage:**

```tsx
import PuttSolverDemo from './components/PuttSolverDemo/PuttSolverDemo';

<PuttSolverDemo />
```

**Features:**
- Form for entering ball/cup coordinates
- Stimp rating input
- Displays solver results
- Shows ball path visualization data

---

### OfflineMode

Component displayed when API is unavailable.

**Location:** `src/components/OfflineMode/OfflineMode.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onRetry` | () => void | Yes | Retry connection callback |
| `error` | string | No | Error message to display |

---

## TypeScript Types

### Core Types

**Location:** `src/types/index.ts`

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

#### Session

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

#### Status Types

```typescript
type ProjectStatus = 'Active' | 'Paused' | 'Complete' | 'Archived';
type ProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';
type SessionStatus = 'In Progress' | 'Completed' | 'Paused' | 'Active' | 'Blocked' | 'Archived';
type SessionType = 'Feature Development' | 'Bug Fix' | 'Refactoring' | 'Documentation' | 'Planning' | 'Testing' | 'Deployment';
type ProjectType = 'Web Application' | 'Mobile App' | 'API/Backend' | 'Infrastructure' | 'Documentation' | 'Library/Package';
```

#### API Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

#### Filter Types

```typescript
interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  workspace?: string[];
  type?: ProjectType[];
  tags?: string[];
  search?: string;
}

interface SessionFilters {
  projectId?: string;
  status?: SessionStatus[];
  type?: SessionType[];
  dateRange?: { start: string; end: string };
  search?: string;
}
```

#### Dashboard Statistics

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

interface CategoryStats {
  name: string;
  projectCount: number;
  activeProjects: number;
  sessionCount: number;
  totalHours: number;
}
```

---

## Utility Functions

### Logger

**Location:** `src/utils/logger.ts`

Centralized logging utility with development/production awareness.

```typescript
import { logger } from '../utils/logger';

// Log informational messages
logger.info('Operation completed', { details: 'additional data' });

// Log warnings
logger.warn('Deprecated method used', { method: 'oldMethod' });

// Log errors (always logged)
logger.error('Failed to fetch data', error);

// Log debug messages (development only)
logger.debug('Variable state', { value: 42 });
```

**Methods:**

| Method | Description | Production |
|--------|-------------|------------|
| `info(message, meta?)` | Informational logs | No |
| `warn(message, meta?)` | Warning logs | No |
| `error(message, error?)` | Error logs | Yes |
| `debug(message, meta?)` | Debug logs | No |

---

## Python Utilities

### WGS84 to State Plane Transform

**Location:** `ovation_golf/python/transforms/WGS84ToStatePlane.py`

Converts WGS84 coordinates to State Plane coordinates.

```python
from transforms.WGS84ToStatePlane import wgs84ToStatePlane

# Convert coordinates
x, y = wgs84ToStatePlane('EPSG:2234', 41.09361, -73.39203)
```

**CLI Usage:**

```bash
python WGS84ToStatePlane.py 2234 41.09361 -73.39203
# Output:
# X(m): 250859.11639312567
# Y(m): 181505.8478478079
```

---

## Environment Variables

### Backend Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PUTTSOLVER_SERVICE_URL` | PuttSolver service URL | `http://localhost:8081` |
| `AIME_TRANSFORM_MODE` | Transform mode (mock/real) | `mock` |

### Server Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `NOTION_TOKEN` | Notion API token | Yes |
| `NOTION_PROJECTS_DATABASE_ID` | Projects database ID | Yes |
| `NOTION_SESSIONS_DATABASE_ID` | Sessions database ID | Yes |
| `PORT` | Server port | No (3001) |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |

### Frontend Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |

---

## Running the Services

### Development Setup

```bash
# Install dependencies
npm install
pip install -r backend/requirements.txt
pip install -r putt-solver-service/requirements.txt

# Start frontend (Vite)
npm run dev

# Start Express server
npm run server

# Start AIME Backend
cd backend && uvicorn main:app --reload --port 8000

# Start PuttSolver Service
cd putt-solver-service && uvicorn main:app --reload --port 8081
```

### Production

The application is configured for Vercel deployment. See `DEPLOYMENT_GUIDE.md` for details.

---

## Rate Limiting

The Express server implements rate limiting:
- **Window:** 15 minutes
- **Max Requests:** 100 per IP per window

---

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable
