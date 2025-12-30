## HTTP API Reference

This repo exposes **two different backends**:

- **Agent Alex Notion API (Express)**: used by the React app for projects/sessions.
- **AIME backend + PuttSolver service (FastAPI)**: used by the putting solver demo and related endpoints.

Both are documented below.

---

## Agent Alex Notion API (Express)

### Base URL

- **Local**: `http://localhost:3001`
- **Path prefix**: most endpoints are under `/api/*`

### Authentication

- **No auth** is implemented at the HTTP layer right now.
- The server requires Notion credentials **at startup** via environment variables (see below).

### Required environment variables

Enforced by `server/index.ts`:

- `NOTION_TOKEN`
- `NOTION_PROJECTS_DATABASE_ID`
- `NOTION_SESSIONS_DATABASE_ID`

Optional:

- `PORT` (defaults to `3001`)
- `ALLOWED_ORIGINS` (comma-separated list; defaults to local dev origins)

### Common response envelope

Most endpoints return:

- `success: boolean`
- plus a payload field like `projects`, `project`, `sessions`, `session`, `stats`, `categories`
- on failures: `success: false` and `error: string`

### Endpoints

#### `GET /health`

Simple health check.

**Response**

```json
{ "status": "ok", "message": "Agent Alex API is running" }
```

#### `GET /api/projects`

Fetch **all projects** from Notion (server paginates internally to return the full history).

**Query params (currently accepted by server but not applied as filters)**

- `search?: string`
- `status?: string`
- `workspace?: string`

**Response**

```json
{ "success": true, "projects": [/* Project[] */] }
```

**Example**

```bash
curl "http://localhost:3001/api/projects"
```

#### `GET /api/projects/:id`

Fetch a single project by Notion page id (either hyphenated or compact id).

**Response**

```json
{ "success": true, "project": { "id": "...", "name": "...", "status": "Active" } }
```

**Example**

```bash
curl "http://localhost:3001/api/projects/<NOTION_PAGE_ID>"
```

#### `POST /api/projects`

Create a new project page in the Notion Projects database.

**Request body**

```json
{
  "name": "My Project",
  "description": "What it is",
  "status": "Active",
  "priority": "Medium",
  "type": "Web Application",
  "workspace": "/path/to/project",
  "repository": "https://github.com/org/repo",
  "currentContext": "Where I left off",
  "nextSteps": "What to do next",
  "techStack": "React, TypeScript"
}
```

Notes:

- `techStack` is treated as a **comma-separated string** and mapped into Notion `multi_select`.
- Notion schema field names must match your databases (the server currently uses `"Tech Stack"`, `"Current Context"`, `"Next Steps"`, etc.).

**Response**

```json
{ "success": true, "project": { "id": "<notion_id>", "name": "My Project" } }
```

**Example**

```bash
curl -X POST "http://localhost:3001/api/projects" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Demo","status":"Active","priority":"Medium"}'
```

#### `PATCH /api/projects/:id`

Placeholder endpoint (returns “to be implemented”).

**Response**

```json
{ "success": true, "project": null, "message": "Update project endpoint - to be implemented" }
```

#### `GET /api/sessions`

Fetch **all sessions** from Notion (server paginates internally to return complete history).

**Query params**

- `projectId?: string` (currently used as a **string search** against the session title)
- `search?: string` (not applied)
- `status?: string` (not applied)

**Response**

```json
{ "success": true, "sessions": [/* Session[] */] }
```

**Example**

```bash
curl "http://localhost:3001/api/sessions"
```

#### `GET /api/sessions/:id`

Fetch a single Notion session page by id.

**Response**

```json
{ "success": true, "session": { "id": "...", "title": "...", "status": "Completed" } }
```

#### `POST /api/sessions`

Create a session log entry in the Notion Sessions database.

**Request body**

This endpoint accepts many fields; the server maps what it can into the Notion schema. Fields that
don’t exist as dedicated properties are concatenated into the Notion `Notes` rich_text field.

Minimum practical payload used by the UI:

```json
{
  "title": "Implement feature X",
  "projectId": "<notion_project_relation_id_optional>",
  "aiAgent": "Claude",
  "workspace": "Cursor",
  "sessionType": "Feature Development",
  "duration": 120,
  "summary": "What I did",
  "filesModified": "src/App.tsx",
  "nextSteps": "Do Y next",
  "blockers": "None"
}
```

**Response**

```json
{ "success": true, "session": { "id": "<notion_id>", "title": "..." }, "message": "Session logged successfully!" }
```

#### `PATCH /api/sessions/:id`

Update session status in Notion.

**Request body**

```json
{ "status": "Completed" }
```

**Response**

```json
{ "success": true, "message": "Session status updated successfully", "session": { "id": "...", "status": "Completed" } }
```

#### `GET /api/dashboard/stats`

Returns dashboard stats computed from **complete Notion history**.

**Response**

```json
{
  "success": true,
  "stats": {
    "totalProjects": 10,
    "activeProjects": 4,
    "totalSessions": 120,
    "totalHours": 50,
    "completedSessions": 42,
    "technologiesCount": 18,
    "sessionsWithFiles": 20
  }
}
```

#### `GET /api/dashboard/categories`

