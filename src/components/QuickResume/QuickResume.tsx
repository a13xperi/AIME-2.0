/**
 * QuickResume Component
 * Modal for resuming a project with context and quick actions
 */

import React, { useEffect, useRef } from 'react';
import { Project, Session } from '../../types';
import './QuickResume.css';

interface QuickResumeProps {
  project: Project;
  lastSession?: Session;
  onClose: () => void;
}

const QuickResume: React.FC<QuickResumeProps> = ({ project, lastSession, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management - trap focus within modal
  useEffect(() => {
    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Trap focus within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

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
      window.open(project.repository, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenDeployment = () => {
    if (project.deploymentUrl) {
      window.open(project.deploymentUrl, '_blank', 'noopener,noreferrer');
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
    <div
      className="quick-resume-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      aria-describedby="resume-modal-description"
    >
      <div
        className="quick-resume-modal"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        role="document"
      >
        <button
          className="close-button"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Close resume modal"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <div className="resume-header">
          <h2 id="resume-modal-title">
            <span aria-hidden="true">🚀</span> Resume: {project.name}
          </h2>
          <p className="resume-subtitle" id="resume-modal-description">
            Pick up exactly where you left off
          </p>
        </div>

        <div className="resume-content">
          {/* Current Context */}
          <section className="resume-section" aria-labelledby="context-heading">
            <h3 id="context-heading">
              <span aria-hidden="true">📍</span> Current Context
            </h3>
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
            <section className="resume-section" aria-labelledby="last-session-heading">
              <h3 id="last-session-heading">
                <span aria-hidden="true">🕐</span> Last Session
              </h3>
              <div className="session-card" aria-label={`Last session: ${lastSession.title}`}>
                <div className="session-card-header">
                  <strong>{lastSession.title}</strong>
                  <span className="session-date">
                    <span className="sr-only">Date:</span> {formatDate(lastSession.date)}
                  </span>
                </div>
                {lastSession.summary && <p className="session-summary">{lastSession.summary}</p>}
                <div className="session-meta" aria-label="Session details">
                  {lastSession.duration > 0 && (
                    <span>
                      <span aria-hidden="true">⏱️</span>
                      <span className="sr-only">Duration:</span> {lastSession.duration} min
                    </span>
                  )}
                  {lastSession.aiAgent && (
                    <span>
                      <span aria-hidden="true">🤖</span>
                      <span className="sr-only">AI Agent:</span> {lastSession.aiAgent}
                    </span>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Project Info Grid */}
          <section className="resume-section" aria-labelledby="project-info-heading">
            <h3 id="project-info-heading">
              <span aria-hidden="true">📊</span> Project Info
            </h3>
            <dl className="info-grid">
              <div className="info-item">
                <dt className="info-label">Status</dt>
                <dd>
                  <span
                    className={`status-badge ${project.status.toLowerCase().replace(/[^a-z]/g, '')}`}
                  >
                    {project.status}
                  </span>
                </dd>
              </div>
              <div className="info-item">
                <dt className="info-label">Priority</dt>
                <dd>
                  <span
                    className={`priority-badge ${project.priority.toLowerCase().replace(/[^a-z]/g, '')}`}
                  >
                    {project.priority}
                  </span>
                </dd>
              </div>
              <div className="info-item">
                <dt className="info-label">Last Updated</dt>
                <dd className="info-value">
                  {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              <div className="info-item">
                <dt className="info-label">Tech Stack</dt>
                <dd className="info-value">
                  {project.techStack.length > 0 ? project.techStack.join(', ') : 'Not specified'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Quick Actions */}
          <section className="resume-section" aria-labelledby="actions-heading">
            <h3 id="actions-heading">
              <span aria-hidden="true">⚡</span> Quick Actions
            </h3>
            <div className="action-buttons" role="group" aria-label="Quick actions">
              {project.workspace && (
                <button
                  className="resume-action-btn primary"
                  onClick={handleOpenWorkspace}
                  aria-label="Copy workspace path to clipboard"
                >
                  <span aria-hidden="true">📁</span> Copy Workspace Path
                </button>
              )}
              {project.repository && (
                <button
                  className="resume-action-btn"
                  onClick={handleOpenRepository}
                  aria-label="Open project repository in new tab"
                >
                  <span aria-hidden="true">💻</span> Open Repository
                </button>
              )}
              {project.deploymentUrl && (
                <button
                  className="resume-action-btn"
                  onClick={handleOpenDeployment}
                  aria-label="View deployment in new tab"
                >
                  <span aria-hidden="true">🌐</span> View Deployment
                </button>
              )}
              <button
                className="resume-action-btn"
                onClick={() => (window.location.href = `/project/${project.id}`)}
                aria-label={`View full details for ${project.name}`}
              >
                <span aria-hidden="true">📝</span> View Full Details
              </button>
            </div>
          </section>
        </div>

        <div className="resume-footer" role="group" aria-label="Modal actions">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
          <button
            className="btn-start-session"
            onClick={() => alert('Session tracking coming soon!')}
            aria-label="Start a new work session"
          >
            <span aria-hidden="true">▶️</span> Start New Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickResume;
