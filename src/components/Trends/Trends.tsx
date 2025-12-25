/**
 * Trends Component
 * Performance trends and improvements over time
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trends.css';

const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const trends = {
    score: { current: 86, previous: 89, change: -3, trend: 'improving' },
    fairways: { current: 57, previous: 52, change: 5, trend: 'improving' },
    gir: { current: 33, previous: 28, change: 5, trend: 'improving' },
    putts: { current: 34, previous: 36, change: -2, trend: 'improving' },
  };

  return (
    <div className="trends-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Performance Trends</h1>
            <div className="timeframe-selector">
              <button
                className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
                onClick={() => setTimeframe('week')}
              >
                Week
              </button>
              <button
                className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
                onClick={() => setTimeframe('month')}
              >
                Month
              </button>
              <button
                className={`timeframe-btn ${timeframe === 'year' ? 'active' : ''}`}
                onClick={() => setTimeframe('year')}
              >
                Year
              </button>
            </div>
          </div>

          <div className="trends-list">
            <div className="trend-card">
              <div className="trend-header">
                <div className="trend-label">Average Score</div>
                <div className={`trend-change ${trends.score.trend}`}>
                  {trends.score.change > 0 ? '+' : ''}{trends.score.change}
                </div>
              </div>
              <div className="trend-values">
                <div className="trend-current">{trends.score.current}</div>
                <div className="trend-previous">vs {trends.score.previous}</div>
              </div>
              <div className="trend-chart">
                <div className="chart-bar" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="trend-card">
              <div className="trend-header">
                <div className="trend-label">Fairways Hit %</div>
                <div className={`trend-change ${trends.fairways.trend}`}>
                  +{trends.fairways.change}%
                </div>
              </div>
              <div className="trend-values">
                <div className="trend-current">{trends.fairways.current}%</div>
                <div className="trend-previous">vs {trends.fairways.previous}%</div>
              </div>
              <div className="trend-chart">
                <div className="chart-bar" style={{ width: `${trends.fairways.current}%` }}></div>
              </div>
            </div>

            <div className="trend-card">
              <div className="trend-header">
                <div className="trend-label">GIR %</div>
                <div className={`trend-change ${trends.gir.trend}`}>
                  +{trends.gir.change}%
                </div>
              </div>
              <div className="trend-values">
                <div className="trend-current">{trends.gir.current}%</div>
                <div className="trend-previous">vs {trends.gir.previous}%</div>
              </div>
              <div className="trend-chart">
                <div className="chart-bar" style={{ width: `${trends.gir.current * 2}%` }}></div>
              </div>
            </div>

            <div className="trend-card">
              <div className="trend-header">
                <div className="trend-label">Avg Putts</div>
                <div className={`trend-change ${trends.putts.trend}`}>
                  {trends.putts.change}
                </div>
              </div>
              <div className="trend-values">
                <div className="trend-current">{trends.putts.current}</div>
                <div className="trend-previous">vs {trends.putts.previous}</div>
              </div>
              <div className="trend-chart">
                <div className="chart-bar" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="insights-section">
            <h3>Key Insights</h3>
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <span className="insight-text">Your driving accuracy has improved by 5% this month</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">GIR percentage is trending upward</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">⛳</span>
              <span className="insight-text">Putting is more consistent - keep it up!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;

