# API Documentation

## Overview

This document provides comprehensive documentation for all public APIs in the AIME (Agent Alex) application. The application consists of two main backend services:

1. **FastAPI Backend** - Python-based API for golf putt solving
2. **Express/TypeScript Backend** - Node.js API for project and session management with Notion integration

---

## Table of Contents

- [FastAPI Backend (Python)](#fastapi-backend-python)
  - [Health Check Endpoints](#health-check-endpoints)
  - [Courses API](#courses-api)
  - [Putt Solver API](#putt-solver-api)
- [Express Backend (TypeScript)](#express-backend-typescript)
  - [Projects API](#projects-api)
  - [Sessions API](#sessions-api)
  - [Dashboard API](#dashboard-api)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## FastAPI Backend (Python)

Base URL: `http://localhost:8000` (development)

### Health Check Endpoints

#### GET /api/health

Basic health check for the backend service.

**Response:**
```json
{
  "status": "ok",
  "service": "aime-backend",
  "version": "0.1.0"
}
```

**Status Codes:**
- `200` - Service is healthy

**Example:**
```bash
curl http://localhost:8000/api/health
```

---

#### GET /api/health/full

Comprehensive health check for backend and PuttSolver service.

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
      "dll_loaded": true
    }
  }
}
```

**Status Codes:**
- `200` - All services healthy
- `503` - PuttSolver service unavailable

**Example:**
```bash
curl http://localhost:8000/api/health/full
```

---

### Courses API

#### GET /api/courses

Returns all available golf courses from the datasets registry.

**Response:**
```json
{
  "datasets": [
    {
      "dtm_id": "riverside_country_club_hole_1",
      "course_id": "riverside_country_club",
      "hole_id": 1,
      "grid_spacing_m": 0.2,
      "grid_rows": 100,
      "grid_cols": 100
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error (datasets file not found or invalid)

**Example:**
```bash
curl http://localhost:8000/api/courses
```

**Error Response:**
```json
{
  "detail": "Datasets registry not found: /path/to/datasets.json"
}
```

---

### Putt Solver API

#### POST /api/solve_putt

Calculates the optimal putt path for a golf shot.

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

**Parameters:**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `course_id` | string | Yes | - | Identifier for the golf course |
| `hole_id` | integer | Yes | 1-18 | Hole number |
| `ball_wgs84` | object | Yes | - | Ball position in WGS84 coordinates |
| `ball_wgs84.lat` | float | Yes | -90 to 90 | Latitude |
| `ball_wgs84.lon` | float | Yes | -180 to 180 | Longitude |
| `cup_wgs84` | object | Yes | - | Cup position in WGS84 coordinates |
| `cup_wgs84.lat` | float | Yes | -90 to 90 | Latitude |
| `cup_wgs84.lon` | float | Yes | -180 to 180 | Longitude |
| `stimp` | float | Yes | 6.0-15.0 | Green speed measurement |

**Response:**
```json
{
  "success": true,
  "instruction_text": "Aim 2.5 degrees left of cup, hit at 8.2 mph",
  "aim_line_deg": -2.5,
  "initial_speed_mph": 8.2,
  "plot_points_local": [
    {"x": 10.0, "y": 8.0, "t": 0.0},
    {"x": 10.1, "y": 8.2, "t": 0.1},
    {"x": 10.0, "y": 11.0, "t": 2.5}
  ],
  "error": null
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the solve was successful |
| `instruction_text` | string | Human-readable instruction |
| `aim_line_deg` | float | Aim angle in degrees (positive = right, negative = left) |
| `initial_speed_mph` | float | Initial ball speed in mph |
| `plot_points_local` | array | Array of trajectory points in local coordinates |
| `error` | string | Error message if failed |

**Status Codes:**
- `200` - Success (check `success` field for actual result)
- `422` - Validation error (invalid parameters)
- `500` - Server error

**Error Response:**
```json
{
  "success": false,
  "instruction_text": null,
  "aim_line_deg": null,
  "initial_speed_mph": null,
  "plot_points_local": [],
  "error": "AB_001 Unknown course/hole mapping: Course not found"
}
```

**Error Codes:**
- `AB_001` - Unknown course/hole mapping
- `AB_002` - Transform not implemented
- `AB_003` - PuttSolver service error or unreachable
- `AB_004` - Unexpected error

**Example:**
```bash
curl -X POST http://localhost:8000/api/solve_putt \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "riverside_country_club",
    "hole_id": 1,
    "ball_wgs84": {"lat": 37.774929, "lon": -122.419416},
    "cup_wgs84": {"lat": 37.77485, "lon": -122.4193},
    "stimp": 10.5
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('/api/solve_putt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    course_id: 'riverside_country_club',
    hole_id: 1,
    ball_wgs84: { lat: 37.774929, lon: -122.419416 },
    cup_wgs84: { lat: 37.77485, lon: -122.4193 },
    stimp: 10.5
  })
});
const data = await response.json();
console.log(data.instruction_text);
```

---

## Express Backend (TypeScript)

Base URL: `http://localhost:3001` (development)

### Projects API

#### GET /api/projects

Retrieve all projects with optional filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search projects by name |
| `status` | string | Filter by status (comma-separated) |
| `workspace` | string | Filter by workspace (comma-separated) |

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "abc123...",
      "name": "Agent Alex",
      "description": "AI work session tracker",
      "status": "Active",
      "priority": "High",
      "type": "Web Application",
      "workspace": "/workspace/agent-alex",
      "startedDate": "2024-01-01",
      "lastUpdated": "2024-01-15",
      "currentContext": "Building API documentation",
      "repository": "https://github.com/user/agent-alex",
      "techStack": ["React", "TypeScript", "Node.js"],
      "backlogItems": 5,
      "statusNotes": "On track",
      "nextSteps": "Complete documentation",
      "blockers": "",
      "tags": ["productivity", "ai"]
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
# Get all projects
curl http://localhost:3001/api/projects

# Get active projects
curl "http://localhost:3001/api/projects?status=Active"

# Search projects
curl "http://localhost:3001/api/projects?search=agent"
```

---

#### GET /api/projects/:id

Retrieve a single project by ID.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Project ID |

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "abc123...",
    "name": "Agent Alex",
    "description": "AI work session tracker",
    "status": "Active",
    "priority": "High",
    "type": "Web Application",
    "workspace": "/workspace/agent-alex",
    "startedDate": "2024-01-01",
    "lastUpdated": "2024-01-15",
    "currentContext": "Building API documentation",
    "repository": "https://github.com/user/agent-alex",
    "techStack": ["React", "TypeScript", "Node.js"],
    "backlogItems": 5,
    "statusNotes": "On track",
    "nextSteps": "Complete documentation",
    "blockers": "",
    "tags": ["productivity", "ai"]
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Project not found
- `500` - Server error

**Example:**
```bash
curl http://localhost:3001/api/projects/abc123...
```

---

#### POST /api/projects

Create a new project.

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "Active",
  "priority": "Medium",
  "type": "Web Application",
  "workspace": "/path/to/workspace",
  "repository": "https://github.com/user/repo",
  "currentContext": "Starting new project",
  "nextSteps": "Setup initial structure",
  "techStack": "React, TypeScript, Node.js"
}
```

**Required Fields:**
- `name` (string)
- `status` (string): "Active", "Paused", "Complete", or "Archived"
- `priority` (string): "Critical", "High", "Medium", or "Low"

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "new-project-id",
    "name": "New Project",
    ...
  },
  "message": "Project created successfully!"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request body
- `500` - Server error

**Example:**
```javascript
const response = await fetch('http://localhost:3001/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Project',
    description: 'A great new project',
    status: 'Active',
    priority: 'High',
    type: 'Web Application',
    workspace: '/workspace/new-project'
  })
});
const data = await response.json();
```

---

#### PATCH /api/projects/:id

Update an existing project (placeholder endpoint).

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Project ID |

**Request Body:**
```json
{
  "status": "Complete",
  "nextSteps": "Archive project"
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

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### GET /api/projects/:id/context

Get project context for resuming work (placeholder endpoint).

**Response:**
```json
{
  "success": true,
  "context": null,
  "message": "Project context endpoint - to be implemented"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Sessions API

#### GET /api/sessions

Retrieve all work sessions with optional filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | string | Filter sessions by project ID |
| `search` | string | Search sessions by title |
| `status` | string | Filter by status (comma-separated) |

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session123...",
      "title": "Implemented authentication",
      "date": "2024-01-15",
      "duration": 120,
      "projectId": "project123...",
      "projectName": "Agent Alex",
      "status": "Completed",
      "summary": "Built JWT authentication system",
      "filesModified": "src/auth.ts, src/middleware.ts",
      "nextSteps": "Add refresh token support",
      "blockers": "",
      "aiAgent": "Claude",
      "workspace": "Cursor",
      "type": "Feature Development",
      "tags": ["backend", "security"],
      "keyDecisions": "Chose JWT over sessions",
      "challenges": "Token refresh complexity",
      "solutions": "Implemented sliding sessions",
      "codeChanges": "Added auth middleware",
      "technologiesUsed": ["Node.js", "JWT"],
      "links": "",
      "notes": "Full implementation notes...",
      "outcomes": "Authentication working",
      "learnings": "JWT best practices",
      "context": "Security improvements",
      "toolsUsed": "Cursor, Git"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
# Get all sessions
curl http://localhost:3001/api/sessions

# Get sessions for a project
curl "http://localhost:3001/api/sessions?projectId=project123"
```

---

#### GET /api/sessions/:id

Retrieve a single session by ID.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Session ID |

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session123...",
    "title": "Implemented authentication",
    "date": "2024-01-15",
    "duration": 120,
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Session not found
- `500` - Server error

---

#### POST /api/sessions

Create a new work session.

**Request Body:**
```json
{
  "projectId": "project123...",
  "title": "Session title",
  "duration": 120,
  "sessionType": "Feature Development",
  "aiAgent": "Claude",
  "workspace": "Cursor",
  "summary": "What was accomplished",
  "filesModified": "List of files",
  "nextSteps": "What's next",
  "blockers": "Any blockers",
  "keyDecisions": "Important decisions",
  "challenges": "Challenges faced",
  "solutions": "Solutions found",
  "codeChanges": "Code changes made",
  "outcomes": "Results achieved",
  "learnings": "Things learned"
}
```

**Required Fields:**
- `title` (string)
- `summary` (string)
- `sessionType` (string): "Feature Development", "Bug Fix", "Refactoring", "Documentation", "Planning", "Testing", or "Deployment"
- `aiAgent` (string): "Claude", "GPT-4", "Gemini", "Multiple", or "None"
- `workspace` (string): "Cursor", "VS Code", "Warp", "Terminal", or "Other"

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "new-session-id",
    "title": "Session title",
    ...
  },
  "message": "Session logged successfully!"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request body
- `500` - Server error

**Example:**
```javascript
const response = await fetch('http://localhost:3001/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'project123',
    title: 'Built API documentation',
    duration: 180,
    sessionType: 'Documentation',
    aiAgent: 'Claude',
    workspace: 'Cursor',
    summary: 'Created comprehensive API docs',
    filesModified: 'docs/API.md',
    nextSteps: 'Review and publish'
  })
});
```

---

#### PATCH /api/sessions/:id

Update a session's status.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Session ID |

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
    "id": "session123",
    "status": "Completed"
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Dashboard API

#### GET /api/dashboard/stats

Get dashboard statistics including complete project and session history.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalProjects": 15,
    "activeProjects": 5,
    "totalSessions": 127,
    "totalHours": 254,
    "completedSessions": 115,
    "technologiesCount": 12,
    "sessionsWithFiles": 98
  }
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `totalProjects` | number | Total number of projects |
| `activeProjects` | number | Number of active projects |
| `totalSessions` | number | Total number of sessions logged |
| `totalHours` | number | Total hours worked |
| `completedSessions` | number | Sessions with outcomes |
| `technologiesCount` | number | Unique technologies used |
| `sessionsWithFiles` | number | Sessions with file modifications |

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
curl http://localhost:3001/api/dashboard/stats
```

---

#### GET /api/dashboard/categories

Get project categories and work distribution.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "name": "Web Application",
      "projectCount": 8,
      "activeProjects": 3,
      "sessionCount": 45,
      "totalHours": 92.5
    },
    {
      "name": "API/Backend",
      "projectCount": 5,
      "activeProjects": 2,
      "sessionCount": 38,
      "totalHours": 76.0
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Authentication

The Express backend supports CORS with restricted origins for security.

**Allowed Origins (configurable via `ALLOWED_ORIGINS` env var):**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `http://localhost:3003`

**CORS Headers:**
```
Access-Control-Allow-Origin: <origin>
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Credentials: true
```

---

## Error Handling

### Standard Error Response Format

All APIs return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

---

## Rate Limiting

The Express backend implements rate limiting to prevent abuse.

**Configuration:**
- Window: 15 minutes
- Max requests per window: 100 per IP
- Response when exceeded:
  ```json
  {
    "error": "Too many requests from this IP, please try again later."
  }
  ```

**Headers:**
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time when limit resets

---

## Environment Variables

### FastAPI Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PUTTSOLVER_SERVICE_URL` | No | `http://localhost:8081` | PuttSolver service URL |
| `AIME_TRANSFORM_MODE` | No | `mock` | Coordinate transform mode |

### Express Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NOTION_TOKEN` | Yes | - | Notion API integration token |
| `NOTION_PROJECTS_DATABASE_ID` | Yes | - | Notion projects database ID |
| `NOTION_SESSIONS_DATABASE_ID` | Yes | - | Notion sessions database ID |
| `PORT` | No | `3001` | Server port |
| `ALLOWED_ORIGINS` | No | See above | Comma-separated list of allowed CORS origins |

---

## Getting Started

### Prerequisites

```bash
# Python backend
python -m pip install -r backend/requirements.txt

# Node.js backend
npm install
```

### Running the Services

```bash
# Start FastAPI backend
cd backend
uvicorn main:app --reload --port 8000

# Start Express backend
npm run dev
```

### Testing the APIs

```bash
# Health checks
curl http://localhost:8000/api/health
curl http://localhost:3001/health

# Get courses
curl http://localhost:8000/api/courses

# Get projects
curl http://localhost:3001/api/projects

# Get sessions
curl http://localhost:3001/api/sessions
```

---

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/user/agent-alex/issues)
- Review the [troubleshooting guide](../TROUBLESHOOTING.md)
- Contact the development team

---

## Changelog

### Version 0.1.0 (Current)
- Initial API implementation
- FastAPI backend for putt solving
- Express backend for project/session management
- Notion integration
- CORS and rate limiting
- Health check endpoints
