import React, { useState, useEffect } from 'react';
import { Project, Session, ApiEndpoint, Webhook, ThirdPartyIntegration, ApiDocumentation, ApiKey, IntegrationTest } from '../../types';
import './IntegrationManagement.css';

interface IntegrationManagementProps {
  projects: Project[];
  sessions: Session[];
  onClose: () => void;
}

const IntegrationManagement: React.FC<IntegrationManagementProps> = ({
  projects,
  sessions,
  onClose
}) => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [tests, setTests] = useState<IntegrationTest[]>([]);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'webhooks' | 'integrations' | 'keys' | 'tests' | 'docs'>('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [showApiDocs, setShowApiDocs] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockEndpoints: ApiEndpoint[] = [
      {
        id: 'endpoint-1',
        name: 'Get Projects',
        description: 'Retrieve all projects with optional filtering',
        path: '/api/projects',
        method: 'GET',
        category: 'projects',
        version: 'v1',
        status: 'active',
        authentication: {
          required: true,
          type: 'api_key',
          scopes: ['read:projects']
        },
        rateLimit: {
          requests: 100,
          period: 'hour',
          burst: 10
        },
        parameters: [
          {
            name: 'status',
            type: 'string',
            required: false,
            description: 'Filter projects by status',
            location: 'query',
            validation: {
              enum: ['Active', 'Paused', 'Complete', 'Archived']
            }
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: 'Number of projects to return',
            defaultValue: 50,
            location: 'query',
            validation: {
              min: 1,
              max: 100
            }
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successful response',
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                projects: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Project' }
                },
                total: { type: 'number' },
                page: { type: 'number' }
              }
            }
          },
          {
            statusCode: 401,
            description: 'Unauthorized',
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        ],
        examples: [
          {
            name: 'Get Active Projects',
            description: 'Retrieve all active projects',
            request: {
              query: { status: 'Active', limit: '10' }
            },
            response: {
              statusCode: 200,
              body: {
                projects: [
                  {
                    id: 'proj-1',
                    name: 'Agent Alex',
                    status: 'Active',
                    priority: 'High'
                  }
                ],
                total: 1,
                page: 1
              }
            }
          }
        ],
        tags: ['projects', 'read'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        usageCount: 1247,
        errorRate: 0.2,
        averageResponseTime: 45
      },
      {
        id: 'endpoint-2',
        name: 'Create Session',
        description: 'Create a new work session',
        path: '/api/sessions',
        method: 'POST',
        category: 'sessions',
        version: 'v1',
        status: 'active',
        authentication: {
          required: true,
          type: 'api_key',
          scopes: ['write:sessions']
        },
        rateLimit: {
          requests: 200,
          period: 'hour'
        },
        parameters: [
          {
            name: 'session',
            type: 'object',
            required: true,
            description: 'Session data',
            location: 'body'
          }
        ],
        responses: [
          {
            statusCode: 201,
            description: 'Session created successfully',
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        ],
        examples: [],
        tags: ['sessions', 'write'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        usageCount: 89,
        errorRate: 1.1,
        averageResponseTime: 120
      }
    ];

    const mockWebhooks: Webhook[] = [
      {
        id: 'webhook-1',
        name: 'Project Status Updates',
        description: 'Notify external systems when project status changes',
        url: 'https://external-system.com/webhooks/project-status',
        events: ['project.status.changed', 'project.created', 'project.archived'],
        status: 'active',
        authentication: {
          type: 'hmac',
          credentials: {
            secret: 'webhook-secret-key'
          }
        },
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          initialDelay: 1000
        },
        filters: [
          {
            field: 'status',
            operator: 'equals',
            value: 'Complete'
          }
        ],
        transformations: [
          {
            type: 'map',
            configuration: {
              mapping: {
                'project.id': 'id',
                'project.name': 'title',
                'project.status': 'status'
              }
            },
            order: 1
          }
        ],
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AgentAlex/1.0'
        },
        timeout: 5000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastTriggered: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        triggerCount: 23,
        successRate: 95.7,
        averageResponseTime: 180
      }
    ];

    const mockIntegrations: ThirdPartyIntegration[] = [
      {
        id: 'integration-1',
        name: 'Slack Integration',
        description: 'Send notifications and updates to Slack channels',
        service: 'Slack',
        category: 'communication',
        status: 'connected',
        configuration: {
          apiKey: 'xoxb-***',
          baseUrl: 'https://slack.com/api',
          timeout: 10000
        },
        capabilities: [
          {
            name: 'Send Messages',
            description: 'Send messages to Slack channels',
            type: 'api_call',
            endpoints: ['/chat.postMessage'],
            parameters: {
              channel: 'string',
              text: 'string',
              blocks: 'array'
            }
          },
          {
            name: 'Update Status',
            description: 'Update user status in Slack',
            type: 'api_call',
            endpoints: ['/users.profile.set'],
            parameters: {
              status_text: 'string',
              status_emoji: 'string'
            }
          }
        ],
        webhooks: ['webhook-1'],
        syncSettings: {
          enabled: true,
          frequency: 'realtime',
          lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          direction: 'bidirectional'
        },
        permissions: {
          read: true,
          write: true,
          delete: false,
          admin: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        usageCount: 156,
        errorCount: 2,
        healthScore: 98.7
      },
      {
        id: 'integration-2',
        name: 'GitHub Integration',
        description: 'Sync project data with GitHub repositories',
        service: 'GitHub',
        category: 'development',
        status: 'connected',
        configuration: {
          apiKey: 'ghp_***',
          baseUrl: 'https://api.github.com',
          timeout: 15000
        },
        capabilities: [
          {
            name: 'Repository Sync',
            description: 'Sync repository information',
            type: 'data_sync',
            endpoints: ['/repos', '/repos/{owner}/{repo}'],
            parameters: {
              owner: 'string',
              repo: 'string'
            }
          }
        ],
        webhooks: [],
        syncSettings: {
          enabled: true,
          frequency: 'hourly',
          lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          nextSync: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          direction: 'import'
        },
        permissions: {
          read: true,
          write: false,
          delete: false,
          admin: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        usageCount: 89,
        errorCount: 0,
        healthScore: 100
      }
    ];

    const mockApiKeys: ApiKey[] = [
      {
        id: 'key-1',
        name: 'Frontend Application',
        description: 'API key for the main frontend application',
        key: 'ak_live_***',
        prefix: 'ak_live',
        permissions: {
          endpoints: ['/api/projects', '/api/sessions'],
          methods: ['GET', 'POST'],
          rateLimit: {
            requests: 1000,
            period: 'hour'
          }
        },
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        usageCount: 15420,
        createdAt: new Date().toISOString(),
        createdBy: 'user-1',
        metadata: {
          environment: 'production',
          application: 'frontend'
        }
      }
    ];

    const mockTests: IntegrationTest[] = [
      {
        id: 'test-1',
        name: 'Slack Connection Test',
        description: 'Test connection to Slack API',
        integrationId: 'integration-1',
        type: 'connection',
        configuration: {
          endpoint: '/auth.test',
          method: 'GET'
        },
        expectedResult: {
          ok: true,
          url: 'https://workspace.slack.com/'
        },
        actualResult: {
          ok: true,
          url: 'https://workspace.slack.com/',
          team: 'Agent Alex Team'
        },
        status: 'passed',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 500).toISOString(),
        duration: 500,
        logs: [
          {
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            level: 'info',
            message: 'Starting connection test',
            data: { integration: 'Slack' }
          },
          {
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 500).toISOString(),
            level: 'info',
            message: 'Connection test completed successfully',
            data: { responseTime: 500 }
          }
        ],
        createdAt: new Date().toISOString(),
        createdBy: 'user-1'
      }
    ];

    setEndpoints(mockEndpoints);
    setWebhooks(mockWebhooks);
    setIntegrations(mockIntegrations);
    setApiKeys(mockApiKeys);
    setTests(mockTests);
  }, []);

  const handleEndpointToggle = (endpointId: string) => {
    setEndpoints(prev => 
      prev.map(endpoint => 
        endpoint.id === endpointId 
          ? { 
              ...endpoint, 
              status: endpoint.status === 'active' ? 'deprecated' : 'active',
              updatedAt: new Date().toISOString()
            }
          : endpoint
      )
    );
  };

  const handleWebhookToggle = (webhookId: string) => {
    setWebhooks(prev => 
      prev.map(webhook => 
        webhook.id === webhookId 
          ? { 
              ...webhook, 
              status: webhook.status === 'active' ? 'inactive' : 'active',
              updatedAt: new Date().toISOString()
            }
          : webhook
      )
    );
  };

  const handleIntegrationToggle = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: integration.status === 'connected' ? 'disconnected' : 'connected',
              updatedAt: new Date().toISOString()
            }
          : integration
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'passed': return '#10b981';
      case 'inactive':
      case 'disconnected':
      case 'failed': return '#dc2626';
      case 'deprecated':
      case 'error': return '#f59e0b';
      case 'beta':
      case 'pending': return '#3b82f6';
      case 'maintenance':
      case 'testing': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#10b981';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#dc2626';
      case 'PATCH': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'projects': return '📋';
      case 'sessions': return '⏱️';
      case 'analytics': return '📊';
      case 'workflows': return '🔄';
      case 'integrations': return '🔗';
      case 'communication': return '💬';
      case 'development': return '💻';
      case 'productivity': return '⚡';
      default: return '🔧';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.floor(ms / 1000)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  return (
    <div className="integration-management-overlay">
      <div className="integration-management-modal">
        <div className="integration-header">
          <h2>🔗 Integration & API Management</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="integration-content">
          <div className="integration-tabs">
            <button 
              className={`tab-button ${activeTab === 'endpoints' ? 'active' : ''}`}
              onClick={() => setActiveTab('endpoints')}
            >
              🌐 API Endpoints ({endpoints.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'webhooks' ? 'active' : ''}`}
              onClick={() => setActiveTab('webhooks')}
            >
              🪝 Webhooks ({webhooks.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('integrations')}
            >
              🔌 Integrations ({integrations.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'keys' ? 'active' : ''}`}
              onClick={() => setActiveTab('keys')}
            >
              🔑 API Keys ({apiKeys.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              🧪 Tests ({tests.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
            >
              📚 Documentation
            </button>
          </div>

          <div className="integration-body">
            {activeTab === 'endpoints' && (
              <div className="endpoints-section">
                <div className="section-header">
                  <h3>API Endpoints</h3>
                  <button className="btn btn-primary">
                    ➕ Add Endpoint
                  </button>
                </div>

                <div className="endpoints-list">
                  {endpoints.map(endpoint => (
                    <div key={endpoint.id} className="endpoint-card">
                      <div className="endpoint-header">
                        <div className="endpoint-title">
                          <span 
                            className="method-badge"
                            style={{ backgroundColor: getMethodColor(endpoint.method) }}
                          >
                            {endpoint.method}
                          </span>
                          <h4>
                            {getCategoryIcon(endpoint.category)} {endpoint.name}
                          </h4>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(endpoint.status) }}
                          >
                            {endpoint.status}
                          </span>
                        </div>
                        <div className="endpoint-actions">
                          <button 
                            className="btn btn-outline btn-small"
                            onClick={() => handleEndpointToggle(endpoint.id)}
                          >
                            {endpoint.status === 'active' ? 'Deprecate' : 'Activate'}
                          </button>
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="endpoint-path">
                        <code>{endpoint.path}</code>
                        <span className="version-badge">v{endpoint.version}</span>
                      </div>

                      <p className="endpoint-description">{endpoint.description}</p>

                      <div className="endpoint-stats">
                        <div className="stat-item">
                          <span className="stat-label">Usage:</span>
                          <span className="stat-value">{endpoint.usageCount.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Error Rate:</span>
                          <span className="stat-value">{endpoint.errorRate}%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Avg Response:</span>
                          <span className="stat-value">{endpoint.averageResponseTime}ms</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Rate Limit:</span>
                          <span className="stat-value">{endpoint.rateLimit.requests}/{endpoint.rateLimit.period}</span>
                        </div>
                      </div>

                      <div className="endpoint-meta">
                        <span className="meta-item">
                          Auth: {endpoint.authentication.type}
                        </span>
                        <span className="meta-item">
                          Last used: {endpoint.lastUsed ? new Date(endpoint.lastUsed).toLocaleString() : 'Never'}
                        </span>
                        <span className="meta-item">
                          Tags: {endpoint.tags.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div className="webhooks-section">
                <div className="section-header">
                  <h3>Webhooks</h3>
                  <button className="btn btn-primary">
                    ➕ Add Webhook
                  </button>
                </div>

                <div className="webhooks-list">
                  {webhooks.map(webhook => (
                    <div key={webhook.id} className="webhook-card">
                      <div className="webhook-header">
                        <div className="webhook-title">
                          <h4>🪝 {webhook.name}</h4>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(webhook.status) }}
                          >
                            {webhook.status}
                          </span>
                        </div>
                        <div className="webhook-actions">
                          <button 
                            className="btn btn-outline btn-small"
                            onClick={() => handleWebhookToggle(webhook.id)}
                          >
                            {webhook.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button className="btn btn-primary btn-small">
                            Test
                          </button>
                        </div>
                      </div>

                      <div className="webhook-url">
                        <code>{webhook.url}</code>
                      </div>

                      <p className="webhook-description">{webhook.description}</p>

                      <div className="webhook-events">
                        <h5>Events:</h5>
                        <div className="events-list">
                          {webhook.events.map(event => (
                            <span key={event} className="event-tag">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="webhook-stats">
                        <div className="stat-item">
                          <span className="stat-label">Triggers:</span>
                          <span className="stat-value">{webhook.triggerCount}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Success Rate:</span>
                          <span className="stat-value">{webhook.successRate}%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Avg Response:</span>
                          <span className="stat-value">{webhook.averageResponseTime}ms</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Timeout:</span>
                          <span className="stat-value">{webhook.timeout}ms</span>
                        </div>
                      </div>

                      <div className="webhook-meta">
                        <span className="meta-item">
                          Auth: {webhook.authentication.type}
                        </span>
                        <span className="meta-item">
                          Last triggered: {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleString() : 'Never'}
                        </span>
                        {webhook.lastError && (
                          <span className="meta-item error">
                            Last error: {webhook.lastError.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="integrations-section">
                <div className="section-header">
                  <h3>Third-Party Integrations</h3>
                  <button className="btn btn-primary">
                    ➕ Add Integration
                  </button>
                </div>

                <div className="integrations-grid">
                  {integrations.map(integration => (
                    <div key={integration.id} className="integration-card">
                      <div className="integration-header">
                        <div className="integration-title">
                          <h4>
                            {getCategoryIcon(integration.category)} {integration.name}
                          </h4>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(integration.status) }}
                          >
                            {integration.status}
                          </span>
                        </div>
                        <div className="integration-actions">
                          <button 
                            className="btn btn-outline btn-small"
                            onClick={() => handleIntegrationToggle(integration.id)}
                          >
                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </button>
                          <button className="btn btn-primary btn-small">
                            Configure
                          </button>
                        </div>
                      </div>

                      <p className="integration-description">{integration.description}</p>

                      <div className="integration-service">
                        <span className="service-badge">{integration.service}</span>
                      </div>

                      <div className="integration-capabilities">
                        <h5>Capabilities:</h5>
                        <div className="capabilities-list">
                          {integration.capabilities.map(capability => (
                            <div key={capability.name} className="capability-item">
                              <span className="capability-name">{capability.name}</span>
                              <span className="capability-type">{capability.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="integration-stats">
                        <div className="stat-item">
                          <span className="stat-label">Usage:</span>
                          <span className="stat-value">{integration.usageCount}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Errors:</span>
                          <span className="stat-value">{integration.errorCount}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Health:</span>
                          <span className="stat-value">{integration.healthScore}%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Sync:</span>
                          <span className="stat-value">{integration.syncSettings.frequency}</span>
                        </div>
                      </div>

                      <div className="integration-meta">
                        <span className="meta-item">
                          Last used: {integration.lastUsed ? new Date(integration.lastUsed).toLocaleString() : 'Never'}
                        </span>
                        <span className="meta-item">
                          Last sync: {integration.syncSettings.lastSync ? new Date(integration.syncSettings.lastSync).toLocaleString() : 'Never'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'keys' && (
              <div className="keys-section">
                <div className="section-header">
                  <h3>API Keys</h3>
                  <button className="btn btn-primary">
                    ➕ Generate Key
                  </button>
                </div>

                <div className="keys-list">
                  {apiKeys.map(apiKey => (
                    <div key={apiKey.id} className="key-card">
                      <div className="key-header">
                        <div className="key-title">
                          <h4>🔑 {apiKey.name}</h4>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(apiKey.status) }}
                          >
                            {apiKey.status}
                          </span>
                        </div>
                        <div className="key-actions">
                          <button className="btn btn-outline btn-small">
                            Regenerate
                          </button>
                          <button className="btn btn-secondary btn-small">
                            Revoke
                          </button>
                        </div>
                      </div>

                      <div className="key-value">
                        <code>{apiKey.key}</code>
                        <button className="copy-button">📋</button>
                      </div>

                      <p className="key-description">{apiKey.description}</p>

                      <div className="key-permissions">
                        <h5>Permissions:</h5>
                        <div className="permissions-list">
                          <div className="permission-item">
                            <span className="permission-label">Endpoints:</span>
                            <span className="permission-value">{apiKey.permissions.endpoints.join(', ')}</span>
                          </div>
                          <div className="permission-item">
                            <span className="permission-label">Methods:</span>
                            <span className="permission-value">{apiKey.permissions.methods.join(', ')}</span>
                          </div>
                          <div className="permission-item">
                            <span className="permission-label">Rate Limit:</span>
                            <span className="permission-value">{apiKey.permissions.rateLimit.requests}/{apiKey.permissions.rateLimit.period}</span>
                          </div>
                        </div>
                      </div>

                      <div className="key-stats">
                        <div className="stat-item">
                          <span className="stat-label">Usage:</span>
                          <span className="stat-value">{apiKey.usageCount.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Created:</span>
                          <span className="stat-value">{new Date(apiKey.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Expires:</span>
                          <span className="stat-value">
                            {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Last Used:</span>
                          <span className="stat-value">
                            {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="tests-section">
                <div className="section-header">
                  <h3>Integration Tests</h3>
                  <button className="btn btn-primary">
                    ➕ Run Test
                  </button>
                </div>

                <div className="tests-list">
                  {tests.map(test => (
                    <div key={test.id} className="test-card">
                      <div className="test-header">
                        <div className="test-title">
                          <h4>🧪 {test.name}</h4>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(test.status) }}
                          >
                            {test.status}
                          </span>
                        </div>
                        <div className="test-actions">
                          <button className="btn btn-outline btn-small">
                            View Logs
                          </button>
                          <button className="btn btn-primary btn-small">
                            Run Again
                          </button>
                        </div>
                      </div>

                      <p className="test-description">{test.description}</p>

                      <div className="test-details">
                        <div className="detail-item">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{test.type}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Integration:</span>
                          <span className="detail-value">
                            {integrations.find(i => i.id === test.integrationId)?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">
                            {test.duration ? formatDuration(test.duration) : 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="test-results">
                        <div className="result-section">
                          <h5>Expected Result:</h5>
                          <pre className="result-json">
                            {JSON.stringify(test.expectedResult, null, 2)}
                          </pre>
                        </div>
                        {test.actualResult && (
                          <div className="result-section">
                            <h5>Actual Result:</h5>
                            <pre className="result-json">
                              {JSON.stringify(test.actualResult, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>

                      <div className="test-meta">
                        <span className="meta-item">
                          Started: {test.startedAt ? new Date(test.startedAt).toLocaleString() : 'N/A'}
                        </span>
                        <span className="meta-item">
                          Completed: {test.completedAt ? new Date(test.completedAt).toLocaleString() : 'N/A'}
                        </span>
                        {test.errorMessage && (
                          <span className="meta-item error">
                            Error: {test.errorMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="docs-section">
                <div className="section-header">
                  <h3>API Documentation</h3>
                  <button className="btn btn-primary">
                    📖 View Full Docs
                  </button>
                </div>

                <div className="docs-content">
                  <div className="docs-overview">
                    <h4>Agent Alex API v1</h4>
                    <p>
                      The Agent Alex API provides programmatic access to projects, sessions, 
                      analytics, and workflow management. All API endpoints are RESTful and 
                      return JSON responses.
                    </p>
                  </div>

                  <div className="docs-quick-start">
                    <h4>Quick Start</h4>
                    <div className="code-block">
                      <pre>
{`# Get your API key from the API Keys section
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.agentalex.com/v1/projects`}
                      </pre>
                    </div>
                  </div>

                  <div className="docs-endpoints">
                    <h4>Available Endpoints</h4>
                    <div className="endpoints-summary">
                      {endpoints.map(endpoint => (
                        <div key={endpoint.id} className="endpoint-summary">
                          <span 
                            className="method-badge"
                            style={{ backgroundColor: getMethodColor(endpoint.method) }}
                          >
                            {endpoint.method}
                          </span>
                          <code className="endpoint-path">{endpoint.path}</code>
                          <span className="endpoint-description">{endpoint.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationManagement;
