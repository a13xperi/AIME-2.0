/**
 * QuickResume Component
 * Modal for resuming a project with context and quick actions
 */

import React from 'react';
import { Project, Session } from '../../types';
import './QuickResume.css';

interface QuickResumeProps {
  project: Project;
  lastSession?: Session;
  onClose: () => void;
}

const QuickResume: React.FC<QuickResumeProps> = ({ project, lastSession, onClose }) => {
  const handleOpenWorkspace = () => {
    if (project.workspace) {
      // Copy workspace path to clipboard
      navigator.clipboard.writeText(project.workspace);
      alert(
        `Workspace path copied to clipboard!\n\n${project.workspace}\n\nOpen your terminal and paste to navigate there.`
      );
    }
  };

  const handleOpenRepository = () => {
    if (project.repository) {
      window.open(project.repository, '_blank');
    }
  };

  const handleOpenDeployment = () => {
    if (project.deploymentUrl) {
      window.open(project.deploymentUrl, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="quick-resume-overlay" onClick={onClose}>
      <div className="quick-resume-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <div className="resume-header">
          <h2>🚀 Resume: {project.name}</h2>
          <p className="resume-subtitle">Pick up exactly where you left off</p>
        </div>

        <div className="resume-content">
          {/* Current Context */}
          <section className="resume-section">
            <h3>📍 Current Context</h3>
            <div className="context-card">
              {project.currentContext ? (
                <p>{project.currentContext}</p>
              ) : (
                <p className="no-data">No context saved yet</p>
              )}
            </div>
          </section>

          {/* Last Session */}
          {lastSession && (
            <section className="resume-section">
              <h3>🕐 Last Session</h3>
              <div className="session-card">
                <div className="session-card-header">
                  <strong>{lastSession.title}</strong>
                  <span className="session-date">{formatDate(lastSession.date)}</span>
                </div>
                {lastSession.summary && <p className="session-summary">{lastSession.summary}</p>}
                <div className="session-meta">
                  {lastSession.duration > 0 && <span>⏱️ {lastSession.duration} min</span>}
                  {lastSession.aiAgent && <span>🤖 {lastSession.aiAgent}</span>}
                </div>
              </div>
            </section>
          )}

          {/* Project Info Grid */}
          <section className="resume-section">
            <h3>📊 Project Info</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Status</span>
                <span
                  className={`status-badge ${project.status.toLowerCase().replace(/[^a-z]/g, '')}`}
                >
                  {project.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Priority</span>
                <span
                  className={`priority-badge ${project.priority.toLowerCase().replace(/[^a-z]/g, '')}`}
                >
                  {project.priority}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">
                  {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Tech Stack</span>
                <span className="info-value">
                  {project.techStack.length > 0 ? project.techStack.join(', ') : 'Not specified'}
                </span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="resume-section">
            <h3>⚡ Quick Actions</h3>
            <div className="action-buttons">
              {project.workspace && (
                <button className="resume-action-btn primary" onClick={handleOpenWorkspace}>
                  📁 Copy Workspace Path
                </button>
              )}
              {project.repository && (
                <button className="resume-action-btn" onClick={handleOpenRepository}>
                  💻 Open Repository
                </button>
              )}
              {project.deploymentUrl && (
                <button className="resume-action-btn" onClick={handleOpenDeployment}>
                  🌐 View Deployment
                </button>
              )}
              <button
                className="resume-action-btn"
                onClick={() => (window.location.href = `/project/${project.id}`)}
              >
                📝 View Full Details
              </button>
            </div>
          </section>
        </div>

        <div className="resume-footer">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
          <button
            className="btn-start-session"
            onClick={() => alert('Session tracking coming soon!')}
          >
            ▶️ Start New Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickResume;
