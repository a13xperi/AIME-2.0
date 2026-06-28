/**
 * AIME Splash Screen Component
 * Mobile-first splash screen matching Figma design
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen welcome screen
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    const timer = setTimeout(() => {
      if (!hasSeenWelcome) {
        navigate('/welcome');
      } else {
        navigate('/course-selection');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="phone-frame">
        {/* Notch/Dynamic Island */}
        <div className="phone-notch"></div>

        {/* Brand stack */}
        <div className="splash-body">
          <div className="aime-wordmark">
            <span className="wm-ai">AI</span><span className="wm-me">me</span>
          </div>
          <div className="aime-subtitle">AI Golf Caddie</div>
          <div className="aime-tagline">
            <div className="tagline-strong">Trust the read.</div>
            <div className="tagline-soft">Speed wins.</div>
          </div>
        </div>

        <div className="splash-footer">
          RoboPuck <span className="dot">●</span> paired
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

