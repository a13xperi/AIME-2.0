/**
 * Shot Complete Component
 * Confirmation and result screen after completing a shot
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ShotComplete.css';

const ShotComplete: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const shotNumber = parseInt(searchParams.get('shot') || '1');
  const club = searchParams.get('club') || '7 Iron';
  const distance = parseInt(searchParams.get('distance') || '162');
  const condition = searchParams.get('condition') || 'Fairway';

  const [shotResult, setShotResult] = useState<'tracking' | 'result'>('tracking');
  const [trackingProgress, setTrackingProgress] = useState(0);

  useEffect(() => {
    // Simulate shot tracking
    const interval = setInterval(() => {
      setTrackingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShotResult('result'), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const shotData = {
    club,
    distance,
    condition,
    result: 'Fairway',
    newDistance: 45,
    carry: 155,
    total: 162,
  };

  const handleContinue = () => {
    if (shotData.newDistance < 50) {
      navigate(`/green-transition?hole=${holeNumber}`);
    } else {
      navigate(`/shot-guidance?hole=${holeNumber}&shot=${shotNumber + 1}`);
    }
  };

  const handleViewAnalysis = () => {
    navigate(`/shot-analysis?hole=${holeNumber}&shot=${shotNumber}`);
  };

  if (shotResult === 'tracking') {
    return (
      <div className="shot-complete-screen">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          
          <div className="screen-content">
            <div className="tracking-view">
              <div className="tracking-icon">📡</div>
              <h2>Tracking Shot...</h2>
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${trackingProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{trackingProgress}%</div>
              </div>
              <p className="tracking-message">Analyzing ball flight and landing position</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shot-complete-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <div className="header-info">
              <div className="hole-info">Hole {holeNumber}</div>
              <div className="shot-info">Shot {shotNumber}</div>
            </div>
          </div>

          <div className="shot-result-card">
            <div className="result-icon">✅</div>
            <h1 className="result-title">Shot Recorded</h1>
            <div className="result-badge">{shotData.result}</div>
          </div>

          <div className="shot-details">
            <div className="detail-row">
              <div className="detail-label">Club Used</div>
              <div className="detail-value">{shotData.club}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Distance</div>
              <div className="detail-value">{shotData.distance} yds</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Condition</div>
              <div className="detail-value">{shotData.condition}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Result</div>
              <div className="detail-value highlight">{shotData.result}</div>
            </div>
          </div>

          <div className="shot-metrics">
            <h3>Shot Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-label">Carry</div>
                <div className="metric-value">{shotData.carry} yds</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Total</div>
                <div className="metric-value">{shotData.total} yds</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Remaining</div>
                <div className="metric-value">{shotData.newDistance} yds</div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-secondary" onClick={handleViewAnalysis}>
              View Analysis
            </button>
            <button className="btn-primary" onClick={handleContinue}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotComplete;

