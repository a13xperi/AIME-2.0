/**
 * IntervalTracker Component
 * Tracks work in 30-minute intervals with detailed progress
 */

import React, { useState, useEffect } from 'react';
import './IntervalTracker.css';

interface WorkInterval {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  accomplishments: string[];
  focus: string;
  status: 'active' | 'completed' | 'paused';
  productivity: 'high' | 'medium' | 'low';
}

interface IntervalTrackerProps {
  sessionId?: string;
  onIntervalComplete?: (interval: WorkInterval) => void;
}

const IntervalTracker: React.FC<IntervalTrackerProps> = ({ 
  sessionId, 
  onIntervalComplete 
}) => {
  const [currentInterval, setCurrentInterval] = useState<WorkInterval | null>(null);
  const [completedIntervals, setCompletedIntervals] = useState<WorkInterval[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [accomplishments, setAccomplishments] = useState<string[]>(['']);
  const [currentFocus, setCurrentFocus] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Interval completed
            completeInterval();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const startInterval = () => {
    const newInterval: WorkInterval = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 30,
      accomplishments: [''],
      focus: currentFocus,
      status: 'active',
      productivity: 'medium'
    };

    setCurrentInterval(newInterval);
    setIsRunning(true);
    setTimeRemaining(30 * 60);
  };

  const pauseInterval = () => {
    setIsRunning(false);
    if (currentInterval) {
      setCurrentInterval({
        ...currentInterval,
        status: 'paused'
      });
    }
  };

  const resumeInterval = () => {
    setIsRunning(true);
    if (currentInterval) {
      setCurrentInterval({
        ...currentInterval,
        status: 'active'
      });
    }
  };

  const completeInterval = () => {
    if (!currentInterval) return;

    const completedInterval: WorkInterval = {
      ...currentInterval,
      endTime: new Date(),
      accomplishments: accomplishments.filter(acc => acc.trim() !== ''),
      status: 'completed',
      productivity: calculateProductivity(accomplishments)
    };

    setCompletedIntervals(prev => [completedInterval, ...prev]);
    setCurrentInterval(null);
    setIsRunning(false);
    setAccomplishments(['']);
    setCurrentFocus('');
    setTimeRemaining(30 * 60);

    if (onIntervalComplete) {
      onIntervalComplete(completedInterval);
    }
  };

  const calculateProductivity = (accs: string[]): 'high' | 'medium' | 'low' => {
    const validAccomplishments = accs.filter(acc => acc.trim() !== '').length;
    if (validAccomplishments >= 3) return 'high';
    if (validAccomplishments >= 1) return 'medium';
    return 'low';
  };

  const addAccomplishment = () => {
    setAccomplishments(prev => [...prev, '']);
  };

  const updateAccomplishment = (index: number, value: string) => {
    setAccomplishments(prev => 
      prev.map((acc, i) => i === index ? value : acc)
    );
  };

  const removeAccomplishment = (index: number) => {
    setAccomplishments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((30 * 60 - timeRemaining) / (30 * 60)) * 100;
  };

  const getProductivityColor = (productivity: string) => {
    switch (productivity) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getProductivityEmoji = (productivity: string) => {
    switch (productivity) {
      case 'high': return '🚀';
      case 'medium': return '⚡';
      case 'low': return '🐌';
      default: return '📊';
    }
  };

  return (
    <div className="interval-tracker">
      <div className="tracker-header">
        <h2>⏱️ 30-Minute Work Intervals</h2>
        <p>Track your focused work sessions and accomplishments</p>
      </div>

      {/* Current Interval */}
      {currentInterval && (
        <div className="current-interval">
          <div className="interval-timer">
            <div className="timer-display">
              <div className="time">{formatTime(timeRemaining)}</div>
              <div className="timer-label">Time Remaining</div>
            </div>
            <div className="progress-ring">
              <svg className="progress-circle" width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - getProgressPercentage() / 100)}`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
            </div>
          </div>

          <div className="interval-controls">
            {!isRunning ? (
              <button className="btn btn-primary" onClick={resumeInterval}>
                ▶️ Resume
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={pauseInterval}>
                ⏸️ Pause
              </button>
            )}
            <button className="btn btn-danger" onClick={completeInterval}>
              ✅ Complete
            </button>
          </div>

          <div className="interval-focus">
            <label>Current Focus:</label>
            <input
              type="text"
              value={currentFocus}
              onChange={(e) => setCurrentFocus(e.target.value)}
              placeholder="What are you working on?"
              className="focus-input"
            />
          </div>

          <div className="accomplishments">
            <h3>📝 Accomplishments</h3>
            {accomplishments.map((acc, index) => (
              <div key={index} className="accomplishment-item">
                <input
                  type="text"
                  value={acc}
                  onChange={(e) => updateAccomplishment(index, e.target.value)}
                  placeholder={`Accomplishment ${index + 1}...`}
                  className="accomplishment-input"
                />
                {accomplishments.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeAccomplishment(index)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-outline" onClick={addAccomplishment}>
              ➕ Add Accomplishment
            </button>
          </div>
        </div>
      )}

      {/* Start New Interval */}
      {!currentInterval && (
        <div className="start-interval">
          <div className="focus-setup">
            <label>What will you focus on?</label>
            <input
              type="text"
              value={currentFocus}
              onChange={(e) => setCurrentFocus(e.target.value)}
              placeholder="e.g., Implement user authentication, Fix bug in payment flow..."
              className="focus-input"
            />
          </div>
          <button 
            className="btn btn-primary btn-large" 
            onClick={startInterval}
            disabled={!currentFocus.trim()}
          >
            🚀 Start 30-Minute Interval
          </button>
        </div>
      )}

      {/* Completed Intervals */}
      {completedIntervals.length > 0 && (
        <div className="completed-intervals">
          <h3>📊 Completed Intervals</h3>
          <div className="intervals-grid">
            {completedIntervals.map((interval) => (
              <div key={interval.id} className="interval-card">
                <div className="interval-header">
                  <div className="interval-time">
                    {interval.startTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="productivity-badge" style={{ 
                    backgroundColor: getProductivityColor(interval.productivity) 
                  }}>
                    {getProductivityEmoji(interval.productivity)} {interval.productivity}
                  </div>
                </div>
                
                <div className="interval-focus-display">
                  <strong>Focus:</strong> {interval.focus}
                </div>
                
                <div className="interval-accomplishments">
                  <strong>Accomplished:</strong>
                  <ul>
                    {interval.accomplishments.map((acc, index) => (
                      <li key={index}>{acc}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="interval-stats">
                  <span>Duration: {interval.duration}min</span>
                  <span>Tasks: {interval.accomplishments.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Summary */}
      {completedIntervals.length > 0 && (
        <div className="session-summary">
          <h3>📈 Session Summary</h3>
          <div className="summary-stats">
            <div className="stat">
              <div className="stat-number">{completedIntervals.length}</div>
              <div className="stat-label">Intervals</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                {completedIntervals.reduce((sum, interval) => sum + interval.accomplishments.length, 0)}
              </div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                {completedIntervals.reduce((sum, interval) => sum + interval.duration, 0)}min
              </div>
              <div className="stat-label">Total Time</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                {Math.round(completedIntervals.reduce((sum, interval) => sum + interval.accomplishments.length, 0) / completedIntervals.length * 10) / 10}
              </div>
              <div className="stat-label">Avg Tasks/Interval</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntervalTracker;
