/**
 * Loading Component
 * Comprehensive loading state component with multiple variants
 */

import React from 'react';
import './Loading.css';

export type LoadingVariant = 
  | 'spinner' 
  | 'spinner-large' 
  | 'dots' 
  | 'pulse' 
  | 'skeleton' 
  | 'progress' 
  | 'gps';

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  variant?: LoadingVariant;
  progress?: number; // 0-100 for progress variant
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  fullScreen = false,
  variant = 'spinner',
  progress,
  size = 'medium',
  className = '',
}) => {
  const renderSpinner = () => {
    const spinnerClass = variant === 'spinner-large' ? 'loading-spinner-large' : 
                        size === 'small' ? 'loading-spinner-small' :
                        size === 'large' ? 'loading-spinner-large' : 
                        'loading-spinner';
    
    return <div className={spinnerClass}></div>;
  };

  const renderDots = () => {
    return (
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    );
  };

  const renderPulse = () => {
    return <div className={`loading-pulse loading-pulse-${size}`}></div>;
  };

  const renderProgress = () => {
    return (
      <div className="loading-progress-container">
        <div className="loading-progress-bar">
          <div 
            className="loading-progress-fill" 
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
        {message && <div className="loading-progress-message">{message}</div>}
        {progress !== undefined && (
          <div className="loading-progress-percent">{Math.round(progress)}%</div>
        )}
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className="loading-skeleton-container">
        <div className="loading-skeleton-line loading-skeleton-title"></div>
        <div className="loading-skeleton-line loading-skeleton-text"></div>
        <div className="loading-skeleton-line loading-skeleton-text"></div>
        <div className="loading-skeleton-line loading-skeleton-short"></div>
      </div>
    );
  };

  const renderGPS = () => {
    return (
      <div className="loading-gps-container">
        <div className="loading-gps-icon">📍</div>
        <div className="loading-gps-pulse"></div>
        <div className="loading-gps-message">{message || 'Getting GPS location...'}</div>
      </div>
    );
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'progress':
        return renderProgress();
      case 'skeleton':
        return renderSkeleton();
      case 'gps':
        return renderGPS();
      case 'spinner-large':
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className={`loading-fullscreen ${className}`}>
        <div className="loading-content">
          {renderLoader()}
          {message && variant !== 'progress' && variant !== 'gps' && (
            <div className="loading-message">{message}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-inline ${className}`}>
      {renderLoader()}
      {message && variant !== 'progress' && variant !== 'gps' && (
        <div className="loading-message-small">{message}</div>
      )}
    </div>
  );
};

export default Loading;

