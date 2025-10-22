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

/**
 * Advanced Integration & API Management System interfaces
 */
export interface ApiEndpoint {
  id: string;
  name: string;
  description: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  category: 'projects' | 'sessions' | 'analytics' | 'workflows' | 'integrations' | 'custom';
  version: string;
  status: 'active' | 'deprecated' | 'beta' | 'maintenance';
  authentication: {
    required: boolean;
    type: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2' | 'jwt';
    scopes?: string[];
  };
  rateLimit: {
    requests: number;
    period: 'minute' | 'hour' | 'day';
    burst?: number;
  };
  parameters: ApiParameter[];
  responses: ApiResponseSpec[];
  examples: ApiExample[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  usageCount: number;
  errorRate: number;
  averageResponseTime: number;
}

export interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
  location: 'query' | 'path' | 'header' | 'body';
}

export interface ApiResponseSpec {
  statusCode: number;
  description: string;
  contentType: string;
  schema: any;
  examples?: any[];
}

export interface ApiExample {
  name: string;
  description: string;
  request: {
    headers?: Record<string, string>;
    body?: any;
    query?: Record<string, string>;
  };
  response: {
    statusCode: number;
    headers?: Record<string, string>;
    body?: any;
  };
}

export interface Webhook {
  id: string;
  name: string;
  description: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error' | 'testing';
  authentication: {
    type: 'none' | 'api_key' | 'bearer' | 'hmac' | 'oauth2';
    credentials: Record<string, string>;
  };
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
    initialDelay: number;
  };
  filters: WebhookFilter[];
  transformations: WebhookTransformation[];
  headers: Record<string, string>;
  timeout: number;
  createdAt: string;
  updatedAt: string;
  lastTriggered?: string;
  triggerCount: number;
  successRate: number;
  averageResponseTime: number;
  lastError?: {
    message: string;
    timestamp: string;
    statusCode?: number;
  };
}

export interface WebhookFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface WebhookTransformation {
  type: 'map' | 'filter' | 'transform' | 'enrich';
  configuration: Record<string, any>;
  order: number;
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  description: string;
  service: string;
  category: 'productivity' | 'communication' | 'development' | 'analytics' | 'storage' | 'payment' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  configuration: {
    apiKey?: string;
    secret?: string;
    baseUrl?: string;
    version?: string;
    customHeaders?: Record<string, string>;
    timeout?: number;
    retryPolicy?: {
      maxRetries: number;
      backoffStrategy: 'linear' | 'exponential';
      initialDelay: number;
    };
  };
  capabilities: IntegrationCapability[];
  webhooks: string[];
  syncSettings: {
    enabled: boolean;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
    lastSync?: string;
    nextSync?: string;
    direction: 'import' | 'export' | 'bidirectional';
  };
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  };
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  usageCount: number;
  errorCount: number;
  healthScore: number;
}

export interface IntegrationCapability {
  name: string;
  description: string;
  type: 'data_sync' | 'webhook' | 'api_call' | 'file_transfer' | 'notification';
  endpoints: string[];
  parameters: Record<string, any>;
  rateLimit?: {
    requests: number;
    period: string;
  };
}

export interface ApiDocumentation {
  id: string;
  title: string;
  description: string;
  version: string;
  baseUrl: string;
  contact: {
    name: string;
    email: string;
    url?: string;
  };
  license: {
    name: string;
    url?: string;
  };
  servers: ApiServer[];
  endpoints: string[];
  schemas: ApiSchema[];
  examples: ApiExample[];
  changelog: ApiChangelogEntry[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface ApiServer {
  url: string;
  description: string;
  environment: 'development' | 'staging' | 'production';
}

export interface ApiSchema {
  name: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  description: string;
  properties?: Record<string, any>;
  required?: string[];
  examples?: any[];
}

export interface ApiChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
    description: string;
    endpoint?: string;
  }[];
}

