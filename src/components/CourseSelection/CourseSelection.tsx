/**
 * Course Selection Component
 * Select golf course before starting round
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRound } from '../../context/RoundContext';
import { Course } from '../../types/round';
import './CourseSelection.css';

const CourseSelection: React.FC = () => {
  const navigate = useNavigate();
  const { selectCourse } = useRound();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Mock courses - in production, these would come from an API
  const courses: Course[] = [
    {
      id: '1',
      name: 'Pebble Beach',
      location: 'Pebble Beach, CA',
      holes: Array.from({ length: 18 }, (_, i) => ({
        number: i + 1,
        par: 4,
        yards: 400,
      })),
      totalPar: 72,
    },
    {
      id: '2',
      name: 'Augusta National',
      location: 'Augusta, GA',
      holes: Array.from({ length: 18 }, (_, i) => ({
        number: i + 1,
        par: 4,
        yards: 400,
      })),
      totalPar: 72,
    },
    {
      id: '3',
      name: 'St. Andrews',
      location: 'St. Andrews, Scotland',
      holes: Array.from({ length: 18 }, (_, i) => ({
        number: i + 1,
        par: 4,
        yards: 400,
      })),
      totalPar: 72,
    },
    {
      id: '4',
      name: 'Riverside Golf Club',
      location: 'Riverside, CA',
      holes: Array.from({ length: 18 }, (_, i) => ({
        number: i + 1,
        par: 4,
        yards: 400,
      })),
      totalPar: 72,
    },
  ];

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      selectCourse(course);
    }
  };

  const handleContinue = () => {
    if (selectedCourseId) {
      navigate(`/round-settings?course=${selectedCourseId}`);
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
                className={`course-card ${selectedCourseId === course.id ? 'selected' : ''}`}
                onClick={() => handleSelectCourse(course.id)}
                onDoubleClick={() => navigate(`/course-detail/${course.id}`)}
              >
                <div className="course-info">
                  <div className="course-name">{course.name}</div>
                  <div className="course-location">{course.location}</div>
                  <div className="course-details">
                    <span>{course.holes.length} holes</span>
                    <span>•</span>
                    <span>Par {course.totalPar}</span>
                  </div>
                </div>
                <div className="course-select-indicator">
                  {selectedCourseId === course.id && '✓'}
                </div>
              </div>
            ))}
          </div>

          <div className="screen-footer">
            <button 
              className="btn-primary" 
              onClick={handleContinue}
              disabled={!selectedCourseId}
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

