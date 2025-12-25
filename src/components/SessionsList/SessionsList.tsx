/**
 * SessionsList Component
 * Chronological list of all work sessions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '../../types';
import SessionCard from '../SessionCard/SessionCard';
import './SessionsList.css';

const SessionsList: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();

    // Auto-refresh every 30 seconds to pick up changes from Notion
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing sessions from Notion...');
      loadSessions();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${API_URL}/api/sessions`);
      const data = await response.json();

      if (data.success && data.sessions) {
        setSessions(data.sessions);
      } else {
        setError(data.error || 'Failed to load sessions');
      }
    } catch (err) {
      setError('Failed to load sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalMinutes = sessions.reduce((total, s) => total + (s.duration || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (loading) {
    return (
      <div className="sessions-list-page">
        <div className="loading">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sessions-list-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="sessions-list-page">
      <header className="page-header">
        <div className="header-top">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          <button
            className="refresh-button-small"
            onClick={() => loadSessions()}
            title="Refresh sessions from Notion"
          >
            🔄 Refresh
          </button>
        </div>
        <h1>📝 All Work Sessions</h1>
        <p className="subtitle">
          {sessions.length} sessions • {totalHours}h {remainingMinutes}m total
        </p>
      </header>

      <div className="sessions-timeline">
        {sessions.map((session, index) => {
          const prevSession = index > 0 ? sessions[index - 1] : null;
          const currentDate = session.date ? new Date(session.date).toDateString() : '';
          const prevDate =
            prevSession && prevSession.date ? new Date(prevSession.date).toDateString() : '';
          const showDateHeader = !prevDate || currentDate !== prevDate;

          return (
            <React.Fragment key={session.id}>
              {showDateHeader && (
                <div className="date-divider">
                  <span className="date-label">
                    {session.date
                      ? new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'No date'}
                  </span>
                </div>
              )}

              <SessionCard session={session} detailed={false} />
            </React.Fragment>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <div className="empty-state">
          <p>No sessions logged yet. Start tracking your work!</p>
        </div>
      )}
    </div>
  );
};

export default SessionsList;
