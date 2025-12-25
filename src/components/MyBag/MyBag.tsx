/**
 * My Bag Component
 * Club management screen for round setup
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBag.css';

interface Club {
  id: string;
  name: string;
  type: 'wood' | 'iron' | 'wedge' | 'putter';
  distance?: number;
}

const MyBag: React.FC = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([
    { id: '1', name: 'Driver', type: 'wood', distance: 250 },
    { id: '2', name: '3 Wood', type: 'wood', distance: 220 },
    { id: '3', name: '5 Iron', type: 'iron', distance: 180 },
    { id: '4', name: '7 Iron', type: 'iron', distance: 150 },
    { id: '5', name: '9 Iron', type: 'iron', distance: 120 },
    { id: '6', name: 'PW', type: 'wedge', distance: 100 },
    { id: '7', name: 'SW', type: 'wedge', distance: 80 },
    { id: '8', name: 'Putter', type: 'putter' },
  ]);

  const handleSave = () => {
    navigate('/hole-start');
  };

  const handleUseSuggested = () => {
    // Auto-fill with suggested distances
    setClubs(prev => prev.map(club => {
      if (club.type === 'wood' && !club.distance) return { ...club, distance: 230 };
      if (club.type === 'iron' && !club.distance) return { ...club, distance: 150 };
      if (club.type === 'wedge' && !club.distance) return { ...club, distance: 90 };
      return club;
    }));
  };

  const updateDistance = (id: string, distance: number) => {
    setClubs(prev => prev.map(club => 
      club.id === id ? { ...club, distance } : club
    ));
  };

  const getClubsByType = (type: Club['type']) => clubs.filter(c => c.type === type);

  return (
    <div className="my-bag-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>My Bag</h1>
            <p className="subtitle">Set your club distances</p>
          </div>

          <div className="bag-options">
            <button className="option-btn" onClick={handleUseSuggested}>
              Use Suggested Distances
            </button>
            <button className="option-btn secondary">
              Import from Previous Round
            </button>
          </div>

          <div className="clubs-section">
            {/* Woods */}
            <div className="club-category">
              <h2>Woods</h2>
              <div className="club-list">
                {getClubsByType('wood').map(club => (
                  <ClubItem
                    key={club.id}
                    club={club}
                    onDistanceChange={(dist) => updateDistance(club.id, dist)}
                  />
                ))}
              </div>
            </div>

            {/* Irons */}
            <div className="club-category">
              <h2>Irons</h2>
              <div className="club-list">
                {getClubsByType('iron').map(club => (
                  <ClubItem
                    key={club.id}
                    club={club}
                    onDistanceChange={(dist) => updateDistance(club.id, dist)}
                  />
                ))}
              </div>
            </div>

            {/* Wedges */}
            <div className="club-category">
              <h2>Wedges</h2>
              <div className="club-list">
                {getClubsByType('wedge').map(club => (
                  <ClubItem
                    key={club.id}
                    club={club}
                    onDistanceChange={(dist) => updateDistance(club.id, dist)}
                  />
                ))}
              </div>
            </div>

            {/* Putter */}
            <div className="club-category">
              <h2>Putter</h2>
              <div className="club-list">
                {getClubsByType('putter').map(club => (
                  <div key={club.id} className="club-item putter-item">
                    <span className="club-name">{club.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="screen-footer">
            <button className="btn-primary" onClick={handleSave}>
              Save & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ClubItemProps {
  club: Club;
  onDistanceChange: (distance: number) => void;
}

const ClubItem: React.FC<ClubItemProps> = ({ club, onDistanceChange }) => {
  const [distance, setDistance] = useState(club.distance || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setDistance(value);
    onDistanceChange(value);
  };

  return (
    <div className="club-item">
      <span className="club-name">{club.name}</span>
      <div className="distance-input">
        <input
          type="number"
          value={distance}
          onChange={handleChange}
          placeholder="yds"
          min="0"
        />
        <span className="unit">yds</span>
      </div>
    </div>
  );
};

export default MyBag;

