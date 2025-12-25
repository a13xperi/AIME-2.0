/**
 * Club Analysis Component
 * Analyze club performance and usage
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClubAnalysis.css';

interface ClubStat {
  club: string;
  avgDistance: number;
  accuracy: number;
  usage: number;
  bestDistance: number;
  worstDistance: number;
}

const ClubAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const clubStats: ClubStat[] = [
    { club: 'Driver', avgDistance: 245, accuracy: 65, usage: 18, bestDistance: 267, worstDistance: 220 },
    { club: '3 Wood', avgDistance: 220, accuracy: 72, usage: 12, bestDistance: 240, worstDistance: 200 },
    { club: '5 Iron', avgDistance: 180, accuracy: 78, usage: 24, bestDistance: 195, worstDistance: 165 },
    { club: '7 Iron', avgDistance: 150, accuracy: 82, usage: 32, bestDistance: 165, worstDistance: 135 },
    { club: '9 Iron', avgDistance: 120, accuracy: 85, usage: 28, bestDistance: 135, worstDistance: 105 },
    { club: 'PW', avgDistance: 100, accuracy: 88, usage: 22, bestDistance: 115, worstDistance: 85 },
  ];

  return (
    <div className="club-analysis-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Club Analysis</h1>
            <p className="subtitle">Performance insights for your clubs</p>
          </div>

          <div className="club-stats-list">
            {clubStats.map((stat) => (
              <div key={stat.club} className="club-stat-card">
                <div className="club-stat-header">
                  <div className="club-name">{stat.club}</div>
                  <div className="club-usage">{stat.usage} shots</div>
                </div>

                <div className="stat-row">
                  <div className="stat-item">
                    <div className="stat-label">Avg Distance</div>
                    <div className="stat-value">{stat.avgDistance} yds</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Accuracy</div>
                    <div className="stat-value">{stat.accuracy}%</div>
                  </div>
                </div>

                <div className="distance-range">
                  <div className="range-label">Distance Range</div>
                  <div className="range-bar">
                    <div className="range-fill" style={{ 
                      left: `${((stat.worstDistance - 80) / 200) * 100}%`,
                      width: `${((stat.bestDistance - stat.worstDistance) / 200) * 100}%`
                    }}></div>
                  </div>
                  <div className="range-values">
                    <span>{stat.worstDistance} yds</span>
                    <span>{stat.bestDistance} yds</span>
                  </div>
                </div>

                <div className="accuracy-bar">
                  <div className="accuracy-label">Accuracy</div>
                  <div className="accuracy-bar-container">
                    <div 
                      className="accuracy-bar-fill" 
                      style={{ width: `${stat.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="insights-section">
            <h3>Insights</h3>
            <div className="insight-item">
              <span className="insight-icon">💡</span>
              <span className="insight-text">Your 7 Iron is your most consistent club</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <span className="insight-text">Consider practicing with your Driver for better accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubAnalysis;

