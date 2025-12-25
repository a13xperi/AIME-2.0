/**
 * Settings Component
 * App settings and preferences
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<'yards' | 'meters'>('yards');
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="settings-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Settings</h1>
          </div>

          <div className="settings-sections">
            <div className="settings-section">
              <h2>Preferences</h2>
              <div className="setting-item">
                <div className="setting-label">Distance Units</div>
                <div className="setting-control">
                  <button
                    className={`unit-btn ${units === 'yards' ? 'active' : ''}`}
                    onClick={() => setUnits('yards')}
                  >
                    Yards
                  </button>
                  <button
                    className={`unit-btn ${units === 'meters' ? 'active' : ''}`}
                    onClick={() => setUnits('meters')}
                  >
                    Meters
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2>Notifications</h2>
              <div className="toggle-item">
                <span className="toggle-label">Push Notifications</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h2>Haptic Feedback</h2>
              <div className="toggle-item">
                <span className="toggle-label">Enable Haptic Feedback</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={hapticFeedback}
                    onChange={(e) => setHapticFeedback(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h2>Data</h2>
              <div className="toggle-item">
                <span className="toggle-label">Auto-save Rounds</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <button className="action-btn">Export Data</button>
              <button className="action-btn secondary">Clear Cache</button>
            </div>

            <div className="settings-section">
              <h2>About</h2>
              <div className="about-info">
                <div className="info-row">
                  <span className="info-label">Version</span>
                  <span className="info-value">3.0.0</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Build</span>
                  <span className="info-value">2025.12.25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

