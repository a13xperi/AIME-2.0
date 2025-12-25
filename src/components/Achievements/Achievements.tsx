/**
 * Achievements/Badges Component
 * User achievements and badges
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Achievements.css';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  dateUnlocked?: string;
}

const Achievements: React.FC = () => {
  const navigate = useNavigate();

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Round',
      description: 'Complete your first round',
      icon: '🎉',
      unlocked: true,
      dateUnlocked: 'Dec 1, 2025',
    },
    {
      id: '2',
      name: 'Birdie Master',
      description: 'Score 10 birdies in a single round',
      icon: '🐦',
      unlocked: true,
      dateUnlocked: 'Dec 10, 2025',
    },
    {
      id: '3',
      name: 'Eagle Eye',
      description: 'Score an eagle',
      icon: '🦅',
      unlocked: false,
      progress: 0,
    },
    {
      id: '4',
      name: 'Perfect Round',
      description: 'Play 18 holes without a penalty',
      icon: '⭐',
      unlocked: false,
      progress: 16,
    },
    {
      id: '5',
      name: 'Putting Pro',
      description: 'Average under 30 putts per round for 5 rounds',
      icon: '⛳',
      unlocked: false,
      progress: 60,
    },
    {
      id: '6',
      name: 'Distance King',
      description: 'Drive over 300 yards',
      icon: '🚀',
      unlocked: false,
      progress: 89,
    },
    {
      id: '7',
      name: 'Consistency',
      description: 'Play 10 rounds',
      icon: '📊',
      unlocked: false,
      progress: 70,
    },
    {
      id: '8',
      name: 'Practice Makes Perfect',
      description: 'Complete 20 practice sessions',
      icon: '🏌️',
      unlocked: false,
      progress: 45,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Achievements</h1>
            <div className="progress-summary">
              <div className="progress-text">
                {unlockedCount} of {totalCount} unlocked
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="achievements-list">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-info">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-description">{achievement.description}</div>
                  {achievement.unlocked && achievement.dateUnlocked && (
                    <div className="achievement-date">Unlocked: {achievement.dateUnlocked}</div>
                  )}
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="achievement-progress">
                      <div className="progress-bar-small">
                        <div 
                          className="progress-fill-small" 
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      <div className="progress-text-small">{achievement.progress}%</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;

