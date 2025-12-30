## Exported TypeScript Types (`src/types/index.ts`)

This file exports the domain model types used across the frontend components and the API client.

It contains two groups:

- **Core types actively used by the app today** (projects/sessions/dashboard)
- **Advanced/future types** used by some feature modules (workflow automation, integrations, reporting, CRM, security)

---

## Core app types

### `Project`

Represents a tracked project from Notion.

Key fields:

- `id: string`
- `name: string`
- `description: string`
- `status: ProjectStatus` (`'Active' | 'Paused' | 'Complete' | 'Archived'`)
- `priority: ProjectPriority` (`'Critical' | 'High' | 'Medium' | 'Low'`)
- `workspace: string` (local path / label)
- `type: ProjectType` (e.g. `'Web Application' | 'API/Backend' | ...`)
- `startedDate: string` (ISO date)
- `lastUpdated: string` (ISO date)
- `currentContext: string`
- `nextSteps: string`
- `blockers: string`
- `techStack: string[]`
- `tags: string[]`

### `Session`

Represents a work session entry (mostly backed by the Notion Sessions database).

Key fields:

- `id: string`
- `title: string`
- `date: string` (ISO date)
- `duration: number` (minutes)
- `projectId: string`
- `projectName?: string`
- `status: SessionStatus`
- `summary: string`
- `filesModified: string`
- `nextSteps: string`
- `blockers: string`
- `aiAgent: string`
- `workspace: string`
- `type: SessionType`
- `tags: string[]`

Extended/optional fields often shown in `SessionCard`/`SessionDetail`:

- `keyDecisions?`, `challenges?`, `solutions?`, `codeChanges?`, `outcomes?`, `learnings?`, `context?`, `toolsUsed?`, `links?`, `notes?`

### `ApiResponse<T>`

Standard wrapper used by `src/api/notionApi.ts`:

- `success: boolean`
- `data?: T`
- `error?: string`
- `message?: string`

### `DashboardStats` / `CategoryStats`

Shapes used by `Dashboard` and `AnalyticsDashboard`:

- `DashboardStats`: totals and rollups (projects, sessions, hours, etc.)
- `CategoryStats`: category rollups (projects, sessions, hours)

---

## Advanced/future models

Several UI modules (e.g. `WorkflowAutomation`, `IntegrationManagement`, `ReportGenerator`, `CustomerCRM`)
use types that represent “future” systems. These are still public exports and can be imported.

### Project templates & planning

- `ProjectTemplate`, `ProjectPhase`, `SessionTemplate`, `ChecklistItem`, `Resource`
- `ProjectDependency`, `ProjectMilestone`, `ProjectTimeline`, `TimelinePhase`
- `ProjectHealth`, `ProjectRisk`, `ProjectAlert`

### Reporting & export

- `ReportTemplate`, `ReportSection`, `ReportFilter`, `ReportStyling`, `ReportSchedule`
- `GeneratedReport`, `ExportOptions`, `ReportAnalytics`

### AI insights & recommendations

- `AIInsight`, `TrendData`, `ComparisonData`
- `AIRecommendation`, `RecommendationStep`
- `WorkPattern`, `PredictiveAnalytics`, `SmartSuggestion`

### Workflow automation

- `Workflow`, `WorkflowTrigger`, `WorkflowStep`, `WorkflowCondition`, `WorkflowVariable`
- `WorkflowSettings`, `WorkflowPermissions`
- `WorkflowExecution`, `WorkflowStepExecution`, `WorkflowLog`
- `AutomationRule`, `AutomationCondition`, `AutomationAction`
- `WorkflowTemplate`

### Integrations & API management

- `ApiEndpoint`, `ApiParameter`, `ApiResponseSpec`, `ApiExample`
- `Webhook`, `WebhookFilter`, `WebhookTransformation`
- `ThirdPartyIntegration`, `IntegrationCapability`
- `ApiDocumentation`, `ApiServer`, `ApiSchema`, `ApiChangelogEntry`
- `ApiUsage`, `ApiKey`, `IntegrationTest`, `IntegrationTestLog`

### Security & compliance

- `User`, `UserRole`, `Permission`, `PermissionCondition`
- `AuditLog`, `SecurityEvent`, `SecurityEvidence`
- `ComplianceFramework`, `ComplianceRequirement`, `ComplianceControl`, `ComplianceEvidence`
- `ComplianceAssessment`, `ComplianceFinding`
- `DataClassification`, `DataInventory`, `DataRisk`
- `SecurityPolicy`, `PolicyAcknowledgment`, `SecurityTraining`, `SecurityQuiz`, `QuizQuestion`, `TrainingCompletion`

### CRM (used by `CustomerCRM`)

This module exports many CRM-related entities, including:

- `Customer`, `Lead`, `Opportunity`, `Contact`, `Company`, `Deal`, `Pipeline`
- `SalesActivity`, `SalesStage`, `SalesForecast`, `SalesTarget`, `SalesTeam`, `SalesTerritory`, `SalesProduct`, etc.
- Additional helper types in the “Additional CRM Types” section: `Activity`, `Task`, `Campaign`, `Interaction`, etc.

---

## Usage examples

### Importing core models

```ts
import type { Project, Session, ApiResponse } from './types';
```

### Using `ExportOptions` with `DataExport`

```ts
import type { ExportOptions } from './types';

const opts: ExportOptions = {
  format: 'csv',
  includeCharts: false,
  includeImages: false,
  dateRange: { start: '2025-01-01', end: '2025-12-31' },
  filters: { projects: [], sessions: [] },
};
```
