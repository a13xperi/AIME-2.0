/**
 * Profile/Account Component
 * User profile and account settings
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    // Future: Open edit profile modal
  };

  return (
    <div className="profile-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h1>Profile</h1>
          </div>

          <div className="profile-section">
            <div className="profile-avatar">
              <div className="avatar-circle">AG</div>
              <button className="edit-avatar-btn">Edit</button>
            </div>
            <div className="profile-info">
              <div className="profile-name">Alex Golfer</div>
              <div className="profile-email">alex@example.com</div>
              <div className="profile-handicap">Handicap: 12</div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">24</div>
              <div className="stat-label">Rounds Played</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">87</div>
              <div className="stat-label">Avg Score</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">82</div>
              <div className="stat-label">Best Score</div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="action-item" onClick={handleEditProfile}>
              <span className="action-icon">✏️</span>
              <span className="action-text">Edit Profile</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/round-history')}>
              <span className="action-icon">📊</span>
              <span className="action-text">Round History</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/my-bag')}>
              <span className="action-icon">🎒</span>
              <span className="action-text">My Bag</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/settings')}>
              <span className="action-icon">⚙️</span>
              <span className="action-text">Settings</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/help')}>
              <span className="action-icon">❓</span>
              <span className="action-text">Help & Support</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/practice')}>
              <span className="action-icon">🏌️</span>
              <span className="action-text">Practice Mode</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/achievements')}>
              <span className="action-icon">🏆</span>
              <span className="action-text">Achievements</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/club-analysis')}>
              <span className="action-icon">📊</span>
              <span className="action-text">Club Analysis</span>
              <span className="action-arrow">→</span>
            </button>
            <button className="action-item" onClick={() => navigate('/leaderboard')}>
              <span className="action-icon">🏆</span>
              <span className="action-text">Leaderboard</span>
              <span className="action-arrow">→</span>
            </button>
          </div>

          <div className="profile-footer">
            <button className="btn-secondary logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

