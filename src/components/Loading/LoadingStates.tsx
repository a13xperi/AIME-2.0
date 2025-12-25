/**
 * Loading States Component
 * Showcase of all loading state variants
 * Useful for testing and documentation
 */

import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import './LoadingStates.css';

const LoadingStates: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 2, 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const variants = [
    { name: 'Spinner', variant: 'spinner' as const, size: 'medium' as const },
    { name: 'Spinner Large', variant: 'spinner-large' as const, size: 'large' as const },
    { name: 'Spinner Small', variant: 'spinner' as const, size: 'small' as const },
    { name: 'Dots', variant: 'dots' as const, size: 'medium' as const },
    { name: 'Pulse', variant: 'pulse' as const, size: 'medium' as const },
    { name: 'GPS', variant: 'gps' as const, size: 'medium' as const },
    { name: 'Progress', variant: 'progress' as const, size: 'medium' as const, progress },
    { name: 'Skeleton', variant: 'skeleton' as const, size: 'medium' as const },
  ];

  return (
    <div className="loading-states-demo">
      <div className="demo-header">
        <h1>Loading States</h1>
        <p>All available loading state variants</p>
      </div>

      <div className="variants-grid">
        {variants.map((variant) => (
          <div key={variant.name} className="variant-card">
            <div className="variant-header">
              <h3>{variant.name}</h3>
            </div>
            <div className="variant-preview">
              <Loading
                variant={variant.variant}
                size={variant.size}
                message={variant.variant === 'progress' ? 'Loading data...' : undefined}
                progress={variant.progress}
              />
            </div>
            <div className="variant-code">
              <code>
                {`<Loading variant="${variant.variant}"${variant.size !== 'medium' ? ` size="${variant.size}"` : ''}${variant.progress !== undefined ? ` progress={${variant.progress}}` : ''} />`}
              </code>
            </div>
          </div>
        ))}
      </div>

      <div className="fullscreen-demo">
        <h2>Fullscreen Examples</h2>
        <div className="demo-buttons">
          <button onClick={() => {
            // Demo fullscreen spinner
            const overlay = document.createElement('div');
            overlay.className = 'demo-overlay';
            overlay.innerHTML = `
              <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 46, 31, 0.95); display: flex; justify-content: center; align-items: center; z-index: 99999;">
                ${document.querySelector('.variant-card:first-child .variant-preview')?.innerHTML || ''}
                <div style="color: #4ade80; margin-top: 16px;">Loading...</div>
              </div>
            `;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.remove(), 2000);
          }}>
            Show Fullscreen Spinner
          </button>
          <button onClick={() => {
            const overlay = document.createElement('div');
            overlay.className = 'demo-overlay';
            overlay.innerHTML = `
              <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 46, 31, 0.95); display: flex; justify-content: center; align-items: center; z-index: 99999;">
                <div style="text-align: center;">
                  <div style="font-size: 4rem; margin-bottom: 16px;">📍</div>
                  <div style="color: #4ade80; font-size: 1rem;">Getting GPS location...</div>
                </div>
              </div>
            `;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.remove(), 2000);
          }}>
            Show Fullscreen GPS
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadingStates;

