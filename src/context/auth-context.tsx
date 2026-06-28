import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map a Supabase auth user onto the app's lightweight User shape. */
function toUser(u: SupabaseUser): User {
  const meta = (u.user_metadata ?? {}) as { name?: string };
  const isAnon = (u as { is_anonymous?: boolean }).is_anonymous === true;
  return {
    id: u.id,
    name: meta.name ?? (isAnon ? 'Guest' : u.email ?? 'Golfer'),
    email: u.email ?? '',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Establish a session on mount. Anonymous-first: if Supabase is configured
  // and there is no session, sign in anonymously so RLS-keyed persistence works
  // immediately (auth.uid() exists). Upgrading to an email keeps the same uid
  // (see signup). If Supabase is not configured, the app runs signed-out.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const sync = (su: SupabaseUser | null | undefined) => {
      if (mounted) setUser(su ? toUser(su) : null);
    };

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          sync(data.session.user);
        } else {
          const { data: anon, error: anonError } =
            await supabase.auth.signInAnonymously();
          if (anonError) {
            // Anonymous sign-ins must be enabled in the Supabase dashboard.
            console.warn('[auth] anonymous sign-in failed:', anonError.message);
          }
          sync(anon?.user ?? null);
        }
      } catch (e) {
        console.warn('[auth] session bootstrap failed:', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => sync(session?.user)
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      setError('Sign-in is not configured yet.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      // onAuthStateChange updates `user`.
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create an account. If the current session is anonymous, UPGRADE it in place
  // (same uid => the rounds already saved stay with this user); otherwise sign
  // up fresh.
  const signup = async (name: string, email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      setError('Sign-up is not configured yet.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getUser();
      const current = data.user;
      if (current && (current as { is_anonymous?: boolean }).is_anonymous) {
        const { error: upgradeError } = await supabase.auth.updateUser({
          email,
          password,
          data: { name },
        });
        if (upgradeError) throw upgradeError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (signUpError) throw signUpError;
      }
      // onAuthStateChange updates `user`.
    } catch (err) {
      setError('Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const supabase = getSupabase();
    if (supabase) {
      void supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
