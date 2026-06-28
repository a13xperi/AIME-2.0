/**
 * Putt-solver client.
 *
 * Talks to the AIme backend `POST /api/solve_putt` (FastAPI, default :8000),
 * which transforms WGS84 -> green-local and calls the PuttSolver engine on
 * :8081. This is the same tool contract the voice caddie uses
 * (src/components/airealtime), so the screen and the voice read converge on one
 * source. See contracts/schemas/tool.solve_putt.*.schema.json and
 * docs/INFRA-PHASE-D.md.
 */

export interface PointWGS84 {
  lat: number;
  lon: number;
}

export interface PointLocalM {
  x: number;
  y: number;
}

export interface SolvePuttRequest {
  course_id: string;
  hole_id: number;
  ball_wgs84: PointWGS84;
  cup_wgs84: PointWGS84;
  /** Green stimp meter reading (0-20). */
  stimp: number;
}

export interface SolvePuttResponse {
  success: boolean;
  instruction_text?: string | null;
  aim_line_deg?: number | null;
  initial_speed_mph?: number | null;
  plot_points_local?: PointLocalM[] | null;
  error?: string | null;
}

const PUTT_API_BASE =
  process.env.REACT_APP_PUTT_API_URL || 'http://localhost:8000';

const PUTT_SOLVER_BASE =
  process.env.REACT_APP_PUTT_SOLVER_URL || 'http://localhost:8081';

/** Green-local request shape the PuttSolver engine takes directly (no GPS). */
export interface SolvePuttLocalRequest {
  dtm_id: string;
  ball_local_m: PointLocalM;
  cup_local_m: PointLocalM;
  stimp: number;
  request_id?: string;
}

/**
 * Solve a putt and return the read. Network / non-2xx failures are normalised
 * into a `{ success: false, error }` response so callers can render a single
 * fallback path instead of try/catch.
 */
export async function solvePutt(
  req: SolvePuttRequest,
  opts: { signal?: AbortSignal } = {}
): Promise<SolvePuttResponse> {
  try {
    const res = await fetch(`${PUTT_API_BASE}/api/solve_putt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: opts.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        success: false,
        error: `solver ${res.status}${text ? `: ${text}` : ''}`,
      };
    }

    return (await res.json()) as SolvePuttResponse;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'solver unreachable',
    };
  }
}

/**
 * Solve a putt straight against the PuttSolver engine using green-local
 * coordinates. Used by the putt-read screen until on-device GPS / the RTK puck
 * supplies WGS84 (at which point the screen moves to `solvePutt`, the path the
 * voice caddie already uses). Same failure normalisation as `solvePutt`.
 */
export async function solvePuttLocal(
  req: SolvePuttLocalRequest,
  opts: { signal?: AbortSignal } = {}
): Promise<SolvePuttResponse> {
  try {
    const res = await fetch(`${PUTT_SOLVER_BASE}/solve_putt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: opts.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        success: false,
        error: `solver ${res.status}${text ? `: ${text}` : ''}`,
      };
    }

    return (await res.json()) as SolvePuttResponse;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'solver unreachable',
    };
  }
}

/** Format the aim angle the way the read card shows it (e.g. "2.5° left"). */
export function formatAim(aimLineDeg: number): string {
  const mag = Math.abs(aimLineDeg).toFixed(1);
  if (aimLineDeg === 0) return 'straight at the cup';
  return `${mag}° ${aimLineDeg < 0 ? 'left' : 'right'}`;
}
