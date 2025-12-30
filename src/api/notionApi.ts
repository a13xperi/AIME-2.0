/**
 * @fileoverview Agent Alex - Notion API Client
 * 
 * This module provides a type-safe API client for communicating with the
 * Agent Alex backend server, which interfaces with Notion databases.
 * 
 * @module api/notionApi
 * @author Agent Alex Team
 * @version 1.0.0
 * 
 * @example
 * // Import and use the API functions
 * import { fetchProjects, createSession } from './api/notionApi';
 * 
 * // Fetch all active projects
 * const response = await fetchProjects({ status: ['Active'] });
 * if (response.success) {
 *   console.log('Projects:', response.data);
 * }
 */

import { Project, Session, ProjectFilters, SessionFilters, ApiResponse } from '../types';
import { logger } from '../utils/logger';

/**
 * Base URL for API requests.
 * Uses VITE_API_URL environment variable or defaults to localhost for development.
 * @constant {string}
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fetches all projects from the Notion database with optional filtering.
 * 
 * @async
 * @function fetchProjects
 * @param {ProjectFilters} [filters] - Optional filters to apply to the query
 * @param {string} [filters.search] - Search term to filter projects by name/description
 * @param {ProjectStatus[]} [filters.status] - Filter by project status (Active, Paused, etc.)
 * @param {string[]} [filters.workspace] - Filter by workspace path
 * @returns {Promise<ApiResponse<Project[]>>} Promise resolving to API response with projects array
 * 
 * @example
 * // Fetch all projects
 * const allProjects = await fetchProjects();
 * 
 * @example
 * // Fetch with filters
 * const activeProjects = await fetchProjects({
 *   status: ['Active', 'Paused'],
 *   search: 'authentication'
 * });
 * 
 * @example
 * // Handle response
 * const response = await fetchProjects();
 * if (response.success && response.data) {
 *   response.data.forEach(project => console.log(project.name));
 * } else {
 *   console.error('Error:', response.error);
 * }
 */