export interface ApiUsage {
  id: string;
  endpointId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  errorMessage?: string;
  metadata: Record<string, any>;
}

export interface ApiKey {
  id: string;
  name: string;
  description: string;
  key: string;
  prefix: string;
  permissions: {
    endpoints: string[];
    methods: string[];
    rateLimit: {
      requests: number;
      period: string;
    };
  };
  status: 'active' | 'inactive' | 'revoked';
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
  createdAt: string;
  createdBy: string;
  metadata: Record<string, any>;
}

export interface IntegrationTest {
  id: string;
  name: string;
  description: string;
  integrationId: string;
  type: 'connection' | 'data_sync' | 'webhook' | 'api_call' | 'end_to_end';
  configuration: Record<string, any>;
  expectedResult: any;
  actualResult?: any;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  errorMessage?: string;
  logs: IntegrationTestLog[];
  createdAt: string;
  createdBy: string;
}

export interface IntegrationTestLog {
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  data?: any;
}

/**
 * Advanced Security & Compliance System interfaces
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin?: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
  metadata: {
    department?: string;
    title?: string;
    location?: string;
    timezone?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    failedLoginAttempts: number;
    lastFailedLogin?: string;
    accountLockedUntil?: string;
  };
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number; // 1-10, higher = more privileges
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'admin';
  conditions?: PermissionCondition[];
  createdAt: string;
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: {
    method?: string;
    endpoint?: string;
    ipAddress: string;
    userAgent: string;
    requestBody?: any;
    responseStatus?: number;
    errorMessage?: string;
  };
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security';
  tags: string[];
  metadata: Record<string, any>;
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'permission_denied' | 'data_breach' | 'suspicious_activity' | 'system_compromise' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolution?: string;
  evidence: SecurityEvidence[];
  impact: {
    affectedUsers: number;
    affectedData: string[];
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
  remediation: {
    steps: string[];
    completed: boolean;
    completedAt?: string;
  };
}

export interface SecurityEvidence {
  type: 'log' | 'screenshot' | 'file' | 'network' | 'database';
  content: string;
  timestamp: string;
  source: string;
  hash?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'gdpr' | 'ccpa' | 'sox' | 'hipaa' | 'pci_dss' | 'iso27001' | 'custom';
  requirements: ComplianceRequirement[];
  assessments: ComplianceAssessment[];
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_assessed';
  lastAssessment: string;
  nextAssessment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  controls: ComplianceControl[];
  evidence: ComplianceEvidence[];
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_assessed';
  lastReviewed: string;
  nextReview: string;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective';
  implementation: 'automated' | 'manual' | 'hybrid';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  owner: string;
  status: 'implemented' | 'partial' | 'not_implemented';
  effectiveness: number; // 0-100
  lastTested: string;
  nextTest: string;
}

export interface ComplianceEvidence {
  id: string;
  type: 'document' | 'screenshot' | 'log' | 'test_result' | 'policy' | 'training';
  title: string;
  description: string;
  filePath?: string;
  content?: string;
  collectedBy: string;
  collectedAt: string;
  validUntil: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ComplianceAssessment {
  id: string;
  frameworkId: string;
  name: string;
  description: string;
  assessor: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  findings: ComplianceFinding[];
  overallScore: number; // 0-100
  recommendations: string[];
  reportPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceFinding {
  id: string;
  requirementId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  recommendations: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  assignedTo?: string;
  dueDate?: string;
  resolvedAt?: string;
}

export interface DataClassification {
  id: string;
  name: string;
  level: number; // 1-5, higher = more sensitive
  description: string;
  examples: string[];
  handlingRequirements: {
    encryption: boolean;
    accessControl: string[];
    retention: number; // days
    backup: boolean;
    sharing: 'internal' | 'restricted' | 'prohibited';
  };
  applicableFrameworks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DataInventory {
  id: string;
  name: string;
  description: string;
  type: 'database' | 'file' | 'api' | 'third_party' | 'backup';
  location: string;
  classification: string;
  owner: string;
  custodian: string;
  dataSubjects: string[]; // for GDPR
  purposes: string[];
  retentionPeriod: number; // days
  lastAccessed: string;
  accessCount: number;
  securityMeasures: string[];
  risks: DataRisk[];
  createdAt: string;
  updatedAt: string;
}

export interface DataRisk {
  id: string;
  type: 'confidentiality' | 'integrity' | 'availability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  likelihood: number; // 0-100
  impact: number; // 0-100
  riskScore: number; // calculated
  mitigation: string[];
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted';
  owner: string;
  dueDate?: string;
  lastReviewed: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'access_control' | 'data_protection' | 'incident_response' | 'business_continuity' | 'vendor_management';
  version: string;
  status: 'draft' | 'active' | 'archived';
  content: string;
  applicableRoles: string[];
  effectiveDate: string;
  reviewDate: string;
  approvedBy: string;
  approvedAt: string;
  acknowledgments: PolicyAcknowledgment[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAcknowledgment {
  userId: string;
  userName: string;
  acknowledgedAt: string;
  version: string;
}

export interface SecurityTraining {
  id: string;
  title: string;
  description: string;
  type: 'mandatory' | 'optional' | 'role_specific';
  category: 'general' | 'phishing' | 'data_protection' | 'incident_response' | 'compliance';
  duration: number; // minutes
  content: string;
  quiz?: SecurityQuiz;
  requiredRoles: string[];
  completions: TrainingCompletion[];
  createdAt: string;
  updatedAt: string;
}

export interface SecurityQuiz {
  questions: QuizQuestion[];
  passingScore: number; // percentage
  attempts: number;
  timeLimit?: number; // minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface TrainingCompletion {
  userId: string;
  userName: string;
  completedAt: string;
  score?: number;
  attempts: number;
  certificate?: string;
}

/**
 * Advanced Mobile Optimization & PWA Features interfaces
 */
export interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation: 'portrait' | 'landscape' | 'any';
  theme_color: string;
  background_color: string;
  icons: PWAIcon[];
  categories: string[];
  lang: string;
  dir: 'ltr' | 'rtl';
  scope: string;
  id?: string;
  related_applications?: PWAApplication[];
  prefer_related_applications?: boolean;
  edge_side_panel?: {
    preferred_width: number;
  };
  shortcuts?: PWAShortcut[];
  screenshots?: PWAScreenshot[];
  share_target?: PWAShareTarget;
  protocol_handlers?: PWAProtocolHandler[];
  file_handlers?: PWAFileHandler[];
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome';
  label?: string;
}

export interface PWAApplication {
  platform: string;
  url: string;
  id?: string;
  min_version?: string;
  fingerprints?: PWAFingerprint[];
}

export interface PWAFingerprint {
  type: string;
  value: string;
}

export interface PWAShortcut {
  name: string;
  short_name?: string;
  description?: string;
  url: string;
  icons?: PWAIcon[];
}

export interface PWAScreenshot {
  src: string;
  sizes: string;
  type: string;
  form_factor: 'narrow' | 'wide';
  label?: string;
}

export interface PWAShareTarget {
  action: string;
  method?: 'GET' | 'POST';
  enctype?: string;
  params: PWAShareParam[];
}

export interface PWAShareParam {
  name: string;
  value: string;
}

export interface PWAProtocolHandler {
  protocol: string;
  url: string;
}

export interface PWAFileHandler {
  action: string;
  accept: Record<string, string[]>;
}

export interface ServiceWorkerConfig {
  version: string;
  cacheName: string;
  strategies: CacheStrategy[];
  offlinePages: string[];
  backgroundSync: BackgroundSyncConfig;
  pushNotifications: PushNotificationConfig;
  updateStrategy: 'immediate' | 'skipWaiting' | 'prompt';
}

