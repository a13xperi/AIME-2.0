/**
 * Putting Guidance Component
 * Detailed puck setup and putting guidance
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { solvePuttLocal, formatAim, SolvePuttResponse, PointLocalM } from '../../lib/puttSolver';
import './PuttingGuidance.css';

const PuttingGuidance: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const holeNumber = parseInt(searchParams.get('hole') || '1');
  const skipRTK = searchParams.get('skip') === 'true';
  const [puckPlaced, setPuckPlaced] = useState(skipRTK);
  const [puttNumber] = useState(1);
  const [distance] = useState(18);
  const [read, setRead] = useState<SolvePuttResponse | null>(null);
  const [reading, setReading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePuckPlaced = () => {
    setPuckPlaced(true);
  };

  // Once the puck is placed, fetch the solved read. Green-local demo coords
  // (ball at origin, cup `distance` ft up the fall line) stand in until GPS /
  // the RTK puck supplies WGS84; at that point this moves to solvePutt() via
  // the backend, the same contract the voice caddie uses.
  useEffect(() => {
    if (!puckPlaced) return;
    let cancelled = false;
    const controller = new AbortController();
    setReading(true);
    const distMeters = distance * 0.3048;
    solvePuttLocal(
      {
        dtm_id: 'riverside_2023_20cm',
        ball_local_m: { x: 0, y: 0 },
        cup_local_m: { x: 1.1, y: distMeters },
        stimp: 10.5,
        request_id: `putt-${holeNumber}-${puttNumber}`,
      },
      { signal: controller.signal }
    ).then((r) => {
      if (cancelled) return;
      setRead(r);
      setReading(false);
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [puckPlaced, distance, holeNumber, puttNumber]);

  const drawPath = useCallback((points: PointLocalM[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext('2d');
    if (!g) return;
    const W = canvas.width;
    const H = canvas.height;
    g.clearRect(0, 0, W, H);

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const padX = 70;
    const padTop = 50;
    const padBot = 50;
    const spanX = Math.max(0.6, maxX - minX);
    const spanY = Math.max(0.6, maxY);
    const innerW = W - 2 * padX;
    const innerH = H - padTop - padBot;
    const sx = (x: number) => padX + ((x - minX) / spanX) * innerW * 0.5 + innerW * 0.25;
    const sy = (y: number) => H - padBot - (y / spanY) * innerH;

    // faint straight ball -> cup reference
    g.strokeStyle = 'rgba(255,255,255,0.2)';
    g.lineWidth = 2;
    g.setLineDash([6, 7]);
    g.beginPath();
    g.moveTo(sx(points[0].x), sy(points[0].y));
    g.lineTo(sx(points[points.length - 1].x), sy(points[points.length - 1].y));
    g.stroke();
    g.setLineDash([]);

    // the solved break path (gold = the read)
    g.strokeStyle = '#c9a227';
    g.lineWidth = 5;
    g.lineJoin = 'round';
    g.beginPath();
    points.forEach((p, i) =>
      i ? g.lineTo(sx(p.x), sy(p.y)) : g.moveTo(sx(p.x), sy(p.y))
    );
    g.stroke();

    // ball
    const ball = points[0];
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(sx(ball.x), sy(ball.y), 9, 0, Math.PI * 2);
    g.fill();

    // cup
    const cup = points[points.length - 1];
    g.fillStyle = '#2d6a4f';
    g.strokeStyle = '#3fae74';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(sx(cup.x), sy(cup.y), 12, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }, []);

  useEffect(() => {
    if (read?.success && read.plot_points_local && read.plot_points_local.length) {
      drawPath(read.plot_points_local);
    }
  }, [read, drawPath]);

  const fallbackRead = 'Aim 2° left. Hit with 3.5 mph speed. Break: 6 inches right to left.';

  const handleSkipInstructions = () => {
    setPuckPlaced(true);
  };

  return (
    <div className="putting-guidance-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        
        <div className="screen-content">
          <div className="screen-header">
            <div className="header-top">
              <div className="putt-title">Putt {puttNumber} • Hole {holeNumber}</div>
              <div className="putt-distance">{distance} ft</div>
            </div>
          </div>

          {!puckPlaced ? (
            <>
              <div className="puck-instruction">
                <h2>Place puck directly behind your ball</h2>
                <div className="placement-diagram">
                  <div className="ball-visual">⚪</div>
                  <div className="puck-visual">📡</div>
                  <div className="placement-arrow">↓</div>
                  <div className="placement-text">2-3 inches</div>
                </div>
              </div>

              <div className="puck-status-card">
                <div className="status-row">
                  <span className="status-icon">✓</span>
                  <span className="status-text">Puck connected</span>
                </div>
                <div className="status-row">
                  <span className="status-label">Battery:</span>
                  <span className="status-value">85%</span>
                </div>
                <div className="status-row waiting">
                  <span className="status-icon">📡</span>
                  <span className="status-text">Waiting for position...</span>
                </div>
              </div>

              <div className="quick-tips">
                <h3>Quick Tips</h3>
                <ul>
                  <li>Keep puck flat on green</li>
                  <li>Avoid standing over puck</li>
                  <li>Don't move until reading complete</li>
                </ul>
              </div>

              <div className="screen-footer">
                <button className="btn-primary" onClick={handlePuckPlaced}>
                  Puck Placed →
                </button>
                <button className="link-btn" onClick={handleSkipInstructions}>
                  Returning user? Skip instructions for quick place
                </button>
              </div>
            </>
          ) : (
            <div className="putting-line-view">
              <div className="green-view">
                <canvas ref={canvasRef} className="green-canvas" width={700} height={520} />
                {!read?.success && (
                  <div className="green-placeholder">
                    <span className="ball-position">⚪</span>
                    <span className="cup-position">⛳</span>
                  </div>
                )}
              </div>
              <div className="putting-instruction">
                <h3>{read?.success ? 'The read' : 'Putt Line'}</h3>
                <div className="instruction-detail">
                  {reading
                    ? 'Reading the line…'
                    : read?.success && read.instruction_text
                    ? read.instruction_text
                    : fallbackRead}
                </div>
                {read?.success && (
                  <div className="read-stats">
                    <div className="read-stat">
                      <div className="read-stat-value gold">
                        {read.aim_line_deg != null ? formatAim(read.aim_line_deg) : '—'}
                      </div>
                      <div className="read-stat-label">Aim</div>
                    </div>
                    <div className="read-stat">
                      <div className="read-stat-value">
                        {read.initial_speed_mph != null
                          ? `${read.initial_speed_mph.toFixed(1)} mph`
                          : '—'}
                      </div>
                      <div className="read-stat-label">Speed</div>
                    </div>
                    <div className="read-stat">
                      <div className="read-stat-value">
                        {read.plot_points_local?.length ?? 0}
                      </div>
                      <div className="read-stat-label">Path pts</div>
                    </div>
                  </div>
                )}
                {read && !read.success && (
                  <div className="read-source">solver offline, showing sample read</div>
                )}
              </div>
              <div className="screen-footer">
                <button className="btn-primary" onClick={() => navigate(`/hole-complete?hole=${holeNumber}`)}>
                  Putt Complete →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuttingGuidance;

