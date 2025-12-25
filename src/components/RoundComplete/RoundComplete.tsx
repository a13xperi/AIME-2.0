/**
 * Round Complete Component
 * Final round summary with statistics
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoundComplete.css';

const RoundComplete: React.FC = () => {
  const navigate = useNavigate();

  const handleViewStats = () => {
    navigate('/dashboard');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="round-complete-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>Round Complete!</h1>
            <div className="total-score">
              <div className="score-number">86</div>
              <div className="score-over-par">+14</div>
            </div>
            <div className="round-info">
              <div className="location">Pebble Beach</div>
              <div className="date">Dec 10, 2025</div>
            </div>
          </div>

          <div className="highlights-section">
            <h2>Highlights</h2>
            <div className="highlights-grid">
              <div className="highlight-item">
                <div className="highlight-icon">🏆</div>
                <div className="highlight-text">
                  <div className="highlight-label">Best Hole</div>
                  <div className="highlight-value">#5 (Birdie!)</div>
                </div>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">🚀</div>
                <div className="highlight-text">
                  <div className="highlight-label">Longest Drive</div>
                  <div className="highlight-value">267 yds</div>
                </div>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">⛳</div>
                <div className="highlight-text">
                  <div className="highlight-label">Fewest Putts</div>
                  <div className="highlight-value">Hole 8 (1)</div>
                </div>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">📊</div>
                <div className="highlight-text">
                  <div className="highlight-label">Back 9</div>
                  <div className="highlight-value">43 (+7)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="key-stats">
            <h2>Key Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Fairways</div>
                <div className="stat-value">8/14 (57%)</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">GIR</div>
                <div className="stat-value">6/18 (33%)</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Putts</div>
                <div className="stat-value">34 total</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Penalties</div>
                <div className="stat-value">2</div>
              </div>
            </div>
          </div>

          <div className="scoring-breakdown">
            <h2>Scoring Breakdown</h2>
            <div className="breakdown-bars">
              <div className="breakdown-item">
                <div className="breakdown-label">Eagles</div>
                <div className="breakdown-bar">
                  <div className="bar-fill" style={{ width: '0%' }}></div>
                </div>
                <div className="breakdown-count">0</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Birdies</div>
                <div className="breakdown-bar">
                  <div className="bar-fill" style={{ width: '39%' }}></div>
                </div>
                <div className="breakdown-count">7</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Pars</div>
                <div className="breakdown-bar">
                  <div className="bar-fill" style={{ width: '44%' }}></div>
                </div>
                <div className="breakdown-count">8</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Bogeys</div>
                <div className="breakdown-bar">
                  <div className="bar-fill" style={{ width: '11%' }}></div>
                </div>
                <div className="breakdown-count">2</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Doubles+</div>
                <div className="breakdown-bar">
                  <div className="bar-fill" style={{ width: '6%' }}></div>
                </div>
                <div className="breakdown-count">1</div>
              </div>
            </div>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleViewStats}>
              View Detailed Stats →
            </button>
            <div className="footer-links">
              <button className="link-btn" onClick={handleReturnHome}>
                Share Results
              </button>
              <button className="link-btn" onClick={handleReturnHome}>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundComplete;

