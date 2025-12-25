/**
 * Empty State Component
 * Reusable empty state component
 */

import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-message">{message}</div>
      {actionLabel && onAction && (
        <button className="empty-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

