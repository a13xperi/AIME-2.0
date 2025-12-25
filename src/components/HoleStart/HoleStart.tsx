/**
 * Hole Start Component
 * Initial hole setup screen
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './HoleStart.css';

const HoleStart: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const par = parseInt(searchParams.get('par') || '4');

  const handleStartHole = () => {
    navigate(`/shot-guidance?hole=${holeNumber}&par=${par}`);
  };

  return (
    <div className="hole-start-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="hole-info">
            <div className="hole-number">Hole {holeNumber}</div>
            <div className="hole-details">
              <div className="par-badge">Par {par}</div>
              <div className="distance">420 yds</div>
            </div>
          </div>

          <div className="course-map-preview">
            <div className="map-placeholder">
              <div className="tee-marker">🏌️</div>
              <div className="green-marker">⛳</div>
              <div className="fairway-line"></div>
            </div>
          </div>

          <div className="hole-tips">
            <h3>Hole Overview</h3>
            <ul>
              <li>Dogleg right at 250 yds</li>
              <li>Water hazard on the left</li>
              <li>Large green with subtle slope</li>
            </ul>
            <button 
              className="weather-btn"
              onClick={() => navigate(`/weather?course=${holeNumber}`)}
            >
              🌤️ View Weather & Conditions
            </button>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleStartHole}>
              Start Hole →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoleStart;

