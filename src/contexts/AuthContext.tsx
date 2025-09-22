import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'> | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  hasRole: (...roles: string[]) => boolean;
  inDepartment: (...departments: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        const newUser = newSession?.user ?? null;
        setUser(newUser);
        if (newUser) {
          await loadOrCreateProfile(newUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await loadOrCreateProfile(currentUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadOrCreateProfile = async (currentUser: User) => {
    // Try to load profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (!error && data) {
      setProfile(data);
      return;
    }

    // If missing, attempt to create from user metadata
    const department: string = (currentUser.user_metadata?.department as string) || 'Operations';
    const role: string = (currentUser.user_metadata?.role as string) || 'Station Controller';
    const displayName: string | null = (currentUser.user_metadata?.display_name as string) || null;
    const avatarUrl: string | null = (currentUser.user_metadata?.avatar_url as string) || null;

    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: currentUser.id,
        department,
        role,
        display_name: displayName,
        avatar_url: avatarUrl,
      })
      .select()
      .single();

    if (!insertError) {
      setProfile(created as Tables<'profiles'>);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const hasRole = (...roles: string[]) => {
    if (!profile?.role) return false;
    return roles.map(r => r.toLowerCase()).includes(profile.role.toLowerCase());
  };

  const inDepartment = (...departments: string[]) => {
    if (!profile?.department) return false;
    return departments.map(d => d.toLowerCase()).includes(profile.department.toLowerCase());
  };

  const value = {
    user,
    session,
    loading,
    profile,
    signIn,
    signUp,
    signOut,
    hasRole,
    inDepartment,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};