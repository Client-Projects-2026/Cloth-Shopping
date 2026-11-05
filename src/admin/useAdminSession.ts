import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthStatus = 'loading' | 'guest' | 'authorized';

async function verifyMembership(userId: string): Promise<void> {
  if (!supabase) throw new Error('Connect Supabase before signing in.');
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error)
    throw new Error('Admin setup is incomplete. Check the database migration and membership.');
  if (!data) throw new Error('This account is not approved as a shop administrator.');
}

export function useAdminSession() {
  const [status, setStatus] = useState<AuthStatus>(supabase ? 'loading' : 'guest');
  const [userId, setUserId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sessionVersion = useRef(0);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const client = supabase;
    const { data: listener } = client.auth.onAuthStateChange((event) => {
      if (!active || event !== 'SIGNED_OUT') return;
      sessionVersion.current += 1;
      setUserId('');
      setStatus('guest');
    });
    async function restore() {
      const version = sessionVersion.current;
      const { data, error: authError } = await client.auth.getUser();
      if (!active || version !== sessionVersion.current) return;
      if (authError || !data.user) {
        setStatus('guest');
        if (authError) setError('Could not verify your session. Please sign in again.');
        return;
      }
      try {
        await verifyMembership(data.user.id);
        if (active && version === sessionVersion.current) {
          setUserId(data.user.id);
          setStatus('authorized');
        }
      } catch (reason) {
        if (active && version === sessionVersion.current) {
          setError(message(reason));
          setStatus('guest');
        }
      }
    }
    void restore();
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<boolean> {
    if (!supabase) return false;
    setBusy(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError || !data.user)
        throw new Error('Could not sign in. Check your email and password.');
      const version = sessionVersion.current;
      try {
        await verifyMembership(data.user.id);
      } catch (reason) {
        await supabase.auth.signOut();
        throw reason;
      }
      if (version !== sessionVersion.current)
        throw new Error('Your session changed. Sign in again.');
      setUserId(data.user.id);
      setStatus('authorized');
      return true;
    } catch (reason) {
      setError(message(reason));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function signOut(): Promise<boolean> {
    if (supabase) {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) {
        setError('Could not sign out. Please try again.');
        return false;
      }
    }
    setUserId('');
    setStatus('guest');
    setError('');
    return true;
  }

  return { status, userId, busy, error, clearError: () => setError(''), signIn, signOut };
}

function message(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'An unexpected sign-in error occurred.';
}
