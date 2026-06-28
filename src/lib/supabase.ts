/**
 * Supabase client (Phase D persistence).
 *
 * Replaces the in-memory RoundContext / Notion store. The client is created
 * lazily and is null until REACT_APP_SUPABASE_URL + REACT_APP_SUPABASE_ANON_KEY
 * are set, so the app runs fine before the backend is wired (every caller must
 * null-check via `getSupabase()` / `isSupabaseConfigured`). Schema:
 * supabase/migrations/0001_aime_core.sql; plan: docs/INFRA-PHASE-D.md.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export type AimeClient = SupabaseClient<Database>;

let client: AimeClient | null = null;

/**
 * Returns the shared Supabase client, or null when env is not configured.
 * Callers persist when this is non-null and otherwise fall back to local state,
 * so persistence can land incrementally without breaking the app.
 */
export function getSupabase(): AimeClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient<Database>(
      SUPABASE_URL as string,
      SUPABASE_ANON_KEY as string,
      { auth: { persistSession: true, autoRefreshToken: true } }
    );
  }
  return client;
}
