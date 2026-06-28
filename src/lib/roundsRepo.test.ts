import { createRound, recordShot, upsertRoundHole, finishRound, resolveProfileId, recordPuttRead } from './roundsRepo';
import type { Round } from '../types/round';

// With no REACT_APP_SUPABASE_* env (the case in the test runner), getSupabase()
// returns null, so every repo function must no-op safely: the app keeps running
// on local state and nothing throws. This locks that contract.
describe('roundsRepo when Supabase is unconfigured', () => {
  it('resolveProfileId returns null', async () => {
    await expect(resolveProfileId()).resolves.toBeNull();
  });

  it('createRound returns null without throwing', async () => {
    await expect(createRound({} as Round)).resolves.toBeNull();
  });

  it('recordShot resolves (no-op) without throwing', async () => {
    await expect(
      recordShot('round-1', {
        id: 's1',
        holeNumber: 1,
        shotNumber: 1,
        club: '7 Iron',
        distance: 162,
        condition: 'Fairway',
        result: 'Good',
        timestamp: '2026-06-28T00:00:00.000Z',
      })
    ).resolves.toBeUndefined();
  });

  it('upsertRoundHole resolves (no-op) without throwing', async () => {
    await expect(
      upsertRoundHole('round-1', {
        number: 1,
        par: 4,
        score: 4,
        stats: { fairwayHit: true, greenInRegulation: true, putts: 2, penalties: 0 },
      })
    ).resolves.toBeUndefined();
  });

  it('finishRound resolves (no-op) without throwing', async () => {
    await expect(finishRound('round-1', '2026-06-28T00:00:00.000Z')).resolves.toBeUndefined();
  });

  it('recordPuttRead resolves (no-op) without throwing', async () => {
    await expect(
      recordPuttRead({
        ball: { lat: 0, lon: 0 },
        cup: { lat: 0, lon: 0 },
        stimp: 10.5,
      })
    ).resolves.toBeUndefined();
  });
});
