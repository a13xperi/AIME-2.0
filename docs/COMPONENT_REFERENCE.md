# Component & Utility Reference

This document provides a reference for key React components and utility functions in the frontend application.

## Table of Contents

- [API Client (`notionApi.ts`)](#api-client-notionapits)
- [Components](#components)
  - [SessionLogger](#sessionlogger)
  - [ProjectsList](#projectslist)
  - [SessionTemplates](#sessiontemplates)

---

## API Client (`notionApi.ts`)

Located in `src/api/notionApi.ts`.

This utility module handles all communication with the Agent Alex Node.js Backend. It provides typed functions for fetching and modifying data.

### `fetchProjects(filters?: ProjectFilters)`
Fetches a list of projects from the backend.
- **Parameters:**
  - `filters` (optional): Object containing `search`, `status`, and `workspace` filters.
- **Returns:** `Promise<ApiResponse<Project[]>>`

### `fetchProject(projectId: string)`
Fetches a single project by its ID.
- **Parameters:**
  - `projectId`: The ID of the project to fetch.
- **Returns:** `Promise<ApiResponse<Project>>`

### `createProject(project: Partial<Project>)`
Creates a new project.
- **Parameters:**
  - `project`: Project data object.
- **Returns:** `Promise<ApiResponse<Project>>`

### `fetchSessions(filters?: SessionFilters)`
Fetches a list of sessions.
- **Parameters:**
  - `filters` (optional): Object containing `projectId`, `search`, and `status` filters.
- **Returns:** `Promise<ApiResponse<Session[]>>`

### `createSession(session: Partial<Session>)`
Logs a new work session.
- **Parameters:**
  - `session`: Session data object.
- **Returns:** `Promise<ApiResponse<Session>>`

### `fetchDashboardStats()`
Fetches aggregated statistics for the dashboard.
- **Returns:** `Promise<ApiResponse<any>>`

---

## Components

### SessionLogger

Located in `src/components/SessionLogger/SessionLogger.tsx`.

A modal component for logging work sessions. It allows users to input details about their work, including duration, type, summary, and next steps.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls the visibility of the modal. |
| `onClose` | `() => void` | Callback function when the modal is closed. |
| `onSuccess` | `() => void` | Callback function when a session is successfully logged. |
| `projects` | `Project[]` | List of projects to populate the project selection dropdown. |
| `preselectedProjectId` | `string` (optional) | ID of the project to pre-select. |

#### Features
- **Template Support:** Users can choose from predefined templates (Feature, Bug Fix, etc.) to pre-fill fields.
- **Form Validation:** Ensures required fields like Project, Title, and Duration are filled.
- **Collapsible Sections:** "Additional Context" section is collapsible to keep the UI clean.

### ProjectsList

Located in `src/components/ProjectsList/ProjectsList.tsx`.

A full-page component that displays a list of all projects. It provides filtering capabilities and navigation to individual project details.

#### Features
- **Filtering:** Filter projects by status (All, Active, Complete, Paused).
- **Navigation:** Click on a project row to navigate to its details page.
- **Status Indicators:** Visual indicators for project status and priority.

### SessionTemplates

Located in `src/components/SessionTemplates/SessionTemplates.tsx` (referenced by `SessionLogger`).

A modal component for selecting a session template.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `onSelectTemplate` | `(template: SessionTemplate) => void` | Callback when a template is selected. |
| `onClose` | `() => void` | Callback to close the modal. |

#### Usage
Used within the `SessionLogger` to allow quick setup of common session types.
