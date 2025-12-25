/**
 * Scorecard Component
 * Multi-hole scorecard view
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Scorecard.css';

interface HoleScore {
  hole: number;
  par: number;
  score: number;
  strokes: number[];
}

const Scorecard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get('round') || 'current';

  // Mock data - in real app, this would come from state/API
  const front9: HoleScore[] = [
    { hole: 1, par: 4, score: 5, strokes: [1, 1, 1, 1, 1] },
    { hole: 2, par: 3, score: 3, strokes: [1, 1, 1] },
    { hole: 3, par: 5, score: 5, strokes: [1, 1, 1, 1, 1] },
    { hole: 4, par: 4, score: 4, strokes: [1, 1, 1, 1] },
    { hole: 5, par: 4, score: 3, strokes: [1, 1, 1] },
    { hole: 6, par: 3, score: 4, strokes: [1, 1, 1, 1] },
    { hole: 7, par: 5, score: 6, strokes: [1, 1, 1, 1, 1, 1] },
    { hole: 8, par: 4, score: 4, strokes: [1, 1, 1, 1] },
    { hole: 9, par: 4, score: 5, strokes: [1, 1, 1, 1, 1] },
  ];

  const back9: HoleScore[] = [
    { hole: 10, par: 4, score: 4, strokes: [1, 1, 1, 1] },
    { hole: 11, par: 3, score: 3, strokes: [1, 1, 1] },
    { hole: 12, par: 5, score: 5, strokes: [1, 1, 1, 1, 1] },
    { hole: 13, par: 4, score: 5, strokes: [1, 1, 1, 1, 1] },
    { hole: 14, par: 4, score: 4, strokes: [1, 1, 1, 1] },
    { hole: 15, par: 3, score: 4, strokes: [1, 1, 1, 1] },
    { hole: 16, par: 5, score: 6, strokes: [1, 1, 1, 1, 1, 1] },
    { hole: 17, par: 4, score: 4, strokes: [1, 1, 1, 1] },
    { hole: 18, par: 4, score: 5, strokes: [1, 1, 1, 1, 1] },
  ];

  const frontTotal = front9.reduce((sum, h) => sum + h.score, 0);
  const backTotal = back9.reduce((sum, h) => sum + h.score, 0);
  const total = frontTotal + backTotal;
  const parTotal = front9.reduce((sum, h) => sum + h.par, 0) + back9.reduce((sum, h) => sum + h.par, 0);
  const overPar = total - parTotal;

  const getScoreClass = (score: number, par: number) => {
    const diff = score - par;
    if (diff === -2) return 'eagle';
    if (diff === -1) return 'birdie';
    if (diff === 0) return 'par';
    if (diff === 1) return 'bogey';
    return 'double';
  };

  const handleHoleClick = (hole: number) => {
    navigate(`/hole-analysis?hole=${hole}&course=1`);
  };

  return (
    <div className="scorecard-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <h1>Scorecard</h1>
            <div className="round-info">
              <span>Pebble Beach</span>
              <span>•</span>
              <span>Dec 10, 2025</span>
            </div>
          </div>

          <div className="scorecard-table">
            <div className="table-header">
              <div className="col-hole">Hole</div>
              <div className="col-par">Par</div>
              <div className="col-score">Score</div>
            </div>

            <div className="table-section">
              <div className="section-label">Front 9</div>
              {front9.map((hole) => (
                <div
                  key={hole.hole}
                  className="table-row"
                  onClick={() => handleHoleClick(hole.hole)}
                >
                  <div className="col-hole">{hole.hole}</div>
                  <div className="col-par">{hole.par}</div>
                  <div className={`col-score ${getScoreClass(hole.score, hole.par)}`}>
                    {hole.score}
                  </div>
                </div>
              ))}
              <div className="table-row total">
                <div className="col-hole">Out</div>
                <div className="col-par">{front9.reduce((sum, h) => sum + h.par, 0)}</div>
                <div className="col-score">{frontTotal}</div>
              </div>
            </div>

            <div className="table-section">
              <div className="section-label">Back 9</div>
              {back9.map((hole) => (
                <div
                  key={hole.hole}
                  className="table-row"
                  onClick={() => handleHoleClick(hole.hole)}
                >
                  <div className="col-hole">{hole.hole}</div>
                  <div className="col-par">{hole.par}</div>
                  <div className={`col-score ${getScoreClass(hole.score, hole.par)}`}>
                    {hole.score}
                  </div>
                </div>
              ))}
              <div className="table-row total">
                <div className="col-hole">In</div>
                <div className="col-par">{back9.reduce((sum, h) => sum + h.par, 0)}</div>
                <div className="col-score">{backTotal}</div>
              </div>
            </div>

            <div className="table-row grand-total">
              <div className="col-hole">Total</div>
              <div className="col-par">{parTotal}</div>
              <div className="col-score">
                {total}
                <span className="over-par">({overPar > 0 ? '+' : ''}{overPar})</span>
              </div>
            </div>
          </div>

          <div className="screen-footer">
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;

