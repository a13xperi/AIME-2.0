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
export type SessionStatus = 'In Progress' | 'Completed' | 'Paused';

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

/**
 * Project Template interfaces
 */
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  templateData: {
    projectName: string;
    description: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
    estimatedDuration: number; // in hours
    phases: ProjectPhase[];
    defaultSessions: SessionTemplate[];
    checklist: ChecklistItem[];
    resources: Resource[];
  };
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number;
  dependencies: string[];
  deliverables: string[];
  checklist: ChecklistItem[];
}

export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  type: SessionType;
  estimatedDuration: number;
  objectives: string[];
  deliverables: string[];
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  isRequired: boolean;
  order: number;
  category?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'Document' | 'Link' | 'Tool' | 'Reference';
  url?: string;
  description: string;
  category: string;
}

/**
 * Advanced Project Management interfaces
 */
export interface ProjectDependency {
  id: string;
  projectId: string;
  dependsOnProjectId: string;
  dependencyType: 'blocks' | 'enables' | 'relates';
  description?: string;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deliverables: string[];
  dependencies: string[];
  progress: number; // 0-100
}

export interface ProjectTimeline {
  id: string;
  projectId: string;
  phases: TimelinePhase[];
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
}

export interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'delayed';
  progress: number;
  dependencies: string[];
  milestones: string[];
  color: string;
}

export interface ProjectHealth {
  projectId: string;
  overallScore: number; // 0-100
  indicators: {
    onTime: number;
    onBudget: number;
    quality: number;
    teamSatisfaction: number;
    stakeholderSatisfaction: number;
  };
  risks: ProjectRisk[];
  alerts: ProjectAlert[];
  lastUpdated: string;
}

export interface ProjectRisk {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  impact: number; // 0-100
  mitigation: string;
  owner: string;
  status: 'identified' | 'monitoring' | 'mitigating' | 'resolved';
}

export interface ProjectAlert {
  id: string;
  type: 'deadline' | 'budget' | 'quality' | 'resource' | 'dependency';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  actionRequired: boolean;
}

/**
 * Advanced Reporting & Export System interfaces
 */
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'project' | 'session' | 'productivity' | 'team' | 'custom';
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  templateData: {
    title: string;
    sections: ReportSection[];
    filters: ReportFilter[];
    format: 'pdf' | 'html' | 'csv' | 'json';
    styling: ReportStyling;
    schedule?: ReportSchedule;
  };
}

export interface ReportSection {
  id: string;
  type: 'summary' | 'charts' | 'tables' | 'text' | 'metrics' | 'timeline';
  title: string;
  dataSource: string;
  configuration: any;
  order: number;
  visible: boolean;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'date_range' | 'greater_than' | 'less_than';
  value: any;
  label: string;
}

export interface ReportStyling {
  theme: 'light' | 'dark' | 'corporate' | 'minimal';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    monospace: string;
  };
  layout: {
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
}

export interface ReportSchedule {
  id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  recipients: string[];
  enabled: boolean;
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  generatedAt: string;
  generatedBy: string;
  data: any;
  format: 'pdf' | 'html' | 'csv' | 'json';
  filePath?: string;
  fileSize?: number;
  status: 'generating' | 'completed' | 'failed' | 'archived';
  error?: string;
  metadata: {
    recordCount: number;
    dateRange: {
      start: string;
      end: string;
    };
    filters: ReportFilter[];
  };
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'excel';
  includeCharts: boolean;
  includeImages: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    projects?: string[];
    sessions?: string[];
    categories?: string[];
    status?: string[];
  };
  styling?: ReportStyling;
}

export interface ReportAnalytics {
  reportId: string;
  views: number;
  downloads: number;
  lastViewed: string;
  averageGenerationTime: number;
  successRate: number;
  userFeedback?: {
    rating: number;
    comments: string;
  };
}

/**
 * AI-Powered Insights & Recommendations System interfaces
 */
export interface AIInsight {
  id: string;
  type: 'productivity' | 'efficiency' | 'pattern' | 'recommendation' | 'prediction' | 'optimization';
  category: 'workflow' | 'time_management' | 'project_management' | 'collaboration' | 'learning';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  data: {
    metrics: Record<string, number>;
    trends: TrendData[];
    comparisons: ComparisonData[];
  };
  recommendations: AIRecommendation[];
  createdAt: string;
  expiresAt?: string;
  acknowledged: boolean;
  applied: boolean;
}

export interface TrendData {
  period: string;
  value: number;
  change: number; // percentage change from previous period
  direction: 'up' | 'down' | 'stable';
}

export interface ComparisonData {
  metric: string;
  current: number;
  average: number;
  benchmark: number;
  percentile: number; // 0-100
}

export interface AIRecommendation {
  id: string;
  type: 'action' | 'optimization' | 'prevention' | 'enhancement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  expectedImpact: {
    productivity: number; // 0-100
    efficiency: number; // 0-100
    timeSaved: number; // in minutes
  };
  steps: RecommendationStep[];
  prerequisites: string[];
  estimatedEffort: number; // in minutes
  successMetrics: string[];
  createdAt: string;
  applied: boolean;
  appliedAt?: string;
  feedback?: {
    rating: number; // 1-5
    comments: string;
    actualImpact: number; // 0-100
  };
}

export interface RecommendationStep {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number; // in minutes
  completed: boolean;
  resources?: {
    links: string[];
    tools: string[];
    documentation: string[];
  };
}

