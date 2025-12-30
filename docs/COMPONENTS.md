## React Components Reference

This document lists **all exported React components** under `src/components/*` that form the app’s
public UI surface.

Conventions used by this codebase:

- Most components are `export default` React components.
- “Modal” components generally return `null` when not visible (`isOpen`/`isVisible` false).
- Routing is defined in `src/App.tsx` (page components have no props and are used as route elements).

---

## Pages (routed)

### `Dashboard` (`src/components/Dashboard/Dashboard.tsx`)

- **Props**: none (page)
- **Uses**: `fetchProjects`, `fetchDashboardStats`, `GET /api/sessions`, `GET /api/dashboard/categories`
- **Notable behavior**:
  - Auto-refreshes every 30 seconds
  - Falls back into “offline mode” UI on failures
  - Hosts many feature modals (session logger, project creator, templates, timers, etc.)

**Usage**

```tsx
import Dashboard from './components/Dashboard/Dashboard';

<Route path="/" element={<Dashboard />} />
```

### `ProjectsList` (`src/components/ProjectsList/ProjectsList.tsx`)

- **Props**: none (page)
- **Behavior**: fetches projects once; client-side filter by status.

```tsx
<Route path="/projects" element={<ProjectsList />} />
```

### `ProjectDetail` (`src/components/ProjectDetail/ProjectDetail.tsx`)

- **Props**: none (page; uses `useParams` id)
- **Calls**:
  - `GET /api/projects/:id`
  - `GET /api/sessions?projectId=<project.name>`
- **Uses**: `ProjectBacklog`, `SessionCard`, `QuickResume`

```tsx
<Route path="/project/:id" element={<ProjectDetail />} />
```

### `SessionsList` (`src/components/SessionsList/SessionsList.tsx`)

- **Props**: none (page)
- **Behavior**: auto-refresh every 30 seconds.

```tsx
<Route path="/sessions" element={<SessionsList />} />
```

### `SessionDetail` (`src/components/SessionDetail/SessionDetail.tsx`)

- **Props**: none (page; uses `useParams` id)
- **Calls**: `GET /api/sessions/:id`
- **Utilities inside component**:
  - `parseActionItems(text)` converts “Next Steps” text to a list
  - `parseBacklogItems(text)` converts “Blockers” text to a list

```tsx
<Route path="/session/:id" element={<SessionDetail />} />
```

### `AnalyticsDashboard` (`src/components/AnalyticsDashboard/AnalyticsDashboard.tsx`)

- **Props**: none (page)
- **Calls**:
  - `GET /api/sessions`
  - `GET /api/projects`
- **Note**: uses `VITE_API_URL || http://localhost:3002` (different default than most components).

```tsx
<Route path="/analytics" element={<AnalyticsDashboard />} />
```

### `TeamCollaboration` (`src/components/TeamCollaboration/TeamCollaboration.tsx`)

- **Props**:
  - `projects: Project[]`
  - `sessions: Session[]`
  - `currentUserId: string`
  - `onProjectUpdate?: (projectId, updates) => void`
  - `onSessionUpdate?: (sessionId, updates) => void`
- **Behavior**: currently uses mocked team members and comments.

```tsx
import TeamCollaboration from './components/TeamCollaboration/TeamCollaboration';

<TeamCollaboration projects={projects} sessions={sessions} currentUserId="me" />
```

### `CustomerCRM` (`src/components/CustomerCRM/CustomerCRM.tsx`)

- **Props**: none (page)
- **Behavior**: a large, mostly mocked CRM UI using many exported types.

---

## Layout / App infrastructure

### `ErrorBoundary` (`src/components/ErrorBoundary/ErrorBoundary.tsx`)

- **Props**: `{ children: ReactNode }`
- **Behavior**: logs errors via `logger.error`, shows a dev-only error stack, supports “Try Again”.

**Usage**

