/**
 * Sharing Component
 * Share round results and achievements
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Sharing.css';

const Sharing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get('round') || 'current';
  const [shareMethod, setShareMethod] = useState<string>('');

  const roundData = {
    course: 'Pebble Beach',
    date: 'Dec 10, 2025',
    score: 86,
    par: 72,
    overPar: 14,
  };

  const shareOptions = [
    { id: 'image', name: 'Share as Image', icon: '🖼️', description: 'Create a shareable image' },
    { id: 'link', name: 'Share Link', icon: '🔗', description: 'Copy shareable link' },
    { id: 'social', name: 'Social Media', icon: '📱', description: 'Share to social platforms' },
    { id: 'text', name: 'Text Message', icon: '💬', description: 'Send via text' },
  ];

  const handleShare = (method: string) => {
    setShareMethod(method);
    // Future: Implement actual sharing functionality
    setTimeout(() => {
      alert(`Sharing via ${method}...`);
    }, 500);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="sharing-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Share Round</h1>
            <div className="round-preview">
              <div className="preview-course">{roundData.course}</div>
              <div className="preview-score">
                {roundData.score} ({roundData.overPar > 0 ? '+' : ''}{roundData.overPar})
              </div>
              <div className="preview-date">{roundData.date}</div>
            </div>
          </div>

          <div className="share-options">
            {shareOptions.map((option) => (
              <div
                key={option.id}
                className={`share-option-card ${shareMethod === option.id ? 'selected' : ''}`}
                onClick={() => handleShare(option.id)}
              >
                <div className="share-icon">{option.icon}</div>
                <div className="share-info">
                  <div className="share-name">{option.name}</div>
                  <div className="share-description">{option.description}</div>
                </div>
                <div className="share-arrow">→</div>
              </div>
            ))}
          </div>

          <div className="share-preview">
            <h3>Preview</h3>
            <div className="preview-card">
              <div className="preview-header">
                <div className="preview-logo">A⛳IME</div>
                <div className="preview-badge">Round Complete</div>
              </div>
              <div className="preview-content">
                <div className="preview-score-large">{roundData.score}</div>
                <div className="preview-details">
                  <div>{roundData.course}</div>
                  <div>Par {roundData.par} • {roundData.overPar > 0 ? '+' : ''}{roundData.overPar}</div>
                  <div>{roundData.date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sharing;

