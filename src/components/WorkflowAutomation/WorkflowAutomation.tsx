import React, { useState, useEffect } from 'react';
import { Project, Session, Workflow, WorkflowExecution, AutomationRule, WorkflowTemplate } from '../../types';
import './WorkflowAutomation.css';

interface WorkflowAutomationProps {
  projects: Project[];
  sessions: Session[];
  onClose: () => void;
}

const WorkflowAutomation: React.FC<WorkflowAutomationProps> = ({
  projects,
  sessions,
  onClose
}) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'workflows' | 'executions' | 'rules' | 'templates'>('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: 'workflow-1',
        name: 'Daily Project Status Update',
        description: 'Automatically updates project status and sends daily reports',
        category: 'project_management',
        status: 'active',
        version: '1.2.0',
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        executionCount: 45,
        successRate: 96.7,
        averageExecutionTime: 120,
        triggers: [
          {
            id: 'trigger-1',
            type: 'schedule',
            name: 'Daily at 9 AM',
            description: 'Runs every weekday at 9:00 AM',
            configuration: {
              schedule: {
                frequency: 'daily',
                time: '09:00',
                days: [1, 2, 3, 4, 5]
              }
            },
            enabled: true,
            lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            triggerCount: 45
          }
        ],
        steps: [
          {
            id: 'step-1',
            name: 'Fetch Active Projects',
            type: 'action',
            description: 'Retrieve all active projects from the database',
            order: 1,
            configuration: {
              action: {
                type: 'fetch_projects',
                parameters: { status: 'active' },
                timeout: 30
              }
            },
            enabled: true,
            onError: 'stop',
            dependencies: []
          },
          {
            id: 'step-2',
            name: 'Generate Status Report',
            type: 'data_transform',
            description: 'Process project data and generate status report',
            order: 2,
            configuration: {
              dataTransform: {
                input: 'projects',
                output: 'status_report',
                transformation: 'generate_project_status',
                schema: { type: 'object' }
              }
            },
            enabled: true,
            onError: 'continue',
            dependencies: ['step-1']
          },
          {
            id: 'step-3',
            name: 'Send Email Notification',
            type: 'notification',
            description: 'Send daily status report via email',
            order: 3,
            configuration: {
              notification: {
                type: 'email',
                recipients: ['team@company.com'],
                template: 'daily_status_report',
                data: { report: '{{status_report}}' }
              }
            },
            enabled: true,
            onError: 'continue',
            dependencies: ['step-2']
          }
        ],
        conditions: [],
        variables: [
          {
            id: 'var-1',
            name: 'team_email',
            type: 'string',
            value: 'team@company.com',
            description: 'Team email address for notifications',
            scope: 'workflow',
            encrypted: false,
            required: true
          }
        ],
        settings: {
          maxConcurrentExecutions: 1,
          timeout: 300,
          retryPolicy: {
            maxRetries: 3,
            backoffStrategy: 'exponential',
            initialDelay: 5
          },
          logging: {
            level: 'info',
            retention: 30
          },
          notifications: {
            onSuccess: false,
            onFailure: true,
            onTimeout: true,
            recipients: ['admin@company.com']
          },
          security: {
            requireApproval: false,
            allowedUsers: ['user-1'],
            restrictedActions: []
          }
        },
        permissions: {
          canView: ['user-1', 'user-2'],
          canEdit: ['user-1'],
          canExecute: ['user-1'],
          canDelete: ['user-1'],
          canShare: ['user-1']
        }
      },
      {
        id: 'workflow-2',
        name: 'Session Completion Automation',
        description: 'Automatically processes completed sessions and updates project progress',
        category: 'productivity',
        status: 'active',
        version: '1.0.0',
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        executionCount: 23,
        successRate: 100,
        averageExecutionTime: 45,
        triggers: [
          {
            id: 'trigger-2',
            type: 'event',
            name: 'Session Completed',
            description: 'Triggers when a session is marked as completed',
            configuration: {
              event: {
                source: 'session_tracker',
                eventType: 'session_completed',
                filters: { status: 'completed' }
              }
            },
            enabled: true,
            lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            triggerCount: 23
          }
        ],
        steps: [
          {
            id: 'step-4',
            name: 'Update Project Progress',
            type: 'action',
            description: 'Update project progress based on session completion',
            order: 1,
            configuration: {
              action: {
                type: 'update_project_progress',
                parameters: { sessionId: '{{session_id}}' }
              }
            },
            enabled: true,
            onError: 'retry',
            dependencies: []
          },
          {
            id: 'step-5',
            name: 'Create Follow-up Task',
            type: 'action',
            description: 'Create follow-up tasks based on session outcomes',
            order: 2,
            configuration: {
              action: {
                type: 'create_followup_tasks',
                parameters: { sessionId: '{{session_id}}' }
              }
            },
            enabled: true,
            onError: 'continue',
            dependencies: ['step-4']
          }
        ],
        conditions: [],
        variables: [],
        settings: {
          maxConcurrentExecutions: 5,
          timeout: 120,
          retryPolicy: {
            maxRetries: 2,
            backoffStrategy: 'linear',
            initialDelay: 10
          },
          logging: {
            level: 'debug',
            retention: 14
          },
          notifications: {
            onSuccess: false,
            onFailure: true,
            onTimeout: false,
            recipients: ['user-1']
          },
          security: {
            requireApproval: false,
            allowedUsers: ['user-1'],
            restrictedActions: []
          }
        },
        permissions: {
          canView: ['user-1'],
          canEdit: ['user-1'],
          canExecute: ['user-1'],
          canDelete: ['user-1'],
          canShare: ['user-1']
        }
      }
    ];

    const mockExecutions: WorkflowExecution[] = [
      {
        id: 'exec-1',
        workflowId: 'workflow-1',
        status: 'completed',
        triggerId: 'trigger-1',
        triggeredBy: 'system',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120 * 1000).toISOString(),
        duration: 120,
        steps: [
          {
            id: 'exec-step-1',
            stepId: 'step-1',
            status: 'completed',
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000).toISOString(),
            duration: 30,
            input: { status: 'active' },
            output: { projects: 12 },
            retryCount: 0
          },
          {
            id: 'exec-step-2',
            stepId: 'step-2',
            status: 'completed',
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 90 * 1000).toISOString(),
            duration: 60,
            input: { projects: 12 },
            output: { report: 'Generated successfully' },
            retryCount: 0
          },
          {
            id: 'exec-step-3',
            stepId: 'step-3',
            status: 'completed',
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 90 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120 * 1000).toISOString(),
            duration: 30,
            input: { report: 'Generated successfully' },
            output: { emailSent: true },
            retryCount: 0
          }
        ],
        variables: { team_email: 'team@company.com' },
        logs: [
          {
            id: 'log-1',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            level: 'info',
            message: 'Workflow execution started',
            stepId: undefined,
            data: { triggerId: 'trigger-1' }
          },
          {
            id: 'log-2',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000).toISOString(),
            level: 'info',
            message: 'Fetched 12 active projects',
            stepId: 'step-1',
            data: { count: 12 }
          }
        ],
        metadata: {
          source: 'scheduler',
          userAgent: 'WorkflowEngine/1.0'
        }
      }
    ];

    const mockAutomationRules: AutomationRule[] = [
      {
        id: 'rule-1',
        name: 'Auto-assign High Priority Tasks',
        description: 'Automatically assigns high priority tasks to available team members',
        category: 'task_management',
        enabled: true,
        priority: 1,
        conditions: [
          {
            id: 'cond-1',
            field: 'priority',
            operator: 'equals',
            value: 'high',
            logicalOperator: 'AND'
          },
          {
            id: 'cond-2',
            field: 'status',
            operator: 'equals',
            value: 'pending'
          }
        ],
        actions: [
          {
            id: 'action-1',
            type: 'assign_user',
            parameters: { userId: 'auto-assign' },
            delay: 0
          }
        ],
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastExecuted: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        executionCount: 8,
        successRate: 100
      }
    ];

    const mockTemplates: WorkflowTemplate[] = [
      {
        id: 'template-1',
        name: 'Project Onboarding Workflow',
        description: 'Complete project setup and team assignment workflow',
        category: 'project_management',
        tags: ['onboarding', 'project', 'team'],
        difficulty: 'intermediate',
        estimatedSetupTime: 15,
        useCases: ['New project setup', 'Team onboarding', 'Project initialization'],
        template: mockWorkflows[0],
        preview: {
          description: 'Automates the complete project onboarding process',
          features: ['Project creation', 'Team assignment', 'Resource allocation', 'Notification setup']
        },
        author: 'system',
        createdAt: new Date().toISOString(),
        downloads: 156,
        rating: 4.8,
        reviews: 23
      }
    ];

    setWorkflows(mockWorkflows);
    setExecutions(mockExecutions);
    setAutomationRules(mockAutomationRules);
    setTemplates(mockTemplates);
  }, []);

  const handleWorkflowToggle = (workflowId: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? { 
              ...workflow, 
              status: workflow.status === 'active' ? 'paused' : 'active',
              updatedAt: new Date().toISOString()
            }
          : workflow
      )
    );
  };

  const handleExecuteWorkflow = (workflowId: string) => {
    // Simulate workflow execution
    const newExecution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId,
      status: 'running',
      triggerId: 'manual',
      triggeredBy: 'user-1',
      startedAt: new Date().toISOString(),
      steps: [],
      variables: {},
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Manual workflow execution started',
          data: { triggeredBy: 'user-1' }
        }
      ],
      metadata: {
        source: 'manual',
        userAgent: 'AgentAlex/1.0'
      }
    };

    setExecutions(prev => [newExecution, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'draft': return '#6b7280';
      case 'archived': return '#9ca3af';
      case 'completed': return '#10b981';
      case 'running': return '#3b82f6';
      case 'failed': return '#dc2626';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return '⚡';
      case 'project_management': return '📋';
      case 'communication': return '💬';
      case 'data_processing': return '🔄';
      case 'task_management': return '✅';
      default: return '🔧';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="workflow-automation-overlay">
      <div className="workflow-automation-modal">
        <div className="automation-header">
          <h2>🤖 Workflow Automation</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="automation-content">
          <div className="automation-tabs">
            <button 
              className={`tab-button ${activeTab === 'workflows' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflows')}
            >
              🔄 Workflows ({workflows.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'executions' ? 'active' : ''}`}
              onClick={() => setActiveTab('executions')}
            >
              📊 Executions ({executions.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              ⚙️ Rules ({automationRules.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              📋 Templates ({templates.length})
            </button>
          </div>

          <div className="automation-body">
            {activeTab === 'workflows' && (
              <div className="workflows-section">
                <div className="section-header">
                  <h3>Active Workflows</h3>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowWorkflowBuilder(true)}
                  >
                    ➕ Create Workflow
                  </button>
                </div>

                <div className="workflows-grid">
                  {workflows.map(workflow => (
                    <div key={workflow.id} className="workflow-card">
                      <div className="workflow-header">
                        <div className="workflow-title">
                          <h4>
                            {getCategoryIcon(workflow.category)} {workflow.name}
                          </h4>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(workflow.status) }}
                          >
                            {workflow.status}
                          </span>
                        </div>
                        <div className="workflow-actions">
                          <button 
                            className="btn btn-outline btn-small"
                            onClick={() => handleWorkflowToggle(workflow.id)}
                          >
                            {workflow.status === 'active' ? '⏸️ Pause' : '▶️ Start'}
                          </button>
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => handleExecuteWorkflow(workflow.id)}
                          >
                            ▶️ Run
                          </button>
                        </div>
                      </div>

                      <p className="workflow-description">{workflow.description}</p>

                      <div className="workflow-stats">
                        <div className="stat-item">
                          <span className="stat-label">Executions:</span>
                          <span className="stat-value">{workflow.executionCount}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Success Rate:</span>
                          <span className="stat-value">{workflow.successRate}%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Avg Time:</span>
                          <span className="stat-value">{formatDuration(workflow.averageExecutionTime)}</span>
                        </div>
                      </div>

                      <div className="workflow-triggers">
                        <h5>Triggers:</h5>
                        <div className="triggers-list">
                          {workflow.triggers.map(trigger => (
                            <div key={trigger.id} className="trigger-item">
                              <span className="trigger-type">{trigger.type}</span>
                              <span className="trigger-name">{trigger.name}</span>
                              <span className={`trigger-status ${trigger.enabled ? 'enabled' : 'disabled'}`}>
                                {trigger.enabled ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="workflow-meta">
                        <span className="meta-item">v{workflow.version}</span>
                        <span className="meta-item">
                          Last run: {workflow.lastRun ? new Date(workflow.lastRun).toLocaleString() : 'Never'}
                        </span>
                        {workflow.nextRun && (
                          <span className="meta-item">
                            Next run: {new Date(workflow.nextRun).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'executions' && (
              <div className="executions-section">
                <div className="section-header">
                  <h3>Recent Executions</h3>
                </div>

                <div className="executions-list">
                  {executions.map(execution => {
                    const workflow = workflows.find(w => w.id === execution.workflowId);
                    return (
                      <div key={execution.id} className="execution-card">
                        <div className="execution-header">
                          <div className="execution-title">
                            <h4>{workflow?.name || 'Unknown Workflow'}</h4>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(execution.status) }}
                            >
                              {execution.status}
                            </span>
                          </div>
                          <div className="execution-meta">
                            <span className="execution-duration">
                              {execution.duration ? formatDuration(execution.duration) : 'Running...'}
                            </span>
                            <span className="execution-time">
                              {new Date(execution.startedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="execution-steps">
                          <h5>Steps:</h5>
                          <div className="steps-list">
                            {execution.steps.map(step => {
                              const workflowStep = workflow?.steps.find(s => s.id === step.stepId);
                              return (
                                <div key={step.id} className="step-item">
                                  <div className="step-header">
                                    <span className="step-name">
                                      {workflowStep?.name || 'Unknown Step'}
                                    </span>
                                    <span 
                                      className="step-status"
                                      style={{ backgroundColor: getStatusColor(step.status) }}
                                    >
                                      {step.status}
                                    </span>
                                  </div>
                                  {step.duration && (
                                    <span className="step-duration">
                                      {formatDuration(step.duration)}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {execution.error && (
                          <div className="execution-error">
                            <h5>Error:</h5>
                            <p>{execution.error.message}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="rules-section">
                <div className="section-header">
                  <h3>Automation Rules</h3>
                  <button className="btn btn-primary">
                    ➕ Create Rule
                  </button>
                </div>

                <div className="rules-list">
                  {automationRules.map(rule => (
                    <div key={rule.id} className="rule-card">
                      <div className="rule-header">
                        <div className="rule-title">
                          <h4>
                            {getCategoryIcon(rule.category)} {rule.name}
                          </h4>
                          <span className={`rule-status ${rule.enabled ? 'enabled' : 'disabled'}`}>
                            {rule.enabled ? '✓ Enabled' : '✗ Disabled'}
                          </span>
                        </div>
                        <div className="rule-actions">
                          <button className="btn btn-outline btn-small">
                            Edit
                          </button>
                          <button className="btn btn-secondary btn-small">
                            {rule.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>

                      <p className="rule-description">{rule.description}</p>

                      <div className="rule-conditions">
                        <h5>Conditions:</h5>
                        <div className="conditions-list">
                          {rule.conditions.map((condition, index) => (
                            <div key={condition.id} className="condition-item">
                              {index > 0 && (
                                <span className="logical-operator">
                                  {condition.logicalOperator || 'AND'}
                                </span>
                              )}
                              <span className="condition-text">
                                {condition.field} {condition.operator} {JSON.stringify(condition.value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rule-stats">
                        <div className="stat-item">
                          <span className="stat-label">Executions:</span>
                          <span className="stat-value">{rule.executionCount}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Success Rate:</span>
                          <span className="stat-value">{rule.successRate}%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Last Run:</span>
                          <span className="stat-value">
                            {rule.lastExecuted ? new Date(rule.lastExecuted).toLocaleString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="templates-section">
                <div className="section-header">
                  <h3>Workflow Templates</h3>
                </div>

                <div className="templates-grid">
                  {templates.map(template => (
                    <div key={template.id} className="template-card">
                      <div className="template-header">
                        <h4>
                          {getCategoryIcon(template.category)} {template.name}
                        </h4>
                        <div className="template-rating">
                          <span className="rating-stars">⭐ {template.rating}</span>
                          <span className="rating-count">({template.reviews})</span>
                        </div>
                      </div>

                      <p className="template-description">{template.description}</p>

                      <div className="template-meta">
                        <div className="meta-item">
                          <span className="meta-label">Difficulty:</span>
                          <span className="meta-value">{template.difficulty}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Setup Time:</span>
                          <span className="meta-value">{template.estimatedSetupTime} min</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Downloads:</span>
                          <span className="meta-value">{template.downloads}</span>
                        </div>
                      </div>

                      <div className="template-features">
                        <h5>Features:</h5>
                        <ul>
                          {template.preview.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="template-actions">
                        <button className="btn btn-primary">
                          Use Template
                        </button>
                        <button className="btn btn-outline">
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAutomation;
