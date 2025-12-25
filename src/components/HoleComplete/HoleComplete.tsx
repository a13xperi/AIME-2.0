/**
 * Hole Complete Component
 * Performance summary after completing a hole
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './HoleComplete.css';

const HoleComplete: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const isLastHole = holeNumber >= 18;

  const handleContinue = () => {
    if (isLastHole) {
      navigate('/round-complete');
    } else {
      navigate(`/hole-start?hole=${holeNumber + 1}&par=4`);
    }
  };

  return (
    <div className="hole-complete-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>Hole {holeNumber} Complete</h1>
            <div className="score-display">
              <div className="score-large">5</div>
              <div className="score-label">(Bogey)</div>
            </div>
          </div>

          <div className="par-info">
            <div className="par-badge-large">Par 4</div>
            <div className="shot-breakdown">3 + 2 putts</div>
          </div>

          <div className="performance-metrics">
            <div className="metric-card">
              <div className="metric-label">Fairway</div>
              <div className="metric-value positive">Hit</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Putts</div>
              <div className="metric-value">
                2 <span className="metric-trend">(Avg: 1.8) ↓</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">GIR</div>
              <div className="metric-value positive">Yes ✓</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Penalties</div>
              <div className="metric-value">0</div>
            </div>
          </div>

          <div className="highlight-card">
            <div className="highlight-label">Longest drive</div>
            <div className="highlight-value">267 yds!</div>
          </div>

          <div className="view-shots">
            <button className="link-btn">View 4 shots</button>
          </div>

          <div className="average-comparison">
            <div className="avg-label">Your avg on this hole:</div>
            <div className="avg-value">5.2</div>
            <div className="avg-trend">↓ Better than average!</div>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleContinue}>
              {isLastHole ? 'View Round Summary →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoleComplete;