export interface CacheStrategy {
  pattern: string;
  strategy: 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate' | 'networkOnly' | 'cacheOnly';
  cacheName?: string;
  plugins?: CachePlugin[];
}

export interface CachePlugin {
  name: string;
  config: Record<string, any>;
}

export interface BackgroundSyncConfig {
  enabled: boolean;
  queueName: string;
  maxRetries: number;
  retryDelay: number;
  events: string[];
}

export interface PushNotificationConfig {
  enabled: boolean;
  vapidPublicKey: string;
  supportedActions: NotificationAction[];
  defaultOptions: NotificationOptions;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
  actions?: NotificationAction[];
}

export interface MobileOptimization {
  touchTargets: TouchTargetConfig;
  gestures: GestureConfig;
  orientation: OrientationConfig;
  performance: PerformanceConfig;
  accessibility: AccessibilityConfig;
  responsive: ResponsiveConfig;
}

export interface TouchTargetConfig {
  minSize: number;
  spacing: number;
  feedback: 'haptic' | 'visual' | 'both';
  longPressDelay: number;
  swipeThreshold: number;
}

export interface GestureConfig {
  swipe: SwipeConfig;
  pinch: PinchConfig;
  rotate: RotateConfig;
  pan: PanConfig;
}

export interface SwipeConfig {
  enabled: boolean;
  directions: ('left' | 'right' | 'up' | 'down')[];
  threshold: number;
  velocity: number;
  preventDefault: boolean;
}

export interface PinchConfig {
  enabled: boolean;
  minScale: number;
  maxScale: number;
  threshold: number;
}

export interface RotateConfig {
  enabled: boolean;
  threshold: number;
  preventDefault: boolean;
}

export interface PanConfig {
  enabled: boolean;
  threshold: number;
  preventDefault: boolean;
  direction: 'horizontal' | 'vertical' | 'both';
}

export interface OrientationConfig {
  supported: ('portrait' | 'landscape')[];
  lock: boolean;
  autoRotate: boolean;
  transition: 'smooth' | 'instant';
}

export interface PerformanceConfig {
  lazyLoading: boolean;
  imageOptimization: boolean;
  codeSplitting: boolean;
  preloading: boolean;
  compression: boolean;
  caching: boolean;
}

export interface AccessibilityConfig {
  screenReader: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  focusManagement: boolean;
}

export interface ResponsiveConfig {
  breakpoints: ResponsiveBreakpoint[];
  fluid: boolean;
  container: ContainerConfig;
  grid: GridConfig;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  columns: number;
  gutter: number;
}

export interface ContainerConfig {
  maxWidth: number;
  padding: number;
  center: boolean;
}

export interface GridConfig {
  columns: number;
  gutter: number;
  margin: number;
}

export interface OfflineCapability {
  enabled: boolean;
  storage: OfflineStorage;
  sync: OfflineSync;
  conflict: ConflictResolution;
  indicators: OfflineIndicators;
}

export interface OfflineStorage {
  type: 'indexeddb' | 'websql' | 'localstorage';
  maxSize: number;
  compression: boolean;
  encryption: boolean;
  versioning: boolean;
}

export interface OfflineSync {
  enabled: boolean;
  strategy: 'immediate' | 'periodic' | 'manual';
  interval: number;
  retryPolicy: RetryPolicy;
  conflictResolution: 'server' | 'client' | 'manual' | 'timestamp';
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay: number;
}

export interface ConflictResolution {
  strategy: 'lastWriteWins' | 'merge' | 'manual';
  autoResolve: boolean;
  notifyUser: boolean;
  preserveHistory: boolean;
}

export interface OfflineIndicators {
  showStatus: boolean;
  showSyncProgress: boolean;
  showConflicts: boolean;
  position: 'top' | 'bottom' | 'floating';
  style: 'banner' | 'toast' | 'badge';
}