```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Display components

### `SessionCard` (`src/components/SessionCard/SessionCard.tsx`)

- **Props**:
  - `session: Session`
  - `detailed?: boolean` (default `false`)
- **Behavior**: collapsible/expandable, shows rich session fields when expanded.

```tsx
<SessionCard session={session} detailed />
```

### `SessionStatusBadge` (`src/components/SessionStatusBadge/SessionStatusBadge.tsx`)

- **Props**:
  - `status: SessionStatus`
  - `size?: 'small' | 'medium' | 'large'`
  - `showIcon?: boolean`
  - `showLabel?: boolean`
  - `onClick?: () => void`

```tsx
<SessionStatusBadge status="In Progress" size="small" />
```

### `SessionStatusFilter` (`src/components/SessionStatusFilter/SessionStatusFilter.tsx`)

- **Props**:
  - `selectedStatus: SessionStatus | 'All'`
  - `onStatusChange: (status) => void`
  - `sessionCounts?: Record<SessionStatus, number>`

```tsx
<SessionStatusFilter selectedStatus="All" onStatusChange={setStatus} sessionCounts={counts} />
```

---

## Modals & feature tools

### `QuickResume` (`src/components/QuickResume/QuickResume.tsx`)

- **Props**:
  - `project: Project`
  - `lastSession?: Session`
  - `onClose: () => void`
- **Behavior**:
  - Copies `project.workspace` to clipboard
  - Opens `project.repository`/`deploymentUrl` in new tabs when present

### `ProjectCreator` (`src/components/ProjectCreator/ProjectCreator.tsx`)

- **Props**:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onSuccess: () => void`
- **Calls**: `POST /api/projects`

```tsx
<ProjectCreator isOpen={open} onClose={() => setOpen(false)} onSuccess={refresh} />
```

### `SessionLogger` (`src/components/SessionLogger/SessionLogger.tsx`)

- **Props**:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onSuccess: () => void`
  - `projects: Project[]`
  - `preselectedProjectId?: string`
- **Calls**: `POST /api/sessions`
- **Uses**: `SessionTemplates` (template picker)

### `SessionTemplates` (`src/components/SessionTemplates/SessionTemplates.tsx`)

- **Exports**:
  - Default component `SessionTemplates`
  - Named type `SessionTemplate`
- **Props**:
  - `onSelectTemplate: (template: SessionTemplate) => void`
  - `onClose: () => void`

### `ProjectBacklog` (`src/components/ProjectBacklog/ProjectBacklog.tsx`)

- **Props**:
  - `project: Project`
- **Behavior**: parses `nextSteps` and `blockers` into list UI.

### `ProjectTemplates` (`src/components/ProjectTemplates/ProjectTemplates.tsx`)

- **Props**:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onTemplateSelect: (template: ProjectTemplate) => void`
  - `onApplyTemplate: (template: ProjectTemplate, projectData: Partial<Project>) => void`
- **Behavior**: ships with a set of default templates in-component.

### `TemplateBuilder` (`src/components/TemplateBuilder/TemplateBuilder.tsx`)

