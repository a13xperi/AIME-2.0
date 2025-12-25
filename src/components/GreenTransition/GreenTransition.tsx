/**
 * Green Transition Component
 * Precision putting setup with Robo puck deployment
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './GreenTransition.css';

const GreenTransition: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');

  const handleContinue = () => {
    navigate(`/putting?hole=${holeNumber}`);
  };

  const handleSkip = () => {
    navigate(`/putting?hole=${holeNumber}&skip=true`);
  };

  return (
    <div className="green-transition-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>You're on the green!</h1>
            <p className="subtitle">Get ready for cm-accurate putt lines</p>
          </div>

          <div className="puck-visualization">
            <div className="puck-3d">
              <div className="puck-top"></div>
              <div className="puck-body"></div>
              <div className="puck-led"></div>
            </div>
          </div>

          <div className="puck-instructions">
            <h3>Deploy Robo Puck</h3>
            <ol className="instruction-steps">
              <li>Get puck from bag/pocket</li>
              <li>Power on (LED indicates status)</li>
              <li>Place behind ball 2-3 inches</li>
            </ol>
          </div>

          <div className="puck-status">
            <div className="status-item">
              <span className="status-label">Last connected:</span>
              <span className="status-value">RoboPuck 007</span>
            </div>
            <div className="status-item">
              <span className="status-label">Battery:</span>
              <span className="status-value">89%</span>
            </div>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleContinue}>
              I have my puck →
            </button>
            <div className="footer-options">
              <button className="link-btn" onClick={handleSkip}>
                Skip RTK mode
              </button>
              <button className="link-btn">
                Learn more tutorial
              </button>
              <button className="link-btn">
                Buy a puck
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenTransition;

