/**
 * Shot Analysis Component
 * Detailed analysis of a completed shot
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ShotAnalysis.css';

const ShotAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const shotNumber = parseInt(searchParams.get('shot') || '1');

  const shotAnalysis = {
    club: '7 Iron',
    intendedDistance: 150,
    actualDistance: 162,
    accuracy: 92,
    ballSpeed: 95,
    launchAngle: 18,
    spinRate: 4200,
    carry: 155,
    total: 162,
    result: 'Fairway',
    condition: 'Fairway',
    windImpact: '+2 yds',
    elevationImpact: '0 yds',
  };

  const recommendations = [
    {
      type: 'improvement',
      icon: '💡',
      text: 'Slightly long - consider 8 Iron for better distance control',
    },
    {
      type: 'positive',
      icon: '✅',
      text: 'Excellent accuracy - 92% on target',
    },
    {
      type: 'tip',
      icon: '🎯',
      text: 'Your launch angle is optimal for this club',
    },
  ];

  return (
    <div className="shot-analysis-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Shot Analysis</h1>
            <div className="shot-header-info">
              <span>Hole {holeNumber}</span>
              <span>•</span>
              <span>Shot {shotNumber}</span>
            </div>
          </div>

          <div className="analysis-summary">
            <div className="summary-card">
              <div className="summary-label">Club</div>
              <div className="summary-value">{shotAnalysis.club}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Accuracy</div>
              <div className="summary-value">{shotAnalysis.accuracy}%</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Result</div>
              <div className="summary-value">{shotAnalysis.result}</div>
            </div>
          </div>

          <div className="distance-comparison">
            <h3>Distance Analysis</h3>
            <div className="comparison-bars">
              <div className="comparison-item">
                <div className="comparison-label">Intended</div>
                <div className="comparison-bar">
                  <div 
                    className="comparison-fill intended" 
                    style={{ width: `${(shotAnalysis.intendedDistance / 200) * 100}%` }}
                  ></div>
                </div>
                <div className="comparison-value">{shotAnalysis.intendedDistance} yds</div>
              </div>
              <div className="comparison-item">
                <div className="comparison-label">Actual</div>
                <div className="comparison-bar">
                  <div 
                    className="comparison-fill actual" 
                    style={{ width: `${(shotAnalysis.actualDistance / 200) * 100}%` }}
                  ></div>
                </div>
                <div className="comparison-value">{shotAnalysis.actualDistance} yds</div>
              </div>
            </div>
            <div className="distance-diff">
              {shotAnalysis.actualDistance > shotAnalysis.intendedDistance ? '+' : ''}
              {shotAnalysis.actualDistance - shotAnalysis.intendedDistance} yds difference
            </div>
          </div>

          <div className="shot-metrics-detailed">
            <h3>Shot Metrics</h3>
            <div className="metrics-list">
              <div className="metric-row">
                <div className="metric-label">Ball Speed</div>
                <div className="metric-value">{shotAnalysis.ballSpeed} mph</div>
              </div>
              <div className="metric-row">
                <div className="metric-label">Launch Angle</div>
                <div className="metric-value">{shotAnalysis.launchAngle}°</div>
              </div>
              <div className="metric-row">
                <div className="metric-label">Spin Rate</div>
                <div className="metric-value">{shotAnalysis.spinRate.toLocaleString()} rpm</div>
              </div>
              <div className="metric-row">
                <div className="metric-label">Carry Distance</div>
                <div className="metric-value">{shotAnalysis.carry} yds</div>
              </div>
              <div className="metric-row">
                <div className="metric-label">Total Distance</div>
                <div className="metric-value">{shotAnalysis.total} yds</div>
              </div>
            </div>
          </div>

          <div className="environmental-factors">
            <h3>Environmental Factors</h3>
            <div className="factors-list">
              <div className="factor-item">
                <span className="factor-icon">🌬️</span>
                <span className="factor-label">Wind Impact</span>
                <span className="factor-value">{shotAnalysis.windImpact}</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">⛰️</span>
                <span className="factor-label">Elevation</span>
                <span className="factor-value">{shotAnalysis.elevationImpact}</span>
              </div>
            </div>
          </div>

          <div className="recommendations-section">
            <h3>Recommendations</h3>
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-item ${rec.type}`}>
                <span className="rec-icon">{rec.icon}</span>
                <span className="rec-text">{rec.text}</span>
              </div>
            ))}
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={() => navigate(-1)}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotAnalysis;

