/**
 * Help/Tutorial Component
 * Help center and tutorials
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Help.css';

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: string;
}

const Help: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      content: 'Learn how to set up your first round, configure your club bag, and start tracking your game.',
    },
    {
      id: 'gps-tracking',
      title: 'GPS Tracking',
      icon: '📍',
      content: 'Understand how GPS positioning works, how to correct your position, and get accurate distances.',
    },
    {
      id: 'robo-puck',
      title: 'Robo Puck Setup',
      icon: '📡',
      content: 'Step-by-step guide to setting up and using your Robo Puck for precision putting.',
    },
    {
      id: 'shot-tracking',
      title: 'Shot Tracking',
      icon: '🎯',
      content: 'Learn how to track shots, select conditions, and get AI-powered club recommendations.',
    },
    {
      id: 'statistics',
      title: 'Understanding Statistics',
      icon: '📊',
      content: 'Learn what all the statistics mean and how to use them to improve your game.',
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      content: 'Common issues and solutions for GPS, Robo Puck, and app functionality.',
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="help-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Help & Tutorials</h1>
            <p className="subtitle">Get help and learn how to use AIME</p>
          </div>

          <div className="help-sections">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`help-card ${selectedSection === section.id ? 'expanded' : ''}`}
                onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
              >
                <div className="help-card-header">
                  <div className="help-icon">{section.icon}</div>
                  <div className="help-title">{section.title}</div>
                  <div className="help-arrow">
                    {selectedSection === section.id ? '▼' : '▶'}
                  </div>
                </div>
                {selectedSection === section.id && (
                  <div className="help-content">
                    <p>{section.content}</p>
                    <button className="help-action-btn">View Tutorial →</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="help-footer">
            <div className="contact-section">
              <h3>Need More Help?</h3>
              <button className="btn-secondary">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

