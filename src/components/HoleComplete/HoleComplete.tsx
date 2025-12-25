/**
 * Hole Complete Component
 * Performance summary after completing a hole
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRound } from '../../context/RoundContext';
import './HoleComplete.css';

const HoleComplete: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentRound, completeHole, currentHole } = useRound();
  
  const holeNumber = parseInt(searchParams.get('hole') || currentHole.toString() || '1');
  const hole = currentRound?.holes.find((h) => h.number === holeNumber);
  const isLastHole = holeNumber >= 18;

  // Get actual hole data from context
  const score = hole?.score || 5; // Default to 5 if not set
  const par = hole?.par || 4;
  const stats = hole?.stats || {
    fairwayHit: true,
    greenInRegulation: true,
    putts: 2,
    penalties: 0,
  };

  const handleContinue = () => {
    // Complete the hole if not already completed
    if (hole && !hole.score) {
      completeHole(holeNumber, score, stats);
    }
    
    if (isLastHole) {
      navigate('/round-complete');
    } else {
      navigate(`/round-summary?hole=${holeNumber}`);
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
              <div className="score-large">{score}</div>
              <div className="score-label">
                ({score === par - 1 ? 'Birdie' : score === par ? 'Par' : score === par + 1 ? 'Bogey' : score === par + 2 ? 'Double Bogey' : `+${score - par}`})
              </div>
            </div>
          </div>

          <div className="par-info">
            <div className="par-badge-large">Par {par}</div>
            <div className="shot-breakdown">
              {hole?.shots.length || 0} shots + {stats.putts} putts
            </div>
          </div>

          <div className="performance-metrics">
            <div className="metric-card">
              <div className="metric-label">Fairway</div>
              <div className={`metric-value ${stats.fairwayHit ? 'positive' : ''}`}>
                {stats.fairwayHit ? 'Hit' : 'Missed'}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Putts</div>
              <div className="metric-value">
                {stats.putts} <span className="metric-trend">(Avg: 1.8) ↓</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">GIR</div>
              <div className={`metric-value ${stats.greenInRegulation ? 'positive' : ''}`}>
                {stats.greenInRegulation ? 'Yes ✓' : 'No'}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Penalties</div>
              <div className="metric-value">{stats.penalties}</div>
            </div>
          </div>

          <div className="highlight-card">
            <div className="highlight-label">Longest drive</div>
            <div className="highlight-value">267 yds!</div>
          </div>

          <div className="view-shots">
            <button className="link-btn" onClick={() => navigate(`/shot-history?hole=${holeNumber}`)}>
              View {hole?.shots.length || 0} shots
            </button>
          </div>

          <div className="average-comparison">
            <div className="avg-label">Your avg on this hole:</div>
            <div className="avg-value">5.2</div>
            <div className="avg-trend">↓ Better than average!</div>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={() => navigate(`/round-summary?hole=${holeNumber}`)}>
              View Round Summary →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoleComplete;

