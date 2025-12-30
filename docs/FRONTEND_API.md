## Frontend Public API (TypeScript)

This document covers the public, importable API exposed by:

- `src/api/notionApi.ts`
- `src/utils/logger.ts`
- `src/reportWebVitals.ts`

---

## `src/api/notionApi.ts` — Notion/Server API client

### Base URL selection

All functions call:

- `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'`

So you configure the backend base URL via:

- `VITE_API_URL` (Vite env var)

### Return type

Every function returns an `ApiResponse<T>` from `src/types/index.ts`:

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### `fetchProjects(filters?: ProjectFilters): Promise<ApiResponse<Project[]>>`

Fetches projects from `GET /api/projects`.

**Example**

```ts
import { fetchProjects } from './api/notionApi';

const res = await fetchProjects({ search: 'agent', status: ['Active'] });
if (res.success) console.log(res.data);
```

### `fetchProject(projectId: string): Promise<ApiResponse<Project>>`

Fetches a single project from `GET /api/projects/:id`.

**Example**

```ts
import { fetchProject } from './api/notionApi';

const res = await fetchProject('some-notion-id');
if (!res.success) throw new Error(res.error);
```

### `createProject(project: Partial<Project>): Promise<ApiResponse<Project>>`

Creates a project via `POST /api/projects`.

**Example**

```ts
import { createProject } from './api/notionApi';

await createProject({
  name: 'New Project',
  description: 'Track work here',
  status: 'Active',
  priority: 'Medium',
  type: 'Web Application',
});
```

### `updateProject(projectId: string, updates: Partial<Project>): Promise<ApiResponse<Project>>`

Calls `PATCH /api/projects/:id` (currently a placeholder server-side).

**Example**

```ts
import { updateProject } from './api/notionApi';

// Note: backend currently returns a placeholder response.
await updateProject('project-id', { status: 'Paused' });
```

### `fetchSessions(filters?: SessionFilters): Promise<ApiResponse<Session[]>>`

Fetches sessions from `GET /api/sessions`.

**Example**

```ts
import { fetchSessions } from './api/notionApi';

const res = await fetchSessions({ projectId: 'Agent Alex' });
if (res.success) console.log(res.data);
```

### `createSession(session: Partial<Session>): Promise<ApiResponse<Session>>`

Creates a session via `POST /api/sessions`.

**Example**

```ts
import { createSession } from './api/notionApi';

await createSession({
  title: 'Fix production deploy',
  duration: 90,
  aiAgent: 'Claude',
  workspace: 'Cursor',
  sessionType: 'Deployment', // server expects `sessionType`
  summary: 'Updated vercel config and validated env vars',
});
```

### `getProjectContext(projectId: string): Promise<ApiResponse<any>>`

Calls `GET /api/projects/:id/context` (currently a placeholder server-side).

### `fetchDashboardStats(): Promise<ApiResponse<any>>`

Calls `GET /api/dashboard/stats`.

**Example**

```ts
import { fetchDashboardStats } from './api/notionApi';

const res = await fetchDashboardStats();
if (res.success) {
  console.log(res.data.totalProjects, res.data.totalSessions);
}
```

---

## `src/utils/logger.ts` — Logger singleton

Exports:

- `export const logger = new Logger();`
- `export default logger;`

### Methods

- `logger.info(message: string, meta?: any): void`
- `logger.warn(message: string, meta?: any): void`
- `logger.error(message: string, error?: any): void`
- `logger.debug(message: string, meta?: any): void`

Behavior:

- `info/warn/debug` are gated to dev/test (`NODE_ENV === 'development' || 'test'`)
- `error` always logs

**Example**

```ts
import { logger } from './utils/logger';

logger.info('Loaded dashboard', { projects: 10 });
logger.warn('Slow request', { ms: 1200 });
logger.error('Failed to fetch sessions', new Error('Network error'));
```

---

## `src/reportWebVitals.ts` — Performance reporting

Default export:

- `reportWebVitals(onPerfEntry?: ReportHandler): void`

If you pass a callback, it lazily imports `web-vitals` and reports:

- CLS, FID, FCP, LCP, TTFB

**Example**

```ts
import reportWebVitals from './reportWebVitals';

reportWebVitals((metric) => {
  // send to analytics endpoint, or log during development
  console.log(metric);
});
```
