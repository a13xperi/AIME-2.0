# Agent Alex - TypeScript Types Reference

> Complete reference for all TypeScript types, interfaces, and enums used in the application.

## Table of Contents

- [Core Types](#core-types)
- [Project Types](#project-types)
- [Session Types](#session-types)
- [Dashboard Types](#dashboard-types)
- [Filter Types](#filter-types)
- [API Types](#api-types)
- [Template Types](#template-types)
- [Project Management Types](#project-management-types)
- [Reporting Types](#reporting-types)
- [AI & Insights Types](#ai--insights-types)
- [Workflow Types](#workflow-types)
- [Integration Types](#integration-types)
- [Security Types](#security-types)
- [CRM Types](#crm-types)

---

## Core Types

### Status Enums

```typescript
/**
 * Project status options
 */
type ProjectStatus = 'Active' | 'Paused' | 'Complete' | 'Archived';

/**
 * Project priority levels
 */
type ProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';

/**
 * Session status options
 */
type SessionStatus =
  | 'In Progress'
  | 'Completed'
  | 'Paused'
  | 'Active'
  | 'Blocked'
  | 'Archived';

/**
 * Session type categories
 */
type SessionType =
  | 'Feature Development'
  | 'Bug Fix'
  | 'Refactoring'
  | 'Documentation'
  | 'Planning'
  | 'Testing'
  | 'Deployment';

/**
 * Project type categories
 */
type ProjectType =
  | 'Web Application'
  | 'Mobile App'
  | 'API/Backend'
  | 'Infrastructure'
  | 'Documentation'
  | 'Library/Package';
```

---

## Project Types

### Project

The main project interface representing a tracked project.

```typescript
interface Project {
  /** Unique identifier (Notion page ID) */
  id: string;
  
  /** Project name */
  name: string;
  
  /** Project description */
  description: string;
  
  /** Current status */
  status: ProjectStatus;
  
  /** Priority level */
  priority: ProjectPriority;
  
  /** Workspace/folder path */
  workspace: string;
  
  /** Project type/category */
  type: ProjectType;
  
  /** Date project was started */
  startedDate: string;
  
  /** Last modification date */
  lastUpdated: string;
  
  /** Current work context */
  currentContext: string;
  
  /** GitHub/Git repository URL */
  repository?: string;
  
  /** Local file system path */
  localPath?: string;
  
  /** Production deployment URL */
  deploymentUrl?: string;
  
  /** Number of backlog items */
  backlogItems: number;
  
  /** Current status notes */
  statusNotes: string;
  
  /** Planned next steps */
  nextSteps: string;
  
  /** Current blockers */
  blockers: string;
  
  /** Technologies used */
  techStack: string[];
  
  /** Project tags */
  tags: string[];
  
  /** Related session IDs */
  relatedSessions?: string[];
}
```

**Example:**

```typescript
const project: Project = {
  id: 'abc123',
  name: 'Agent Alex',
  description: 'AI-powered work session tracker',
  status: 'Active',
  priority: 'High',
  workspace: '/projects/agent-alex',
  type: 'Web Application',
  startedDate: '2024-01-01',
  lastUpdated: '2024-01-15',
  currentContext: 'Working on documentation',
  repository: 'https://github.com/user/agent-alex',
  backlogItems: 5,
  statusNotes: 'On track',
  nextSteps: 'Complete API documentation',
  blockers: '',
  techStack: ['React', 'TypeScript', 'Node.js'],
  tags: ['frontend', 'productivity']
};
```

---

### ProjectContext

Context snapshot for resuming work on a project.

```typescript
interface ProjectContext {
  /** Project ID */
  projectId: string;
  
  /** Project name */
  projectName: string;
  
  /** Current status description */
  currentStatus: string;
  
  /** Most recent session */
  lastSession: Session;
  
  /** Planned next steps */
  nextSteps: string[];
  
  /** Current blockers */
  blockers: string[];
  
  /** Files currently being worked on */
  filesInProgress: string[];
  
  /** Local path */
  localPath?: string;
  
  /** Repository URL */
  repository?: string;
  
  /** Deployment URL */
  deploymentUrl?: string;
}
```

---

## Session Types

### Session

Work session interface for tracking development sessions.

```typescript
interface Session {
  /** Unique identifier */
  id: string;
  
  /** Session title */
  title: string;
  
  /** Session date (ISO format) */
  date: string;
  
  /** Duration in minutes */
  duration: number;
  
  /** Associated project ID */
  projectId: string;
  
  /** Project name (derived) */
  projectName?: string;
  
  /** Session status */
  status: SessionStatus;
  
  /** Session summary */
  summary: string;
  
  /** Files modified during session */
  filesModified: string;
  
  /** Planned next steps */
  nextSteps: string;
  
  /** Current blockers */
  blockers: string;
  
  /** AI agent used */
  aiAgent: string;
  
  /** Development workspace/IDE */
  workspace: string;
  
  /** Type of work performed */
  type: SessionType;
  
  /** Session tags */
  tags: string[];

  // Extended fields
  
  /** Key decisions made */
  keyDecisions?: string;
  
  /** Challenges encountered */
  challenges?: string;
  
  /** Solutions implemented */
  solutions?: string;
  
  /** Code changes made */
  codeChanges?: string;
  
  /** Technologies used */
  technologiesUsed?: string[];
  
  /** Reference links */
  links?: string;
  
  /** Additional notes */
  notes?: string;
  
  /** Session outcomes */
  outcomes?: string;
  
  /** Learnings from session */
  learnings?: string;
  
  /** Context information */
  context?: string;
  
  /** Tools used */
  toolsUsed?: string;
}
```

**Example:**

```typescript
const session: Session = {
  id: 'session-123',
  title: 'Implemented authentication',
  date: '2024-01-15',
  duration: 120,
  projectId: 'project-abc',
  projectName: 'Agent Alex',
  status: 'Completed',
  summary: 'Added OAuth2 authentication with Google provider',
  filesModified: 'auth.ts, Login.tsx, api.ts',
  nextSteps: 'Add additional OAuth providers',
  blockers: '',
  aiAgent: 'Claude',
  workspace: 'Cursor',
  type: 'Feature Development',
  tags: ['auth', 'security'],
  keyDecisions: 'Used NextAuth for OAuth handling',
  challenges: 'CORS issues with redirect',
  solutions: 'Configured proper callback URLs',
  codeChanges: 'New auth module with 500 lines',
  technologiesUsed: ['NextAuth', 'OAuth2'],
  outcomes: 'Working Google sign-in',
  learnings: 'OAuth state management patterns'
};
```

---

## Dashboard Types

### DashboardStats

Dashboard statistics interface.

```typescript
interface DashboardStats {
  /** Total number of projects */
  totalProjects: number;
  
  /** Number of active projects */
  activeProjects: number;
  
  /** Number of completed projects */
  completedProjects?: number;
  
  /** Total number of sessions */
  totalSessions: number;
  
  /** Total hours logged */
  totalHours: number;
  
  /** Sessions this week */
  thisWeekSessions?: number;
  
  /** Hours this week */
  thisWeekHours?: number;
  
  /** Sessions with deliverables */
  completedSessions?: number;
  
  /** Unique technologies count */
  technologiesCount?: number;
  
  /** Sessions with file changes */
  sessionsWithFiles?: number;
}
```

### CategoryStats

Statistics grouped by category.

```typescript
interface CategoryStats {
  /** Category name */
  name: string;
  
  /** Number of projects in category */
  projectCount: number;
  
  /** Active projects in category */
  activeProjects: number;
  
  /** Sessions in category */
  sessionCount: number;
  
  /** Total hours in category */
  totalHours: number;
}
```

---

## Filter Types

### ProjectFilters

Filter options for project lists.

```typescript
interface ProjectFilters {
  /** Filter by status */
  status?: ProjectStatus[];
  
  /** Filter by priority */
  priority?: ProjectPriority[];
  
  /** Filter by workspace */
  workspace?: string[];
  
  /** Filter by project type */
  type?: ProjectType[];
  
  /** Filter by tags */
  tags?: string[];
  
  /** Search text */
  search?: string;
}
```

**Example:**

```typescript
const filters: ProjectFilters = {
  status: ['Active', 'Paused'],
  priority: ['High', 'Critical'],
  type: ['Web Application'],
  search: 'authentication'
};
```

### SessionFilters

Filter options for session lists.

```typescript
interface SessionFilters {
  /** Filter by project ID */
  projectId?: string;
  
  /** Filter by status */
  status?: SessionStatus[];
  
  /** Filter by session type */
  type?: SessionType[];
  
  /** Filter by date range */
  dateRange?: {
    start: string;
    end: string;
  };
  
  /** Search text */
  search?: string;
}
```

---

## API Types

### ApiResponse

Generic API response wrapper.

```typescript
interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  
  /** Response data (if successful) */
  data?: T;
  
  /** Error message (if failed) */
  error?: string;
  
  /** Success message */
  message?: string;
}
```

**Example:**

```typescript
// Success response
const successResponse: ApiResponse<Project[]> = {
  success: true,
  data: [project1, project2],
  message: 'Projects loaded successfully'
};

// Error response
const errorResponse: ApiResponse<Project[]> = {
  success: false,
  error: 'Failed to fetch projects'
};
```

### NotionDatabaseSchema

Notion database configuration.

```typescript
interface NotionDatabaseSchema {
  /** Projects database ID */
  projectsDatabase: string;
  
  /** Sessions database ID */
  sessionsDatabase: string;
}
```

---

## Template Types

### ProjectTemplate

Project template structure.

```typescript
interface ProjectTemplate {
  /** Unique template ID */
  id: string;
  
  /** Template name */
  name: string;
  
  /** Template description */
  description: string;
  
  /** Template category */
  category: string;
  
  /** Template tags */
  tags: string[];
  
  /** Whether this is a default template */
  isDefault: boolean;
  
  /** Whether template is public */
  isPublic: boolean;
  
  /** Creator user ID */
  createdBy: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Template data */
  templateData: {
    projectName: string;
    description: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
    estimatedDuration: number;
    phases: ProjectPhase[];
    defaultSessions: SessionTemplate[];
    checklist: ChecklistItem[];
    resources: Resource[];
  };
}
```

### ProjectPhase

Phase definition within a project template.

```typescript
interface ProjectPhase {
  /** Phase ID */
  id: string;
  
  /** Phase name */
  name: string;
  
  /** Phase description */
  description: string;
  
  /** Order in sequence */
  order: number;
  
  /** Estimated duration in hours */
  estimatedDuration: number;
  
  /** Dependent phase IDs */
  dependencies: string[];
  
  /** Expected deliverables */
  deliverables: string[];
  
  /** Phase checklist */
  checklist: ChecklistItem[];
}
```

### SessionTemplate

Session template structure.

```typescript
interface SessionTemplate {
  /** Template ID */
  id: string;
  
  /** Template name */
  name: string;
  
  /** Template description */
  description: string;
  
  /** Session type */
  type: SessionType;
  
  /** Estimated duration in minutes */
  estimatedDuration: number;
  
  /** Session objectives */
  objectives: string[];
  
  /** Expected deliverables */
  deliverables: string[];
  
  /** Session checklist */
  checklist: ChecklistItem[];
}
```

### ChecklistItem

Checklist item structure.

```typescript
interface ChecklistItem {
  /** Item ID */
  id: string;
  
  /** Item title */
  title: string;
  
  /** Item description */
  description?: string;
  
  /** Whether required */
  isRequired: boolean;
  
  /** Order in list */
  order: number;
  
  /** Category grouping */
  category?: string;
}
```

### Resource

Resource reference structure.

```typescript
interface Resource {
  /** Resource ID */
  id: string;
  
  /** Resource name */
  name: string;
  
  /** Resource type */
  type: 'Document' | 'Link' | 'Tool' | 'Reference';
  
  /** Resource URL */
  url?: string;
  
  /** Resource description */
  description: string;
  
  /** Resource category */
  category: string;
}
```

---

## Project Management Types

### ProjectDependency

Project dependency relationship.

```typescript
interface ProjectDependency {
  /** Dependency ID */
  id: string;
  
  /** Source project ID */
  projectId: string;
  
  /** Target project ID */
  dependsOnProjectId: string;
  
  /** Type of dependency */
  dependencyType: 'blocks' | 'enables' | 'relates';
  
  /** Description */
  description?: string;
  
  /** Creation timestamp */
  createdAt: string;
}
```

### ProjectMilestone

Milestone tracking structure.

```typescript
interface ProjectMilestone {
  /** Milestone ID */
  id: string;
  
  /** Associated project ID */
  projectId: string;
  
  /** Milestone name */
  name: string;
  
  /** Milestone description */
  description: string;
  
  /** Target completion date */
  targetDate: string;
  
  /** Actual completion date */
  completedDate?: string;
  
  /** Current status */
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  /** Expected deliverables */
  deliverables: string[];
  
  /** Dependent milestone IDs */
  dependencies: string[];
  
  /** Completion percentage (0-100) */
  progress: number;
}
```

### ProjectHealth

Project health metrics.

```typescript
interface ProjectHealth {
  /** Project ID */
  projectId: string;
  
  /** Overall health score (0-100) */
  overallScore: number;
  
  /** Health indicators */
  indicators: {
    onTime: number;
    onBudget: number;
    quality: number;
    teamSatisfaction: number;
    stakeholderSatisfaction: number;
  };
  
  /** Project risks */
  risks: ProjectRisk[];
  
  /** Project alerts */
  alerts: ProjectAlert[];
  
  /** Last update timestamp */
  lastUpdated: string;
}
```

### ProjectRisk

Risk assessment structure.

```typescript
interface ProjectRisk {
  /** Risk ID */
  id: string;
  
  /** Risk title */
  title: string;
  
  /** Risk description */
  description: string;
  
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Probability (0-100) */
  probability: number;
  
  /** Impact (0-100) */
  impact: number;
  
  /** Mitigation strategy */
  mitigation: string;
  
  /** Risk owner */
  owner: string;
  
  /** Risk status */
  status: 'identified' | 'monitoring' | 'mitigating' | 'resolved';
}
```

### ProjectAlert

Project alert structure.

```typescript
interface ProjectAlert {
  /** Alert ID */
  id: string;
  
  /** Alert type */
  type: 'deadline' | 'budget' | 'quality' | 'resource' | 'dependency';
  
  /** Severity level */
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  /** Alert title */
  title: string;
  
  /** Alert message */
  message: string;
  
  /** Alert timestamp */
  timestamp: string;
  
  /** Whether acknowledged */
  acknowledged: boolean;
  
  /** Whether action is required */
  actionRequired: boolean;
}
```

---

## AI & Insights Types

### AIInsight

AI-generated insight structure.

```typescript
interface AIInsight {
  /** Insight ID */
  id: string;
  
  /** Insight type */
  type: 'productivity' | 'efficiency' | 'pattern' | 'recommendation' | 'prediction' | 'optimization';
  
  /** Category */
  category: 'workflow' | 'time_management' | 'project_management' | 'collaboration' | 'learning';
  
  /** Insight title */
  title: string;
  
  /** Insight description */
  description: string;
  
  /** Confidence score (0-100) */
  confidence: number;
  
  /** Impact level */
  impact: 'low' | 'medium' | 'high' | 'critical';
  
  /** Whether actionable */
  actionable: boolean;
  
  /** Supporting data */
  data: {
    metrics: Record<string, number>;
    trends: TrendData[];
    comparisons: ComparisonData[];
  };
  
  /** Related recommendations */
  recommendations: AIRecommendation[];
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Expiration timestamp */
  expiresAt?: string;
  
  /** Whether acknowledged by user */
  acknowledged: boolean;
  
  /** Whether applied */
  applied: boolean;
}
```

### AIRecommendation

AI recommendation structure.

```typescript
interface AIRecommendation {
  /** Recommendation ID */
  id: string;
  
  /** Type */
  type: 'action' | 'optimization' | 'prevention' | 'enhancement';
  
  /** Priority */
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  /** Title */
  title: string;
  
  /** Description */
  description: string;
  
  /** Expected impact */
  expectedImpact: {
    productivity: number;
    efficiency: number;
    timeSaved: number;
  };
  
  /** Implementation steps */
  steps: RecommendationStep[];
  
  /** Prerequisites */
  prerequisites: string[];
  
  /** Estimated effort in minutes */
  estimatedEffort: number;
  
  /** Success metrics */
  successMetrics: string[];
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Whether applied */
  applied: boolean;
  
  /** Application timestamp */
  appliedAt?: string;
  
  /** User feedback */
  feedback?: {
    rating: number;
    comments: string;
    actualImpact: number;
  };
}
```

### SmartSuggestion

Smart suggestion structure.

```typescript
interface SmartSuggestion {
  /** Suggestion ID */
  id: string;
  
  /** Suggestion type */
  type: 'project' | 'session' | 'break' | 'focus' | 'collaboration' | 'learning';
  
  /** Title */
  title: string;
  
  /** Description */
  description: string;
  
  /** Reasoning */
  reasoning: string;
  
  /** Urgency level */
  urgency: 'low' | 'medium' | 'high' | 'critical';
  
  /** Whether time-sensitive */
  timeSensitive: boolean;
  
  /** Expiration timestamp */
  expiresAt?: string;
  
  /** Supporting data */
  data: {
    context: Record<string, any>;
    triggers: string[];
    conditions: string[];
  };
  
  /** Available actions */
  actions: {
    primary: string;
    secondary?: string;
    dismiss?: string;
  };
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Whether acknowledged */
  acknowledged: boolean;
  
  /** Whether applied */
  applied: boolean;
}
```

---

## Workflow Types

### Workflow

Workflow automation structure.

```typescript
interface Workflow {
  /** Workflow ID */
  id: string;
  
  /** Workflow name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Category */
  category: 'productivity' | 'project_management' | 'communication' | 'data_processing' | 'custom';
  
  /** Status */
  status: 'active' | 'paused' | 'draft' | 'archived';
  
  /** Version */
  version: string;
  
  /** Creator */
  createdBy: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Update timestamp */
  updatedAt: string;
  
  /** Last run timestamp */
  lastRun?: string;
  
  /** Next scheduled run */
  nextRun?: string;
  
  /** Total executions */
  executionCount: number;
  
  /** Success rate percentage */
  successRate: number;
  
  /** Average execution time in ms */
  averageExecutionTime: number;
  
  /** Workflow triggers */
  triggers: WorkflowTrigger[];
  
  /** Workflow steps */
  steps: WorkflowStep[];
  
  /** Conditions */
  conditions: WorkflowCondition[];
  
  /** Variables */
  variables: WorkflowVariable[];
  
  /** Settings */
  settings: WorkflowSettings;
  
  /** Permissions */
  permissions: WorkflowPermissions;
}
```

### WorkflowTrigger

Workflow trigger configuration.

```typescript
interface WorkflowTrigger {
  /** Trigger ID */
  id: string;
  
  /** Trigger type */
  type: 'schedule' | 'event' | 'condition' | 'manual' | 'webhook';
  
  /** Trigger name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Configuration */
  configuration: {
    schedule?: {
      frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
      time?: string;
      days?: number[];
      cron?: string;
    };
    event?: {
      source: string;
      eventType: string;
      filters: Record<string, any>;
    };
    condition?: {
      field: string;
      operator: string;
      value: any;
    };
    webhook?: {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers: Record<string, string>;
    };
  };
  
  /** Whether enabled */
  enabled: boolean;
  
  /** Last trigger timestamp */
  lastTriggered?: string;
  
  /** Total trigger count */
  triggerCount: number;
}
```

---

## Integration Types

### ThirdPartyIntegration

External integration configuration.

```typescript
interface ThirdPartyIntegration {
  /** Integration ID */
  id: string;
  
  /** Integration name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Service identifier */
  service: string;
  
  /** Category */
  category: 'productivity' | 'communication' | 'development' | 'analytics' | 'storage' | 'payment' | 'custom';
  
  /** Connection status */
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  
  /** Configuration */
  configuration: {
    apiKey?: string;
    secret?: string;
    baseUrl?: string;
    version?: string;
    customHeaders?: Record<string, string>;
    timeout?: number;
  };
  
  /** Capabilities */
  capabilities: IntegrationCapability[];
  
  /** Webhook IDs */
  webhooks: string[];
  
  /** Sync settings */
  syncSettings: {
    enabled: boolean;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
    lastSync?: string;
    nextSync?: string;
    direction: 'import' | 'export' | 'bidirectional';
  };
  
  /** Permissions */
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  };
  
  /** Timestamps */
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  
  /** Usage statistics */
  usageCount: number;
  errorCount: number;
  healthScore: number;
}
```

---

## Security Types

### User

User account structure.

```typescript
interface User {
  /** User ID */
  id: string;
  
  /** Email address */
  email: string;
  
  /** Display name */
  name: string;
  
  /** Avatar URL */
  avatar?: string;
  
  /** User role */
  role: UserRole;
  
  /** Permissions */
  permissions: Permission[];
  
  /** Account status */
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  
  /** Last login timestamp */
  lastLogin?: string;
  
  /** Login count */
  loginCount: number;
  
  /** Timestamps */
  createdAt: string;
  updatedAt: string;
  
  /** Metadata */
  metadata: {
    department?: string;
    title?: string;
    location?: string;
    timezone?: string;
  };
  
  /** Security settings */
  security: {
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    failedLoginAttempts: number;
    lastFailedLogin?: string;
    accountLockedUntil?: string;
  };
}
```

### AuditLog

Audit log entry structure.

```typescript
interface AuditLog {
  /** Log ID */
  id: string;
  
  /** User ID */
  userId: string;
  
  /** User name */
  userName: string;
  
  /** Action performed */
  action: string;
  
  /** Resource type */
  resource: string;
  
  /** Resource ID */
  resourceId?: string;
  
  /** Action details */
  details: {
    method?: string;
    endpoint?: string;
    ipAddress: string;
    userAgent: string;
    requestBody?: any;
    responseStatus?: number;
    errorMessage?: string;
  };
  
  /** Timestamp */
  timestamp: string;
  
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Category */
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security';
  
  /** Tags */
  tags: string[];
  
  /** Additional metadata */
  metadata: Record<string, any>;
}
```

---

## Usage Examples

### Working with Types

```typescript
import { 
  Project, 
  Session, 
  ProjectFilters, 
  ApiResponse 
} from '../types';

// Creating a new project
const newProject: Partial<Project> = {
  name: 'My Project',
  description: 'Project description',
  status: 'Active',
  priority: 'High',
  type: 'Web Application'
};

// Filtering projects
const filters: ProjectFilters = {
  status: ['Active'],
  priority: ['High', 'Critical'],
  search: 'authentication'
};

// Handling API responses
async function loadProjects(): Promise<void> {
  const response: ApiResponse<Project[]> = await fetchProjects(filters);
  
  if (response.success && response.data) {
    console.log('Loaded projects:', response.data);
  } else {
    console.error('Error:', response.error);
  }
}
```

### Type Guards

```typescript
function isActiveProject(project: Project): boolean {
  return project.status === 'Active';
}

function isCompletedSession(session: Session): boolean {
  return session.status === 'Completed';
}

function hasBlockers(item: Project | Session): boolean {
  return item.blockers !== '' && item.blockers !== undefined;
}
```

### Generic Utilities

```typescript
// Filter helper
function filterByStatus<T extends { status: string }>(
  items: T[],
  statuses: string[]
): T[] {
  return items.filter(item => statuses.includes(item.status));
}

// Date range filter
function filterByDateRange(
  sessions: Session[],
  start: string,
  end: string
): Session[] {
  return sessions.filter(session => {
    const date = new Date(session.date);
    return date >= new Date(start) && date <= new Date(end);
  });
}
```
