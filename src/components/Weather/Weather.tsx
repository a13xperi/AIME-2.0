/**
 * Weather/Conditions Component
 * Current weather and course conditions
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Weather.css';

const Weather: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course') || '1';

  // Mock weather data - in real app, this would come from API
  const weather = {
    temperature: 72,
    condition: 'Sunny',
    windSpeed: 8,
    windDirection: 'SW',
    humidity: 65,
    pressure: 30.15,
    visibility: 10,
  };

  const conditions = {
    greenSpeed: 'Fast',
    firmness: 'Medium',
    roughHeight: 'Medium',
    bunkerCondition: 'Good',
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getWindIcon = (direction: string) => {
    const directions: { [key: string]: string } = {
      'N': '⬆️', 'NE': '↗️', 'E': '➡️', 'SE': '↘️',
      'S': '⬇️', 'SW': '↙️', 'W': '⬅️', 'NW': '↖️',
    };
    return directions[direction] || '🌬️';
  };

  return (
    <div className="weather-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Weather & Conditions</h1>
            <div className="location-info">
              <span>Pebble Beach, CA</span>
              <span>•</span>
              <span>Dec 10, 2025</span>
            </div>
          </div>

          <div className="weather-main">
            <div className="temperature-large">{weather.temperature}°F</div>
            <div className="condition-large">{weather.condition}</div>
            <div className="weather-icon">☀️</div>
          </div>

          <div className="weather-details">
            <h2>Weather Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon">🌬️</div>
                <div className="detail-info">
                  <div className="detail-label">Wind</div>
                  <div className="detail-value">
                    {weather.windSpeed} mph {getWindIcon(weather.windDirection)} {weather.windDirection}
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">💧</div>
                <div className="detail-info">
                  <div className="detail-label">Humidity</div>
                  <div className="detail-value">{weather.humidity}%</div>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">📊</div>
                <div className="detail-info">
                  <div className="detail-label">Pressure</div>
                  <div className="detail-value">{weather.pressure} inHg</div>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">👁️</div>
                <div className="detail-info">
                  <div className="detail-label">Visibility</div>
                  <div className="detail-value">{weather.visibility} mi</div>
                </div>
              </div>
            </div>
          </div>

          <div className="course-conditions">
            <h2>Course Conditions</h2>
            <div className="conditions-grid">
              <div className="condition-item">
                <div className="condition-label">Green Speed</div>
                <div className="condition-value">{conditions.greenSpeed}</div>
              </div>
              <div className="condition-item">
                <div className="condition-label">Firmness</div>
                <div className="condition-value">{conditions.firmness}</div>
              </div>
              <div className="condition-item">
                <div className="condition-label">Rough Height</div>
                <div className="condition-value">{conditions.roughHeight}</div>
              </div>
              <div className="condition-item">
                <div className="condition-label">Bunker Condition</div>
                <div className="condition-value">{conditions.bunkerCondition}</div>
              </div>
            </div>
          </div>

          <div className="impact-section">
            <h2>Impact on Play</h2>
            <div className="impact-items">
              <div className="impact-item">
                <span className="impact-icon">📏</span>
                <span className="impact-text">Wind may add 5-10 yds to shots</span>
              </div>
              <div className="impact-item">
                <span className="impact-icon">⛳</span>
                <span className="impact-text">Fast greens - play for more break</span>
              </div>
              <div className="impact-item">
                <span className="impact-icon">🌾</span>
                <span className="impact-text">Medium rough - expect 10-15% distance loss</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;

