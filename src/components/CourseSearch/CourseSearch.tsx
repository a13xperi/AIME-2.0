/**
 * Course Search Component
 * Search and browse golf courses
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseSearch.css';

interface Course {
  id: string;
  name: string;
  location: string;
  holes: number;
  par: number;
  rating: number;
  distance?: number;
}

const CourseSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const allCourses: Course[] = [
    { id: '1', name: 'Pebble Beach', location: 'Pebble Beach, CA', holes: 18, par: 72, rating: 4.8, distance: 2.5 },
    { id: '2', name: 'Augusta National', location: 'Augusta, GA', holes: 18, par: 72, rating: 4.9, distance: 15.2 },
    { id: '3', name: 'St. Andrews', location: 'St. Andrews, Scotland', holes: 18, par: 72, rating: 4.7 },
    { id: '4', name: 'Riverside Golf Club', location: 'Riverside, CA', holes: 18, par: 72, rating: 4.2, distance: 0.8 },
    { id: '5', name: 'Torrey Pines', location: 'La Jolla, CA', holes: 36, par: 72, rating: 4.6, distance: 5.3 },
    { id: '6', name: 'Cypress Point', location: 'Pebble Beach, CA', holes: 18, par: 72, rating: 4.9, distance: 1.2 },
  ];

  const filteredCourses = allCourses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const handleContinue = () => {
    if (selectedCourse) {
      navigate(`/round-settings?course=${selectedCourse}`);
    }
  };

  return (
    <div className="course-search-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Search Courses</h1>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {searchQuery && (
            <div className="results-count">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </div>
          )}

          <div className="courses-list">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
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
                      <span>•</span>
                      <span className="rating">⭐ {course.rating}</span>
                      {course.distance && (
                        <>
                          <span>•</span>
                          <span>{course.distance} mi away</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="course-select-indicator">
                    {selectedCourse === course.id && '✓'}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <div className="no-results-text">No courses found</div>
                <div className="no-results-subtext">Try a different search term</div>
              </div>
            )}
          </div>

          {selectedCourse && (
            <div className="screen-footer">
              <button className="btn-primary" onClick={handleContinue}>
                Select Course →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;

