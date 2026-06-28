/**
 * ElevenLabs voice caddie (Phase D, W3).
 *
 * The replacement for the OpenAI WebRTC path (src/components/airealtime). It
 * opens a Conversational-AI session over a server-minted signed URL
 * (GET /api/elevenlabs/signed-url, so the API key never reaches the browser)
 * and registers a `solve_putt` client tool that forwards to the SAME backend
 * the putt-read screen uses, so screen and voice converge on one read.
 *
 * Lives at /caddie alongside the OpenAI routes (/golf, /aime) until it passes a
 * Switchboard /scenario; then those routes point here and /api/token +
 * /api/realtime are retired (and the OpenAI key rotated).
 */
import React, { useCallback, useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { solvePutt, formatAim, SolvePuttRequest } from '../../lib/puttSolver';
import './ElevenLabsCaddie.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

type ToolParams = Record<string, unknown>;

const num = (v: unknown, fallback = 0): number =>
  typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : fallback;

const ElevenLabsCaddie: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  // The agent calls this during conversation; we resolve the read off the same
  // backend contract the screen uses and hand back a spoken-ready sentence.
  const solvePuttTool = useCallback(async (params: ToolParams): Promise<string> => {
    const req: SolvePuttRequest = {
      course_id: String(params.course_id ?? 'riverside_country_club'),
      hole_id: num(params.hole_id, 1),
      ball_wgs84: { lat: num(params.ball_lat), lon: num(params.ball_lon) },
      cup_wgs84: { lat: num(params.cup_lat), lon: num(params.cup_lon) },
      stimp: num(params.stimp, 10.5),
    };
    const read = await solvePutt(req);
    if (!read.success || read.aim_line_deg == null || read.initial_speed_mph == null) {
      return `No read available: ${read.error ?? 'solver returned nothing'}.`;
    }
    return (
      read.instruction_text ??
      `Aim ${formatAim(read.aim_line_deg)}, hit it ${read.initial_speed_mph.toFixed(1)} miles per hour.`
    );
  }, []);

  const conversation = useConversation({
    clientTools: { solve_putt: solvePuttTool },
    onError: (message: string) => setError(message),
  });

  const { status, isSpeaking } = conversation;
  const connected = status === 'connected';

  const start = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/elevenlabs/signed-url`);
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`signed-url ${res.status}${body ? `: ${body}` : ''}`);
      }
      const { signed_url: signedUrl } = (await res.json()) as { signed_url?: string };
      if (!signedUrl) throw new Error('no signed_url returned');
      await conversation.startSession({ signedUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to start the caddie');
    }
  }, [conversation]);

  const stop = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch {
      /* best-effort */
    }
  }, [conversation]);

  return (
    <div className="caddie-screen">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="screen-content">
          <div className="caddie-label">CADDIE</div>

          <div className={`caddie-orb ${connected ? 'live' : ''} ${isSpeaking ? 'speaking' : ''}`}>
            <div className="caddie-orb-core"></div>
          </div>

          <div className="caddie-status">
            {status === 'connecting' && 'Connecting...'}
            {connected && (isSpeaking ? 'Caddie is talking' : 'Listening...')}
            {status === 'disconnected' && 'Tap to talk to your caddie'}
          </div>

          {error && <div className="caddie-error">{error}</div>}

          <div className="caddie-controls">
            {connected ? (
              <button className="btn-primary" onClick={stop}>
                End session
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={start}
                disabled={status === 'connecting'}
              >
                {status === 'connecting' ? 'Connecting...' : 'Talk to caddie'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevenLabsCaddie;
