/**
 * Profile/Account Component
 * User profile and account settings
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import './Profile.css';

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || 'G';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, signup, logout, isLoading, error } = useAuth();

  // An anonymous session has no email; offer to upgrade it in place (same uid
  // keeps the rounds already saved). See auth-context signup().
  const isAnonymous = !!user && !user.email;
  const displayName = user?.name || 'Golfer';
  const displayEmail = user?.email || (user ? 'Guest, not saved' : 'Not signed in');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    // Future: Open edit profile modal
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name || displayName, email, password);
      setSaved(true);
      setPassword('');
    } catch {
      // useAuth surfaces `error`; keep the form open for a retry.
    }
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
              <div className="avatar-circle">{initials(displayName)}</div>
              <button className="edit-avatar-btn">Edit</button>
            </div>
            <div className="profile-info">
              <div className="profile-name">{displayName}</div>
              <div className="profile-email">{displayEmail}</div>
              <div className="profile-handicap">Handicap: 12</div>
            </div>
          </div>

          {isAnonymous && !saved && (
            <form className="upgrade-card" onSubmit={handleSaveAccount}>
              <div className="upgrade-title">Save your account</div>
              <div className="upgrade-sub">
                You are playing as a guest. Add an email to keep your rounds on any device.
              </div>
              <input
                className="upgrade-input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <input
                className="upgrade-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <input
                className="upgrade-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {error && <div className="upgrade-error">{error}</div>}
              <button className="btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save my account'}
              </button>
            </form>
          )}

          {saved && (
            <div className="upgrade-card upgrade-done">
              Account saved. Your rounds are now tied to your email.
            </div>
          )}

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
            <button className="action-item" onClick={() => navigate('/trends')}>
              <span className="action-icon">📈</span>
              <span className="action-text">Performance Trends</span>
              <span className="action-arrow">→</span>
            </button>
          </div>

          <div className="profile-footer">
            <button className="btn-secondary logout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
