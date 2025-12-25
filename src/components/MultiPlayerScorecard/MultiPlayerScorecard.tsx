/**
 * Multi-Player Scorecard Component
 * Scorecard for multiple players in a round
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './MultiPlayerScorecard.css';

interface Player {
  id: string;
  name: string;
  scores: number[];
  total: number;
  overPar: number;
}

const MultiPlayerScorecard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get('round') || 'current';

  const players: Player[] = [
    { id: '1', name: 'You', scores: [5, 3, 5, 4, 3, 4, 6, 4, 5], total: 39, overPar: 3 },
    { id: '2', name: 'Alex', scores: [4, 3, 5, 4, 4, 4, 5, 4, 5], total: 38, overPar: 2 },
    { id: '3', name: 'Jordan', scores: [5, 4, 6, 5, 4, 5, 6, 5, 6], total: 46, overPar: 10 },
    { id: '4', name: 'Sam', scores: [4, 3, 4, 4, 3, 4, 5, 4, 4], total: 35, overPar: -1 },
  ];

  const pars = [4, 3, 5, 4, 4, 3, 5, 4, 4];
  const front9Par = pars.reduce((sum, par) => sum + par, 0);

  const getScoreClass = (score: number, par: number) => {
    const diff = score - par;
    if (diff === -2) return 'eagle';
    if (diff === -1) return 'birdie';
    if (diff === 0) return 'par';
    if (diff === 1) return 'bogey';
    return 'double';
  };

  const getLeader = () => {
    return players.reduce((leader, player) => 
      player.overPar < leader.overPar ? player : leader
    );
  };

  const leader = getLeader();

  return (
    <div className="multiplayer-scorecard-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Multi-Player Scorecard</h1>
            <div className="round-info">
              <span>Hole 9</span>
              <span>•</span>
              <span>Par {front9Par}</span>
            </div>
          </div>

          <div className="leader-badge">
            <div className="leader-icon">🏆</div>
            <div className="leader-text">
              <div className="leader-label">Current Leader</div>
              <div className="leader-name">{leader.name}</div>
              <div className="leader-score">{leader.overPar > 0 ? '+' : ''}{leader.overPar}</div>
            </div>
          </div>

          <div className="scorecard-table">
            <div className="table-header">
              <div className="col-player">Player</div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((hole) => (
                <div key={hole} className="col-hole-small">{hole}</div>
              ))}
              <div className="col-total">Total</div>
            </div>

            {players.map((player) => (
              <div key={player.id} className={`table-row ${player.id === '1' ? 'current-player' : ''}`}>
                <div className="col-player">
                  <div className="player-name">{player.name}</div>
                  {player.id === '1' && <div className="you-badge">You</div>}
                </div>
                {player.scores.map((score, index) => (
                  <div
                    key={index}
                    className={`col-hole-small score-cell ${getScoreClass(score, pars[index])}`}
                  >
                    {score}
                  </div>
                ))}
                <div className="col-total">
                  <div className="total-score">{player.total}</div>
                  <div className="over-par-small">
                    {player.overPar > 0 ? '+' : ''}{player.overPar}
                  </div>
                </div>
              </div>
            ))}

            <div className="table-row par-row">
              <div className="col-player">Par</div>
              {pars.map((par, index) => (
                <div key={index} className="col-hole-small">{par}</div>
              ))}
              <div className="col-total">{front9Par}</div>
            </div>
          </div>

          <div className="player-stats">
            <h3>Player Stats</h3>
            <div className="stats-grid">
              {players.map((player) => (
                <div key={player.id} className="player-stat-card">
                  <div className="stat-player-name">{player.name}</div>
                  <div className="stat-details">
                    <div className="stat-item">
                      <span className="stat-label">Score</span>
                      <span className="stat-value">{player.total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">vs Par</span>
                      <span className={`stat-value ${player.overPar <= 0 ? 'positive' : ''}`}>
                        {player.overPar > 0 ? '+' : ''}{player.overPar}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiPlayerScorecard;

