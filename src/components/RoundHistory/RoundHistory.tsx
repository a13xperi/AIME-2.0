/**
 * Round History Component
 * View previous rounds and statistics
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoundHistory.css';

interface Round {
  id: string;
  course: string;
  date: string;
  score: number;
  par: number;
  overPar: number;
  location: string;
}

const RoundHistory: React.FC = () => {
  const navigate = useNavigate();

  const rounds: Round[] = [
    { id: '1', course: 'Pebble Beach', date: 'Dec 10, 2025', score: 86, par: 72, overPar: 14, location: 'Pebble Beach, CA' },
    { id: '2', course: 'Augusta National', date: 'Dec 5, 2025', score: 92, par: 72, overPar: 20, location: 'Augusta, GA' },
    { id: '3', course: 'Riverside Golf Club', date: 'Nov 28, 2025', score: 84, par: 72, overPar: 12, location: 'Riverside, CA' },
    { id: '4', course: 'St. Andrews', date: 'Nov 20, 2025', score: 89, par: 72, overPar: 17, location: 'St. Andrews, Scotland' },
  ];

  const handleViewRound = (roundId: string) => {
    navigate(`/round-detail/${roundId}`);
  };

  const handleStartNewRound = () => {
    navigate('/course-selection');
  };

  return (
    <div className="round-history-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>Round History</h1>
            <p className="subtitle">Your previous rounds</p>
          </div>

          <div className="stats-summary">
            <div className="stat-card">
              <div className="stat-label">Total Rounds</div>
              <div className="stat-value">{rounds.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Score</div>
              <div className="stat-value">
                {Math.round(rounds.reduce((sum, r) => sum + r.score, 0) / rounds.length)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Best Score</div>
              <div className="stat-value">
                {Math.min(...rounds.map(r => r.score))}
              </div>
            </div>
          </div>

          <div className="rounds-list">
            {rounds.map((round) => (
              <div
                key={round.id}
                className="round-card"
                onClick={() => handleViewRound(round.id)}
              >
                <div className="round-header">
                  <div className="round-course">{round.course}</div>
                  <div className="round-date">{round.date}</div>
                </div>
                <div className="round-score">
                  <div className="score-number">{round.score}</div>
                  <div className="score-details">
                    <span className="par-info">Par {round.par}</span>
                    <span className={`over-par ${round.overPar > 0 ? 'positive' : 'negative'}`}>
                      {round.overPar > 0 ? '+' : ''}{round.overPar}
                    </span>
                  </div>
                </div>
                <div className="round-location">{round.location}</div>
              </div>
            ))}
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleStartNewRound}>
              Start New Round →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundHistory;

