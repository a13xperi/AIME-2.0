# Agent Alex - Component Reference

> Detailed documentation for all React components with props, examples, and usage patterns.

## Table of Contents

- [Core Components](#core-components)
  - [App](#app)
  - [Dashboard](#dashboard)
  - [ErrorBoundary](#errorboundary)
- [Project Components](#project-components)
  - [ProjectsList](#projectslist)
  - [ProjectDetail](#projectdetail)
  - [ProjectCreator](#projectcreator)
  - [ProjectTemplates](#projecttemplates)
- [Session Components](#session-components)
  - [SessionsList](#sessionslist)
  - [SessionDetail](#sessiondetail)
  - [SessionLogger](#sessionlogger)
  - [SessionCard](#sessioncard)
  - [SessionTimer](#sessiontimer)
  - [SessionTemplates](#sessiontemplates)
  - [SessionDuplicator](#sessionduplicator)
- [Status Components](#status-components)
  - [SessionStatusBadge](#sessionstatusbadge)
  - [SessionStatusFilter](#sessionstatusfilter)
  - [SessionStatusManager](#sessionstatusmanager)
- [Analytics & Productivity](#analytics--productivity)
  - [AnalyticsDashboard](#analyticsdashboard)
  - [ProductivityInsights](#productivityinsights)
  - [SmartRecommendations](#smartrecommendations)
  - [ReportGenerator](#reportgenerator)
  - [DataExport](#dataexport)
- [Time Management](#time-management)
  - [TimeTracker](#timetracker)
  - [IntervalTracker](#intervaltracker)
  - [BreakReminder](#breakreminder)
  - [DailySummary](#dailysummary)
- [Project Management](#project-management)
  - [ProjectBacklog](#projectbacklog)
  - [ProjectDependencies](#projectdependencies)
  - [ProjectMilestones](#projectmilestones)
  - [ProjectHealth](#projecthealth)
  - [ProjectHandoff](#projecthandoff)
- [Collaboration](#collaboration)
  - [TeamCollaboration](#teamcollaboration)
  - [IntegrationManagement](#integrationmanagement)
  - [WorkflowAutomation](#workflowautomation)
- [Utility Components](#utility-components)
  - [QuickResume](#quickresume)
  - [NotificationSystem](#notificationsystem)
  - [TemplateBuilder](#templatebuilder)
  - [OfflineMode](#offlinemode)
- [Domain-Specific](#domain-specific)
  - [PuttSolverDemo](#puttsolverdemo)
  - [CustomerCRM](#customercrm)

---

## Core Components

### App

The root application component that sets up routing.

**Location:** `src/App.tsx`

**Description:**  
Main entry point that configures React Router and renders the application layout.

**Routes:**

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Dashboard | Main dashboard |
| `/projects` | ProjectsList | All projects view |
| `/sessions` | SessionsList | All sessions view |
| `/analytics` | AnalyticsDashboard | Analytics page |
| `/team` | TeamCollaboration | Team features |
| `/project/:id` | ProjectDetail | Single project |
| `/session/:id` | SessionDetail | Single session |

**Example:**

```tsx
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

---

### Dashboard

The main dashboard view displaying projects, sessions, and statistics.

**Location:** `src/components/Dashboard/Dashboard.tsx`

**State Management:**

| State | Type | Description |
|-------|------|-------------|
| `projects` | Project[] | Loaded projects |
| `stats` | DashboardStats | Dashboard statistics |
| `categories` | CategoryStats[] | Category breakdown |
| `loading` | boolean | Loading state |
| `error` | string \| null | Error message |
| `isOffline` | boolean | Offline mode |
| `currentSessions` | Session[] | Today's sessions |
| `allSessions` | Session[] | All sessions |

**Features:**

1. **Statistics Cards** - Clickable cards showing:
   - Total projects (active count)
   - Work sessions (with deliverables)
   - Time logged (average per session)
   - Technologies used

2. **Current Sessions** - Today's active work:
   - Session title and metadata
   - Quick actions (View, Update, Timer)

3. **Quick Actions** - Dashboard buttons:
   - New Project
   - Log Session
   - Templates
   - Analytics
   - Team
   - Daily Summary

4. **Categories Section** - Work distribution by project type

5. **Projects Grid** - All projects with status badges

**Auto-refresh:**  
Refreshes data every 30 seconds.

**Example Usage:**

```tsx
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
```

---

### ErrorBoundary

Global error boundary to catch and display React errors gracefully.

**Location:** `src/components/ErrorBoundary/ErrorBoundary.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | ReactNode | Yes | - | Child components to wrap |

**State:**

| State | Type | Description |
|-------|------|-------------|
| `hasError` | boolean | Error caught flag |
| `error` | Error \| null | The caught error |
| `errorInfo` | ErrorInfo \| null | React error info |

**Methods:**

| Method | Description |
|--------|-------------|
| `getDerivedStateFromError` | Updates state when error occurs |
| `componentDidCatch` | Logs error to external service |
| `handleReset` | Resets error state |

**Example:**

```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Dashboard />
      </Router>
    </ErrorBoundary>
  );
}
```

**Error Display:**
- User-friendly error message
- Stack trace in development mode
- "Try Again" button to reset
- "Go to Dashboard" navigation

---

## Project Components

### ProjectsList

Full list view of all projects with filtering.

**Location:** `src/components/ProjectsList/ProjectsList.tsx`

**State:**

| State | Type | Description |
|-------|------|-------------|
| `projects` | Project[] | All projects |
| `loading` | boolean | Loading state |
| `error` | string \| null | Error message |
| `filterStatus` | string | Current filter |

**Filter Options:**
- `all` - Show all projects
- `active` - Active projects only
- `complete` - Completed projects
- `paused` - Paused projects

**Features:**
- Status filter buttons with counts
- Clickable rows navigate to detail
- Shows status and priority badges
- Last updated date display

**Example:**

```tsx
<Route path="/projects" element={<ProjectsList />} />
```

---

### ProjectDetail

Detailed view of a single project.

**Location:** `src/components/ProjectDetail/ProjectDetail.tsx`

**URL Parameters:**
- `id` - Project ID from URL

**Features:**
- Full project information
- Related sessions list
- Status and priority display
- Tech stack badges
- Quick actions

---

### ProjectCreator

Modal form for creating new projects.

**Location:** `src/components/ProjectCreator/ProjectCreator.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Modal visibility |
| `onClose` | () => void | Yes | Close callback |
| `onSuccess` | () => void | Yes | Success callback |

**Form Fields:**

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `name` | text | Yes | - |
| `description` | textarea | No | - |
| `status` | select | Yes | Active, Paused, Complete, Archived |
| `priority` | select | Yes | Critical, High, Medium, Low |
| `type` | select | Yes | Web Application, Mobile App, API/Backend, etc. |
| `workspace` | text | No | - |
| `repository` | url | No | - |
| `currentContext` | textarea | No | - |
| `nextSteps` | textarea | No | - |
| `techStack` | text | No | Comma-separated |

**Example:**

```tsx
import ProjectCreator from './components/ProjectCreator/ProjectCreator';

function ParentComponent() {
  const [showCreator, setShowCreator] = useState(false);

  return (
    <>
      <button onClick={() => setShowCreator(true)}>
        + New Project
      </button>
      <ProjectCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onSuccess={() => {
          setShowCreator(false);
          refreshProjects();
        }}
      />
    </>
  );
}
```

---

### ProjectTemplates

Modal for selecting and applying project templates.

**Location:** `src/components/ProjectTemplates/ProjectTemplates.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Modal visibility |
| `onClose` | () => void | Yes | Close callback |
| `onTemplateSelect` | (template) => void | Yes | Selection callback |
| `onApplyTemplate` | (template, projectData) => void | Yes | Apply callback |

**Template Structure:**

```typescript
interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  templateData: {
    projectName: string;
    description: string;
    phases: ProjectPhase[];
    defaultSessions: SessionTemplate[];
    checklist: ChecklistItem[];
  };
}
```

---

## Session Components

### SessionsList

Timeline view of all work sessions.

**Location:** `src/components/SessionsList/SessionsList.tsx`

**Features:**
- Chronological session list
- Filter by date range
- Search functionality
- Status badges
- Click to view details

---

### SessionDetail

Detailed view of a single session.

**Location:** `src/components/SessionDetail/SessionDetail.tsx`

**URL Parameters:**
- `id` - Session ID from URL

**Displays:**
- Session title and date
- Duration and status
- Summary and code changes
- Files modified
- Next steps and blockers
- Key decisions and learnings

---

### SessionLogger

Modal form for logging new work sessions.

**Location:** `src/components/SessionLogger/SessionLogger.tsx`

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | boolean | Yes | - | Modal visibility |
| `onClose` | () => void | Yes | - | Close callback |
| `onSuccess` | () => void | Yes | - | Success callback |
| `projects` | Project[] | Yes | - | Available projects |
| `preselectedProjectId` | string | No | - | Pre-selected project |

**Form Sections:**

1. **Core Information**
   - Project selection
   - Session title
   - Duration (minutes)
   - Session type
   - AI Agent used
   - Workspace used

2. **Session Details**
   - Summary
   - Files modified
   - Code changes

3. **Next Steps & Issues**
   - Next steps
   - Blockers

4. **Additional Context** (collapsible)
   - Key decisions
   - Challenges
   - Solutions
   - Outcomes
   - Learnings

**Example:**

```tsx
<SessionLogger
  isOpen={showSessionLogger}
  onClose={() => setShowSessionLogger(false)}
  onSuccess={() => {
    loadDashboard();
  }}
  projects={projects}
  preselectedProjectId="project-123"
/>
```

---

### SessionCard

Card component for displaying session summary.

**Location:** `src/components/SessionCard/SessionCard.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `session` | Session | Yes | Session data |
| `onClick` | () => void | No | Click handler |

---

### SessionTimer

Timer component for tracking session duration.

**Location:** `src/components/SessionTimer/SessionTimer.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `session` | Session | Yes | Session to track |
| `onSessionUpdate` | (id: string, updates: Partial<Session>) => void | Yes | Update callback |
| `onClose` | () => void | Yes | Close callback |

**Features:**
- Start/pause/resume timer
- Duration tracking
- Auto-save progress

**Example:**

```tsx
<SessionTimer
  session={activeSession}
  onSessionUpdate={(id, updates) => {
    setAllSessions(prev => 
      prev.map(s => s.id === id ? {...s, ...updates} : s)
    );
  }}
  onClose={() => setSessionToTrack(null)}
/>
```

---

### SessionTemplates

Template selector for session logging.

**Location:** `src/components/SessionTemplates/SessionTemplates.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSelectTemplate` | (template: SessionTemplate) => void | Yes | Selection callback |
| `onClose` | () => void | Yes | Close callback |

**SessionTemplate Interface:**

```typescript
interface SessionTemplate {
  id: string;
  name: string;
  type: SessionType;
  defaultFields: {
    aiAgent?: string;
    workspace?: string;
    summary?: string;
    nextSteps?: string;
  };
}
```

---

### SessionDuplicator

Component for duplicating existing sessions.

**Location:** `src/components/SessionDuplicator/SessionDuplicator.tsx`

**Features:**
- Copy session data
- Modify before creating
- Quick session creation

---

## Status Components

### SessionStatusBadge

Badge component displaying session status.

**Location:** `src/components/SessionStatusBadge/SessionStatusBadge.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `status` | SessionStatus | Yes | Status to display |

**Status Colors:**
- `In Progress` - Blue
- `Completed` - Green
- `Paused` - Yellow
- `Blocked` - Red
- `Archived` - Gray

**Example:**

```tsx
<SessionStatusBadge status="Completed" />
```

---

### SessionStatusFilter

Filter component for session status.

**Location:** `src/components/SessionStatusFilter/SessionStatusFilter.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectedStatuses` | SessionStatus[] | Yes | Selected statuses |
| `onChange` | (statuses: SessionStatus[]) => void | Yes | Change callback |

---

### SessionStatusManager

Component for managing and updating session status.

**Location:** `src/components/SessionStatusManager/SessionStatusManager.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `session` | Session | Yes | Session to manage |
| `onStatusChange` | (status: SessionStatus) => void | Yes | Status change callback |

---

## Analytics & Productivity

### AnalyticsDashboard

Analytics and reporting dashboard.

**Location:** `src/components/AnalyticsDashboard/AnalyticsDashboard.tsx`

**Features:**
- Time tracking charts
- Project progress
- Productivity metrics
- Session statistics

**Example:**

```tsx
<Route path="/analytics" element={<AnalyticsDashboard />} />
```

---

### ProductivityInsights

Component displaying productivity metrics and insights.

**Location:** `src/components/ProductivityInsights/ProductivityInsights.tsx`

**Features:**
- Work pattern analysis
- Peak productivity hours
- Session duration trends

---

### SmartRecommendations

AI-powered recommendations for productivity.

**Location:** `src/components/SmartRecommendations/SmartRecommendations.tsx`

**Features:**
- Suggested next actions
- Break reminders
- Focus time recommendations

---

### ReportGenerator

Component for generating reports.

**Location:** `src/components/ReportGenerator/ReportGenerator.tsx`

**Features:**
- Custom date ranges
- Multiple report formats
- Export options

---

### DataExport

Component for exporting data.

**Location:** `src/components/DataExport/DataExport.tsx`

**Features:**
- Export formats (CSV, JSON, PDF)
- Data selection
- Download functionality

---

## Time Management

### TimeTracker

Real-time time tracking component.

**Location:** `src/components/TimeTracker/TimeTracker.tsx`

**Features:**
- Start/stop tracking
- Duration display
- Project association

---

### IntervalTracker

Pomodoro-style interval tracking.

**Location:** `src/components/IntervalTracker/IntervalTracker.tsx`

**Features:**
- Work intervals
- Break reminders
- Progress tracking

---

### BreakReminder

Notification for taking breaks.

**Location:** `src/components/BreakReminder/BreakReminder.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isVisible` | boolean | Yes | Visibility state |
| `onClose` | () => void | Yes | Close callback |
| `onTakeBreak` | () => void | Yes | Break callback |
| `workDuration` | number | Yes | Minutes worked |

**Example:**

```tsx
<BreakReminder
  isVisible={showBreakReminder}
  onClose={() => setShowBreakReminder(false)}
  onTakeBreak={() => {
    pauseCurrentSession();
    setShowBreakReminder(false);
  }}
  workDuration={90}
/>
```

---

### DailySummary

Modal showing daily work summary.

**Location:** `src/components/DailySummary/DailySummary.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sessions` | Session[] | Yes | Sessions to summarize |
| `isVisible` | boolean | Yes | Visibility state |
| `onClose` | () => void | Yes | Close callback |

**Displays:**
- Total time worked
- Sessions completed
- Projects touched
- Key accomplishments

---

## Project Management

### ProjectBacklog

Backlog management for projects.

**Location:** `src/components/ProjectBacklog/ProjectBacklog.tsx`

**Features:**
- Backlog items list
- Priority ordering
- Status updates

---

### ProjectDependencies

Dependency visualization and management.

**Location:** `src/components/ProjectDependencies/ProjectDependencies.tsx`

**Features:**
- Dependency graph
- Blocking relationships
- Cross-project links

---

### ProjectMilestones

Milestone tracking for projects.

**Location:** `src/components/ProjectMilestones/ProjectMilestones.tsx`

**Features:**
- Milestone timeline
- Progress tracking
- Due date alerts

---

### ProjectHealth

Health indicators for projects.

**Location:** `src/components/ProjectHealth/ProjectHealth.tsx`

**Features:**
- Health score
- Risk indicators
- Status alerts

---

### ProjectHandoff

Handoff documentation for projects.

**Location:** `src/components/ProjectHandoff/ProjectHandoff.tsx`

**Features:**
- Context summary
- Pending tasks
- Documentation links

---

## Collaboration

### TeamCollaboration

Team collaboration features.

**Location:** `src/components/TeamCollaboration/TeamCollaboration.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projects` | Project[] | Yes | Available projects |
| `sessions` | Session[] | Yes | Available sessions |
| `currentUserId` | string | Yes | Current user ID |

**Features:**
- Team member list
- Shared projects
- Activity feed

---

### IntegrationManagement

External integration management.

**Location:** `src/components/IntegrationManagement/IntegrationManagement.tsx`

**Features:**
- Integration status
- Connection management
- Sync controls

---

### WorkflowAutomation

Workflow automation configuration.

**Location:** `src/components/WorkflowAutomation/WorkflowAutomation.tsx`

**Features:**
- Automation rules
- Trigger configuration
- Action setup

---

## Utility Components

### QuickResume

Modal for quickly resuming work on a project.

**Location:** `src/components/QuickResume/QuickResume.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `project` | Project | Yes | Project to resume |
| `lastSession` | Session | No | Last session context |
| `onClose` | () => void | Yes | Close callback |

**Displays:**
- Project status
- Last session summary
- Next steps
- Blockers
- Quick actions

**Example:**

```tsx
{resumeProject && (
  <QuickResume
    project={resumeProject}
    lastSession={resumeSession}
    onClose={() => {
      setResumeProject(null);
      setResumeSession(null);
    }}
  />
)}
```

---

### NotificationSystem

Notification management component.

**Location:** `src/components/NotificationSystem/NotificationSystem.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sessions` | Session[] | Yes | Sessions to monitor |
| `onSessionUpdate` | (id: string, updates: Partial<Session>) => void | Yes | Update callback |

**Features:**
- Session reminders
- Break notifications
- Status alerts

---

### TemplateBuilder

Component for creating custom templates.

**Location:** `src/components/TemplateBuilder/TemplateBuilder.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Modal visibility |
| `onClose` | () => void | Yes | Close callback |
| `onSave` | (template: ProjectTemplate) => void | Yes | Save callback |

**Features:**
- Template name/description
- Phase configuration
- Checklist builder
- Default session setup

---

### OfflineMode

Display when API is unavailable.

**Location:** `src/components/OfflineMode/OfflineMode.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onRetry` | () => void | Yes | Retry callback |
| `error` | string | No | Error message |

**Example:**

```tsx
if (isOffline) {
  return (
    <OfflineMode
      onRetry={handleRetry}
      error={error}
    />
  );
}
```

---

## Domain-Specific

### PuttSolverDemo

Demo component for the PuttSolver API.

**Location:** `src/components/PuttSolverDemo/PuttSolverDemo.tsx`

**State:**

| State | Type | Description |
|-------|------|-------------|
| `courseId` | string | Selected course |
| `holeId` | number | Hole number |
| `ballLat`, `ballLon` | number | Ball position |
| `cupLat`, `cupLon` | number | Cup position |
| `stimp` | number | Stimpmeter reading |
| `loading` | boolean | Loading state |
| `result` | SolvePuttResult | Solver result |
| `error` | string | Error message |

**Form Inputs:**
- Course ID
- Hole ID (1-18)
- Ball latitude/longitude
- Cup latitude/longitude
- Stimp rating (6.0-15.0)

**Example:**

```tsx
import PuttSolverDemo from './components/PuttSolverDemo/PuttSolverDemo';

<PuttSolverDemo />
```

---

### CustomerCRM

Customer relationship management component.

**Location:** `src/components/CustomerCRM/CustomerCRM.tsx`

**Status:** Currently disabled (`.tsx.disabled`)

**Features:**
- Customer list
- Contact management
- Deal tracking
- Pipeline view

---

## Component Patterns

### Modal Pattern

Most modal components follow this pattern:

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modal Title</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {/* Content */}
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};
```

### List Pattern

List components follow this pattern:

```tsx
const ListComponent: React.FC = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.status === filter);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="list-container">
      <FilterBar filter={filter} onChange={setFilter} />
      <div className="list-grid">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
```

### Form Pattern

Form components follow this pattern:

```tsx
const FormComponent: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        name="field1"
        value={formData.field1}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

---

## Styling

All components have corresponding CSS files:

```
src/components/
  ComponentName/
    ComponentName.tsx
    ComponentName.css
```

CSS classes follow the pattern: `component-name-element`

Example:

```css
.dashboard {
  /* Container styles */
}

.dashboard-header {
  /* Header styles */
}

.dashboard-stats {
  /* Stats section styles */
}

.stat-card {
  /* Individual stat card */
}
```
