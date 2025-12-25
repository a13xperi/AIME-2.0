/**
 * Detailed Statistics Component
 * Comprehensive round statistics and analytics
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DetailedStats.css';

const DetailedStats: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="detailed-stats-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Detailed Statistics</h1>
            <div className="round-info">
              <span>Pebble Beach</span>
              <span>•</span>
              <span>Dec 10, 2025</span>
            </div>
          </div>

          <div className="stats-sections">
            <div className="stat-section">
              <h2>Driving</h2>
              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-label">Fairways Hit</div>
                  <div className="stat-value">8/14 (57%)</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ width: '57%' }}></div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Avg Drive Distance</div>
                  <div className="stat-value">245 yds</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Longest Drive</div>
                  <div className="stat-value">267 yds</div>
                </div>
              </div>
            </div>

            <div className="stat-section">
              <h2>Approach Shots</h2>
              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-label">GIR</div>
                  <div className="stat-value">6/18 (33%)</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ width: '33%' }}></div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Avg Approach Distance</div>
                  <div className="stat-value">142 yds</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Proximity to Pin</div>
                  <div className="stat-value">28 ft</div>
                </div>
              </div>
            </div>

            <div className="stat-section">
              <h2>Putting</h2>
              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-label">Total Putts</div>
                  <div className="stat-value">34</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Avg Putts per Hole</div>
                  <div className="stat-value">1.9</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">3-Putt Avoidance</div>
                  <div className="stat-value">94%</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Putts Made (5-10 ft)</div>
                  <div className="stat-value">4/7 (57%)</div>
                </div>
              </div>
            </div>

            <div className="stat-section">
              <h2>Scoring</h2>
              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-label">Eagles</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Birdies</div>
                  <div className="stat-value">7</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Pars</div>
                  <div className="stat-value">8</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Bogeys</div>
                  <div className="stat-value">2</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Doubles+</div>
                  <div className="stat-value">1</div>
                </div>
              </div>
            </div>

            <div className="stat-section">
              <h2>Penalties & Recovery</h2>
              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-label">Penalties</div>
                  <div className="stat-value">2</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Sand Saves</div>
                  <div className="stat-value">1/2 (50%)</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Scrambling</div>
                  <div className="stat-value">8/12 (67%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStats;

