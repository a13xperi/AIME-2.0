/**
 * Agent Alex - Type Definitions
 * Defines all TypeScript types for the application
 */

/**
 * Project status options
 */
export type ProjectStatus = 'Active' | 'Paused' | 'Complete' | 'Archived';

/**
 * Project priority levels
 */
export type ProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';

/**
 * Session status options
 */
export type SessionStatus =
  | 'Active'
  | 'In Progress'
  | 'Paused'
  | 'Completed'
  | 'Archived'
  | 'Blocked';

/**
 * Session type categories
 */
export type SessionType =
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
export type ProjectType =
  | 'Web Application'
  | 'Mobile App'
  | 'API/Backend'
  | 'Infrastructure'
  | 'Documentation'
  | 'Library/Package';

/**
 * Main Project interface
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  workspace: string;
  type: ProjectType;
  startedDate: string;
  lastUpdated: string;
  currentContext: string;
  repository?: string;
  localPath?: string;
  deploymentUrl?: string;
  backlogItems: number;
  statusNotes: string;
  nextSteps: string;
  blockers: string;
  techStack: string[];
  tags: string[];
  relatedSessions?: string[]; // Session IDs
}

/**
 * Session interface for tracking work sessions
 */
export interface Session {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  projectId: string;
  projectName?: string;
  status: SessionStatus;
  summary: string;
  filesModified: string;
  nextSteps: string;
  blockers: string;
  aiAgent: string;
  workspace: string;
  type: SessionType;
  tags: string[];

  // Extended fields from Notion
  keyDecisions?: string;
  challenges?: string;
  solutions?: string;
  codeChanges?: string;
  technologiesUsed?: string[];
  links?: string;
  notes?: string;
  outcomes?: string;
  learnings?: string;
  context?: string;
  toolsUsed?: string;
}

/**
 * Context snapshot for resuming work
 */
export interface ProjectContext {
  projectId: string;
  projectName: string;
  currentStatus: string;
  lastSession: Session;
  nextSteps: string[];
  blockers: string[];
  filesInProgress: string[];
  localPath?: string;
  repository?: string;
  deploymentUrl?: string;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects?: number;
  totalSessions: number;
  totalHours: number;
  thisWeekSessions?: number;
  thisWeekHours?: number;
  completedSessions?: number;
  technologiesCount?: number;
  sessionsWithFiles?: number;
}

/**
 * Project category statistics
 */
export interface CategoryStats {
  name: string;
  projectCount: number;
  activeProjects: number;
  sessionCount: number;
  totalHours: number;
}

/**
 * Filter options for project list
 */
export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  workspace?: string[];
  type?: ProjectType[];
  tags?: string[];
  search?: string;
}

/**
 * Filter options for session list
 */
export interface SessionFilters {
  projectId?: string;
  status?: SessionStatus[];
  type?: SessionType[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Notion database schema metadata
 */
export interface NotionDatabaseSchema {
  projectsDatabase: string;
  sessionsDatabase: string;
}
