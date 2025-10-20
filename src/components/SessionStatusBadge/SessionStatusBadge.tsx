import React from 'react';
import { SessionStatus } from '../../types';
import './SessionStatusBadge.css';

interface SessionStatusBadgeProps {
  status: SessionStatus;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
}

const STATUS_CONFIG = {
  'Active': { icon: '🟢', color: '#10b981', bgColor: '#d1fae5' },
  'In Progress': { icon: '🔄', color: '#3b82f6', bgColor: '#dbeafe' },
  'Paused': { icon: '⏸️', color: '#f59e0b', bgColor: '#fef3c7' },
  'Blocked': { icon: '🚫', color: '#ef4444', bgColor: '#fee2e2' },
  'Completed': { icon: '✅', color: '#059669', bgColor: '#d1fae5' },
  'Archived': { icon: '📦', color: '#6b7280', bgColor: '#f3f4f6' }
};

const SessionStatusBadge: React.FC<SessionStatusBadgeProps> = ({
  status,
  size = 'medium',
  showIcon = true,
  showLabel = true,
  onClick
}) => {
  const config = STATUS_CONFIG[status];
  
  if (!config) {
    return null;
  }

  const sizeClasses = {
    small: 'badge-small',
    medium: 'badge-medium',
    large: 'badge-large'
  };

  const badgeClasses = [
    'session-status-badge',
    sizeClasses[size],
    onClick ? 'clickable' : ''
  ].filter(Boolean).join(' ');

  return (
    <span
      className={badgeClasses}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.color
      }}
      onClick={onClick}
    >
      {showIcon && <span className="status-icon">{config.icon}</span>}
      {showLabel && <span className="status-label">{status}</span>}
    </span>
  );
};

export default SessionStatusBadge;