export const fetchProjects = async (filters?: ProjectFilters): Promise<ApiResponse<Project[]>> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.status) queryParams.append('status', filters.status.join(','));
    if (filters?.workspace) queryParams.append('workspace', filters.workspace.join(','));

    const response = await fetch(`${API_URL}/api/projects?${queryParams}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch projects');
    }

    return {
      success: true,
      data: data.projects,
    };
  } catch (error) {
    logger.error('Error fetching projects:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Fetches a single project by its unique identifier.
 * 
 * @async
 * @function fetchProject
 * @param {string} projectId - The unique Notion page ID of the project
 * @returns {Promise<ApiResponse<Project>>} Promise resolving to API response with project data
 * @throws {Error} When network request fails or project is not found
 * 
 * @example
 * // Fetch a specific project
 * const response = await fetchProject('abc123-def456');
 * if (response.success && response.data) {
 *   console.log('Project name:', response.data.name);
 *   console.log('Status:', response.data.status);
 * }
 * 
 * @example
 * // Use in a React component
 * useEffect(() => {
 *   const loadProject = async () => {
 *     const { success, data, error } = await fetchProject(projectId);
 *     if (success) setProject(data);
 *     else setError(error);
 *   };
 *   loadProject();
 * }, [projectId]);
 */
export const fetchProject = async (projectId: string): Promise<ApiResponse<Project>> => {
  try {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch project');
    }

    return {
      success: true,
      data: data.project,
    };
  } catch (error) {
    logger.error('Error fetching project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Creates a new project in the Notion database.
 * 
 * @async
 * @function createProject
 * @param {Partial<Project>} project - Project data to create
 * @param {string} project.name - Project name (required)
 * @param {string} [project.description] - Project description
 * @param {ProjectStatus} [project.status='Active'] - Initial project status
 * @param {ProjectPriority} [project.priority='Medium'] - Project priority level
 * @param {ProjectType} [project.type] - Project type/category
 * @param {string} [project.workspace] - Workspace/folder path
 * @param {string} [project.repository] - Git repository URL
 * @param {string[]} [project.techStack] - Technologies used
 * @returns {Promise<ApiResponse<Project>>} Promise resolving to API response with created project
 * 
 * @example
 * // Create a basic project
 * const response = await createProject({
 *   name: 'My New Project',
 *   description: 'A great new project',
 *   status: 'Active',
 *   priority: 'High'
 * });
 * 
 * @example
 * // Create with full details
 * const response = await createProject({
 *   name: 'E-commerce Platform',
 *   description: 'Full-stack e-commerce solution',
 *   status: 'Active',
 *   priority: 'Critical',
 *   type: 'Web Application',
 *   workspace: '/projects/ecommerce',
 *   repository: 'https://github.com/user/ecommerce',
 *   techStack: ['React', 'Node.js', 'PostgreSQL']
 * });
 * 
 * if (response.success) {
 *   console.log('Created project ID:', response.data.id);
 * }
 */
export const createProject = async (project: Partial<Project>): Promise<ApiResponse<Project>> => {
  try {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create project');
    }

    return {
      success: true,
      data: data.project,
      message: 'Project created successfully',
    };
  } catch (error) {
    logger.error('Error creating project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Updates an existing project with partial data.
 * Only the fields provided in the updates object will be modified.
 * 
 * @async
 * @function updateProject
 * @param {string} projectId - The unique Notion page ID of the project to update
 * @param {Partial<Project>} updates - Object containing fields to update
 * @returns {Promise<ApiResponse<Project>>} Promise resolving to API response with updated project
 * 
 * @example
 * // Update project status
 * const response = await updateProject('abc123', {
 *   status: 'Complete'
 * });
 * 
 * @example
 * // Update multiple fields
 * const response = await updateProject('abc123', {
 *   status: 'Active',
 *   priority: 'Critical',
 *   nextSteps: 'Deploy to production',
 *   blockers: ''
 * });
 * 
 * @example
 * // Handle in component
 * const handleStatusChange = async (newStatus: ProjectStatus) => {
 *   const { success, error } = await updateProject(project.id, { status: newStatus });
 *   if (success) {
 *     showNotification('Project updated!');
 *     refreshProject();
 *   } else {
 *     showError(error);
 *   }
 * };
 */
export const updateProject = async (
  projectId: string,
  updates: Partial<Project>
): Promise<ApiResponse<Project>> => {
  try {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update project');
    }

    return {
      success: true,
      data: data.project,
      message: 'Project updated successfully',
    };
  } catch (error) {
    logger.error('Error updating project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Fetches work sessions from the Notion database with optional filtering.
 * Sessions are returned sorted by date in descending order (newest first).
 * 
 * @async
 * @function fetchSessions
 * @param {SessionFilters} [filters] - Optional filters to apply to the query
 * @param {string} [filters.projectId] - Filter sessions by project ID or name
 * @param {string} [filters.search] - Search term to filter by title/summary
 * @param {SessionStatus[]} [filters.status] - Filter by session status
 * @returns {Promise<ApiResponse<Session[]>>} Promise resolving to API response with sessions array
 * 
 * @example
 * // Fetch all sessions
 * const allSessions = await fetchSessions();
 * 
 * @example
 * // Fetch sessions for a specific project
 * const projectSessions = await fetchSessions({
 *   projectId: 'project-123'
 * });
 * 
 * @example
 * // Fetch completed sessions matching search
 * const completedSessions = await fetchSessions({
 *   status: ['Completed'],
 *   search: 'authentication'
 * });
 * 
 * @example
 * // Calculate total hours from sessions
 * const response = await fetchSessions();
 * if (response.success && response.data) {
 *   const totalMinutes = response.data.reduce((sum, s) => sum + s.duration, 0);
 *   console.log('Total hours:', totalMinutes / 60);
 * }
 */
export const fetchSessions = async (filters?: SessionFilters): Promise<ApiResponse<Session[]>> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.projectId) queryParams.append('projectId', filters.projectId);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.status) queryParams.append('status', filters.status.join(','));

    const response = await fetch(`${API_URL}/api/sessions?${queryParams}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch sessions');
    }

    return {
      success: true,
      data: data.sessions,
    };
  } catch (error) {
    logger.error('Error fetching sessions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Creates a new work session in the Notion database.
 * Use this to log completed work sessions with details about what was accomplished.
 * 
 * @async
 * @function createSession
 * @param {Partial<Session>} session - Session data to create
 * @param {string} session.title - Session title (required)
 * @param {string} [session.projectId] - Associated project ID
 * @param {number} [session.duration] - Duration in minutes
 * @param {string} [session.summary] - Summary of work done
 * @param {SessionType} [session.type] - Type of session (Feature Development, Bug Fix, etc.)
 * @param {string} [session.aiAgent] - AI agent used (Claude, GPT-4, etc.)
 * @param {string} [session.workspace] - Development workspace (Cursor, VS Code, etc.)
 * @param {string} [session.filesModified] - List of files modified
 * @param {string} [session.nextSteps] - Planned next steps
 * @param {string} [session.blockers] - Current blockers
 * @returns {Promise<ApiResponse<Session>>} Promise resolving to API response with created session
 * 
 * @example
 * // Log a basic session
 * const response = await createSession({
 *   title: 'Implemented user login',
 *   projectId: 'project-123',
 *   duration: 90,
 *   summary: 'Added email/password authentication'
 * });
 * 
 * @example
 * // Log a detailed session
 * const response = await createSession({
 *   title: 'OAuth2 Integration',
 *   projectId: 'project-123',
 *   duration: 180,
 *   type: 'Feature Development',
 *   aiAgent: 'Claude',
 *   workspace: 'Cursor',
 *   summary: 'Implemented Google OAuth2 login flow',
 *   filesModified: 'auth.ts, Login.tsx, api.ts, types.ts',
 *   codeChanges: 'Added OAuth provider, login component, token handling',
 *   nextSteps: 'Add GitHub and Discord OAuth providers',
 *   blockers: '',
 *   keyDecisions: 'Used NextAuth for session management',
 *   learnings: 'OAuth state parameter prevents CSRF attacks'
 * });
 */
export const createSession = async (session: Partial<Session>): Promise<ApiResponse<Session>> => {
  try {
    const response = await fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create session');
    }

    return {
      success: true,
      data: data.session,
      message: 'Session logged successfully',
    };
  } catch (error) {
    logger.error('Error creating session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Retrieves the current context for a project to help resume work.
 * Returns project status, last session details, next steps, and blockers.
 * 
 * @async
 * @function getProjectContext
 * @param {string} projectId - The unique Notion page ID of the project
 * @returns {Promise<ApiResponse<ProjectContext>>} Promise resolving to API response with project context
 * 
 * @example
 * // Get context before resuming work
 * const response = await getProjectContext('project-123');
 * if (response.success && response.data) {
 *   console.log('Last session:', response.data.lastSession?.title);
 *   console.log('Next steps:', response.data.nextSteps);
 *   console.log('Blockers:', response.data.blockers);
 * }
 * 
 * @example
 * // Use in QuickResume component
 * const loadContext = async () => {
 *   const { success, data } = await getProjectContext(project.id);
 *   if (success) {
 *     setContext(data);
 *     setLastSession(data.lastSession);
 *   }
 * };
 */
export const getProjectContext = async (projectId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/api/projects/${projectId}/context`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch project context');
    }

    return {
      success: true,
      data: data.context,
    };
  } catch (error) {
    logger.error('Error fetching project context:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Fetches aggregated dashboard statistics from the server.
 * Includes total projects, sessions, hours logged, and other metrics.
 * 
 * @async
 * @function fetchDashboardStats
 * @returns {Promise<ApiResponse<DashboardStats>>} Promise resolving to API response with dashboard statistics
 * 
 * @example
 * // Fetch and display stats
 * const response = await fetchDashboardStats();
 * if (response.success && response.data) {
 *   const stats = response.data;
 *   console.log(`Total projects: ${stats.totalProjects}`);
 *   console.log(`Active projects: ${stats.activeProjects}`);
 *   console.log(`Total sessions: ${stats.totalSessions}`);
 *   console.log(`Hours logged: ${stats.totalHours}`);
 * }
 * 
 * @example
 * // Use in Dashboard component
 * useEffect(() => {
 *   const loadStats = async () => {
 *     const { success, data } = await fetchDashboardStats();
 *     if (success) setStats(data);
 *   };
 *   loadStats();
 *   
 *   // Refresh every 30 seconds
 *   const interval = setInterval(loadStats, 30000);
 *   return () => clearInterval(interval);
 * }, []);
 */
export const fetchDashboardStats = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/api/dashboard/stats`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch dashboard stats');
    }

    return {
      success: true,
      data: data.stats,
    };
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