export interface WorkPattern {
  id: string;
  userId: string;
  patternType: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  name: string;
  description: string;
  frequency: number; // occurrences per period
  duration: number; // average duration in minutes
  productivity: number; // 0-100
  efficiency: number; // 0-100
  satisfaction: number; // 0-100
  data: {
    sessions: number;
    totalTime: number;
    averageSessionLength: number;
    peakHours: number[];
    preferredDays: number[];
    context: string[];
  };
  insights: string[];
  recommendations: string[];
  createdAt: string;
  lastUpdated: string;
}

export interface PredictiveAnalytics {
  id: string;
  type: 'project_completion' | 'session_outcome' | 'productivity_forecast' | 'risk_assessment';
  targetId: string; // project or session ID
  prediction: {
    outcome: string;
    probability: number; // 0-100
    timeframe: string;
    confidence: number; // 0-100
  };
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: string[];
  monitoring: {
    metrics: string[];
    thresholds: Record<string, number>;
    alerts: string[];
  };
  createdAt: string;
  expiresAt: string;
  accuracy?: number; // calculated after outcome is known
}

export interface SmartSuggestion {
  id: string;
  type: 'project' | 'session' | 'break' | 'focus' | 'collaboration' | 'learning';
  title: string;
  description: string;
  reasoning: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timeSensitive: boolean;
  expiresAt?: string;
  data: {
    context: Record<string, any>;
    triggers: string[];
    conditions: string[];
  };
  actions: {
    primary: string;
    secondary?: string;
    dismiss?: string;
  };
  createdAt: string;
  acknowledged: boolean;
  applied: boolean;
}

/**
 * Advanced Workflow Automation System interfaces
 */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'project_management' | 'communication' | 'data_processing' | 'custom';
  status: 'active' | 'paused' | 'draft' | 'archived';
  version: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  permissions: WorkflowPermissions;
}

export interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'event' | 'condition' | 'manual' | 'webhook';
  name: string;
  description: string;
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
      operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
      value: any;
    };
    webhook?: {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers: Record<string, string>;
      authentication?: {
        type: 'none' | 'basic' | 'bearer' | 'api_key';
        credentials: Record<string, string>;
      };
    };
  };
  enabled: boolean;
  lastTriggered?: string;
  triggerCount: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'loop' | 'delay' | 'notification' | 'data_transform' | 'api_call';
  description: string;
  order: number;
  configuration: {
    action?: {
      type: string;
      parameters: Record<string, any>;
      timeout?: number;
      retryPolicy?: {
        maxRetries: number;
        backoffStrategy: 'linear' | 'exponential';
        delay: number;
      };
    };
    condition?: {
      expression: string;
      trueSteps: string[];
      falseSteps: string[];
    };
    loop?: {
      type: 'for' | 'while' | 'foreach';
      condition: string;
      maxIterations?: number;
      steps: string[];
    };
    delay?: {
      duration: number;
      unit: 'seconds' | 'minutes' | 'hours' | 'days';
    };
    notification?: {
      type: 'email' | 'slack' | 'webhook' | 'in_app';
      recipients: string[];
      template: string;
      data: Record<string, any>;
    };
    dataTransform?: {
      input: string;
      output: string;
      transformation: string;
      schema: Record<string, any>;
    };
    apiCall?: {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      headers: Record<string, string>;
      body?: any;
      authentication?: {
        type: 'none' | 'basic' | 'bearer' | 'api_key';
        credentials: Record<string, string>;
      };
    };
  };
  enabled: boolean;
  onError: 'continue' | 'stop' | 'retry' | 'skip';
  timeout?: number;
  dependencies: string[];
}

export interface WorkflowCondition {
  id: string;
  name: string;
  description: string;
  expression: string;
  type: 'pre_condition' | 'post_condition' | 'step_condition';
  enabled: boolean;
  evaluationOrder: number;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
  description: string;
  scope: 'global' | 'workflow' | 'step';
  encrypted: boolean;
  required: boolean;
}

export interface WorkflowSettings {
  maxConcurrentExecutions: number;
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
    initialDelay: number;
  };
  logging: {
    level: 'none' | 'error' | 'warning' | 'info' | 'debug';
    retention: number;
  };
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    onTimeout: boolean;
    recipients: string[];
  };
  security: {
    requireApproval: boolean;
    allowedUsers: string[];
    restrictedActions: string[];
  };
}

export interface WorkflowPermissions {
  canView: string[];
  canEdit: string[];
  canExecute: string[];
  canDelete: string[];
  canShare: string[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  triggerId: string;
  triggeredBy: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  steps: WorkflowStepExecution[];
  variables: Record<string, any>;
  logs: WorkflowLog[];
  error?: {
    message: string;
    stack?: string;
    stepId?: string;
  };
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    source: string;
  };
}

export interface WorkflowStepExecution {
  id: string;
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  input: any;
  output?: any;
  error?: {
    message: string;
    stack?: string;
  };
  retryCount: number;
}

export interface WorkflowLog {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  stepId?: string;
  data?: any;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: 'task_management' | 'project_management' | 'communication' | 'data_processing' | 'custom';
  enabled: boolean;
  priority: number;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  schedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    days?: number[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
}

export interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists' | 'in' | 'not_in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface AutomationAction {
  id: string;
  type: 'create_task' | 'update_status' | 'send_notification' | 'assign_user' | 'set_priority' | 'add_tag' | 'create_project' | 'schedule_meeting' | 'send_email' | 'webhook_call';
  parameters: Record<string, any>;
  delay?: number;
  retryPolicy?: {
    maxRetries: number;
    delay: number;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedSetupTime: number;
  useCases: string[];
  template: Workflow;
  preview: {
    image?: string;
    description: string;
    features: string[];
  };
  author: string;
  createdAt: string;
  downloads: number;
  rating: number;
  reviews: number;
}

