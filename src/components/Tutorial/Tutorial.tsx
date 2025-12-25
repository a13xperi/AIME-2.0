/**
 * Tutorial Component
 * Interactive tutorial for specific features
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Tutorial.css';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  highlight?: string;
}

const Tutorial: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tutorialType = searchParams.get('type') || 'gps';
  const [currentStep, setCurrentStep] = useState(0);

  const tutorials: { [key: string]: TutorialStep[] } = {
    gps: [
      {
        title: 'GPS Positioning',
        description: 'The app uses your phone\'s GPS to determine your exact location on the course.',
        highlight: 'Your position is shown on the map with a blue marker.',
      },
      {
        title: 'Confirm Your Position',
        description: 'If the GPS position looks incorrect, tap "I\'m somewhere else" to manually adjust.',
        highlight: 'You can drag the marker to your actual location.',
      },
      {
        title: 'Distance Calculation',
        description: 'Once your position is confirmed, the app calculates distances to targets automatically.',
        highlight: 'Distances update in real-time as you move.',
      },
    ],
    puck: [
      {
        title: 'Robo Puck Setup',
        description: 'Power on your Robo Puck and place it 2-3 inches behind your ball on the green.',
        highlight: 'The puck LED will indicate when it\'s connected and ready.',
      },
      {
        title: 'Position Reading',
        description: 'Wait for the puck to get a GPS lock. This usually takes 10-30 seconds.',
        highlight: 'Don\'t move the puck or stand over it during this time.',
      },
      {
        title: 'Putt Line',
        description: 'Once positioned, you\'ll see a precise putting line showing the break and speed.',
        highlight: 'Follow the line for the best chance to make your putt.',
      },
    ],
    shot: [
      {
        title: 'Shot Tracking',
        description: 'Track every shot by confirming your position and selecting the shot condition.',
        highlight: 'This helps the AI provide better club recommendations.',
      },
      {
        title: 'Club Selection',
        description: 'The app recommends clubs based on distance, conditions, and your historical performance.',
        highlight: 'Tap "View All Recommendations" to see alternative options.',
      },
      {
        title: 'Shot Instructions',
        description: 'Get AI-powered guidance on aim, power, and strategy for each shot.',
        highlight: 'Follow the instructions to improve your accuracy and consistency.',
      },
    ],
  };

  const steps = tutorials[tutorialType] || tutorials.gps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="tutorial-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="tutorial-content">
            <div className="step-indicator">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`indicator-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>

            <div className="step-content">
              <h1 className="step-title">{steps[currentStep].title}</h1>
              <p className="step-description">{steps[currentStep].description}</p>
              {steps[currentStep].highlight && (
                <div className="step-highlight">
                  <div className="highlight-icon">💡</div>
                  <div className="highlight-text">{steps[currentStep].highlight}</div>
                </div>
              )}
            </div>

            <div className="tutorial-actions">
              <div className="action-buttons">
                {currentStep > 0 && (
                  <button className="btn-secondary" onClick={handlePrevious}>
                    ← Previous
                  </button>
                )}
                <button className="btn-primary" onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Got it!' : 'Next →'}
                </button>
              </div>
              {currentStep < steps.length - 1 && (
                <button className="link-btn" onClick={handleSkip}>
                  Skip Tutorial
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;

