/**
 * Error Page Component
 * 404 and error handling
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

interface ErrorPageProps {
  code?: number;
  message?: string;
  description?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  code = 404, 
  message = 'Page Not Found',
  description = 'The page you\'re looking for doesn\'t exist.'
}) => {
  const navigate = useNavigate();

  return (
    <div className="error-page-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="error-content">
            <div className="error-code">{code}</div>
            <div className="error-icon">😕</div>
            <h1 className="error-title">{message}</h1>
            <p className="error-description">{description}</p>
            
            <div className="error-actions">
              <button className="btn-primary" onClick={() => navigate('/')}>
                Go Home
              </button>
              <button className="btn-secondary" onClick={() => navigate(-1)}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

