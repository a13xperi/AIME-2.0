import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '../../types';
import './TimeTracker.css';

interface TimeTrackerProps {
  session: Session;
  onTimeUpdate: (sessionId: string, duration: number) => void;
  onClose: () => void;
  autoStart?: boolean;
}

interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  description?: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({
  session,
  onTimeUpdate,
  onClose,
  autoStart = false,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(session.duration || 0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [showTimeEntries, setShowTimeEntries] = useState(false);

  // Auto-start timer if enabled
  const startTimer = useCallback(() => {
    const now = new Date();
    setIsRunning(true);
    setStartTime(now);

    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}`,
      startTime: now,
      duration: 0,
      description: `Work session - ${session.title}`,
    };

    setCurrentEntry(newEntry);
    setTimeEntries(prev => [...prev, newEntry]);
  }, [session.title]);

  useEffect(() => {
    if (autoStart && !isRunning) {
      startTimer();
    }
  }, [autoStart, isRunning, startTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const pauseTimer = useCallback(() => {
    if (currentEntry && startTime) {
      const now = new Date();
      const sessionDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);

      setTimeEntries(prev =>
        prev.map(entry =>
          entry.id === currentEntry.id
            ? { ...entry, endTime: now, duration: sessionDuration }
            : entry
        )
      );
    }

    setIsRunning(false);
    setStartTime(null);
    const newDuration = sessionDuration + elapsedTime;
    setSessionDuration(newDuration);
    setElapsedTime(0);
    onTimeUpdate(session.id, newDuration);
  }, [currentEntry, startTime, sessionDuration, elapsedTime, session.id, onTimeUpdate]);

  const stopTimer = useCallback(() => {
    if (currentEntry && startTime) {
      const now = new Date();
      const totalDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);

      setTimeEntries(prev =>
        prev.map(entry =>
          entry.id === currentEntry.id ? { ...entry, endTime: now, duration: totalDuration } : entry
        )
      );
    }

    setIsRunning(false);
    setStartTime(null);
    const finalDuration = sessionDuration + elapsedTime;
    setSessionDuration(finalDuration);
    setElapsedTime(0);
    setCurrentEntry(null);
    onTimeUpdate(session.id, finalDuration);
    onClose();
  }, [currentEntry, startTime, sessionDuration, elapsedTime, session.id, onTimeUpdate, onClose]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setSessionDuration(0);
    setCurrentEntry(null);
    setTimeEntries([]);
    onTimeUpdate(session.id, 0);
  }, [session.id, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTime = (): number => {
    return timeEntries.reduce((total, entry) => total + entry.duration, 0);
  };

  const getTodayTime = (): number => {
    const today = new Date().toDateString();
    return timeEntries
      .filter(entry => entry.startTime.toDateString() === today)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const totalTime = sessionDuration + elapsedTime;

  return (
    <div className="time-tracker-overlay">
      <div className="time-tracker-modal">
        <div className="time-tracker-header">
          <h2>⏱️ Time Tracker</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="time-tracker-content">
          <div className="session-info">
            <h3>{session.title}</h3>
            <p className="session-project">{session.projectName}</p>
          </div>

          <div className="timer-display">
            <div className="current-time">
              <div className="time-label">Current Session</div>
              <div className="time-value">{formatTime(elapsedTime)}</div>
            </div>

            <div className="total-time">
              <div className="time-label">Total Time</div>
              <div className="time-value">{formatTime(totalTime)}</div>
            </div>
          </div>

          <div className="timer-controls">
            {!isRunning ? (
              <button className="btn btn-primary btn-large" onClick={startTimer}>
                ▶️ Start Timer
              </button>
            ) : (
              <div className="running-controls">
                <button className="btn btn-secondary" onClick={pauseTimer}>
                  ⏸️ Pause
                </button>
                <button className="btn btn-danger" onClick={stopTimer}>
                  ⏹️ Stop & Save
                </button>
              </div>
            )}

            <button className="btn btn-outline" onClick={resetTimer}>
              🔄 Reset
            </button>
          </div>

          <div className="timer-stats">
            <div className="stat-item">
              <span className="stat-label">Session Duration:</span>
              <span className="stat-value">{formatTime(sessionDuration)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Today's Time:</span>
              <span className="stat-value">{formatTime(getTodayTime())}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Time:</span>
              <span className="stat-value">{formatTime(getTotalTime())}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status:</span>
              <span className={`stat-value ${isRunning ? 'running' : 'paused'}`}>
                {isRunning ? '🟢 Running' : '🔴 Paused'}
              </span>
            </div>
          </div>

          <div className="time-entries-section">
            <button
              className="btn btn-outline btn-small"
              onClick={() => setShowTimeEntries(!showTimeEntries)}
            >
              📊 {showTimeEntries ? 'Hide' : 'Show'} Time Entries
            </button>

            {showTimeEntries && (
              <div className="time-entries">
                <h4>📋 Time Entries</h4>
                {timeEntries.length === 0 ? (
                  <p className="no-entries">No time entries yet</p>
                ) : (
                  <div className="entries-list">
                    {timeEntries.map((entry, index) => (
                      <div key={entry.id} className="time-entry">
                        <div className="entry-header">
                          <span className="entry-number">#{index + 1}</span>
                          <span className="entry-duration">{formatTime(entry.duration)}</span>
                        </div>
                        <div className="entry-details">
                          <span className="entry-time">
                            {entry.startTime.toLocaleTimeString()} -{' '}
                            {entry.endTime?.toLocaleTimeString() || 'Running'}
                          </span>
                          {entry.description && (
                            <span className="entry-description">{entry.description}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
