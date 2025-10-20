/**
 * SessionCard Component
 * Rich display of session details with expandable sections
 */

import React, { useState } from 'react';
import { Session } from '../../types';
import './SessionCard.css';

interface SessionCardProps {
  session: Session;
  detailed?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, detailed = false }) => {
  const [expanded, setExpanded] = useState(detailed);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasContent = (content?: string) => content && content.trim().length > 0;

  return (
    <div className={`session-card-enhanced ${expanded ? 'expanded' : ''}`}>
      {/* Session Header */}
      <div className="session-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="session-header-main">
          {session.projectName && (
            <div className="session-project-tag">
              📁 {session.projectName}
            </div>
          )}
          <h3>{session.title}</h3>
          <span className="session-date-badge">{formatDate(session.date)}</span>
        </div>
        <div className="session-header-meta">
          <div className="session-badges">
            <span className={`status-badge ${session.status.toLowerCase().replace(/\s/g, '')}`}>
              {session.status}
            </span>
            {session.duration > 0 && (
              <span className="duration-badge">⏱️ {session.duration} min</span>
            )}
            {session.aiAgent && (
              <span className="agent-badge">🤖 {session.aiAgent}</span>
            )}
            {session.workspace && (
              <span className="workspace-badge">💻 {session.workspace}</span>
            )}
            {session.type && (
              <span className="type-badge">🎯 {session.type}</span>
            )}
          </div>
          <button className="expand-button">
            {expanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Summary - Always visible */}
      {hasContent(session.summary) && (
        <div className="session-summary-section">
          <p className="session-summary">{session.summary}</p>
        </div>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div className="session-expanded-content">
          {/* Context */}
          {hasContent(session.context) && (
            <section className="session-section context-section">
              <h4>📍 Session Context</h4>
              <div className="section-content">
                <p>{session.context}</p>
              </div>
            </section>
          )}

          {/* Key Decisions */}
          {hasContent(session.keyDecisions) && (
            <section className="session-section decisions-section">
              <h4>🎯 Key Decisions</h4>
              <div className="section-content highlighted">
                <p>{session.keyDecisions}</p>
              </div>
            </section>
          )}

          {/* Code Changes */}
          {hasContent(session.codeChanges) && (
            <section className="session-section code-section">
              <h4>💻 Code Changes</h4>
              <div className="section-content code-content">
                <pre>{session.codeChanges}</pre>
              </div>
            </section>
          )}

          {/* Challenges & Solutions */}
          <div className="two-column-sections">
            {hasContent(session.challenges) && (
              <section className="session-section challenges-section">
                <h4>🚧 Challenges</h4>
                <div className="section-content">
                  <p>{session.challenges}</p>
                </div>
              </section>
            )}

            {hasContent(session.solutions) && (
              <section className="session-section solutions-section">
                <h4>💡 Solutions</h4>
                <div className="section-content">
                  <p>{session.solutions}</p>
                </div>
              </section>
            )}
          </div>

          {/* Outcomes & Learnings */}
          <div className="two-column-sections">
            {hasContent(session.outcomes) && (
              <section className="session-section outcomes-section">
                <h4>✨ Outcomes</h4>
                <div className="section-content">
                  <p>{session.outcomes}</p>
                </div>
              </section>
            )}

            {hasContent(session.learnings) && (
              <section className="session-section learnings-section">
                <h4>📚 Learnings</h4>
                <div className="section-content">
                  <p>{session.learnings}</p>
                </div>
              </section>
            )}
          </div>

          {/* Technologies & Tools */}
          {(session.technologiesUsed && session.technologiesUsed.length > 0) && (
            <section className="session-section tech-section">
              <h4>🛠️ Technologies Used</h4>
              <div className="tech-tags">
                {session.technologiesUsed.map((tech, idx) => (
                  <span key={idx} className="tech-tag">{tech}</span>
                ))}
              </div>
            </section>
          )}

          {hasContent(session.toolsUsed) && (
            <section className="session-section tools-section">
              <h4>🔧 Tools Used</h4>
              <div className="section-content">
                <p>{session.toolsUsed}</p>
              </div>
            </section>
          )}

          {/* Files Modified */}
          {hasContent(session.filesModified) && (
            <section className="session-section files-section">
              <h4>📝 Files Modified</h4>
              <div className="section-content files-content">
                <pre>{session.filesModified}</pre>
              </div>
            </section>
          )}

          {/* Next Steps & Blockers */}
          <div className="two-column-sections">
            {hasContent(session.nextSteps) && (
              <section className="session-section nextsteps-section">
                <h4>🎯 Next Steps</h4>
                <div className="section-content">
                  <p>{session.nextSteps}</p>
                </div>
              </section>
            )}

            {hasContent(session.blockers) && (
              <section className="session-section blockers-section warning">
                <h4>⚠️ Blockers</h4>
                <div className="section-content">
                  <p>{session.blockers}</p>
                </div>
              </section>
            )}
          </div>

          {/* Links & References */}
          {hasContent(session.links) && (
            <section className="session-section links-section">
              <h4>🔗 Links & References</h4>
              <div className="section-content links-content">
                <p>{session.links}</p>
              </div>
            </section>
          )}

          {/* Notes */}
          {hasContent(session.notes) && (
            <section className="session-section notes-section">
              <h4>📓 Additional Notes</h4>
              <div className="section-content">
                <p>{session.notes}</p>
              </div>
            </section>
          )}

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <section className="session-section tags-section">
              <h4>🏷️ Tags</h4>
              <div className="tags-list">
                {session.tags.map((tag, idx) => (
                  <span key={idx} className="tag-badge">{tag}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionCard;

