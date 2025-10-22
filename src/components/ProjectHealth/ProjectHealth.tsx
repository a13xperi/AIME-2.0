import React, { useState, useEffect } from 'react';
import { Project, ProjectHealth, ProjectRisk, ProjectAlert } from '../../types';
import './ProjectHealth.css';

interface ProjectHealthProps {
  project: Project;
  onClose: () => void;
}

const ProjectHealth: React.FC<ProjectHealthProps> = ({ project, onClose }) => {
  const [health, setHealth] = useState<ProjectHealth | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockHealth: ProjectHealth = {
      projectId: project.id,
      overallScore: 78,
      indicators: {
        onTime: 85,
        onBudget: 92,
        quality: 88,
        teamSatisfaction: 76,
        stakeholderSatisfaction: 82
      },
      risks: [
        {
          id: 'risk-1',
          title: 'API Integration Delays',
          description: 'Third-party API documentation is incomplete, causing integration delays',
          severity: 'high',
          probability: 70,
          impact: 80,
          mitigation: 'Schedule additional time for API exploration and create fallback plan',
          owner: 'Development Team',
          status: 'monitoring'
        },
        {
          id: 'risk-2',
          title: 'Resource Availability',
          description: 'Key team member may be unavailable during critical development phase',
          severity: 'medium',
          probability: 40,
          impact: 60,
          mitigation: 'Cross-train team members and document critical processes',
          owner: 'Project Manager',
          status: 'identified'
        },
        {
          id: 'risk-3',
          title: 'Scope Creep',
          description: 'Client requests additional features beyond original scope',
          severity: 'medium',
          probability: 60,
          impact: 50,
          mitigation: 'Implement change control process and client communication protocol',
          owner: 'Project Manager',
          status: 'mitigating'
        }
      ],
      alerts: [
        {
          id: 'alert-1',
          type: 'deadline',
          severity: 'warning',
          title: 'Milestone Approaching',
          message: 'Design Phase Complete milestone is due in 3 days',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          actionRequired: true
        },
        {
          id: 'alert-2',
          type: 'quality',
          severity: 'info',
          title: 'Code Review Completed',
          message: 'Latest code review shows 95% quality score',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          acknowledged: true,
          actionRequired: false
        },
        {
          id: 'alert-3',
          type: 'resource',
          severity: 'error',
          title: 'Team Member Unavailable',
          message: 'Lead developer will be unavailable for 2 days next week',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          acknowledged: false,
          actionRequired: true
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    setTimeout(() => {
      setHealth(mockHealth);
      setLoading(false);
    }, 1000);
  }, [project.id]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    if (score >= 40) return '#ea580c';
    return '#dc2626';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline': return '⏰';
      case 'budget': return '💰';
      case 'quality': return '⭐';
      case 'resource': return '👥';
      case 'dependency': return '🔗';
      default: return '📋';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'error': return '#dc2626';
      case 'warning': return '#ea580c';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="project-health-overlay">
        <div className="project-health-modal">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Analyzing project health...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="project-health-overlay">
      <div className="project-health-modal">
        <div className="health-header">
          <h2>🏥 Project Health Monitor</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="health-content">
          <div className="project-info">
            <h3>{project.name}</h3>
            <p className="project-description">{project.description}</p>
          </div>

          <div className="health-overview">
            <div className="overall-score">
              <div className="score-circle">
                <div 
                  className="score-fill"
                  style={{ 
                    background: `conic-gradient(${getHealthColor(health.overallScore)} ${health.overallScore * 3.6}deg, #e5e7eb 0deg)`
                  }}
                >
                  <div className="score-inner">
                    <span className="score-number">{health.overallScore}</span>
                    <span className="score-label">Health Score</span>
                  </div>
                </div>
              </div>
              <div className="score-details">
                <h4>{getHealthLabel(health.overallScore)}</h4>
                <p>Overall project health is {getHealthLabel(health.overallScore).toLowerCase()}</p>
              </div>
            </div>

            <div className="health-indicators">
              <h4>Health Indicators</h4>
              <div className="indicators-grid">
                {Object.entries(health.indicators).map(([key, value]) => (
                  <div key={key} className="indicator-item">
                    <div className="indicator-header">
                      <span className="indicator-name">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="indicator-score">{value}%</span>
                    </div>
                    <div className="indicator-bar">
                      <div 
                        className="indicator-fill"
                        style={{ 
                          width: `${value}%`,
                          backgroundColor: getHealthColor(value)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="risks-section">
            <h4>Risk Assessment</h4>
            <div className="risks-list">
              {health.risks.map(risk => (
                <div key={risk.id} className="risk-item">
                  <div className="risk-header">
                    <div className="risk-title">
                      <span 
                        className="risk-severity"
                        style={{ backgroundColor: getSeverityColor(risk.severity) }}
                      >
                        {risk.severity}
                      </span>
                      <h5>{risk.title}</h5>
                    </div>
                    <div className="risk-meta">
                      <span className="risk-owner">{risk.owner}</span>
                      <span className="risk-status">{risk.status}</span>
                    </div>
                  </div>
                  <p className="risk-description">{risk.description}</p>
                  <div className="risk-details">
                    <div className="risk-probability">
                      <span className="detail-label">Probability:</span>
                      <span className="detail-value">{risk.probability}%</span>
                    </div>
                    <div className="risk-impact">
                      <span className="detail-label">Impact:</span>
                      <span className="detail-value">{risk.impact}%</span>
                    </div>
                  </div>
                  <div className="risk-mitigation">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="alerts-section">
            <h4>Active Alerts</h4>
            <div className="alerts-list">
              {health.alerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.acknowledged ? 'acknowledged' : ''}`}>
                  <div className="alert-header">
                    <div className="alert-icon">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="alert-content">
                      <div className="alert-title-row">
                        <h5>{alert.title}</h5>
                        <span 
                          className="alert-severity"
                          style={{ color: getAlertSeverityColor(alert.severity) }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="alert-message">{alert.message}</p>
                    </div>
                    <div className="alert-meta">
                      <span className="alert-timestamp">{formatTimestamp(alert.timestamp)}</span>
                      {alert.actionRequired && (
                        <span className="action-required">Action Required</span>
                      )}
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <div className="alert-actions">
                      <button className="btn btn-outline btn-small">
                        Acknowledge
                      </button>
                      {alert.actionRequired && (
                        <button className="btn btn-primary btn-small">
                          Take Action
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="health-actions">
            <button className="btn btn-outline">
              Export Report
            </button>
            <button className="btn btn-primary">
              Update Health Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHealth;
