/**
 * Club Recommendations Component
 * AI-powered club recommendations based on distance and conditions
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ClubRecommendations.css';

interface Recommendation {
  club: string;
  distance: number;
  confidence: number;
  reason: string;
  alternatives: string[];
}

const ClubRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const distance = parseInt(searchParams.get('distance') || '150');
  const condition = searchParams.get('condition') || 'fairway';
  const wind = searchParams.get('wind') || 'none';

  const [recommendations] = useState<Recommendation[]>([
    {
      club: '7 Iron',
      distance: 150,
      confidence: 92,
      reason: 'Perfect distance match. 7 Iron typically carries 150 yds in these conditions.',
      alternatives: ['6 Iron (165 yds)', '8 Iron (135 yds)'],
    },
    {
      club: '6 Iron',
      distance: 165,
      confidence: 75,
      reason: 'Slightly long, but good for uphill or into wind.',
      alternatives: ['7 Iron (150 yds)', '5 Iron (180 yds)'],
    },
    {
      club: '8 Iron',
      distance: 135,
      confidence: 68,
      reason: 'Shorter option if you want to play safe or have wind assistance.',
      alternatives: ['7 Iron (150 yds)', '9 Iron (120 yds)'],
    },
  ]);

  const handleSelectClub = (club: string) => {
    // Navigate back to shot guidance with selected club
    navigate(`/shot-guidance?club=${club}&distance=${distance}`);
  };

  const handleAdjustDistance = () => {
    // Future: Open distance adjustment modal
  };

  return (
    <div className="club-recommendations-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Club Recommendations</h1>
            <div className="shot-context">
              <div className="context-item">
                <span className="context-label">Distance:</span>
                <span className="context-value">{distance} yds</span>
                <button className="adjust-btn" onClick={handleAdjustDistance}>Adjust</button>
              </div>
              <div className="context-item">
                <span className="context-label">Condition:</span>
                <span className="context-value">{condition}</span>
              </div>
              {wind !== 'none' && (
                <div className="context-item">
                  <span className="context-label">Wind:</span>
                  <span className="context-value">{wind}</span>
                </div>
              )}
            </div>
          </div>

          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`recommendation-card ${index === 0 ? 'primary' : ''}`}
                onClick={() => handleSelectClub(rec.club)}
              >
                <div className="recommendation-header">
                  <div className="club-name-large">{rec.club}</div>
                  <div className="confidence-badge">
                    {rec.confidence}% match
                  </div>
                </div>
                <div className="recommendation-distance">
                  ~{rec.distance} yds carry
                </div>
                <div className="recommendation-reason">
                  {rec.reason}
                </div>
                {rec.alternatives.length > 0 && (
                  <div className="alternatives">
                    <div className="alternatives-label">Alternatives:</div>
                    <div className="alternatives-list">
                      {rec.alternatives.map((alt, altIndex) => (
                        <span key={altIndex} className="alternative-tag">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {index === 0 && (
                  <div className="recommendation-badge">Recommended</div>
                )}
              </div>
            ))}
          </div>

          <div className="factors-section">
            <h3>Factors Considered</h3>
            <div className="factors-list">
              <div className="factor-item">
                <span className="factor-icon">📏</span>
                <span className="factor-text">Distance to target</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">🌬️</span>
                <span className="factor-text">Wind conditions</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">⛰️</span>
                <span className="factor-text">Elevation change</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">🌡️</span>
                <span className="factor-text">Temperature & altitude</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">📊</span>
                <span className="factor-text">Your historical performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubRecommendations;

