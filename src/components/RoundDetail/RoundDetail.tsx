/**
 * Round Detail Component
 * Detailed view of a specific round from history
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RoundDetail.css';

const RoundDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Mock round data - in real app, fetch by ID
  const round = {
    id: id || '1',
    course: 'Pebble Beach',
    location: 'Pebble Beach, CA',
    date: 'Dec 10, 2025',
    score: 86,
    par: 72,
    overPar: 14,
    front9: 43,
    back9: 43,
    fairways: '8/14',
    gir: '6/18',
    putts: 34,
    penalties: 2,
  };

  const handleViewScorecard = () => {
    navigate(`/scorecard?round=${round.id}`);
  };

  const handleViewStats = () => {
    navigate(`/detailed-stats?round=${round.id}`);
  };

  const handleBack = () => {
    navigate('/round-history');
  };

  return (
    <div className="round-detail-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>{round.course}</h1>
            <div className="round-meta">
              <span>{round.location}</span>
              <span>•</span>
              <span>{round.date}</span>
            </div>
          </div>

          <div className="score-summary">
            <div className="score-large">{round.score}</div>
            <div className="score-details">
              <div className="par-info">Par {round.par}</div>
              <div className="over-par">+{round.overPar}</div>
            </div>
            <div className="nine-scores">
              <div className="nine-score">
                <div className="nine-label">Front 9</div>
                <div className="nine-value">{round.front9}</div>
              </div>
              <div className="nine-score">
                <div className="nine-label">Back 9</div>
                <div className="nine-value">{round.back9}</div>
              </div>
            </div>
          </div>

          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-label">Fairways</div>
              <div className="quick-stat-value">{round.fairways}</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-label">GIR</div>
              <div className="quick-stat-value">{round.gir}</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-label">Putts</div>
              <div className="quick-stat-value">{round.putts}</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-label">Penalties</div>
              <div className="quick-stat-value">{round.penalties}</div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary" onClick={handleViewScorecard}>
              View Scorecard
            </button>
            <button className="btn-secondary" onClick={handleViewStats}>
              View Detailed Stats
            </button>
          </div>

          <div className="round-notes">
            <h3>Round Notes</h3>
            <div className="notes-content">
              <p>Great round today! Struggled a bit on the front 9 but found my rhythm on the back. 
              Putting was solid, especially on holes 5-8. Need to work on approach shots from 150-175 yds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundDetail;

