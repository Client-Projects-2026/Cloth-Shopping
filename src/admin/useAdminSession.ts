import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const client = supabase;
    async function restore() {
      const { data, error: authError } = await client.auth.getUser();
      if (!active) return;
      if (authError || !data.user) {
        setStatus('guest');
        if (authError) setError('Could not verify your session. Please sign in again.');
        return;
      }
      try {
        await verifyMembership(data.user.id);
        if (active) {
          setUserId(data.user.id);
          setStatus('authorized');
        }
      } catch (reason) {
        if (active) {
          setError(message(reason));
          setStatus('guest');
        }
      }
    }
    void restore();
    return () => {
      active = false;
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
      try {
        await verifyMembership(data.user.id);
      } catch (reason) {
        await supabase.auth.signOut();
        throw reason;
      }
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

  async function signOut() {
    await supabase?.auth.signOut();
    setUserId('');
    setStatus('guest');
  }

  return { status, userId, busy, error, clearError: () => setError(''), signIn, signOut };
}

function message(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'An unexpected sign-in error occurred.';
}
