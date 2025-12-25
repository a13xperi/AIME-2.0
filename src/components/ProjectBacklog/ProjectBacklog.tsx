/**
 * ProjectBacklog Component
 * Displays project backlog, plans, next steps, and blockers
 */

import React from 'react';
import { Project } from '../../types';
import './ProjectBacklog.css';

interface ProjectBacklogProps {
  project: Project;
}

const ProjectBacklog: React.FC<ProjectBacklogProps> = ({ project }) => {
  const hasBlockers = project.blockers && project.blockers.trim().length > 0;
  const hasNextSteps = project.nextSteps && project.nextSteps.trim().length > 0;
  const hasStatusNotes = project.statusNotes && project.statusNotes.trim().length > 0;

  // Parse next steps (assuming they're newline or comma separated)
  const parseItems = (text: string): string[] => {
    if (!text) return [];
    return text
      .split(/\n|,/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const nextStepsList = hasNextSteps ? parseItems(project.nextSteps) : [];
  const blockersList = hasBlockers ? parseItems(project.blockers) : [];

  return (
    <div className="project-backlog">
      <div className="backlog-header">
        <h2>📋 Backlog & Plans</h2>
        <div className="backlog-stats">
          {project.backlogItems > 0 && (
            <span className="stat-badge">
              {project.backlogItems} {project.backlogItems === 1 ? 'item' : 'items'} in backlog
            </span>
          )}
        </div>
      </div>

      <div className="backlog-grid">
        {/* Next Steps Section */}
        <section className="backlog-section next-steps-section">
          <div className="section-header">
            <h3>🎯 Next Steps</h3>
            {nextStepsList.length > 0 && (
              <span className="count-badge">{nextStepsList.length}</span>
            )}
          </div>

          {hasNextSteps ? (
            <ul className="steps-list">
              {nextStepsList.map((step, index) => (
                <li key={index} className="step-item">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No next steps defined yet. Time to plan!</p>
            </div>
          )}
        </section>

        {/* Blockers Section */}
        <section
          className={`backlog-section blockers-section ${hasBlockers ? 'has-blockers' : ''}`}
        >
          <div className="section-header">
            <h3>🚧 Blockers</h3>
            {blockersList.length > 0 && (
              <span className="count-badge warning">{blockersList.length}</span>
            )}
          </div>

          {hasBlockers ? (
            <ul className="blockers-list">
              {blockersList.map((blocker, index) => (
                <li key={index} className="blocker-item">
                  <span className="blocker-icon">⚠️</span>
                  <span className="blocker-text">{blocker}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state success">
              <p>✅ No blockers! Clear path ahead.</p>
            </div>
          )}
        </section>

        {/* Status Notes Section */}
        <section className="backlog-section status-notes-section full-width">
          <div className="section-header">
            <h3>📝 Status Notes & Plans</h3>
          </div>

          {hasStatusNotes ? (
            <div className="status-notes-content">
              <p>{project.statusNotes}</p>
            </div>
          ) : (
            <div className="empty-state">
              <p>No status notes available. Add notes in Notion to track progress.</p>
            </div>
          )}
        </section>

        {/* Backlog Queue Section */}
        <section className="backlog-section queue-section full-width">
          <div className="section-header">
            <h3>📦 Work Queue</h3>
            <span className="info-text">Future features and improvements</span>
          </div>

          <div className="queue-placeholder">
            <div className="queue-card">
              <div className="queue-card-header">
                <span className="queue-icon">💡</span>
                <strong>Plan Future Work</strong>
              </div>
              <p>Add backlog items in your Notion database to see them here.</p>
              <ul className="queue-tips">
                <li>Break down large features into smaller tasks</li>
                <li>Prioritize items by importance</li>
                <li>Track dependencies and blockers</li>
                <li>Update progress as you go</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <div className="backlog-actions">
        <button
          className="action-btn primary"
          onClick={() => alert('Session logging coming soon!')}
        >
          📝 Log New Session
        </button>
        <button
          className="action-btn"
          onClick={() => window.open(`https://notion.so/${project.id.replace(/-/g, '')}`, '_blank')}
        >
          ✏️ Edit in Notion
        </button>
      </div>
    </div>
  );
};

export default ProjectBacklog;
