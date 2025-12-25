import React from 'react';
import { SessionStatus } from '../../types';
import SessionStatusBadge from '../SessionStatusBadge/SessionStatusBadge';
import './SessionStatusFilter.css';

interface SessionStatusFilterProps {
  selectedStatus: SessionStatus | 'All';
  onStatusChange: (status: SessionStatus | 'All') => void;
  sessionCounts?: Record<SessionStatus, number>;
}

const ALL_STATUSES: (SessionStatus | 'All')[] = [
  'All',
  'Active',
  'In Progress',
  'Paused',
  'Blocked',
  'Completed',
  'Archived',
];

const SessionStatusFilter: React.FC<SessionStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  sessionCounts,
}) => {
  return (
    <div className="session-status-filter">
      <div className="filter-label">Filter by Status:</div>
      <div className="status-filter-buttons">
        {ALL_STATUSES.map(status => {
          const isSelected = selectedStatus === status;
          const count =
            status === 'All'
              ? Object.values(sessionCounts || {}).reduce((sum, count) => sum + count, 0)
              : sessionCounts?.[status as SessionStatus] || 0;

          return (
            <button
              key={status}
              className={`status-filter-button ${isSelected ? 'selected' : ''}`}
              onClick={() => onStatusChange(status)}
            >
              {status === 'All' ? (
                <span className="all-status">
                  <span className="all-icon">📋</span>
                  <span className="all-label">All</span>
                  {count > 0 && <span className="count">({count})</span>}
                </span>
              ) : (
                <SessionStatusBadge
                  status={status as SessionStatus}
                  size="small"
                  showIcon={true}
                  showLabel={true}
                />
              )}
              {count > 0 && status !== 'All' && <span className="count">({count})</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SessionStatusFilter;
