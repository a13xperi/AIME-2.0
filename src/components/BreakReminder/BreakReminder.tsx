import React, { useState, useEffect } from 'react';
import './BreakReminder.css';

interface BreakReminderProps {
  isVisible: boolean;
  onClose: () => void;
  onTakeBreak: () => void;
  workDuration: number; // minutes
}

const BreakReminder: React.FC<BreakReminderProps> = ({
  isVisible,
  onClose,
  onTakeBreak,
  workDuration,
}) => {
  const [timeLeft, setTimeLeft] = useState(30); // 30 second countdown
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-take break after countdown
          onTakeBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onTakeBreak]);

  const handleTakeBreak = () => {
    setIsDismissed(true);
    onTakeBreak();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onClose();
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="break-reminder-overlay">
      <div className="break-reminder-modal">
        <div className="break-reminder-header">
          <h2>⏰ Break Time!</h2>
          <button className="close-button" onClick={handleDismiss}>
            ×
          </button>
        </div>

        <div className="break-reminder-content">
          <div className="work-stats">
            <div className="stat-item">
              <span className="stat-label">You've been working for:</span>
              <span className="stat-value">{workDuration} minutes</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Recommended break:</span>
              <span className="stat-value">5-10 minutes</span>
            </div>
          </div>

          <div className="break-suggestions">
            <h3>💡 Break Ideas</h3>
            <ul>
              <li>🌿 Step outside for fresh air</li>
              <li>💧 Drink some water</li>
              <li>👀 Look away from your screen</li>
              <li>🧘 Take a few deep breaths</li>
              <li>🚶 Walk around for a few minutes</li>
            </ul>
          </div>

          {timeLeft > 0 && (
            <div className="countdown">
              <div className="countdown-label">Auto-break in:</div>
              <div className="countdown-value">{timeLeft}s</div>
            </div>
          )}
        </div>

        <div className="break-reminder-actions">
          <button className="btn btn-primary btn-large" onClick={handleTakeBreak}>
            ✅ Take Break Now
          </button>
          <button className="btn btn-secondary" onClick={handleDismiss}>
            ⏰ Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakReminder;
