/**
 * SessionDetail Component
 * Shows detailed planning, action plans, and backlogs for a session
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Session } from '../../types';
import './SessionDetail.css';

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSession(id);
    }
  }, [id]);

  const loadSession = async (sessionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/sessions/${sessionId}`);
      const data = await response.json();

      if (data.success && data.session) {
        setSession(data.session);
      } else {
        setError(data.error || 'Failed to load session');
      }
    } catch (err) {
      setError('Failed to load session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseActionItems = (text: string) => {
    if (!text) return [];
    
    // Split by common delimiters and clean up
    const items = text
      .split(/[\n\r•\-\*]/)
      .map(item => item.trim())
      .filter(item => item.length > 0 && !item.match(/^(next steps|action items|todo|tasks?):?$/i))
      .map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        text: item,
        completed: false,
        priority: item.toLowerCase().includes('urgent') || item.toLowerCase().includes('critical') ? 'high' : 'medium'
      }));

    return items;
  };

  const parseBacklogItems = (text: string) => {
    if (!text) return [];
    
    const items = text
      .split(/[\n\r•\-\*]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        text: item,
        status: 'pending',
        category: item.toLowerCase().includes('bug') ? 'bug' : 
                 item.toLowerCase().includes('feature') ? 'feature' : 'task'
      }));

    return items;
  };

  if (loading) {
    return (
      <div className="session-detail-page">
        <div className="loading">Loading session details...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="session-detail-page">
        <div className="error">
          <h2>Error Loading Session</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const actionItems = parseActionItems(session.nextSteps || '');
  const backlogItems = parseBacklogItems(session.blockers || '');
  const completedItems = actionItems.filter(item => item.completed).length;
  const totalItems = actionItems.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="session-detail-page">
      <header className="session-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <div className="session-title">
          <h1>{session.title}</h1>
          <div className="session-meta">
            <span className="session-date">{new Date(session.date + 'T00:00:00').toLocaleDateString()}</span>
            {session.aiAgent && <span className="session-agent">🤖 {session.aiAgent}</span>}
            {session.workspace && <span className="session-workspace">📍 {session.workspace}</span>}
          </div>
        </div>
      </header>

      <div className="session-content">
        {/* Progress Overview */}
        <div className="progress-section">
          <h2>📊 Progress Overview</h2>
          <div className="progress-card">
            <div className="progress-stats">
              <div className="stat">
                <div className="stat-number">{completedItems}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat">
                <div className="stat-number">{totalItems - completedItems}</div>
                <div className="stat-label">Remaining</div>
              </div>
              <div className="stat">
                <div className="stat-number">{Math.round(progressPercentage)}%</div>
                <div className="stat-label">Progress</div>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Session Summary */}
        {session.summary && (
          <div className="summary-section">
            <h2>📝 Session Summary</h2>
            <div className="summary-card">
              <p>{session.summary}</p>
            </div>
          </div>
        )}

        {/* Action Items / Next Steps */}
        {actionItems.length > 0 && (
          <div className="action-items-section">
            <h2>✅ Action Items & Next Steps</h2>
            <div className="action-items-grid">
              {actionItems.map((item) => (
                <div key={item.id} className={`action-item ${item.priority}`}>
                  <div className="action-checkbox">
                    <input 
                      type="checkbox" 
                      checked={item.completed}
                      onChange={() => {
                        // TODO: Implement toggle functionality
                      }}
                    />
                  </div>
                  <div className="action-text">{item.text}</div>
                  <div className="action-priority">{item.priority}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backlog Items / Blockers */}
        {backlogItems.length > 0 && (
          <div className="backlog-section">
            <h2>🚧 Backlog & Blockers</h2>
            <div className="backlog-grid">
              {backlogItems.map((item) => (
                <div key={item.id} className={`backlog-item ${item.category}`}>
                  <div className="backlog-text">{item.text}</div>
                  <div className="backlog-category">{item.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Decisions */}
        {session.keyDecisions && (
          <div className="decisions-section">
            <h2>🎯 Key Decisions</h2>
            <div className="decisions-card">
              <p>{session.keyDecisions}</p>
            </div>
          </div>
        )}

        {/* Challenges & Solutions */}
        {(session.challenges || session.solutions) && (
          <div className="challenges-section">
            <h2>🔧 Challenges & Solutions</h2>
            <div className="challenges-grid">
              {session.challenges && (
                <div className="challenge-card">
                  <h3>🚨 Challenges</h3>
                  <p>{session.challenges}</p>
                </div>
              )}
              {session.solutions && (
                <div className="solution-card">
                  <h3>💡 Solutions</h3>
                  <p>{session.solutions}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code Changes */}
        {session.codeChanges && (
          <div className="code-section">
            <h2>💻 Code Changes</h2>
            <div className="code-card">
              <pre>{session.codeChanges}</pre>
            </div>
          </div>
        )}

        {/* Outcomes & Learnings */}
        {(session.outcomes || session.learnings) && (
          <div className="outcomes-section">
            <h2>🎉 Outcomes & Learnings</h2>
            <div className="outcomes-grid">
              {session.outcomes && (
                <div className="outcome-card">
                  <h3>🎯 Outcomes</h3>
                  <p>{session.outcomes}</p>
                </div>
              )}
              {session.learnings && (
                <div className="learning-card">
                  <h3>📚 Learnings</h3>
                  <p>{session.learnings}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetail;
