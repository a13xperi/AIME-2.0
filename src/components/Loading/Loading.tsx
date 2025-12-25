/**
 * Loading Component
 * Reusable loading state component
 */

import React from 'react';
import './Loading.css';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-content">
          <div className="loading-spinner-large"></div>
          <div className="loading-message">{message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="loading-spinner"></div>
      <div className="loading-message-small">{message}</div>
    </div>
  );
};

export default Loading;

