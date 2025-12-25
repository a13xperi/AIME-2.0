import React, { useState } from 'react';

interface PlotPoint {
  x: number;
  y: number;
  t: number;
}
interface SolvePuttResult {
  success: boolean;
  instruction_text?: string | null;
  aim_line_deg?: number | null;
  initial_speed_mph?: number | null;
  plot_points_local: PlotPoint[];
  error?: string | null;
}

const PuttSolverDemo: React.FC = () => {
  const [courseId, setCourseId] = useState('riverside_country_club');
  const [holeId, setHoleId] = useState(1);
  const [ballLat, setBallLat] = useState(37.774929);
  const [ballLon, setBallLon] = useState(-122.419416);
  const [cupLat, setCupLat] = useState(37.77485);
  const [cupLon, setCupLon] = useState(-122.4193);
  const [stimp, setStimp] = useState(10.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolvePuttResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch('/api/solve_putt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          hole_id: holeId,
          ball_wgs84: { lat: ballLat, lon: ballLon },
          cup_wgs84: { lat: cupLat, lon: cupLon },
          stimp,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || resp.statusText);
      setResult(data);
    } catch (err: any) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>AIME PuttSolver Demo</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <label>
          Course ID
          <input value={courseId} onChange={e => setCourseId(e.target.value)} />
        </label>
        <label>
          Hole ID
          <input type="number" value={holeId} onChange={e => setHoleId(Number(e.target.value))} />
        </label>
        <label>
          Ball Lat
          <input
            type="number"
            step="any"
            value={ballLat}
            onChange={e => setBallLat(Number(e.target.value))}
          />
        </label>
        <label>
          Ball Lon
          <input
            type="number"
            step="any"
            value={ballLon}
            onChange={e => setBallLon(Number(e.target.value))}
          />
        </label>
        <label>
          Cup Lat
          <input
            type="number"
            step="any"
            value={cupLat}
            onChange={e => setCupLat(Number(e.target.value))}
          />
        </label>
        <label>
          Cup Lon
          <input
            type="number"
            step="any"
            value={cupLon}
            onChange={e => setCupLon(Number(e.target.value))}
          />
        </label>
        <label>
          Stimp
          <input
            type="number"
            step="0.1"
            value={stimp}
            onChange={e => setStimp(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Solving…' : 'Solve putt'}
        </button>
      </form>

      {error && <pre style={{ color: 'crimson' }}>{error}</pre>}
      {result && (
        <pre style={{ background: '#111', color: '#0f0', padding: 12, overflowX: 'auto' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default PuttSolverDemo;
