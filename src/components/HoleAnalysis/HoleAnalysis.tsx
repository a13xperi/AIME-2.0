/**
 * Hole Analysis Component
 * Detailed analysis of a specific hole
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './HoleAnalysis.css';

const HoleAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const courseId = searchParams.get('course') || '1';

  const holeData = {
    number: holeNumber,
    par: 4,
    distance: 420,
    handicap: 3,
    avgScore: 4.8,
    yourAvg: 5.2,
    bestScore: 3,
    worstScore: 7,
    timesPlayed: 12,
  };

  const shotBreakdown = [
    { shot: 1, club: 'Driver', distance: 267, result: 'Fairway', condition: 'Tee' },
    { shot: 2, club: '7 Iron', distance: 162, result: 'Green', condition: 'Fairway' },
    { shot: 3, club: 'Putter', distance: 18, result: 'Made', condition: 'Green' },
    { shot: 4, club: 'Putter', distance: 3, result: 'Made', condition: 'Green' },
  ];

  return (
    <div className="hole-analysis-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Hole {holeData.number} Analysis</h1>
            <div className="hole-basic-info">
              <span>Par {holeData.par}</span>
              <span>•</span>
              <span>{holeData.distance} yds</span>
              <span>•</span>
              <span>Hcp {holeData.handicap}</span>
            </div>
          </div>

          <div className="performance-summary">
            <div className="summary-card">
              <div className="summary-label">Your Average</div>
              <div className="summary-value">{holeData.yourAvg}</div>
              <div className="summary-comparison">
                vs Course Avg: {holeData.avgScore}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Best Score</div>
              <div className="summary-value">{holeData.bestScore}</div>
              <div className="summary-comparison">
                Worst: {holeData.worstScore}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Times Played</div>
              <div className="summary-value">{holeData.timesPlayed}</div>
            </div>
          </div>

          <div className="shot-breakdown-section">
            <h3>Typical Shot Breakdown</h3>
            <div className="shot-list">
              {shotBreakdown.map((shot) => (
                <div key={shot.shot} className="shot-item">
                  <div className="shot-number">Shot {shot.shot}</div>
                  <div className="shot-details">
                    <div className="shot-club">{shot.club}</div>
                    <div className="shot-info">
                      <span>{shot.distance} yds</span>
                      <span>•</span>
                      <span>{shot.condition}</span>
                      <span>•</span>
                      <span className="shot-result">{shot.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations-section">
            <h3>Recommendations</h3>
            <div className="recommendation-item">
              <span className="rec-icon">💡</span>
              <span className="rec-text">Your average is above par. Focus on approach shot accuracy.</span>
            </div>
            <div className="recommendation-item">
              <span className="rec-icon">🎯</span>
              <span className="rec-text">Consider using 6 Iron instead of 7 Iron for better distance control.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoleAnalysis;

