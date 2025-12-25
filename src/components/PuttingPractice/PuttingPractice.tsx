/**
 * Putting Practice Component
 * Detailed putting practice mode
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PuttingPractice.css';

const PuttingPractice: React.FC = () => {
  const navigate = useNavigate();
  const [practiceMode, setPracticeMode] = useState<'distance' | 'break' | 'speed'>('distance');
  const [sessionStats, setSessionStats] = useState({
    putts: 12,
    made: 8,
    avgDistance: 15,
    longestMade: 25,
  });

  const handleStartPractice = () => {
    // Start practice session
  };

  const handleBack = () => {
    navigate('/practice');
  };

  return (
    <div className="putting-practice-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Putting Practice</h1>
            <p className="subtitle">Improve your putting accuracy</p>
          </div>

          <div className="practice-modes">
            <h3>Practice Focus</h3>
            <div className="mode-selector">
              <button
                className={`mode-btn ${practiceMode === 'distance' ? 'active' : ''}`}
                onClick={() => setPracticeMode('distance')}
              >
                Distance Control
              </button>
              <button
                className={`mode-btn ${practiceMode === 'break' ? 'active' : ''}`}
                onClick={() => setPracticeMode('break')}
              >
                Reading Break
              </button>
              <button
                className={`mode-btn ${practiceMode === 'speed' ? 'active' : ''}`}
                onClick={() => setPracticeMode('speed')}
              >
                Speed Control
              </button>
            </div>
          </div>

          <div className="session-stats">
            <h3>This Session</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Putts</div>
                <div className="stat-value">{sessionStats.putts}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Made</div>
                <div className="stat-value">{sessionStats.made}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Make %</div>
                <div className="stat-value">
                  {Math.round((sessionStats.made / sessionStats.putts) * 100)}%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Longest Made</div>
                <div className="stat-value">{sessionStats.longestMade} ft</div>
              </div>
            </div>
          </div>

          <div className="practice-options">
            <h3>Practice Options</h3>
            <div className="options-list">
              <button className="option-card" onClick={handleStartPractice}>
                <span className="option-icon">🎯</span>
                <div className="option-info">
                  <div className="option-name">Target Practice</div>
                  <div className="option-desc">Practice from specific distances</div>
                </div>
                <span className="option-arrow">→</span>
              </button>
              <button className="option-card">
                <span className="option-icon">📊</span>
                <div className="option-info">
                  <div className="option-name">Break Reading</div>
                  <div className="option-desc">Practice reading green slopes</div>
                </div>
                <span className="option-arrow">→</span>
              </button>
              <button className="option-card">
                <span className="option-icon">⏱️</span>
                <div className="option-info">
                  <div className="option-name">Speed Drills</div>
                  <div className="option-desc">Practice controlling putt speed</div>
                </div>
                <span className="option-arrow">→</span>
              </button>
            </div>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleStartPractice}>
              Start Practice →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuttingPractice;

