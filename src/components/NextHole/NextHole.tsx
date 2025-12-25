/**
 * Next Hole Transition Component
 * Transition screen between holes
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './NextHole.css';

const NextHole: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentHole = parseInt(searchParams.get('hole') || '1');
  const nextHole = currentHole + 1;
  const isLastHole = currentHole >= 18;

  useEffect(() => {
    // Auto-navigate after 2 seconds
    const timer = setTimeout(() => {
      if (isLastHole) {
        navigate('/round-complete');
      } else {
        navigate(`/hole-start?hole=${nextHole}&par=4`);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, nextHole, isLastHole]);

  return (
    <div className="next-hole-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="transition-content">
            {isLastHole ? (
              <>
                <div className="transition-icon">🏆</div>
                <h1>Final Hole Complete!</h1>
                <p>Calculating your round summary...</p>
              </>
            ) : (
              <>
                <div className="transition-icon">⛳</div>
                <h1>Hole {currentHole} Complete</h1>
                <p>Moving to Hole {nextHole}...</p>
              </>
            )}
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextHole;

