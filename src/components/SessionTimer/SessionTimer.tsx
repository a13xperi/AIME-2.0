import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '../../types';
import TimeTracker from '../TimeTracker/TimeTracker';
import './SessionTimer.css';

interface SessionTimerProps {
  session: Session;
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
  onClose: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({
  session,
  onSessionUpdate,
  onClose
}) => {
  const [showTimeTracker, setShowTimeTracker] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(session.duration || 0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    setStartTime(new Date());
    setElapsedTime(0);
  }, []);

  const stopTracking = useCallback(() => {
    if (startTime) {
      const now = new Date();
      const totalDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const newDuration = sessionDuration + totalDuration;
      
      setSessionDuration(newDuration);
      setElapsedTime(0);
      setIsTracking(false);
      setStartTime(null);
      
      onSessionUpdate(session.id, {
        duration: newDuration,
        status: 'Completed'
      });
    }
  }, [startTime, sessionDuration, session.id, onSessionUpdate]);

  const pauseTracking = useCallback(() => {
    if (startTime) {
      const now = new Date();
      const sessionDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const newDuration = sessionDuration + sessionDuration;
      
      setSessionDuration(newDuration);
      setElapsedTime(0);
      setIsTracking(false);
      setStartTime(null);
      
      onSessionUpdate(session.id, {
        duration: newDuration
      });
    }
  }, [startTime, sessionDuration, session.id, onSessionUpdate]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = sessionDuration + elapsedTime;

  return (
    <div className="session-timer-overlay">
      <div className="session-timer-modal">
        <div className="session-timer-header">
          <h2>⏱️ Session Timer</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="session-timer-content">
          <div className="session-info">
            <h3>{session.title}</h3>
            <p className="session-project">{session.projectName}</p>
            <div className="session-status">
              <span className={`status-badge ${session.status.toLowerCase()}`}>
                {session.status}
              </span>
            </div>
          </div>

          <div className="timer-display">
            <div className="current-session">
              <div className="time-label">Current Session</div>
              <div className="time-value">{formatTime(elapsedTime)}</div>
            </div>
            
            <div className="total-time">
              <div className="time-label">Total Time</div>
              <div className="time-value">{formatTime(totalTime)}</div>
            </div>
          </div>

          <div className="timer-controls">
            {!isTracking ? (
              <button className="btn btn-primary btn-large" onClick={startTracking}>
                ▶️ Start Tracking
              </button>
            ) : (
              <div className="running-controls">
                <button className="btn btn-secondary" onClick={pauseTracking}>
                  ⏸️ Pause
                </button>
                <button className="btn btn-success" onClick={stopTracking}>
                  ⏹️ Stop & Save
                </button>
              </div>
            )}
            
            <button 
              className="btn btn-outline" 
              onClick={() => setShowTimeTracker(!showTimeTracker)}
            >
              📊 {showTimeTracker ? 'Hide' : 'Show'} Advanced Timer
            </button>
          </div>

          <div className="session-stats">
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-label">Session Duration:</span>
                <span className="stat-value">{formatTime(sessionDuration)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status:</span>
                <span className={`stat-value ${isTracking ? 'tracking' : 'paused'}`}>
                  {isTracking ? '🟢 Tracking' : '🔴 Paused'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Project:</span>
                <span className="stat-value">{session.projectName}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Type:</span>
                <span className="stat-value">{session.type}</span>
              </div>
            </div>
          </div>

          {showTimeTracker && (
            <div className="advanced-timer-section">
              <TimeTracker
                session={session}
                onTimeUpdate={(sessionId, duration) => {
                  onSessionUpdate(sessionId, { duration });
                }}
                onClose={() => setShowTimeTracker(false)}
                autoStart={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;
