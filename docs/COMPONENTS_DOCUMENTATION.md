# React Components Documentation

## Overview

This document provides comprehensive documentation for all React components in the Agent Alex application. Each component includes props, usage examples, and implementation details.

---

## Table of Contents

### Core Components
- [Dashboard](#dashboard)
- [App](#app)
- [ErrorBoundary](#errorboundary)

### Project Management
- [ProjectsList](#projectslist)
- [ProjectDetail](#projectdetail)
- [ProjectCreator](#projectcreator)
- [ProjectTemplates](#projecttemplates)
- [ProjectBacklog](#projectbacklog)
- [ProjectHealth](#projecthealth)
- [ProjectMilestones](#projectmilestones)
- [ProjectDependencies](#projectdependencies)
- [ProjectHandoff](#projecthandoff)

### Session Management
- [SessionsList](#sessionslist)
- [SessionDetail](#sessiondetail)
- [SessionLogger](#sessionlogger)
- [SessionCard](#sessioncard)
- [SessionTimer](#sessiontimer)
- [SessionStatusBadge](#sessionstatusbadge)
- [SessionStatusFilter](#sessionstatusfilter)
- [SessionStatusManager](#sessionstatusmanager)
- [SessionDuplicator](#sessionduplicator)
- [SessionTemplates](#sessiontemplates)

### Analytics & Insights
- [AnalyticsDashboard](#analyticsdashboard)
- [ProductivityInsights](#productivityinsights)
- [SmartRecommendations](#smartrecommendations)
- [DailySummary](#dailysummary)

### Collaboration & Tools
- [TeamCollaboration](#teamcollaboration)
- [CustomerCRM](#customercrm)
- [IntegrationManagement](#integrationmanagement)
- [WorkflowAutomation](#workflowautomation)
- [TemplateBuilder](#templatebuilder)

### Utilities
- [QuickResume](#quickresume)
- [TimeTracker](#timetracker)
- [IntervalTracker](#intervaltracker)
- [BreakReminder](#breakreminder)
- [NotificationSystem](#notificationsystem)
- [OfflineMode](#offlinemode)
- [DataExport](#dataexport)
- [ReportGenerator](#reportgenerator)

### Demos
- [PuttSolverDemo](#puttsolverdemo)

---

## Core Components

### Dashboard

Main dashboard component displaying projects, sessions, and statistics.

**Location:** `src/components/Dashboard/Dashboard.tsx`

**Props:**
```typescript
interface DashboardProps {
  // No props - uses internal state and API calls
}
```

**Features:**
- Displays project and session statistics
- Shows current working sessions
- Category breakdown view
- Quick actions for creating projects/sessions
- Auto-refresh every 30 seconds
- Offline mode support

**Usage:**
```tsx
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return <Dashboard />;
}
```

**State Management:**
- `projects: Project[]` - All projects
- `stats: DashboardStats` - Dashboard statistics
- `categories: CategoryStats[]` - Project categories
- `currentSessions: Session[]` - Today's sessions
- `loading: boolean` - Loading state
- `error: string | null` - Error state
- `isOffline: boolean` - Offline mode flag

**API Calls:**
- `GET /api/projects` - Fetch all projects
- `GET /api/dashboard/stats` - Fetch statistics
- `GET /api/dashboard/categories` - Fetch categories
- `GET /api/sessions` - Fetch all sessions

**Example:**
```tsx
<Dashboard />
```

---

### ErrorBoundary

React error boundary component for catching and handling errors gracefully.

**Location:** `src/components/ErrorBoundary/ErrorBoundary.tsx`

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
```

**Features:**
- Catches React component errors
- Displays error UI
- Provides error details
- Reset functionality

**Usage:**
```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**State:**
- `hasError: boolean` - Error flag
- `error: Error | null` - Error object
- `errorInfo: React.ErrorInfo | null` - Error details

---

## Project Management Components

### ProjectsList

Displays a list of all projects with filtering capabilities.

**Location:** `src/components/ProjectsList/ProjectsList.tsx`

**Props:**
```typescript
interface ProjectsListProps {
  // No props - uses router and internal state
}
```

**Features:**
- Lists all projects
- Filter by status (All, Active, Complete, Paused)
- Click to view project details
- Shows project metadata (status, priority, last updated)

**Usage:**
```tsx
import ProjectsList from './components/ProjectsList/ProjectsList';

<Route path="/projects" element={<ProjectsList />} />
```

**State:**
- `projects: Project[]` - All projects
- `filterStatus: string` - Current filter
- `loading: boolean` - Loading state
- `error: string | null` - Error state

**Example Filter:**
```tsx
// Filter by status
<button onClick={() => setFilterStatus('active')}>
  Active Projects
</button>
```

---

### ProjectCreator

Modal component for creating new projects.

**Location:** `src/components/ProjectCreator/ProjectCreator.tsx`

**Props:**
```typescript
interface ProjectCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Features:**
- Form for creating new projects
- Validation
- Integration with Notion
- Success/error handling

**Usage:**
```tsx
import ProjectCreator from './components/ProjectCreator/ProjectCreator';

const [isOpen, setIsOpen] = useState(false);

<ProjectCreator
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => {
    setIsOpen(false);
    refreshProjects();
  }}
/>
```

**Form Fields:**
- `name` (required) - Project name
- `description` - Project description
- `status` (required) - Active, Paused, Complete, Archived
- `priority` (required) - Critical, High, Medium, Low
- `type` - Project type
- `workspace` - Local workspace path
- `repository` - Git repository URL
- `currentContext` - Current context
- `nextSteps` - Next steps
- `techStack` - Technologies (comma-separated)

**API Call:**
- `POST /api/projects` - Create new project

---

### ProjectDetail

Detailed view of a single project.

**Location:** `src/components/ProjectDetail/ProjectDetail.tsx`

**Props:**
```typescript
interface ProjectDetailProps {
  // Uses route params for project ID
}
```

**Features:**
- Full project details
- Related sessions
- Edit capabilities
- Status management

**Usage:**
```tsx
<Route path="/project/:id" element={<ProjectDetail />} />
```

---

### ProjectTemplates

Component for managing and applying project templates.

**Location:** `src/components/ProjectTemplates/ProjectTemplates.tsx`

**Props:**
```typescript
interface ProjectTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ProjectTemplate) => void;
  onApplyTemplate: (template: ProjectTemplate, data: any) => void;
}
```

**Features:**
- Browse project templates
- Filter by category
- Preview templates
- Apply templates to create projects

**Usage:**
```tsx
import ProjectTemplates from './components/ProjectTemplates/ProjectTemplates';

<ProjectTemplates
  isOpen={showTemplates}
  onClose={() => setShowTemplates(false)}
  onTemplateSelect={(template) => console.log(template)}
  onApplyTemplate={(template, data) => createProject(data)}
/>
```

---

## Session Management Components

### SessionLogger

Modal form for logging new work sessions.

**Location:** `src/components/SessionLogger/SessionLogger.tsx`

**Props:**
```typescript
interface SessionLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projects: Project[];
  preselectedProjectId?: string;
}
```

**Features:**
- Comprehensive session logging form
- Project selection
- Session templates
- Optional fields (collapsible)
- Validation

**Usage:**
```tsx
import SessionLogger from './components/SessionLogger/SessionLogger';

<SessionLogger
  isOpen={showLogger}
  onClose={() => setShowLogger(false)}
  onSuccess={() => {
    setShowLogger(false);
    refreshData();
  }}
  projects={projects}
  preselectedProjectId={projectId}
/>
```

**Form Fields:**

**Core Information:**
- `projectId` (required) - Associated project
- `title` (required) - Session title
- `duration` (required) - Duration in minutes
- `sessionType` (required) - Feature Development, Bug Fix, Refactoring, Documentation, Planning, Testing, Deployment
- `aiAgent` (required) - Claude, GPT-4, Gemini, Multiple, None
- `workspace` (required) - Cursor, VS Code, Warp, Terminal, Other

**Session Details:**
- `summary` (required) - Brief summary
- `filesModified` - List of modified files
- `codeChanges` - Description of code changes

**Next Steps & Issues:**
- `nextSteps` - What needs to be done next
- `blockers` - Any blockers or challenges

**Optional Context:**
- `keyDecisions` - Important decisions made
- `challenges` - Challenges encountered
- `solutions` - Solutions implemented
- `outcomes` - What was the result
- `learnings` - What did you learn

**API Call:**
- `POST /api/sessions` - Create new session

**Example:**
```tsx
const projects = [
  { id: '1', name: 'Project A' },
  { id: '2', name: 'Project B' }
];

<SessionLogger
  isOpen={true}
  onClose={() => {}}
  onSuccess={() => alert('Session logged!')}
  projects={projects}
/>
```

---

### SessionsList

Displays a list of all sessions with filtering.

**Location:** `src/components/SessionsList/SessionsList.tsx`

**Features:**
- Timeline view of sessions
- Filter by project, status, type
- Search functionality
- Click to view details

**Usage:**
```tsx
<Route path="/sessions" element={<SessionsList />} />
```

---

### SessionCard

Card component for displaying session summary.

**Location:** `src/components/SessionCard/SessionCard.tsx`

**Props:**
```typescript
interface SessionCardProps {
  session: Session;
  onClick?: () => void;
}
```

**Features:**
- Compact session display
- Status badge
- Quick actions

**Usage:**
```tsx
import SessionCard from './components/SessionCard/SessionCard';

<SessionCard
  session={session}
  onClick={() => navigate(`/session/${session.id}`)}
/>
```

---

### SessionTimer

Timer component for tracking session duration in real-time.

**Location:** `src/components/SessionTimer/SessionTimer.tsx`

**Props:**
```typescript
interface SessionTimerProps {
  session: Session;
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
  onClose: () => void;
}
```

**Features:**
- Real-time timer
- Start/pause/stop
- Automatic duration tracking
- Updates session duration

**Usage:**
```tsx
import SessionTimer from './components/SessionTimer/SessionTimer';

<SessionTimer
  session={currentSession}
  onSessionUpdate={(id, updates) => updateSession(id, updates)}
  onClose={() => setShowTimer(false)}
/>
```

---

### SessionTemplates

Component for selecting predefined session templates.

**Location:** `src/components/SessionTemplates/SessionTemplates.tsx`

**Props:**
```typescript
interface SessionTemplatesProps {
  onSelectTemplate: (template: SessionTemplate) => void;
  onClose: () => void;
}

interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  type: SessionType;
  defaultFields: {
    aiAgent?: string;
    workspace?: string;
    summary?: string;
    nextSteps?: string;
  };
}
```

**Features:**
- Browse session templates
- Quick setup for common session types
- Predefined field values

**Usage:**
```tsx
import SessionTemplates from './components/SessionTemplates/SessionTemplates';

<SessionTemplates
  onSelectTemplate={(template) => {
    setFormData(prev => ({ ...prev, ...template.defaultFields }));
  }}
  onClose={() => setShowTemplates(false)}
/>
```

---

## Analytics & Insights Components

### AnalyticsDashboard

Comprehensive analytics and metrics dashboard.

**Location:** `src/components/AnalyticsDashboard/AnalyticsDashboard.tsx`

**Features:**
- Productivity metrics
- Time tracking analytics
- Project statistics
- Session distribution
- Technology usage
- Charts and visualizations

**Usage:**
```tsx
<Route path="/analytics" element={<AnalyticsDashboard />} />
```

---

### ProductivityInsights

AI-powered productivity insights and recommendations.

**Location:** `src/components/ProductivityInsights/ProductivityInsights.tsx`

**Features:**
- Work pattern analysis
- Productivity trends
- Recommendations
- Peak performance hours
- Session efficiency metrics

**Usage:**
```tsx
import ProductivityInsights from './components/ProductivityInsights/ProductivityInsights';

<ProductivityInsights sessions={sessions} />
```

---

### SmartRecommendations

AI-generated recommendations for workflow optimization.

**Location:** `src/components/SmartRecommendations/SmartRecommendations.tsx`

**Features:**
- Personalized recommendations
- Action items
- Optimization suggestions
- Learning insights

**Usage:**
```tsx
import SmartRecommendations from './components/SmartRecommendations/SmartRecommendations';

<SmartRecommendations 
  projects={projects}
  sessions={sessions}
/>
```

---

### DailySummary

Daily work summary and achievements.

**Location:** `src/components/DailySummary/DailySummary.tsx`

**Props:**
```typescript
interface DailySummaryProps {
  sessions: Session[];
  isVisible: boolean;
  onClose: () => void;
}
```

**Features:**
- Today's sessions summary
- Total time worked
- Files modified
- Achievements
- Next steps

**Usage:**
```tsx
import DailySummary from './components/DailySummary/DailySummary';

<DailySummary
  sessions={todaySessions}
  isVisible={showSummary}
  onClose={() => setShowSummary(false)}
/>
```

---

## Collaboration & Tools Components

### TeamCollaboration

Team collaboration and coordination features.

**Location:** `src/components/TeamCollaboration/TeamCollaboration.tsx`

**Features:**
- Team member management
- Activity feeds
- Shared projects
- Communication tools

**Usage:**
```tsx
<Route path="/team" element={<TeamCollaboration />} />
```

---

### CustomerCRM

Customer relationship management interface.

**Location:** `src/components/CustomerCRM/CustomerCRM.tsx`

**Features:**
- Customer database
- Contact management
- Sales pipeline
- Activity tracking
- Opportunities
- Support tickets

**Usage:**
```tsx
import CustomerCRM from './components/CustomerCRM/CustomerCRM';

<CustomerCRM />
```

---

### IntegrationManagement

Manage third-party integrations and API connections.

**Location:** `src/components/IntegrationManagement/IntegrationManagement.tsx`

**Features:**
- Integration list
- Connection status
- Configuration
- Sync settings
- Webhooks

**Usage:**
```tsx
<Route path="/integrations" element={<IntegrationManagement />} />
```

---

### WorkflowAutomation

Workflow automation and rule builder.

**Location:** `src/components/WorkflowAutomation/WorkflowAutomation.tsx`

**Features:**
- Visual workflow builder
- Trigger configuration
- Action setup
- Conditions
- Testing
- Execution history

**Usage:**
```tsx
<Route path="/workflows" element={<WorkflowAutomation />} />
```

---

### TemplateBuilder

Visual builder for creating custom project/session templates.

**Location:** `src/components/TemplateBuilder/TemplateBuilder.tsx`

**Props:**
```typescript
interface TemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: any) => void;
}
```

**Features:**
- Template creation
- Field configuration
- Preview
- Save and share

**Usage:**
```tsx
import TemplateBuilder from './components/TemplateBuilder/TemplateBuilder';

<TemplateBuilder
  isOpen={showBuilder}
  onClose={() => setShowBuilder(false)}
  onSave={(template) => saveTemplate(template)}
/>
```

---

## Utility Components

### QuickResume

Modal for quickly resuming work on a project.

**Location:** `src/components/QuickResume/QuickResume.tsx`

**Props:**
```typescript
interface QuickResumeProps {
  project: Project;
  lastSession?: Session;
  onClose: () => void;
}
```

**Features:**
- Project context summary
- Last session details
- Next steps
- Quick actions (log session, view details)

**Usage:**
```tsx
import QuickResume from './components/QuickResume/QuickResume';

<QuickResume
  project={selectedProject}
  lastSession={lastSession}
  onClose={() => setSelectedProject(null)}
/>
```

---

### TimeTracker

Time tracking component for sessions.

**Location:** `src/components/TimeTracker/TimeTracker.tsx`

**Features:**
- Manual time entry
- Start/stop timer
- Break tracking
- Time adjustments

**Usage:**
```tsx
import TimeTracker from './components/TimeTracker/TimeTracker';

<TimeTracker sessionId={session.id} />
```

---

### IntervalTracker

Pomodoro-style interval tracking.

**Location:** `src/components/IntervalTracker/IntervalTracker.tsx`

**Features:**
- Pomodoro timer
- Work/break intervals
- Customizable durations
- Statistics

**Usage:**
```tsx
import IntervalTracker from './components/IntervalTracker/IntervalTracker';

<IntervalTracker />
```

---

### BreakReminder

Reminder system for taking breaks.

**Location:** `src/components/BreakReminder/BreakReminder.tsx`

**Props:**
```typescript
interface BreakReminderProps {
  isVisible: boolean;
  onClose: () => void;
  onTakeBreak: () => void;
  workDuration: number;
}
```

**Features:**
- Break notifications
- Configurable intervals
- Break suggestions
- Skip or postpone

**Usage:**
```tsx
import BreakReminder from './components/BreakReminder/BreakReminder';

<BreakReminder
  isVisible={showReminder}
  onClose={() => setShowReminder(false)}
  onTakeBreak={() => pauseWork()}
  workDuration={90}
/>
```

---

### NotificationSystem

System-wide notification management.

**Location:** `src/components/NotificationSystem/NotificationSystem.tsx`

**Props:**
```typescript
interface NotificationSystemProps {
  sessions: Session[];
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
}
```

**Features:**
- Toast notifications
- Action notifications
- Dismissible alerts
- Queue management

**Usage:**
```tsx
import NotificationSystem from './components/NotificationSystem/NotificationSystem';

<NotificationSystem
  sessions={sessions}
  onSessionUpdate={handleUpdate}
/>
```

---

### OfflineMode

Offline mode indicator and management.

**Location:** `src/components/OfflineMode/OfflineMode.tsx`

**Props:**
```typescript
interface OfflineModeProps {
  onRetry: () => void;
  error?: string;
}
```

**Features:**
- Offline detection
- Retry functionality
- Error display
- Cached data access

**Usage:**
```tsx
import OfflineMode from './components/OfflineMode/OfflineMode';

{isOffline && (
  <OfflineMode
    onRetry={handleRetry}
    error={errorMessage}
  />
)}
```

---

### DataExport

Export data in various formats.

**Location:** `src/components/DataExport/DataExport.tsx`

**Features:**
- Export to CSV, JSON, PDF
- Date range selection
- Filter options
- Custom fields

**Usage:**
```tsx
import DataExport from './components/DataExport/DataExport';

<DataExport 
  data={sessions}
  type="sessions"
/>
```

---

### ReportGenerator

Generate custom reports from data.

**Location:** `src/components/ReportGenerator/ReportGenerator.tsx`

**Features:**
- Report templates
- Custom report builder
- Charts and visualizations
- Export options
- Scheduling

**Usage:**
```tsx
import ReportGenerator from './components/ReportGenerator/ReportGenerator';

<ReportGenerator 
  projects={projects}
  sessions={sessions}
/>
```

---

## Demo Components

### PuttSolverDemo

Demo component for testing the putt solver API.

**Location:** `src/components/PuttSolverDemo/PuttSolverDemo.tsx`

**Features:**
- Input form for putt parameters
- API testing
- Result visualization
- Example presets

**Usage:**
```tsx
import PuttSolverDemo from './components/PuttSolverDemo/PuttSolverDemo';

<Route path="/demo/putt-solver" element={<PuttSolverDemo />} />
```

**Form Fields:**
- `courseId` - Course identifier
- `holeId` - Hole number (1-18)
- `ballLat` - Ball latitude
- `ballLon` - Ball longitude
- `cupLat` - Cup latitude
- `cupLon` - Cup longitude
- `stimp` - Green speed (6.0-15.0)

**Example:**
```tsx
<PuttSolverDemo />
// User fills form and clicks "Solve putt"
// Results displayed showing aim angle and speed
```

---

## Common Patterns

### Modal Components

Many components follow a modal pattern:

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // ... other props
}

function ModalComponent({ isOpen, onClose, ...props }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal content */}
      </div>
    </div>
  );
}
```

### Loading States

Components typically handle loading states:

```tsx
if (loading) {
  return <div className="loading">Loading...</div>;
}

if (error) {
  return <div className="error">{error}</div>;
}
```

### Data Fetching

Components use the Notion API client:

```tsx
import { fetchProjects, fetchSessions } from '../api/notionApi';

useEffect(() => {
  async function loadData() {
    const response = await fetchProjects();
    if (response.success && response.data) {
      setProjects(response.data);
    }
  }
  loadData();
}, []);
```

---

## Styling

All components use CSS modules located in the same directory:

```
components/
  ComponentName/
    ComponentName.tsx
    ComponentName.css
```

**CSS Class Naming Convention:**
- Component root: `.component-name`
- Elements: `.component-name-element`
- Modifiers: `.component-name--modifier`

**Example:**
```css
.session-logger-modal {
  /* Modal styles */
}

.session-logger-form {
  /* Form styles */
}

.session-logger-header {
  /* Header styles */
}
```

---

## Type Safety

All components use TypeScript interfaces from `src/types/index.ts`:

```typescript
import { Project, Session, SessionType, ProjectStatus } from '../../types';
```

Common types:
- `Project` - Project data structure
- `Session` - Session data structure
- `ProjectStatus` - "Active" | "Paused" | "Complete" | "Archived"
- `SessionStatus` - "In Progress" | "Completed" | "Paused" | "Active" | "Blocked" | "Archived"
- `SessionType` - Session category types
- `ApiResponse<T>` - API response wrapper

---

## Testing

Components can be tested using React Testing Library:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SessionCard from './SessionCard';

test('displays session title', () => {
  const session = {
    id: '1',
    title: 'Test Session',
    // ... other fields
  };
  
  render(<SessionCard session={session} />);
  expect(screen.getByText('Test Session')).toBeInTheDocument();
});
```

---

## Best Practices

1. **Props Validation**: Always define TypeScript interfaces for props
2. **Error Handling**: Include loading and error states
3. **Accessibility**: Use semantic HTML and ARIA labels
4. **Performance**: Use React.memo for expensive components
5. **State Management**: Keep state as local as possible
6. **API Calls**: Use the centralized API client
7. **Styling**: Use CSS modules for scoped styles
8. **Testing**: Write tests for critical user flows

---

## Contributing

When adding new components:

1. Create component directory under `src/components/`
2. Create `.tsx` and `.css` files
3. Define TypeScript interfaces for props
4. Add JSDoc comments
5. Update this documentation
6. Add tests if applicable
7. Export from component directory

**Example Structure:**
```
src/components/
  NewComponent/
    NewComponent.tsx
    NewComponent.css
    __tests__/
      NewComponent.test.tsx
```

---

## Support

For component-specific questions:
- Check component source code and comments
- Review the [troubleshooting guide](../TROUBLESHOOTING.md)
- Check existing usage in other components
- Refer to the [API documentation](./API_DOCUMENTATION.md)