- **Props**:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onSave: (template: ProjectTemplate) => void`
  - `initialTemplate?: ProjectTemplate`

### `NotificationSystem` (`src/components/NotificationSystem/NotificationSystem.tsx`)

- **Props**:
  - `sessions: Session[]`
  - `onSessionUpdate?: (sessionId: string, updates: Partial<Session>) => void`
- **Behavior**:
  - Break reminders, session timeout alerts, daily summary notifications, weekly productivity checks
  - Includes user-tunable settings (intervals, toggles, quiet hours)

### `BreakReminder` (`src/components/BreakReminder/BreakReminder.tsx`)

- **Props**:
  - `isVisible: boolean`
  - `onClose: () => void`
  - `onTakeBreak: () => void`
  - `workDuration: number` (minutes)
- **Behavior**: 30-second countdown; auto-invokes `onTakeBreak()`.

### `DailySummary` (`src/components/DailySummary/DailySummary.tsx`)

- **Props**:
  - `sessions: Session[]`
  - `isVisible: boolean`
  - `onClose: () => void`
- **Behavior**: computes today-only stats and derived achievements/recommendations.

### `SessionTimer` (`src/components/SessionTimer/SessionTimer.tsx`)

- **Props**:
  - `session: Session`
  - `onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void`
  - `onClose: () => void`
- **Uses**: `TimeTracker`
- **Note**: includes a “pauseTracking” duration calculation that appears buggy (adds duration to itself).

### `TimeTracker` (`src/components/TimeTracker/TimeTracker.tsx`)

- **Props**:
  - `session: Session`
  - `onTimeUpdate: (sessionId: string, durationSeconds: number) => void`
  - `onClose: () => void`
  - `autoStart?: boolean`
- **Behavior**: tracks entries with start/end times; reports total seconds.

### `IntervalTracker` (`src/components/IntervalTracker/IntervalTracker.tsx`)

- **Props**:
  - `sessionId?: string`
  - `onIntervalComplete?: (interval) => void`
- **Behavior**: 30-minute timer with accomplishments list; computes productivity label.

### `SessionStatusManager` (`src/components/SessionStatusManager/SessionStatusManager.tsx`)

- **Props**:
  - `session: Session`
  - `onStatusChange: (sessionId: string, newStatus: SessionStatus) => void`
  - `onClose: () => void`

### `SessionDuplicator` (`src/components/SessionDuplicator/SessionDuplicator.tsx`)

- **Props**:
  - `session: Session`
  - `onDuplicate: (duplicatedSession: Partial<Session>) => void`
  - `onClose: () => void`
- **Behavior**: creates a new “In Progress” session draft based on an existing session.

### `OfflineMode` (`src/components/OfflineMode/OfflineMode.tsx`)

- **Props**:
  - `onRetry: () => void`
  - `error?: string`

### `ProjectHealth` (`src/components/ProjectHealth/ProjectHealth.tsx`)

- **Props**:
  - `project: Project`
  - `onClose: () => void`
- **Behavior**: uses mocked health/risk/alert data for UI.

### `ProjectDependencies` (`src/components/ProjectDependencies/ProjectDependencies.tsx`)

- **Props**:
  - `project: Project`
  - `allProjects: Project[]`
  - `onDependencyAdd: (dependencyWithoutIdAndCreatedAt) => void`
  - `onDependencyRemove: (dependencyId: string) => void`
  - `onClose: () => void`

### `ProjectMilestones` (`src/components/ProjectMilestones/ProjectMilestones.tsx`)

- **Props**:
  - `project: Project`
  - `onMilestoneAdd: (milestoneWithoutId) => void`
  - `onMilestoneUpdate: (milestoneId, updates) => void`
  - `onMilestoneDelete: (milestoneId) => void`
  - `onClose: () => void`

### `ProjectHandoff` (`src/components/ProjectHandoff/ProjectHandoff.tsx`)

- **Props**:
  - `project: Project`
  - `teamMembers: { id; name; email; role; avatar?; isOnline }[]`
  - `isVisible: boolean`
  - `onClose: () => void`
  - `onHandoff: (projectId, toUserId, handoffData) => void`

### `WorkflowAutomation` (`src/components/WorkflowAutomation/WorkflowAutomation.tsx`)

- **Props**:
  - `projects: Project[]`
  - `sessions: Session[]`
  - `onClose: () => void`
- **Behavior**: workflow/rules/templates UI backed by mock data.

### `SmartRecommendations` (`src/components/SmartRecommendations/SmartRecommendations.tsx`)

- **Props**:
  - `projects: Project[]`
  - `sessions: Session[]`
  - `onClose: () => void`
- **Behavior**: recommendations + smart suggestions UI backed by mock data.

### `IntegrationManagement` (`src/components/IntegrationManagement/IntegrationManagement.tsx`)

- **Props**:
  - `projects: Project[]`
  - `sessions: Session[]`
  - `onClose: () => void`
- **Behavior**: API endpoints/webhooks/integrations/keys/tests UI backed by mock data.

### `DataExport` (`src/components/DataExport/DataExport.tsx`)

- **Props**:
  - `projects: Project[]`
  - `sessions: Session[]`
  - `onClose: () => void`
- **Behavior**: exports selected data as CSV/JSON/TXT (PDF option emits TXT).

### `ReportGenerator` (`src/components/ReportGenerator/ReportGenerator.tsx`)

- **Props**:
  - `projects: Project[]`
  - `sessions: Session[]`
  - `onClose: () => void`
- **Behavior**: template-based report generation (mocked) with “download”.

### `ProductivityInsights` (`src/components/ProductivityInsights/ProductivityInsights.tsx`)

- **Props**:
  - `sessions: Session[]`
  - `projects: Project[]`
  - `timeRange: '7d' | '30d' | '90d' | '1y'`
- **Behavior**: computes derived scores and recommendations from session history.

---

## Demo components

### `PuttSolverDemo` (`src/components/PuttSolverDemo/PuttSolverDemo.tsx`)

- **Props**: none
- **Calls**: `POST /api/solve_putt` (AIME backend)
- **Usage**: embed it anywhere in the UI, typically behind a route or feature flag.

```tsx
import PuttSolverDemo from './components/PuttSolverDemo/PuttSolverDemo';

<PuttSolverDemo />
```
