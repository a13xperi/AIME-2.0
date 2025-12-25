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
        
        {/* Logo Container */}
        <div className="logo-container">
          <div className="aime-logo">
            <div className="logo-text">
              <div className="logo-a">
                <div className="logo-a-left-stroke"></div>
                <div className="logo-golf-icon">
                  <svg 
                    className="golf-club-ball" 
                    viewBox="0 0 100 30" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Golf Club - Driver style */}
                    <path 
                      d="M5 25 L8 10 L12 8 L20 6 L30 5 L40 6 L50 8 L55 10" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Club head */}
                    <path 
                      d="M55 10 Q60 8 65 10 Q70 12 72 15" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Golf Ball */}
                    <circle cx="80" cy="15" r="5" fill="currentColor"/>
                    <circle cx="80" cy="15" r="3" fill="#1a4d3a"/>
                  </svg>
                </div>
                <div className="logo-a-right-stroke"></div>
              </div>
              <span className="logo-rest">IME</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

