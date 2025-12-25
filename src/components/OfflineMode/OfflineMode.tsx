import React from 'react';
import './OfflineMode.css';

interface OfflineModeProps {
  onRetry: () => void;
  error?: string;
}

const OfflineMode: React.FC<OfflineModeProps> = ({ onRetry, error }) => {
  return (
    <div className="offline-mode">
      <div className="offline-content">
        <div className="offline-icon">📡</div>
        <h2>Offline Mode</h2>
        <p>{error || 'Unable to connect to Notion API. This could be due to:'}</p>
        <ul>
          <li>Notion API service temporarily unavailable</li>
          <li>Network connectivity issues</li>
          <li>API rate limiting</li>
          <li>Invalid API credentials</li>
        </ul>
        <div className="offline-actions">
          <button className="btn btn-primary" onClick={onRetry}>
            🔄 Retry Connection
          </button>
          <button className="btn btn-outline" onClick={() => window.location.reload()}>
            🔄 Refresh Page
          </button>
        </div>
        <div className="offline-tips">
          <h3>💡 Tips:</h3>
          <ul>
            <li>Check your internet connection</li>
            <li>Verify your Notion API key is correct</li>
            <li>Wait a few minutes and try again</li>
            <li>
              Check{' '}
              <a href="https://status.notion.so" target="_blank" rel="noopener noreferrer">
                Notion's status page
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;
