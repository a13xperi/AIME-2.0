import { formatAim, solvePutt, solvePuttLocal, SolvePuttRequest } from './puttSolver';

describe('formatAim', () => {
  it('reads zero as straight', () => {
    expect(formatAim(0)).toBe('straight at the cup');
  });
  it('reads a negative angle as left', () => {
    expect(formatAim(-2.5)).toBe('2.5° left');
  });
  it('reads a positive angle as right (one decimal)', () => {
    expect(formatAim(3)).toBe('3.0° right');
  });
});

const req: SolvePuttRequest = {
  course_id: 'riverside_country_club',
  hole_id: 1,
  ball_wgs84: { lat: 0, lon: 0 },
  cup_wgs84: { lat: 0, lon: 0 },
  stimp: 10.5,
};

describe('solvePutt (failure normalization)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the parsed body on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, aim_line_deg: -2.5, initial_speed_mph: 4.4 }),
    }) as unknown as typeof fetch;
    const r = await solvePutt(req);
    expect(r.success).toBe(true);
    expect(r.aim_line_deg).toBe(-2.5);
  });

  it('normalizes a non-2xx into { success:false, error }', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      text: async () => 'upstream boom',
    }) as unknown as typeof fetch;
    const r = await solvePutt(req);
    expect(r.success).toBe(false);
    expect(r.error).toContain('502');
  });

  it('normalizes a thrown/network error into { success:false, error }', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;
    const r = await solvePutt(req);
    expect(r.success).toBe(false);
    expect(r.error).toContain('network down');
  });
});

describe('solvePuttLocal (failure normalization)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the parsed body on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, plot_points_local: [{ x: 0, y: 0 }] }),
    }) as unknown as typeof fetch;
    const r = await solvePuttLocal({
      dtm_id: 'riverside_2023_20cm',
      ball_local_m: { x: 0, y: 0 },
      cup_local_m: { x: 1.1, y: 3.5 },
      stimp: 10.5,
    });
    expect(r.success).toBe(true);
    expect(r.plot_points_local).toHaveLength(1);
  });

  it('normalizes a thrown error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('boom')) as unknown as typeof fetch;
    const r = await solvePuttLocal({
      dtm_id: 'x',
      ball_local_m: { x: 0, y: 0 },
      cup_local_m: { x: 0, y: 0 },
      stimp: 10,
    });
    expect(r.success).toBe(false);
    expect(r.error).toContain('boom');
  });
});
