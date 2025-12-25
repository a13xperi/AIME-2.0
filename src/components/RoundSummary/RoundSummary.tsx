/**
 * Round Summary Component
 * Cumulative round statistics after each hole
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './RoundSummary.css';

const RoundSummary: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const courseId = searchParams.get('course') || '1';

  // Mock round data - in real app, this would come from state/context
  const roundData = {
    currentHole: holeNumber,
    totalHoles: 18,
    totalScore: 45,
    par: 36,
    overPar: 9,
    front9: holeNumber <= 9 ? 45 : 40,
    back9: holeNumber > 9 ? 5 : 0,
    fairways: '6/9',
    gir: '4/9',
    putts: 18,
    penalties: 1,
    birdies: 1,
    pars: 3,
    bogeys: 4,
    doubleBogeys: 1,
    bestHole: { number: 3, score: 3, result: 'Birdie' },
    worstHole: { number: 7, score: 7, result: 'Double Bogey' },
  };

  const isFront9 = holeNumber <= 9;
  const progress = (holeNumber / roundData.totalHoles) * 100;
  const front9Par = 36;
  const back9Par = 36;

  const handleContinue = () => {
    if (holeNumber < roundData.totalHoles) {
      navigate(`/next-hole?hole=${holeNumber}`);
    } else {
      navigate('/round-complete');
    }
  };

  const handleViewScorecard = () => {
    navigate(`/scorecard?round=current`);
  };

  const getScoreColor = (overPar: number) => {
    if (overPar <= 0) return '#4ade80';
    if (overPar <= 5) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="round-summary-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>Round Summary</h1>
            <div className="round-progress">
              <div className="progress-info">
                <span>Hole {roundData.currentHole} of {roundData.totalHoles}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="score-summary-card">
            <div className="score-main">
              <div className="score-large">{roundData.totalScore}</div>
              <div className="score-details">
                <div className="par-info">Par {roundData.par}</div>
                <div 
                  className="over-par" 
                  style={{ color: getScoreColor(roundData.overPar) }}
                >
                  {roundData.overPar > 0 ? '+' : ''}{roundData.overPar}
                </div>
              </div>
            </div>
            {isFront9 && (
              <div className="nine-summary">
                <div className="nine-label">Front 9</div>
                <div className="nine-score">
                  {roundData.front9} ({roundData.front9 - front9Par > 0 ? '+' : ''}{roundData.front9 - front9Par})
                </div>
              </div>
            )}
            {!isFront9 && roundData.back9 > 0 && (
              <div className="nine-summary">
                <div className="nine-label">Back 9</div>
                <div className="nine-score">
                  {roundData.back9} ({roundData.back9 - back9Par > 0 ? '+' : ''}{roundData.back9 - back9Par})
                </div>
              </div>
            )}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-label">Fairways</div>
                <div className="stat-value">{roundData.fairways}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⛳</div>
              <div className="stat-info">
                <div className="stat-label">GIR</div>
                <div className="stat-value">{roundData.gir}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏌️</div>
              <div className="stat-info">
                <div className="stat-label">Putts</div>
                <div className="stat-value">{roundData.putts}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <div className="stat-label">Penalties</div>
                <div className="stat-value">{roundData.penalties}</div>
              </div>
            </div>
          </div>

          <div className="score-breakdown">
            <h3>Score Breakdown</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <div className="breakdown-icon">🐦</div>
                <div className="breakdown-count">{roundData.birdies}</div>
                <div className="breakdown-label">Birdies</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-icon">⛳</div>
                <div className="breakdown-count">{roundData.pars}</div>
                <div className="breakdown-label">Pars</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-icon">📈</div>
                <div className="breakdown-count">{roundData.bogeys}</div>
                <div className="breakdown-label">Bogeys</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-icon">📊</div>
                <div className="breakdown-count">{roundData.doubleBogeys}</div>
                <div className="breakdown-label">Double+</div>
              </div>
            </div>
          </div>

          <div className="highlights-section">
            <h3>Highlights</h3>
            <div className="highlight-item positive">
              <div className="highlight-icon">⭐</div>
              <div className="highlight-info">
                <div className="highlight-label">Best Hole</div>
                <div className="highlight-value">
                  Hole {roundData.bestHole.number}: {roundData.bestHole.score} ({roundData.bestHole.result})
                </div>
              </div>
            </div>
            <div className="highlight-item negative">
              <div className="highlight-icon">📉</div>
              <div className="highlight-info">
                <div className="highlight-label">Toughest Hole</div>
                <div className="highlight-value">
                  Hole {roundData.worstHole.number}: {roundData.worstHole.score} ({roundData.worstHole.result})
                </div>
              </div>
            </div>
          </div>

          <div className="projection-section">
            <h3>Projected Finish</h3>
            <div className="projection-card">
              <div className="projection-label">Based on current pace</div>
              <div className="projection-score">
                {Math.round((roundData.totalScore / holeNumber) * 18)}
              </div>
              <div className="projection-par">
                ({Math.round((roundData.totalScore / holeNumber) * 18) - 72 > 0 ? '+' : ''}
                {Math.round((roundData.totalScore / holeNumber) * 18) - 72} vs Par 72)
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-secondary" onClick={handleViewScorecard}>
              View Scorecard
            </button>
            <button className="btn-primary" onClick={handleContinue}>
              {holeNumber < roundData.totalHoles ? 'Continue Round →' : 'Finish Round →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundSummary;

