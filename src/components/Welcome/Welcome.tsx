/**
 * Welcome/Onboarding Component
 * First-time user onboarding flow
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to AIME',
      subtitle: 'Your AI-Powered Golf Assistant',
      description: 'Get real-time shot guidance, precision putting lines, and complete round tracking.',
      icon: '⛳',
    },
    {
      title: 'GPS Tracking',
      subtitle: 'Know Your Position',
      description: 'Get accurate distances and positioning with integrated GPS technology.',
      icon: '📍',
    },
    {
      title: 'Precision Putting',
      subtitle: 'CM-Accurate Putt Lines',
      description: 'Use the Robo Puck for centimeter-accurate putting guidance on every green.',
      icon: '📡',
    },
    {
      title: 'Round Tracking',
      subtitle: 'Complete Statistics',
      description: 'Track every shot, analyze your performance, and improve your game.',
      icon: '📊',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    navigate('/course-selection');
  };

  return (
    <div className="welcome-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="welcome-content">
            <div className="step-indicator">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`indicator-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>

            <div className="step-content">
              <div className="step-icon">{steps[currentStep].icon}</div>
              <h1 className="step-title">{steps[currentStep].title}</h1>
              <h2 className="step-subtitle">{steps[currentStep].subtitle}</h2>
              <p className="step-description">{steps[currentStep].description}</p>
            </div>

            <div className="welcome-actions">
              <button className="btn-primary" onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Get Started →' : 'Next →'}
              </button>
              {currentStep < steps.length - 1 && (
                <button className="link-btn" onClick={handleSkip}>
                  Skip
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