Returns category aggregation based on project tech stack and session/project keyword matching.

**Response**

```json
{
  "success": true,
  "categories": [
    { "name": "React", "projectCount": 3, "activeProjects": 2, "sessionCount": 10, "totalHours": 22.5 }
  ]
}
```

#### `GET /api/projects/:id/context`

Placeholder endpoint (returns “to be implemented”).

---

## Vercel serverless entrypoints

### `api/index.ts`

Exports the Express app (`server/index.ts`) as the Vercel function default export.

### `api/index.js` (legacy)

A separate serverless handler that implements a **smaller** API surface:

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `GET /api/sessions`
- `POST /api/sessions`

It uses different env var naming (`NOTION_API_KEY` instead of `NOTION_TOKEN`) and different Notion
property mapping (e.g. `Title` vs `Name`). Prefer the TypeScript/Express implementation.

---

## AIME backend (FastAPI)

Entry point: `backend/main.py` (FastAPI title: `"AIME Backend"`).

### Base URL

- **Local**: `http://localhost:8080`
- Routes are prefixed with `/api/*`.

### Environment variables

- `PUTTSOLVER_SERVICE_URL` (default: `http://localhost:8081`)
- `AIME_TRANSFORM_MODE` (default: `mock`)

### Endpoints

#### `GET /api/health`

**Response**

```json
{ "status": "ok", "service": "aime-backend", "version": "0.1.0" }
```

#### `GET /api/health/full`

Health check that also verifies the putt-solver service is reachable.

- Returns `200` if both are healthy
- Returns `503` if the putt-solver service is unreachable/degraded

**Response**

```json
{
  "status": "ok",
  "services": {
    "backend": { "status": "ok", "version": "0.1.0" },
    "puttsolver": { "status": "ok", "reachable": true, "dll_loaded": false }
  }
}
```

#### `GET /api/courses`

Returns course datasets from `course_data/datasets.json`.

**Response**

```json
{
  "datasets": [
    {
      "dtm_id": "riverside_2023_20cm",
      "course_id": "riverside_country_club",
      "hole_id": 1,
      "grid_spacing_m": 0.2,
      "grid_rows": 150,
      "grid_cols": 200
    }
  ]
}
```

#### `POST /api/solve_putt`

Solves a putt by:

1) Resolving `dtm_id` via `course_data/datasets.json`  
2) Transforming WGS84 → green-local coordinates (**mocked** unless `AIME_TRANSFORM_MODE=mock`)  
3) Calling the PuttSolver service `POST /solve_putt`  
4) Normalizing the response to an API-friendly shape

**Request**

```json
{
  "course_id": "riverside_country_club",
  "hole_id": 1,
  "ball_wgs84": { "lat": 37.774929, "lon": -122.419416 },
  "cup_wgs84": { "lat": 37.77485, "lon": -122.4193 },
  "stimp": 10.5
}
```

**Response**

```json
{
  "success": true,
  "instruction_text": "Aim +16.7° (mock), medium pace",
  "aim_line_deg": 16.7,
  "initial_speed_mph": 4.5,
  "plot_points_local": [{ "x": 10, "y": 8, "t": 0 }],
  "error": null
}
```

**Example**

```bash
curl -X POST "http://localhost:8080/api/solve_putt" \
  -H "Content-Type: application/json" \
  -d '{"course_id":"riverside_country_club","hole_id":1,"ball_wgs84":{"lat":37.774929,"lon":-122.419416},"cup_wgs84":{"lat":37.77485,"lon":-122.4193},"stimp":10.5}'
```

---

## PuttSolver service (FastAPI)

Entry point: `putt-solver-service/main.py` (FastAPI title: `"PuttSolver Service"`).

### Base URL

- **Local**: `http://localhost:8081`

### Environment variables

- `PUTTSOLVER_MODE` (default: `mock`)

### Endpoints

#### `GET /health`

**Response**

```json
{
  "status": "ok",
  "service": "putt-solver-service",
  "version": "0.1.0",
  "dll_loaded": false,
  "datasets_count": 1,
  "mode": "mock"
}
```

#### `GET /datasets`

Lists available datasets (currently a mock allowlist).

#### `POST /solve_putt`

**Request**

```json
{
  "dtm_id": "riverside_2023_20cm",
  "ball_local_m": { "x": 10.0, "y": 8.0 },
  "cup_local_m": { "x": 10.0, "y": 11.0 },
  "stimp": 10.5,
  "request_id": "optional-client-id"
}
```

**Response**

```json
{
  "request_id": "generated-or-provided",
  "dtm_id": "riverside_2023_20cm",
  "success": true,
  "instruction_text": "Aim +16.7° (mock), medium pace",
  "aim_line_deg": 16.7,
  "initial_speed_mph": 4.5,
  "plot_points": [{ "x": 10.0, "y": 8.0, "t": 0.0 }],
  "solve_time_ms": 52.3,
  "error": null
}
```

**Example**

```bash
curl -X POST "http://localhost:8081/solve_putt" \
  -H "Content-Type: application/json" \
  -d '{"dtm_id":"riverside_2023_20cm","ball_local_m":{"x":10,"y":8},"cup_local_m":{"x":10,"y":11},"stimp":10.5}'
```
