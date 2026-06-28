/**
 * Rounds repository (Phase D persistence).
 *
 * Maps the in-memory RoundContext model (src/types/round.ts) onto the Supabase
 * schema (supabase/migrations/0001_aime_core.sql). Every function is null-safe:
 * if Supabase is not configured or the user is not signed in, it no-ops and the
 * app keeps running on local state. RoundContext fires these alongside its
 * setState calls, so persistence is purely additive.
 *
 * Runtime go-live still needs: the aime-golf project restored, env set, and an
 * authenticated user (RLS in 0002 keys every row to auth.uid()).
 */
import { getSupabase } from './supabase';
import { Course, Hole, Round, Shot } from '../types/round';

function warn(scope: string, error: unknown): void {
  // Persistence is best-effort; never throw into the UI.
  // eslint-disable-next-line no-console
  console.warn(`[roundsRepo] ${scope}:`, error);
}

/** Current auth user id, ensuring a profiles row exists. Null if signed out. */
export async function resolveProfileId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return null;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id }, { onConflict: 'id' });
    if (error) warn('ensure profile', error);
    return user.id;
  } catch (e) {
    warn('resolveProfileId', e);
    return null;
  }
}

/** Upsert the course by its upstream id and return the DB uuid (or null). */
async function ensureCourse(course: Course): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('courses')
      .upsert(
        {
          external_ref: course.id,
          name: course.name,
          location: course.location ?? null,
          total_par: course.totalPar ?? null,
          total_yards: course.totalYards ?? null,
        },
        { onConflict: 'external_ref' }
      )
      .select('id')
      .single();
    if (error) {
      warn('ensureCourse', error);
      return null;
    }
    return data.id;
  } catch (e) {
    warn('ensureCourse', e);
    return null;
  }
}

/**
 * Persist a freshly started round (+ its course and the seeded holes) and
 * return the DB round id. Callers hold onto this id for shot / hole / finish
 * writes. Null when persistence is unavailable.
 */
export async function createRound(round: Round): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const profileId = await resolveProfileId();
  if (!profileId) return null;
  try {
    const courseId = await ensureCourse(round.course);
    const { data, error } = await supabase
      .from('rounds')
      .insert({
        profile_id: profileId,
        course_id: courseId,
        format: round.settings.format,
        gps_enabled: round.settings.gpsEnabled,
        puck_enabled: round.settings.puckEnabled,
        auto_track_shots: round.settings.autoTrackShots ?? false,
        start_time: round.startTime,
        current_hole: round.currentHole,
        status: 'in_progress',
      })
      .select('id')
      .single();
    if (error || !data) {
      warn('createRound', error);
      return null;
    }
    const roundId = data.id;

    if (round.holes.length) {
      const { error: holesError } = await supabase.from('round_holes').insert(
        round.holes.map((h) => ({
          round_id: roundId,
          number: h.number,
          par: h.par,
          score: h.score ?? null,
          fairway_hit: h.stats.fairwayHit,
          green_in_regulation: h.stats.greenInRegulation,
          putts: h.stats.putts,
          penalties: h.stats.penalties,
        }))
      );
      if (holesError) warn('seed round_holes', holesError);
    }
    return roundId;
  } catch (e) {
    warn('createRound', e);
    return null;
  }
}

/** Append a tracked shot to a persisted round. */
export async function recordShot(roundId: string, shot: Shot): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('shots').insert({
      round_id: roundId,
      hole_number: shot.holeNumber,
      shot_number: shot.shotNumber,
      club: shot.club,
      distance: shot.distance,
      condition: shot.condition,
      result: shot.result,
      gps_lat: shot.gps?.lat ?? null,
      gps_lon: shot.gps?.lon ?? null,
      carry: shot.carry ?? null,
      total: shot.total ?? null,
      remaining: shot.remaining ?? null,
      taken_at: shot.timestamp,
    });
    if (error) warn('recordShot', error);
  } catch (e) {
    warn('recordShot', e);
  }
}

/** Upsert a played hole's score + stats on (round_id, number). */
export async function upsertRoundHole(
  roundId: string,
  hole: Pick<Hole, 'number' | 'par' | 'score' | 'stats'>
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('round_holes').upsert(
      {
        round_id: roundId,
        number: hole.number,
        par: hole.par,
        score: hole.score ?? null,
        fairway_hit: hole.stats.fairwayHit,
        green_in_regulation: hole.stats.greenInRegulation,
        putts: hole.stats.putts,
        penalties: hole.stats.penalties,
      },
      { onConflict: 'round_id,number' }
    );
    if (error) warn('upsertRoundHole', error);
  } catch (e) {
    warn('upsertRoundHole', e);
  }
}

/** Mark a round complete with an end time. */
export async function finishRound(
  roundId: string,
  endTime: string
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('rounds')
      .update({ end_time: endTime, status: 'complete' })
      .eq('id', roundId);
    if (error) warn('finishRound', error);
  } catch (e) {
    warn('finishRound', e);
  }
}

export interface PuttReadRecord {
  roundId?: string | null;
  roundHoleId?: string | null;
  ball: { lat: number; lon: number };
  cup: { lat: number; lon: number };
  stimp: number;
  aimLineDeg?: number | null;
  initialSpeedMph?: number | null;
  instructionText?: string | null;
  plotPoints?: { x: number; y: number }[] | null;
  solverRequestId?: string | null;
}

/** Log a putt-solver read (ties the signature screen to persistence). */
export async function recordPuttRead(read: PuttReadRecord): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('putt_reads').insert({
      round_id: read.roundId ?? null,
      round_hole_id: read.roundHoleId ?? null,
      ball_lat: read.ball.lat,
      ball_lon: read.ball.lon,
      cup_lat: read.cup.lat,
      cup_lon: read.cup.lon,
      stimp: read.stimp,
      aim_line_deg: read.aimLineDeg ?? null,
      initial_speed_mph: read.initialSpeedMph ?? null,
      instruction_text: read.instructionText ?? null,
      plot_points: read.plotPoints ?? null,
      solver_request_id: read.solverRequestId ?? null,
    });
    if (error) warn('recordPuttRead', error);
  } catch (e) {
    warn('recordPuttRead', e);
  }
}
