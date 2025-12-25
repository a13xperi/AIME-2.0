/**
 * Putting Guidance Component
 * Detailed puck setup and putting guidance
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PuttingGuidance.css';

const PuttingGuidance: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const skipRTK = searchParams.get('skip') === 'true';
  const [puckPlaced, setPuckPlaced] = useState(skipRTK);
  const [puttNumber] = useState(1);
  const [distance] = useState(18);

  const handlePuckPlaced = () => {
    setPuckPlaced(true);
    // After puck placement, show putting line
    setTimeout(() => {
      navigate(`/hole-complete?hole=${holeNumber}`);
    }, 2000);
  };

  const handleSkipInstructions = () => {
    setPuckPlaced(true);
  };

  return (
    <div className="putting-guidance-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <div className="header-top">
              <div className="putt-title">Putt {puttNumber} • Hole {holeNumber}</div>
              <div className="putt-distance">{distance} ft</div>
            </div>
          </div>

          {!puckPlaced ? (
            <>
              <div className="puck-instruction">
                <h2>Place puck directly behind your ball</h2>
                <div className="placement-diagram">
                  <div className="ball-visual">⚪</div>
                  <div className="puck-visual">📡</div>
                  <div className="placement-arrow">↓</div>
                  <div className="placement-text">2-3 inches</div>
                </div>
              </div>

              <div className="puck-status-card">
                <div className="status-row">
                  <span className="status-icon">✓</span>
                  <span className="status-text">Puck connected</span>
                </div>
                <div className="status-row">
                  <span className="status-label">Battery:</span>
                  <span className="status-value">85%</span>
                </div>
                <div className="status-row waiting">
                  <span className="status-icon">📡</span>
                  <span className="status-text">Waiting for position...</span>
                </div>
              </div>

              <div className="quick-tips">
                <h3>Quick Tips</h3>
                <ul>
                  <li>Keep puck flat on green</li>
                  <li>Avoid standing over puck</li>
                  <li>Don't move until reading complete</li>
                </ul>
              </div>

              <div className="screen-footer">
                <button className="btn-primary" onClick={handlePuckPlaced}>
                  Puck Placed →
                </button>
                <button className="link-btn" onClick={handleSkipInstructions}>
                  Returning user? Skip instructions for quick place
                </button>
              </div>
            </>
          ) : (
            <div className="putting-line-view">
              <div className="green-view">
                <div className="ball-position">⚪</div>
                <div className="putt-line"></div>
                <div className="cup-position">⛳</div>
              </div>
              <div className="putting-instruction">
                <h3>Putt Line</h3>
                <div className="instruction-detail">
                  Aim 2° left. Hit with 3.5 mph speed. Break: 6 inches right to left.
                </div>
              </div>
              <div className="screen-footer">
                <button className="btn-primary" onClick={() => navigate(`/hole-complete?hole=${holeNumber}`)}>
                  Putt Complete →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuttingGuidance;

