/**
 * Course Selection Component
 * Select golf course before starting round
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseSelection.css';

interface Course {
  id: string;
  name: string;
  location: string;
  holes: number;
  par: number;
  image?: string;
}

const CourseSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const courses: Course[] = [
    { id: '1', name: 'Pebble Beach', location: 'Pebble Beach, CA', holes: 18, par: 72 },
    { id: '2', name: 'Augusta National', location: 'Augusta, GA', holes: 18, par: 72 },
    { id: '3', name: 'St. Andrews', location: 'St. Andrews, Scotland', holes: 18, par: 72 },
    { id: '4', name: 'Riverside Golf Club', location: 'Riverside, CA', holes: 18, par: 72 },
  ];

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const handleContinue = () => {
    if (selectedCourse) {
      navigate(`/round-settings?course=${selectedCourse}`);
    }
  };

  const handleSearch = () => {
    navigate('/course-search');
  };

  return (
    <div className="course-selection-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>Select Course</h1>
            <p className="subtitle">Choose where you're playing today</p>
          </div>

          <div className="search-section">
            <button className="search-btn" onClick={handleSearch}>
              🔍 Search for a course
            </button>
          </div>

          <div className="courses-list">
            <h2>Recent Courses</h2>
            {courses.map((course) => (
              <div
                key={course.id}
                className={`course-card ${selectedCourse === course.id ? 'selected' : ''}`}
                onClick={() => handleSelectCourse(course.id)}
              >
                <div className="course-info">
                  <div className="course-name">{course.name}</div>
                  <div className="course-location">{course.location}</div>
                  <div className="course-details">
                    <span>{course.holes} holes</span>
                    <span>•</span>
                    <span>Par {course.par}</span>
                  </div>
                </div>
                <div className="course-select-indicator">
                  {selectedCourse === course.id && '✓'}
                </div>
              </div>
            ))}
          </div>

          <div className="screen-footer">
            <button 
              className="btn-primary" 
              onClick={handleContinue}
              disabled={!selectedCourse}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;

