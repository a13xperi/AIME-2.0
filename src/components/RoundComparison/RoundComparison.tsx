/**
 * Round Comparison Component
 * Compare rounds side by side
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoundComparison.css';

interface Round {
  id: string;
  course: string;
  date: string;
  score: number;
  par: number;
  overPar: number;
  fairways: string;
  gir: string;
  putts: number;
}

const RoundComparison: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRounds, setSelectedRounds] = useState<string[]>([]);

  const rounds: Round[] = [
    { id: '1', course: 'Pebble Beach', date: 'Dec 10, 2025', score: 86, par: 72, overPar: 14, fairways: '8/14', gir: '6/18', putts: 34 },
    { id: '2', course: 'Augusta National', date: 'Dec 5, 2025', score: 92, par: 72, overPar: 20, fairways: '6/14', gir: '4/18', putts: 38 },
    { id: '3', course: 'Riverside Golf Club', date: 'Nov 28, 2025', score: 84, par: 72, overPar: 12, fairways: '10/14', gir: '8/18', putts: 32 },
  ];

  const toggleRound = (roundId: string) => {
    setSelectedRounds(prev => 
      prev.includes(roundId) 
        ? prev.filter(id => id !== roundId)
        : prev.length < 2 
          ? [...prev, roundId]
          : [prev[1], roundId]
    );
  };

  const getSelectedRoundsData = () => {
    return rounds.filter(r => selectedRounds.includes(r.id));
  };

  const selectedData = getSelectedRoundsData();

  return (
    <div className="round-comparison-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Round Comparison</h1>
            <p className="subtitle">Select up to 2 rounds to compare</p>
          </div>

          <div className="rounds-selection">
            <h3>Select Rounds</h3>
            {rounds.map((round) => (
              <div
                key={round.id}
                className={`round-select-card ${selectedRounds.includes(round.id) ? 'selected' : ''}`}
                onClick={() => toggleRound(round.id)}
              >
                <div className="round-select-info">
                  <div className="round-select-course">{round.course}</div>
                  <div className="round-select-date">{round.date}</div>
                </div>
                <div className="round-select-score">{round.score}</div>
                {selectedRounds.includes(round.id) && (
                  <div className="round-select-check">✓</div>
                )}
              </div>
            ))}
          </div>

          {selectedData.length === 2 && (
            <div className="comparison-table">
              <h3>Comparison</h3>
              <div className="comparison-header">
                <div className="comparison-col">{selectedData[0].course}</div>
                <div className="comparison-col">Metric</div>
                <div className="comparison-col">{selectedData[1].course}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-col">{selectedData[0].score}</div>
                <div className="comparison-col">Score</div>
                <div className="comparison-col">{selectedData[1].score}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-col">{selectedData[0].overPar > 0 ? '+' : ''}{selectedData[0].overPar}</div>
                <div className="comparison-col">vs Par</div>
                <div className="comparison-col">{selectedData[1].overPar > 0 ? '+' : ''}{selectedData[1].overPar}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-col">{selectedData[0].fairways}</div>
                <div className="comparison-col">Fairways</div>
                <div className="comparison-col">{selectedData[1].fairways}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-col">{selectedData[0].gir}</div>
                <div className="comparison-col">GIR</div>
                <div className="comparison-col">{selectedData[1].gir}</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-col">{selectedData[0].putts}</div>
                <div className="comparison-col">Putts</div>
                <div className="comparison-col">{selectedData[1].putts}</div>
              </div>
            </div>
          )}

          {selectedRounds.length < 2 && (
            <div className="selection-hint">
              Select {2 - selectedRounds.length} more round{2 - selectedRounds.length === 1 ? '' : 's'} to compare
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundComparison;

