/**
 * Agent Alex - Notion API Client
 * Handles all communication with Notion API
 */

import { Project, Session, ProjectFilters, SessionFilters, ApiResponse } from '../types';
import { logger } from '../utils/logger';

// Use environment variable or default to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fetch all projects from Notion
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
 * Fetch a single project by ID
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
 * Create a new project in Notion
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
 * Update an existing project
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
 * Fetch sessions with optional filters
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
 * Create a new session
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
 * Get project context for resuming work
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
 * Get dashboard statistics
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
