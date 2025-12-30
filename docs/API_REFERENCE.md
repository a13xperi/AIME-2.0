# API Reference

This document provides a comprehensive reference for the public APIs available in the Agent Alex and AIME system.

## Table of Contents

- [Node.js Backend (Agent Alex)](#nodejs-backend-agent-alex)
  - [Projects](#projects)
  - [Sessions](#sessions)
  - [Dashboard](#dashboard)
  - [Health](#health)
- [Python Backend (AIME Backend)](#python-backend-aime-backend)
  - [Putt Solver](#putt-solver)
  - [Courses](#courses)
  - [Health](#health-1)

---

## Node.js Backend (Agent Alex)

Base URL: `/api` (local default: `http://localhost:3001/api`)

### Projects

#### Get All Projects
Retrieves a paginated list of projects from Notion.

- **URL:** `/projects`
- **Method:** `GET`
- **Query Parameters:**
  - `search` (optional): Search term for project name.
  - `status` (optional): Filter by project status.
  - `workspace` (optional): Filter by workspace.
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, projects: [...] }`

#### Get Single Project
Retrieves details for a specific project.

- **URL:** `/projects/:id`
- **Method:** `GET`
- **URL Params:** `id=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, project: { ... } }`

#### Create Project
Creates a new project in Notion.

- **URL:** `/projects`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "Project Name",
    "status": "Active",
    "priority": "Medium",
    "description": "Project description",
    "type": "Web App",
    "workspace": "Local Path",
    "repository": "https://github.com/...",
    "techStack": "React, Node.js"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, project: { ... }, message: "Project created successfully!" }`

#### Update Project (Stub)
Updates an existing project.

- **URL:** `/projects/:id`
- **Method:** `PATCH`
- **URL Params:** `id=[string]`
- **Body:** `{ ...fields to update }`

#### Get Project Context (Stub)
Retrieves context for resuming work on a project.

- **URL:** `/projects/:id/context`
- **Method:** `GET`
- **URL Params:** `id=[string]`

### Sessions

#### Get All Sessions
Retrieves a paginated list of work sessions.

- **URL:** `/sessions`
- **Method:** `GET`
- **Query Parameters:**
  - `projectId` (optional): Filter by project ID.
  - `search` (optional): Search term.
  - `status` (optional): Filter by status.
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, sessions: [...] }`

#### Get Single Session
Retrieves details for a specific session.

- **URL:** `/sessions/:id`
- **Method:** `GET`
- **URL Params:** `id=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, session: { ... } }`

#### Create Session
Logs a new work session in Notion.

- **URL:** `/sessions`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "title": "Session Title",
    "projectId": "project-id",
    "duration": 60,
    "sessionType": "Feature Development",
    "aiAgent": "Claude",
    "workspace": "Cursor",
    "summary": "Summary of work...",
    "nextSteps": "What to do next..."
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, session: { ... }, message: "Session logged successfully!" }`

#### Update Session Status
Updates the status of a session.

- **URL:** `/sessions/:id`
- **Method:** `PATCH`
- **URL Params:** `id=[string]`
- **Body:** `{ "status": "Completed" }`

### Dashboard

#### Get Category Stats
Retrieves statistics grouped by project category.

- **URL:** `/dashboard/categories`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, categories: [...] }`

#### Get Dashboard Stats
Retrieves overall dashboard statistics.

- **URL:** `/dashboard/stats`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ success: true, stats: { totalProjects: 10, ... } }`

### Health

#### Health Check
Checks if the API is running.

- **URL:** `/health`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ status: "ok", message: "Agent Alex API is running" }`

---

## Python Backend (AIME Backend)

Base URL: `/api` (local default: `http://localhost:8000/api` or similar)

### Putt Solver

#### Solve Putt
Calculates the trajectory for a putt.

- **URL:** `/solve_putt`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "course_id": "course-id",
    "hole_id": 1,
    "ball_wgs84": { "lat": 0.0, "lon": 0.0 },
    "cup_wgs84": { "lat": 0.0, "lon": 0.0 },
    "stimp": 10.0
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "success": true,
      "instruction_text": "Aim 2 cups left",
      "aim_line_deg": 45.0,
      "initial_speed_mph": 5.0,
      "plot_points_local": [ ... ]
    }
    ```

### Courses

#### Get Courses
Returns all available courses from the datasets registry.

- **URL:** `/courses`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ datasets: [ ... ] }`

### Health

#### Simple Health Check
Basic service health check.

- **URL:** `/health`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "status": "ok", ... }`

#### Full Health Check
Comprehensive health check including downstream services (PuttSolver).

- **URL:** `/health/full`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 or 503
  - **Content:**
    ```json
    {
      "status": "ok",
      "services": {
        "backend": { "status": "ok" },
        "puttsolver": { "status": "ok", "reachable": true }
      }
    }
    ```
