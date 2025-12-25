/**
 * Shot Guidance Component
 * Main shot tracking interface with GPS positioning
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ShotGuidance.css';

const ShotGuidance: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const [step, setStep] = useState(1);
  const [condition, setCondition] = useState<string>('');
  const [distance, setDistance] = useState(162);

  const handleConfirmPosition = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else {
      // Check if on green
      if (distance < 50) {
        navigate(`/green-transition?hole=${holeNumber}`);
      } else {
        // Continue with next shot
        navigate(`/shot-guidance?hole=${holeNumber}&step=1`);
      }
    }
  };

  const handlePositionCorrection = () => {
    // Allow manual position adjustment
    setStep(1);
  };

  return (
    <div className="shot-guidance-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <div className="header-top">
              <div className="hole-title">Hole {holeNumber}</div>
              <div className="distance-display">{distance} yds to center</div>
            </div>
            <div className="step-indicator">Step {step} of 4</div>
          </div>

          <div className="course-map">
            <div className="map-container">
              <div className="map-marker player">📍</div>
              <div className="map-marker target">🎯</div>
              <div className="distance-line"></div>
            </div>
            <div className="map-actions">
              <button className="map-btn" onClick={handlePositionCorrection}>
                I'm somewhere else
              </button>
              <button className="map-btn secondary" onClick={() => setDistance(162)}>
                Use GPS
              </button>
            </div>
          </div>

          {step >= 2 && (
            <div className="shot-condition">
              <h3>Shot Condition</h3>
              <div className="condition-buttons">
                {['Tee', 'Fairway', 'Rough', 'Bunker', 'Penalty'].map((cond) => (
                  <button
                    key={cond}
                    className={`condition-btn ${condition === cond ? 'active' : ''}`}
                    onClick={() => setCondition(cond)}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step >= 3 && (
            <div className="club-recommendation">
              <h3>Recommended Club</h3>
              <div className="club-card">
                <div className="club-name-large">7 Iron</div>
                <div className="club-distance">~{distance} yds</div>
                <div className="club-reason">Best for this distance and condition</div>
                <button 
                  className="view-recommendations-btn"
                  onClick={() => navigate(`/club-recommendations?distance=${distance}&condition=${condition}`)}
                >
                  View All Recommendations →
                </button>
              </div>
            </div>
          )}

          {step >= 4 && (
            <div className="shot-instruction">
              <h3>Shot Instruction</h3>
              <div className="instruction-text">
                Aim 5° left of target. Hit with moderate power. Account for slight wind from the right.
              </div>
            </div>
          )}

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleConfirmPosition}>
              {step === 4 ? 'Shot Complete →' : 'Confirm Position →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotGuidance;

