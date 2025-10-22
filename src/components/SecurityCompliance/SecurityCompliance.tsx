import React, { useState, useEffect } from 'react';
import { Project, Session, User, AuditLog, SecurityEvent, ComplianceFramework, DataInventory, SecurityPolicy, SecurityTraining } from '../../types';
import './SecurityCompliance.css';

interface SecurityComplianceProps {
  projects: Project[];
  sessions: Session[];
  onClose: () => void;
}

const SecurityCompliance: React.FC<SecurityComplianceProps> = ({
  projects,
  sessions,
  onClose
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [complianceFrameworks, setComplianceFrameworks] = useState<ComplianceFramework[]>([]);
  const [dataInventory, setDataInventory] = useState<DataInventory[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [securityTraining, setSecurityTraining] = useState<SecurityTraining[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'events' | 'compliance' | 'data' | 'policies' | 'training'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        email: 'alex@agentalex.com',
        name: 'Alex Johnson',
        avatar: 'https://via.placeholder.com/40',
        role: {
          id: 'role-1',
          name: 'Administrator',
          description: 'Full system access',
          permissions: ['*'],
          level: 10,
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        permissions: [
          {
            id: 'perm-1',
            name: 'Full Access',
            description: 'Complete system access',
            resource: '*',
            action: 'admin',
            createdAt: new Date().toISOString()
          }
        ],
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        loginCount: 1247,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          department: 'Engineering',
          title: 'Lead Developer',
          location: 'San Francisco',
          timezone: 'PST'
        },
        security: {
          twoFactorEnabled: true,
          passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          failedLoginAttempts: 0,
          lastFailedLogin: undefined,
          accountLockedUntil: undefined
        }
      },
      {
        id: 'user-2',
        email: 'sarah@agentalex.com',
        name: 'Sarah Chen',
        avatar: 'https://via.placeholder.com/40',
        role: {
          id: 'role-2',
          name: 'Project Manager',
          description: 'Project management access',
          permissions: ['projects:read', 'projects:write', 'sessions:read'],
          level: 5,
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        permissions: [
          {
            id: 'perm-2',
            name: 'Project Management',
            description: 'Manage projects and sessions',
            resource: 'projects',
            action: 'update',
            createdAt: new Date().toISOString()
          }
        ],
        status: 'active',
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        loginCount: 89,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          department: 'Product',
          title: 'Project Manager',
          location: 'New York',
          timezone: 'EST'
        },
        security: {
          twoFactorEnabled: false,
          passwordLastChanged: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          failedLoginAttempts: 2,
          lastFailedLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          accountLockedUntil: undefined
        }
      }
    ];

    const mockAuditLogs: AuditLog[] = [
      {
        id: 'audit-1',
        userId: 'user-1',
        userName: 'Alex Johnson',
        action: 'LOGIN',
        resource: 'authentication',
        details: {
          method: 'POST',
          endpoint: '/api/auth/login',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          responseStatus: 200
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'low',
        category: 'authentication',
        tags: ['login', 'success'],
        metadata: {
          sessionId: 'session-123',
          deviceId: 'device-456'
        }
      },
      {
        id: 'audit-2',
        userId: 'user-2',
        userName: 'Sarah Chen',
        action: 'CREATE_PROJECT',
        resource: 'projects',
        resourceId: 'proj-789',
        details: {
          method: 'POST',
          endpoint: '/api/projects',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          requestBody: { name: 'New Project', description: 'Project description' },
          responseStatus: 201
        },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        severity: 'medium',
        category: 'data_modification',
        tags: ['project', 'create'],
        metadata: {
          projectType: 'web_application'
        }
      },
      {
        id: 'audit-3',
        userId: 'user-2',
        userName: 'Sarah Chen',
        action: 'PERMISSION_DENIED',
        resource: 'admin',
        details: {
          method: 'GET',
          endpoint: '/api/admin/users',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          responseStatus: 403,
          errorMessage: 'Insufficient permissions'
        },
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        severity: 'high',
        category: 'authorization',
        tags: ['permission', 'denied', 'admin'],
        metadata: {
          requiredPermission: 'admin:users:read'
        }
      }
    ];

    const mockSecurityEvents: SecurityEvent[] = [
      {
        id: 'event-1',
        type: 'suspicious_activity',
        severity: 'high',
        title: 'Multiple Failed Login Attempts',
        description: 'User account showing multiple failed login attempts from different IP addresses',
        userId: 'user-2',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'investigating',
        assignedTo: 'security-team',
        evidence: [
          {
            type: 'log',
            content: 'Failed login attempts: 5 in 10 minutes',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'auth-service',
            hash: 'sha256:abc123'
          }
        ],
        impact: {
          affectedUsers: 1,
          affectedData: ['user-credentials'],
          businessImpact: 'medium'
        },
        remediation: {
          steps: [
            'Reset user password',
            'Enable two-factor authentication',
            'Review access logs',
            'Notify user of security incident'
          ],
          completed: false
        }
      }
    ];

    const mockComplianceFrameworks: ComplianceFramework[] = [
      {
        id: 'framework-1',
        name: 'GDPR Compliance',
        description: 'General Data Protection Regulation compliance framework',
        version: '1.0',
        type: 'gdpr',
        requirements: [
          {
            id: 'req-1',
            code: 'GDPR-001',
            title: 'Data Subject Rights',
            description: 'Implement mechanisms for data subjects to exercise their rights',
            category: 'Data Rights',
            priority: 'high',
            controls: [],
            evidence: [],
            status: 'compliant',
            lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        assessments: [],
        status: 'compliant',
        lastAssessment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextAssessment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockDataInventory: DataInventory[] = [
      {
        id: 'data-1',
        name: 'User Database',
        description: 'Primary user account and profile database',
        type: 'database',
        location: 'AWS RDS - us-west-2',
        classification: 'Personal Data',
        owner: 'user-1',
        custodian: 'user-1',
        dataSubjects: ['users', 'customers'],
        purposes: ['authentication', 'user_management', 'analytics'],
        retentionPeriod: 2555, // 7 years
        lastAccessed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        accessCount: 1247,
        securityMeasures: ['encryption_at_rest', 'encryption_in_transit', 'access_control'],
        risks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockSecurityPolicies: SecurityPolicy[] = [
      {
        id: 'policy-1',
        name: 'Password Policy',
        description: 'Requirements for user passwords and authentication',
        category: 'access_control',
        version: '2.1',
        status: 'active',
        content: 'Passwords must be at least 12 characters long, contain uppercase, lowercase, numbers, and special characters...',
        applicableRoles: ['all'],
        effectiveDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        approvedBy: 'security-team',
        approvedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        acknowledgments: [
          {
            userId: 'user-1',
            userName: 'Alex Johnson',
            acknowledgedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            version: '2.1'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockSecurityTraining: SecurityTraining[] = [
      {
        id: 'training-1',
        title: 'Data Protection Awareness',
        description: 'Training on data protection principles and GDPR compliance',
        type: 'mandatory',
        category: 'data_protection',
        duration: 45,
        content: 'This training covers the fundamentals of data protection...',
        requiredRoles: ['all'],
        completions: [
          {
            userId: 'user-1',
            userName: 'Alex Johnson',
            completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            score: 95,
            attempts: 1,
            certificate: 'cert-123'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setUsers(mockUsers);
    setAuditLogs(mockAuditLogs);
    setSecurityEvents(mockSecurityEvents);
    setComplianceFrameworks(mockComplianceFrameworks);
    setDataInventory(mockDataInventory);
    setSecurityPolicies(mockSecurityPolicies);
    setSecurityTraining(mockSecurityTraining);
  }, []);

  const handleUserStatusChange = (userId: string, status: User['status']) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status, updatedAt: new Date().toISOString() }
          : user
      )
    );
  };

  const handleSecurityEventStatusChange = (eventId: string, status: SecurityEvent['status']) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'compliant':
      case 'resolved': return '#10b981';
      case 'inactive':
      case 'non_compliant':
      case 'open': return '#dc2626';
      case 'suspended':
      case 'partial':
      case 'investigating': return '#f59e0b';
      case 'pending':
      case 'draft': return '#3b82f6';
      case 'archived':
      case 'false_positive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#dc2626';
      case 'critical': return '#7c2d12';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return '🔐';
      case 'authorization': return '🛡️';
      case 'data_access': return '📊';
      case 'data_modification': return '✏️';
      case 'system': return '⚙️';
      case 'security': return '🚨';
      case 'access_control': return '🔑';
      case 'data_protection': return '🔒';
      case 'incident_response': return '🚨';
      case 'business_continuity': return '🔄';
      case 'vendor_management': return '🤝';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="security-compliance-overlay">
      <div className="security-compliance-modal">
        <div className="security-header">
          <h2>🔒 Security & Compliance</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="security-content">
          <div className="security-tabs">
            <button 
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users ({users.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              📋 Audit Logs ({auditLogs.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              🚨 Security Events ({securityEvents.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'compliance' ? 'active' : ''}`}
              onClick={() => setActiveTab('compliance')}
            >
              📊 Compliance ({complianceFrameworks.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              💾 Data Inventory ({dataInventory.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              📜 Policies ({securityPolicies.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'training' ? 'active' : ''}`}
              onClick={() => setActiveTab('training')}
            >
              🎓 Training ({securityTraining.length})
            </button>
          </div>

          <div className="security-body">
            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h3>User Management</h3>
                  <button className="btn btn-primary">
                    ➕ Add User
                  </button>
                </div>

                <div className="users-list">
                  {users.map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-header">
                        <div className="user-info">
                          <img src={user.avatar} alt={user.name} className="user-avatar" />
                          <div className="user-details">
                            <h4>{user.name}</h4>
                            <p className="user-email">{user.email}</p>
                            <div className="user-role">
                              <span className="role-badge">{user.role.name}</span>
                              <span className="role-level">Level {user.role.level}</span>
                            </div>
                          </div>
                        </div>
                        <div className="user-status">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(user.status) }}
                          >
                            {user.status}
                          </span>
                          <div className="user-actions">
                            <button 
                              className="btn btn-outline btn-small"
                              onClick={() => setSelectedUser(user)}
                            >
                              View Details
                            </button>
                            <button 
                              className="btn btn-secondary btn-small"
                              onClick={() => handleUserStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                            >
                              {user.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="user-security">
                        <div className="security-item">
                          <span className="security-label">2FA:</span>
                          <span className={`security-value ${user.security.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                            {user.security.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                          </span>
                        </div>
                        <div className="security-item">
                          <span className="security-label">Last Login:</span>
                          <span className="security-value">
                            {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                          </span>
                        </div>
                        <div className="security-item">
                          <span className="security-label">Login Count:</span>
                          <span className="security-value">{user.loginCount.toLocaleString()}</span>
                        </div>
                        <div className="security-item">
                          <span className="security-label">Failed Attempts:</span>
                          <span className={`security-value ${user.security.failedLoginAttempts > 0 ? 'warning' : 'normal'}`}>
                            {user.security.failedLoginAttempts}
                          </span>
                        </div>
                      </div>

                      <div className="user-meta">
                        <span className="meta-item">
                          Department: {user.metadata.department || 'N/A'}
                        </span>
                        <span className="meta-item">
                          Location: {user.metadata.location || 'N/A'}
                        </span>
                        <span className="meta-item">
                          Created: {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="audit-section">
                <div className="section-header">
                  <h3>Audit Logs</h3>
                  <div className="audit-filters">
                    <select className="filter-select">
                      <option value="">All Categories</option>
                      <option value="authentication">Authentication</option>
                      <option value="authorization">Authorization</option>
                      <option value="data_access">Data Access</option>
                      <option value="data_modification">Data Modification</option>
                    </select>
                    <select className="filter-select">
                      <option value="">All Severities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="audit-logs">
                  {auditLogs.map(log => (
                    <div key={log.id} className="audit-log-card">
                      <div className="log-header">
                        <div className="log-info">
                          <h4>
                            {getCategoryIcon(log.category)} {log.action}
                          </h4>
                          <p className="log-user">{log.userName}</p>
                        </div>
                        <div className="log-meta">
                          <span 
                            className="severity-badge"
                            style={{ backgroundColor: getSeverityColor(log.severity) }}
                          >
                            {log.severity}
                          </span>
                          <span className="log-time">{formatDate(log.timestamp)}</span>
                        </div>
                      </div>

                      <div className="log-details">
                        <div className="detail-row">
                          <span className="detail-label">Resource:</span>
                          <span className="detail-value">{log.resource}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">IP Address:</span>
                          <span className="detail-value">{log.details.ipAddress}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">User Agent:</span>
                          <span className="detail-value">{log.details.userAgent}</span>
                        </div>
                        {log.details.endpoint && (
                          <div className="detail-row">
                            <span className="detail-label">Endpoint:</span>
                            <span className="detail-value">{log.details.method} {log.details.endpoint}</span>
                          </div>
                        )}
                        {log.details.responseStatus && (
                          <div className="detail-row">
                            <span className="detail-label">Status:</span>
                            <span className={`detail-value status-${log.details.responseStatus}`}>
                              {log.details.responseStatus}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="log-tags">
                        {log.tags.map(tag => (
                          <span key={tag} className="log-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="events-section">
                <div className="section-header">
                  <h3>Security Events</h3>
                  <button className="btn btn-primary">
                    ➕ Create Event
                  </button>
                </div>

                <div className="events-list">
                  {securityEvents.map(event => (
                    <div key={event.id} className="event-card">
                      <div className="event-header">
                        <div className="event-title">
                          <h4>🚨 {event.title}</h4>
                          <span 
                            className="severity-badge"
                            style={{ backgroundColor: getSeverityColor(event.severity) }}
                          >
                            {event.severity}
                          </span>
                        </div>
                        <div className="event-actions">
                          <button 
                            className="btn btn-outline btn-small"
                            onClick={() => handleSecurityEventStatusChange(event.id, 'investigating')}
                          >
                            Investigate
                          </button>
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => handleSecurityEventStatusChange(event.id, 'resolved')}
                          >
                            Resolve
                          </button>
                        </div>
                      </div>

                      <p className="event-description">{event.description}</p>

                      <div className="event-details">
                        <div className="detail-item">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{event.type.replace('_', ' ')}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Status:</span>
                          <span 
                            className="detail-value"
                            style={{ color: getStatusColor(event.status) }}
                          >
                            {event.status}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">IP Address:</span>
                          <span className="detail-value">{event.ipAddress}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Timestamp:</span>
                          <span className="detail-value">{formatDate(event.timestamp)}</span>
                        </div>
                      </div>

                      <div className="event-impact">
                        <h5>Impact Assessment:</h5>
                        <div className="impact-details">
                          <div className="impact-item">
                            <span className="impact-label">Affected Users:</span>
                            <span className="impact-value">{event.impact.affectedUsers}</span>
                          </div>
                          <div className="impact-item">
                            <span className="impact-label">Business Impact:</span>
                            <span 
                              className="impact-value"
                              style={{ color: getSeverityColor(event.impact.businessImpact) }}
                            >
                              {event.impact.businessImpact}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="event-remediation">
                        <h5>Remediation Steps:</h5>
                        <ul className="remediation-steps">
                          {event.remediation.steps.map((step, index) => (
                            <li key={index} className="remediation-step">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="compliance-section">
                <div className="section-header">
                  <h3>Compliance Frameworks</h3>
                  <button className="btn btn-primary">
                    ➕ Add Framework
                  </button>
                </div>

                <div className="frameworks-list">
                  {complianceFrameworks.map(framework => (
                    <div key={framework.id} className="framework-card">
                      <div className="framework-header">
                        <div className="framework-title">
                          <h4>📊 {framework.name}</h4>
                          <span className="framework-version">v{framework.version}</span>
                        </div>
                        <div className="framework-status">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(framework.status) }}
                          >
                            {framework.status}
                          </span>
                        </div>
                      </div>

                      <p className="framework-description">{framework.description}</p>

                      <div className="framework-details">
                        <div className="detail-item">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{framework.type.toUpperCase()}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Requirements:</span>
                          <span className="detail-value">{framework.requirements.length}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Last Assessment:</span>
                          <span className="detail-value">{formatDate(framework.lastAssessment)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Next Assessment:</span>
                          <span className="detail-value">{formatDate(framework.nextAssessment)}</span>
                        </div>
                      </div>

                      <div className="framework-requirements">
                        <h5>Requirements:</h5>
                        <div className="requirements-list">
                          {framework.requirements.map(requirement => (
                            <div key={requirement.id} className="requirement-item">
                              <div className="requirement-header">
                                <span className="requirement-code">{requirement.code}</span>
                                <span className="requirement-title">{requirement.title}</span>
                                <span 
                                  className="requirement-status"
                                  style={{ color: getStatusColor(requirement.status) }}
                                >
                                  {requirement.status}
                                </span>
                              </div>
                              <p className="requirement-description">{requirement.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="data-section">
                <div className="section-header">
                  <h3>Data Inventory</h3>
                  <button className="btn btn-primary">
                    ➕ Add Data Asset
                  </button>
                </div>

                <div className="data-list">
                  {dataInventory.map(data => (
                    <div key={data.id} className="data-card">
                      <div className="data-header">
                        <div className="data-title">
                          <h4>💾 {data.name}</h4>
                          <span className="data-type">{data.type}</span>
                        </div>
                        <div className="data-classification">
                          <span className="classification-badge">{data.classification}</span>
                        </div>
                      </div>

                      <p className="data-description">{data.description}</p>

                      <div className="data-details">
                        <div className="detail-item">
                          <span className="detail-label">Location:</span>
                          <span className="detail-value">{data.location}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Owner:</span>
                          <span className="detail-value">{data.owner}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Custodian:</span>
                          <span className="detail-value">{data.custodian}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Retention:</span>
                          <span className="detail-value">{data.retentionPeriod} days</span>
                        </div>
                      </div>

                      <div className="data-security">
                        <h5>Security Measures:</h5>
                        <div className="security-measures">
                          {data.securityMeasures.map(measure => (
                            <span key={measure} className="security-measure">
                              {measure}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="data-meta">
                        <span className="meta-item">
                          Last Accessed: {formatDate(data.lastAccessed)}
                        </span>
                        <span className="meta-item">
                          Access Count: {data.accessCount.toLocaleString()}
                        </span>
                        <span className="meta-item">
                          Data Subjects: {data.dataSubjects.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="policies-section">
                <div className="section-header">
                  <h3>Security Policies</h3>
                  <button className="btn btn-primary">
                    ➕ Create Policy
                  </button>
                </div>

                <div className="policies-list">
                  {securityPolicies.map(policy => (
                    <div key={policy.id} className="policy-card">
                      <div className="policy-header">
                        <div className="policy-title">
                          <h4>
                            {getCategoryIcon(policy.category)} {policy.name}
                          </h4>
                          <span className="policy-version">v{policy.version}</span>
                        </div>
                        <div className="policy-status">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(policy.status) }}
                          >
                            {policy.status}
                          </span>
                        </div>
                      </div>

                      <p className="policy-description">{policy.description}</p>

                      <div className="policy-details">
                        <div className="detail-item">
                          <span className="detail-label">Category:</span>
                          <span className="detail-value">{policy.category.replace('_', ' ')}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Effective Date:</span>
                          <span className="detail-value">{formatDate(policy.effectiveDate)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Review Date:</span>
                          <span className="detail-value">{formatDate(policy.reviewDate)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Approved By:</span>
                          <span className="detail-value">{policy.approvedBy}</span>
                        </div>
                      </div>

                      <div className="policy-acknowledgments">
                        <h5>Acknowledgments ({policy.acknowledgments.length}):</h5>
                        <div className="acknowledgments-list">
                          {policy.acknowledgments.map(ack => (
                            <div key={ack.userId} className="acknowledgment-item">
                              <span className="ack-user">{ack.userName}</span>
                              <span className="ack-date">{formatDate(ack.acknowledgedAt)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="training-section">
                <div className="section-header">
                  <h3>Security Training</h3>
                  <button className="btn btn-primary">
                    ➕ Create Training
                  </button>
                </div>

                <div className="training-list">
                  {securityTraining.map(training => (
                    <div key={training.id} className="training-card">
                      <div className="training-header">
                        <div className="training-title">
                          <h4>🎓 {training.title}</h4>
                          <span className="training-type">{training.type}</span>
                        </div>
                        <div className="training-category">
                          <span className="category-badge">{training.category}</span>
                        </div>
                      </div>

                      <p className="training-description">{training.description}</p>

                      <div className="training-details">
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">{formatDuration(training.duration)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Required Roles:</span>
                          <span className="detail-value">{training.requiredRoles.join(', ')}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Completions:</span>
                          <span className="detail-value">{training.completions.length}</span>
                        </div>
                      </div>

                      <div className="training-completions">
                        <h5>Recent Completions:</h5>
                        <div className="completions-list">
                          {training.completions.map(completion => (
                            <div key={completion.userId} className="completion-item">
                              <div className="completion-user">
                                <span className="completion-name">{completion.userName}</span>
                                <span className="completion-score">
                                  Score: {completion.score}%
                                </span>
                              </div>
                              <div className="completion-meta">
                                <span className="completion-date">{formatDate(completion.completedAt)}</span>
                                <span className="completion-attempts">
                                  {completion.attempts} attempt{completion.attempts !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
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

export default SecurityCompliance;
