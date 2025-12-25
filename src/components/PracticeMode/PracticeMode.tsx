/**
 * Practice Mode Component
 * Practice and training features
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PracticeMode.css';

interface PracticeType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const PracticeMode: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPractice, setSelectedPractice] = useState<string>('');

  const practiceTypes: PracticeType[] = [
    {
      id: 'putting',
      name: 'Putting Practice',
      icon: '⛳',
      description: 'Practice putting with Robo Puck guidance',
    },
    {
      id: 'driving',
      name: 'Driving Range',
      icon: '🚀',
      description: 'Track your drives and analyze distance',
    },
    {
      id: 'approach',
      name: 'Approach Shots',
      icon: '🎯',
      description: 'Practice approach shots from various distances',
    },
    {
      id: 'short-game',
      name: 'Short Game',
      icon: '🏌️',
      description: 'Chipping and pitching practice',
    },
  ];

  const handleSelectPractice = (id: string) => {
    setSelectedPractice(id);
    // Navigate to specific practice mode
    setTimeout(() => {
      navigate(`/practice/${id}`);
    }, 500);
  };

  return (
    <div className="practice-mode-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Practice Mode</h1>
            <p className="subtitle">Improve your game with targeted practice</p>
          </div>

          <div className="practice-types">
            {practiceTypes.map((practice) => (
              <div
                key={practice.id}
                className={`practice-card ${selectedPractice === practice.id ? 'selected' : ''}`}
                onClick={() => handleSelectPractice(practice.id)}
              >
                <div className="practice-icon">{practice.icon}</div>
                <div className="practice-info">
                  <div className="practice-name">{practice.name}</div>
                  <div className="practice-description">{practice.description}</div>
                </div>
                <div className="practice-arrow">→</div>
              </div>
            ))}
          </div>

          <div className="practice-stats">
            <h3>Practice Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Sessions This Week</div>
                <div className="stat-value">5</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Practice Time</div>
                <div className="stat-value">2h 30m</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Improvement</div>
                <div className="stat-value positive">+12%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeMode;

