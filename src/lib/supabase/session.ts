/**
 * Session management for Supabase authentication
 * 
 * This file provides utilities for handling user sessions throughout the application
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware'; // Import devtools
import { supabase } from './client';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';
import { createLogger } from '@/lib/utils/logger';

// Create a dedicated logger for auth/session operations
const logger = createLogger('auth:session');

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

export const useAuthStore = create<AuthState>()(
  devtools( // Wrap the store definition with devtools
    (set) => ({
      session: null,
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
      
      setSession: (session) => set({ 
        session, 
        isAuthenticated: !!session,
        user: session?.user || null
      }, false, 'setSession'), // Add action name for devtools
      
      setUser: (user) => set({ user }, false, 'setUser'), // Add action name
      
      setProfile: (profile) => set({ profile }, false, 'setProfile'), // Add action name
      
      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'), // Add action name
      
      clearSession: () => set({ 
        session: null, 
        user: null, 
        profile: null, 
        isAuthenticated: false 
      }, false, 'clearSession'), // Add action name
    }),
    { name: 'AuthStore' } // Optional: Name for the store in devtools
  )
);

/**
 * Initialize the auth listener for session changes
 * Call this function in your app initialization (e.g., layout.tsx or a provider)
 */
export function initializeAuthListener() {
  // Set initial loading state
  useAuthStore.getState().setLoading(true);
  logger.info('Initializing auth listener');
  
  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.getState().setSession(session);
    
    if (session?.user) {
      // Fetch the user's profile
      logger.info('Found existing session', { userId: session.user.id, email: session.user.email });
      fetchUserProfile(session.user.id);
    } else {
      logger.info('No active session found');
    }
    
    useAuthStore.getState().setLoading(false);
  });
  
  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      logger.info('Auth state changed', { event, userId: session?.user?.id });
      useAuthStore.getState().setSession(session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        logger.info('User signed in', { 
          userId: session.user.id, 
          email: session.user.email,
          authProvider: session.user.app_metadata.provider || 'email'
        });
        fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        logger.info('User signed out');
        useAuthStore.getState().clearSession();
      } else if (event === 'USER_UPDATED' && session?.user) {
        logger.info('User data updated', { userId: session.user.id });
        fetchUserProfile(session.user.id);
      } else if (event === 'TOKEN_REFRESHED') {
        logger.info('Session token refreshed', { userId: session?.user?.id });
      }
    }
  );
  
  // Return unsubscribe function
  return () => {
    logger.debug('Unsubscribing from auth state changes');
    subscription.unsubscribe();
  };
}

/**
 * Fetch the user's profile data
 */
async function fetchUserProfile(userId: string) {
  try {
    logger.debug('Fetching user profile', { userId });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      logger.error('Error fetching profile', { userId, error: error.message });
      return;
    }
    
    if (data) {
      logger.debug('User profile fetched successfully', { 
        userId, 
        username: data.username,
        lastLogin: data.last_login
      });
      useAuthStore.getState().setProfile(data as Profile);
    } else {
      logger.warn('No profile found for user', { userId });
    }
  } catch (error) {
    logger.error('Exception fetching profile', { userId, error });
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
