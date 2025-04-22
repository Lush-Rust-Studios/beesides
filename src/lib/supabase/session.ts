/**
 * Session management for Supabase authentication
 * 
 * This file provides utilities for handling user sessions throughout the application
 */

import { create } from 'zustand';
import { supabase } from './client';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Helpers
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  
  setSession: (session) => set({ 
    session, 
    isAuthenticated: !!session,
    user: session?.user || null
  }),
  
  setUser: (user) => set({ user }),
  
  setProfile: (profile) => set({ profile }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  clearSession: () => set({ 
    session: null, 
    user: null, 
    profile: null, 
    isAuthenticated: false 
  }),
}));

/**
 * Initialize the auth listener for session changes
 * Call this function in your app initialization (e.g., layout.tsx or a provider)
 */
export function initializeAuthListener() {
  // Set initial loading state
  useAuthStore.getState().setLoading(true);
  
  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.getState().setSession(session);
    
    if (session?.user) {
      // Fetch the user's profile
      fetchUserProfile(session.user.id);
    }
    
    useAuthStore.getState().setLoading(false);
  });
  
  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      useAuthStore.getState().setSession(session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        useAuthStore.getState().clearSession();
      }
    }
  );
  
  // Return unsubscribe function
  return () => subscription.unsubscribe();
}

/**
 * Fetch the user's profile data
 */
async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    useAuthStore.getState().setProfile(data as Profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}

/**
 * Get the current authentication status
 * Returns a boolean indicating if the user is authenticated
 */
export function isAuthenticated() {
  return useAuthStore.getState().isAuthenticated;
}

/**
 * Get the current user
 * Returns the user object or null if not authenticated
 */
export function getCurrentUser() {
  return useAuthStore.getState().user;
}

/**
 * Get the current user's profile
 * Returns the profile object or null if not authenticated
 */
export function getCurrentProfile() {
  return useAuthStore.getState().profile;
}