export interface MobileFeature {
  id: string;
  name: string;
  description: string;
  category: 'navigation' | 'input' | 'display' | 'performance' | 'accessibility';
  enabled: boolean;
  config: Record<string, any>;
  dependencies: string[];
  compatibility: CompatibilityInfo;
  performance: PerformanceMetrics;
}

export interface CompatibilityInfo {
  browsers: string[];
  devices: string[];
  os: string[];
  versions: string[];
  features: string[];
}

export interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  batteryImpact: 'low' | 'medium' | 'high';
  networkUsage: number;
  cpuUsage: number;
}

export interface MobileAnalytics {
  deviceInfo: DeviceInfo;
  performance: PerformanceData;
  usage: UsageData;
  errors: ErrorData[];
  features: FeatureUsage[];
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  vendor: string;
  model: string;
  screen: ScreenInfo;
  connection: ConnectionInfo;
  battery: BatteryInfo;
  memory: MemoryInfo;
  storage: StorageInfo;
}

export interface ScreenInfo {
  width: number;
  height: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  colorDepth: number;
  touchSupport: boolean;
}

export interface ConnectionInfo {
  type: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface BatteryInfo {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

export interface MemoryInfo {
  used: number;
  total: number;
  limit: number;
}

export interface StorageInfo {
  used: number;
  quota: number;
  available: number;
}

export interface PerformanceData {
  navigation: NavigationTiming;
  paint: PaintTiming;
  resources: ResourceTiming[];
  longTasks: LongTask[];
  layoutShifts: LayoutShift[];
  firstInput: FirstInput;
}

export interface NavigationTiming {
  loadEventEnd: number;
  loadEventStart: number;
  domContentLoadedEventEnd: number;
  domContentLoadedEventStart: number;
  responseEnd: number;
  responseStart: number;
  requestStart: number;
  navigationStart: number;
  redirectEnd: number;
  redirectStart: number;
  unloadEventEnd: number;
  unloadEventStart: number;
}

export interface PaintTiming {
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

export interface ResourceTiming {
  name: string;
  startTime: number;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
}

export interface LongTask {
  startTime: number;
  duration: number;
  name: string;
  attribution: TaskAttribution[];
}

export interface TaskAttribution {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  containerType: string;
  containerSrc: string;
  containerId: string;
  containerName: string;
}

export interface LayoutShift {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources: LayoutShiftSource[];
}

export interface LayoutShiftSource {
  node: string;
  previousRect: DOMRect;
  currentRect: DOMRect;
}

export interface FirstInput {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
  target: string;
  type: string;
}

export interface UsageData {
  sessions: SessionData[];
  pageViews: PageViewData[];
  interactions: InteractionData[];
  errors: ErrorData[];
  customEvents: CustomEventData[];
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  pageViews: number;
  interactions: number;
  device: DeviceInfo;
  location: LocationInfo;
}

export interface LocationInfo {
  country: string;
  region: string;
  city: string;
  timezone: string;
  language: string;
}

export interface PageViewData {
  url: string;
  title: string;
  timestamp: number;
  duration: number;
  referrer: string;
  loadTime: number;
}

export interface InteractionData {
  type: 'click' | 'scroll' | 'swipe' | 'pinch' | 'keyboard' | 'touch';
  target: string;
  timestamp: number;
  duration: number;
  coordinates: Coordinates;
  metadata: Record<string, any>;
}

export interface Coordinates {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
}

export interface ErrorData {
  message: string;
  stack: string;
  filename: string;
  lineno: number;
  colno: number;
  timestamp: number;
  userAgent: string;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'resource' | 'promise' | 'custom';
}

export interface CustomEventData {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  metadata: Record<string, any>;
}

export interface FeatureUsage {
  featureId: string;
  featureName: string;
  usageCount: number;
  lastUsed: number;
  averageDuration: number;
  successRate: number;
  errorRate: number;
  userSatisfaction: number;
}

