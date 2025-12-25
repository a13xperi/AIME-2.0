/**
 * Shot History Component
 * Review all shots from a hole
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ShotHistory.css';

interface Shot {
  id: number;
  number: number;
  club: string;
  distance: number;
  condition: string;
  result: string;
}

const ShotHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');

  const shots: Shot[] = [
    { id: 1, number: 1, club: 'Driver', distance: 267, condition: 'Tee', result: 'Fairway' },
    { id: 2, number: 2, club: '7 Iron', distance: 162, condition: 'Fairway', result: 'Green' },
    { id: 3, number: 3, club: 'Putter', distance: 18, condition: 'Green', result: 'Made' },
    { id: 4, number: 4, club: 'Putter', distance: 3, condition: 'Green', result: 'Made' },
  ];

  const handleBack = () => {
    navigate(`/hole-complete?hole=${holeNumber}`);
  };

  return (
    <div className="shot-history-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Hole {holeNumber} Shots</h1>
            <div className="hole-summary">
              <span className="score">Score: 5</span>
              <span className="par">Par 4</span>
            </div>
          </div>

          <div className="shots-list">
            {shots.map((shot) => (
              <div key={shot.id} className="shot-card">
                <div className="shot-number">Shot {shot.number}</div>
                <div className="shot-details">
                  <div className="shot-info-row">
                    <span className="info-label">Club:</span>
                    <span className="info-value">{shot.club}</span>
                  </div>
                  <div className="shot-info-row">
                    <span className="info-label">Distance:</span>
                    <span className="info-value">{shot.distance} yds</span>
                  </div>
                  <div className="shot-info-row">
                    <span className="info-label">Condition:</span>
                    <span className="info-value">{shot.condition}</span>
                  </div>
                  <div className="shot-info-row">
                    <span className="info-label">Result:</span>
                    <span className={`info-value result ${shot.result.toLowerCase()}`}>
                      {shot.result}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="shot-stats">
            <div className="stat-item">
              <div className="stat-label">Total Shots</div>
              <div className="stat-value">{shots.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Avg Distance</div>
              <div className="stat-value">
                {Math.round(shots.reduce((sum, s) => sum + s.distance, 0) / shots.length)} yds
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Fairways Hit</div>
              <div className="stat-value">1/1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotHistory;

