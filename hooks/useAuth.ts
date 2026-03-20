'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { loadUserData } from '@/lib/sync';

export function useAuth() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async (user: any) => {
      if (!user) return;

      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // First login: Create profile and progress
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Rider',
          avatar_url: user.user_metadata?.avatar_url || ''
        });

        await supabase.from('progress').insert({
          user_id: user.id,
          xp: 0,
          level: 1,
          streak: 0,
          last_active: new Date().toISOString().split('T')[0]
        });
      }

      // Load all data into store
      await loadUserData(user);
    };

    // Check initial session
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await initializeUser(currentUser);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Safety timeout — force loading=false after 5s
    const timeout = setTimeout(() => setLoading(false), 5000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await initializeUser(currentUser);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [setUser]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
