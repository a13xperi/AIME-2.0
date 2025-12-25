/**
 * Leaderboard Component
 * Leaderboard for rounds and achievements
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  course: string;
  date: string;
  badge?: string;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Sam', score: 72, course: 'Pebble Beach', date: 'Dec 10', badge: '🥇' },
    { rank: 2, name: 'Alex', score: 75, course: 'Augusta', date: 'Dec 9', badge: '🥈' },
    { rank: 3, name: 'You', score: 76, course: 'Pebble Beach', date: 'Dec 10', badge: '🥉' },
    { rank: 4, name: 'Jordan', score: 78, course: 'St. Andrews', date: 'Dec 8' },
    { rank: 5, name: 'Taylor', score: 79, course: 'Riverside', date: 'Dec 7' },
    { rank: 6, name: 'Casey', score: 80, course: 'Pebble Beach', date: 'Dec 6' },
    { rank: 7, name: 'Morgan', score: 81, course: 'Augusta', date: 'Dec 5' },
    { rank: 8, name: 'Riley', score: 82, course: 'St. Andrews', date: 'Dec 4' },
  ];

  return (
    <div className="leaderboard-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Leaderboard</h1>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Time
              </button>
              <button 
                className={`filter-tab ${filter === 'week' ? 'active' : ''}`}
                onClick={() => setFilter('week')}
              >
                This Week
              </button>
              <button 
                className={`filter-tab ${filter === 'month' ? 'active' : ''}`}
                onClick={() => setFilter('month')}
              >
                This Month
              </button>
            </div>
          </div>

          <div className="leaderboard-list">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`leaderboard-entry ${entry.name === 'You' ? 'current-user' : ''}`}
              >
                <div className="entry-rank">
                  {entry.badge || `#${entry.rank}`}
                </div>
                <div className="entry-info">
                  <div className="entry-name">
                    {entry.name}
                    {entry.name === 'You' && <span className="you-badge">You</span>}
                  </div>
                  <div className="entry-details">
                    <span>{entry.course}</span>
                    <span>•</span>
                    <span>{entry.date}</span>
                  </div>
                </div>
                <div className="entry-score">{entry.score}</div>
              </div>
            ))}
          </div>

          <div className="leaderboard-footer">
            <div className="your-position">
              <div className="position-label">Your Best</div>
              <div className="position-value">76 (Rank #3)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

