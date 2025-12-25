/**
 * Course Detail Component
 * Detailed course information and hole layouts
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CourseDetail.css';

interface Hole {
  number: number;
  par: number;
  distance: number;
  handicap: number;
}

const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedHole, setSelectedHole] = useState<number | null>(null);

  const course = {
    id: id || '1',
    name: 'Pebble Beach',
    location: 'Pebble Beach, CA',
    holes: 18,
    par: 72,
    rating: 4.8,
    slope: 142,
    description: 'One of the most iconic golf courses in the world, featuring stunning ocean views and challenging holes.',
  };

  const holes: Hole[] = [
    { number: 1, par: 4, distance: 380, handicap: 15 },
    { number: 2, par: 5, distance: 516, handicap: 9 },
    { number: 3, par: 4, distance: 404, handicap: 11 },
    { number: 4, par: 4, distance: 331, handicap: 17 },
    { number: 5, par: 3, distance: 195, handicap: 13 },
    { number: 6, par: 5, distance: 523, handicap: 7 },
    { number: 7, par: 3, distance: 107, handicap: 5 },
    { number: 8, par: 4, distance: 428, handicap: 3 },
    { number: 9, par: 4, distance: 462, handicap: 1 },
    { number: 10, par: 4, distance: 446, handicap: 2 },
    { number: 11, par: 4, distance: 373, handicap: 14 },
    { number: 12, par: 3, distance: 202, handicap: 12 },
    { number: 13, par: 4, distance: 403, handicap: 10 },
    { number: 14, par: 5, distance: 580, handicap: 4 },
    { number: 15, par: 4, distance: 397, handicap: 8 },
    { number: 16, par: 4, distance: 403, handicap: 6 },
    { number: 17, par: 3, distance: 178, handicap: 16 },
    { number: 18, par: 5, distance: 543, handicap: 18 },
  ];

  const handleStartRound = () => {
    navigate(`/round-settings?course=${course.id}`);
  };

  return (
    <div className="course-detail-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>{course.name}</h1>
            <div className="course-meta">
              <span>{course.location}</span>
              <span>•</span>
              <span>⭐ {course.rating}</span>
            </div>
          </div>

          <div className="course-info">
            <div className="info-card">
              <div className="info-item">
                <div className="info-label">Par</div>
                <div className="info-value">{course.par}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Holes</div>
                <div className="info-value">{course.holes}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Slope</div>
                <div className="info-value">{course.slope}</div>
              </div>
            </div>
            <p className="course-description">{course.description}</p>
          </div>

          <div className="holes-section">
            <h3>Hole Layout</h3>
            <div className="holes-grid">
              {holes.map((hole) => (
                <div
                  key={hole.number}
                  className={`hole-card ${selectedHole === hole.number ? 'selected' : ''}`}
                  onClick={() => setSelectedHole(selectedHole === hole.number ? null : hole.number)}
                >
                  <div className="hole-number">{hole.number}</div>
                  <div className="hole-details">
                    <div className="hole-par">Par {hole.par}</div>
                    <div className="hole-distance">{hole.distance} yds</div>
                    <div className="hole-handicap">Hcp {hole.handicap}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleStartRound}>
              Start Round Here →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

