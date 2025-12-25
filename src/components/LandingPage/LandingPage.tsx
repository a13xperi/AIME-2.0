/**
 * AIME Landing Page Component
 * Landing page that emulates the phone app for web testing
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  
  // Screen previews to cycle through
  const screens = [
    { name: 'Splash', component: 'splash' },
    { name: 'Shot Guidance', component: 'shot-guidance' },
    { name: 'Putting', component: 'putting' },
    { name: 'Hole Stats', component: 'hole-stats' },
  ];

  // Auto-cycle through screens every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [screens.length]);

  const handleStartApp = () => {
    navigate('/splash');
  };

  const handleTryDemo = () => {
    navigate('/golf');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="logo-inline">
                <span className="logo-a-inline">
                  <span className="logo-a-left">A</span>
                  <span className="logo-golf-icon-inline">⛳</span>
                </span>
                <span className="logo-rest-inline">IME</span>
              </span>
            </h1>
            <h2 className="hero-subtitle">AI-Powered Golf Assistant</h2>
            <p className="hero-description">
              Get real-time shot guidance, precision putting lines, and complete round tracking. 
              Powered by AI and RTK GPS technology.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={handleStartApp}>
                Launch App
              </button>
              <button className="btn-secondary" onClick={handleTryDemo}>
                Try Demo
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="phone-mockup-container">
            <div className="phone-mockup">
              <div className="phone-frame">
                {/* Notch/Dynamic Island */}
                <div className="phone-notch"></div>
                
                {/* Screen Content */}
                <div className="phone-screen">
                  {currentScreen === 0 && <SplashPreview />}
                  {currentScreen === 1 && <ShotGuidancePreview />}
                  {currentScreen === 2 && <PuttingPreview />}
                  {currentScreen === 3 && <HoleStatsPreview />}
                </div>

                {/* Screen Indicator Dots */}
                <div className="screen-indicators">
                  {screens.map((_, index) => (
                    <div
                      key={index}
                      className={`indicator ${index === currentScreen ? 'active' : ''}`}
                      onClick={() => setCurrentScreen(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Shot Guidance</h3>
            <p>AI-powered recommendations for every shot with GPS positioning</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⛳</div>
            <h3>Precision Putting</h3>
            <p>CM-accurate putt lines with RTK GPS Robo puck integration</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Round Tracking</h3>
            <p>Complete statistics and performance analytics for every round</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏌️</div>
            <h3>Club Management</h3>
            <p>Track your bag and get personalized club recommendations</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Improve Your Game?</h2>
        <p>Start tracking your rounds and get AI-powered guidance today</p>
        <button className="btn-primary btn-large" onClick={handleStartApp}>
          Get Started
        </button>
      </section>
    </div>
  );
};

// Preview Components for Phone Mockup
const SplashPreview: React.FC = () => (
  <div className="screen-preview splash-preview">
    <div className="preview-logo-container">
      <div className="preview-logo">
        <span className="preview-logo-a">A</span>
        <span className="preview-logo-golf">⛳</span>
        <span className="preview-logo-rest">IME</span>
      </div>
    </div>
  </div>
);

const ShotGuidancePreview: React.FC = () => (
  <div className="screen-preview shot-guidance-preview">
    <div className="preview-header">
      <div className="preview-title">Hole 7</div>
      <div className="preview-distance">162 yds to center</div>
    </div>
    <div className="preview-map">
      <div className="map-placeholder">
        <div className="map-marker">📍</div>
        <div className="map-target">🎯</div>
      </div>
    </div>
    <div className="preview-actions">
      <div className="preview-button">Confirm Position</div>
    </div>
  </div>
);

const PuttingPreview: React.FC = () => (
  <div className="screen-preview putting-preview">
    <div className="preview-header">
      <div className="preview-title">Putt 1 • Hole 7</div>
      <div className="preview-distance">18 ft</div>
    </div>
    <div className="preview-green">
      <div className="green-visualization">
        <div className="ball-marker">⚪</div>
        <div className="cup-marker">⛳</div>
        <div className="putt-line"></div>
      </div>
    </div>
    <div className="preview-puck-status">
      <div className="status-item">✓ Puck connected</div>
      <div className="status-item">Battery: 85%</div>
    </div>
  </div>
);

const HoleStatsPreview: React.FC = () => (
  <div className="screen-preview hole-stats-preview">
    <div className="preview-header">
      <div className="preview-title">Hole 7 Complete</div>
      <div className="preview-score">5 (Bogey)</div>
    </div>
    <div className="preview-stats">
      <div className="stat-card">
        <div className="stat-label">Fairway</div>
        <div className="stat-value">Hit</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Putts</div>
        <div className="stat-value">2</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">GIR</div>
        <div className="stat-value">Yes ✓</div>
      </div>
    </div>
  </div>
);

export default LandingPage;

