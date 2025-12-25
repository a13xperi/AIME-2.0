/**
 * Round Settings Component
 * Configure round settings before starting
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './RoundSettings.css';

const RoundSettings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course') || '1';
  
  const [players, setPlayers] = useState(1);
  const [format, setFormat] = useState('stroke');
  const [useGPS, setUseGPS] = useState(true);
  const [usePuck, setUsePuck] = useState(true);

  const handleStartRound = () => {
    navigate('/my-bag');
  };

  return (
    <div className="round-settings-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>Round Settings</h1>
            <p className="subtitle">Configure your round</p>
          </div>

          <div className="settings-section">
            <div className="setting-item">
              <div className="setting-label">Number of Players</div>
              <div className="setting-control">
                <button 
                  className="number-btn"
                  onClick={() => setPlayers(Math.max(1, players - 1))}
                >
                  −
                </button>
                <span className="number-value">{players}</span>
                <button 
                  className="number-btn"
                  onClick={() => setPlayers(players + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label">Game Format</div>
              <div className="format-options">
                {['stroke', 'match', 'skins', 'scramble'].map((fmt) => (
                  <button
                    key={fmt}
                    className={`format-btn ${format === fmt ? 'active' : ''}`}
                    onClick={() => setFormat(fmt)}
                  >
                    {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label">Features</div>
              <div className="feature-toggles">
                <div className="toggle-item">
                  <span className="toggle-label">Use GPS Tracking</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={useGPS}
                      onChange={(e) => setUseGPS(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <span className="toggle-label">Use Robo Puck</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={usePuck}
                      onChange={(e) => setUsePuck(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {players > 1 && (
            <div className="multiplayer-note">
              <div className="note-icon">👥</div>
              <div className="note-text">
                Multi-player mode enabled. You'll be able to track scores for all {players} players.
              </div>
            </div>
          )}

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleStartRound}>
              Start Round →
            </button>
            {players > 1 && (
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/multiplayer-scorecard')}
                style={{ marginTop: '12px' }}
              >
                View Multi-Player Scorecard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundSettings;

