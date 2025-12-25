import React, { useState } from 'react';
import { Session, SessionStatus } from '../../types';
import './SessionStatusManager.css';

interface SessionStatusManagerProps {
  session: Session;
  onStatusChange: (sessionId: string, newStatus: SessionStatus) => void;
  onClose: () => void;
}

const SESSION_STATUS_OPTIONS: {
  value: SessionStatus;
  label: string;
  icon: string;
  color: string;
  description: string;
}[] = [
  {
    value: 'Active',
    label: 'Active',
    icon: '🟢',
    color: '#10b981',
    description: 'Currently working on this session',
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    icon: '🔄',
    color: '#3b82f6',
    description: 'Session is actively being worked on',
  },
  {
    value: 'Paused',
    label: 'Paused',
    icon: '⏸️',
    color: '#f59e0b',
    description: 'Temporarily stopped, will resume later',
  },
  {
    value: 'Blocked',
    label: 'Blocked',
    icon: '🚫',
    color: '#ef4444',
    description: 'Cannot proceed due to blockers',
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: '✅',
    color: '#059669',
    description: 'Session work is finished',
  },
  {
    value: 'Archived',
    label: 'Archived',
    icon: '📦',
    color: '#6b7280',
    description: 'Session is archived for reference',
  },
];

const SessionStatusManager: React.FC<SessionStatusManagerProps> = ({
  session,
  onStatusChange,
  onClose,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus>(session.status);
  const [isChanging, setIsChanging] = useState(false);

  const handleStatusChange = async (newStatus: SessionStatus) => {
    setIsChanging(true);
    try {
      await onStatusChange(session.id, newStatus);
      setSelectedStatus(newStatus);
    } catch (error) {
      console.error('Failed to change session status:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const getCurrentStatusInfo = () => {
    return (
      SESSION_STATUS_OPTIONS.find(option => option.value === session.status) ||
      SESSION_STATUS_OPTIONS[0]
    );
  };

  const currentStatusInfo = getCurrentStatusInfo();

  return (
    <div className="session-status-manager-overlay">
      <div className="session-status-manager-modal">
        <div className="session-status-manager-header">
          <h2>📊 Change Session Status</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="session-status-manager-content">
          <div className="current-session-info">
            <h3>Session: {session.title}</h3>
            <div className="current-status-display">
              <span
                className="status-badge current"
                style={{ backgroundColor: currentStatusInfo.color }}
              >
                {currentStatusInfo.icon} {currentStatusInfo.label}
              </span>
              <p className="status-description">{currentStatusInfo.description}</p>
            </div>
          </div>

          <div className="status-options">
            <h3>Select New Status</h3>
            <div className="status-grid">
              {SESSION_STATUS_OPTIONS.map(option => (
                <div
                  key={option.value}
                  className={`status-option ${selectedStatus === option.value ? 'selected' : ''} ${session.status === option.value ? 'current' : ''}`}
                  onClick={() => setSelectedStatus(option.value)}
                >
                  <div className="status-icon" style={{ color: option.color }}>
                    {option.icon}
                  </div>
                  <div className="status-info">
                    <h4>{option.label}</h4>
                    <p>{option.description}</p>
                  </div>
                  {session.status === option.value && (
                    <div className="current-indicator">Current</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="session-status-manager-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => handleStatusChange(selectedStatus)}
            disabled={isChanging || selectedStatus === session.status}
          >
            {isChanging ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionStatusManager;
