/**
 * Authentication utilities for the Beesides music rating platform
 * 
 * This file provides helper functions for user authentication using Supabase Auth.
 */

import { supabase } from './client';
import { Profile } from '@/types/database';
import { useAuthStore } from './session';
import { createLogger } from '@/lib/utils/logger';

// Create a dedicated logger for auth operations
const logger = createLogger('auth:operations');

/**
 * Sign up a new user with email and password
 * No email verification required - user is automatically signed in
 */
export async function signUp(email: string, password: string, username: string) {
  logger.info('User signup attempt', { email, username });
  
  // Sign up without email verification
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username,
      },
      emailRedirectTo: undefined,
    }
  });

  if (authError) {
    logger.error('Signup failed', { email, error: authError.message });
    return { error: authError.message };
  }

  if (!authData.user) {
    logger.error('Signup failed - no user returned', { email });
    return { error: 'Signup failed' };
  }
  
  logger.info('User signup successful', { 
    userId: authData.user.id,
    email: authData.user.email
  });
  
  // Create a profile record for the new user using server-side API
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: authData.user.id,
        username,
        display_name: username,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating profile:', errorData);
      return { error: errorData.error || 'Failed to create user profile' };
    }
  } catch (error) {
    console.error('Error creating profile:', error);
    return { error: 'Failed to create user profile' };
  }

  // Set session in auth store to ensure user is logged in immediately
  if (authData.session) {
    useAuthStore.getState().setSession(authData.session);
    useAuthStore.getState().setUser(authData.user);
    
    // Try to fetch the profile and update the auth store
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
      
    if (profileData) {
      useAuthStore.getState().setProfile(profileData as Profile);
    }
  }

  // Return success, user is automatically signed in
  return { user: authData.user };
}

/**
 * Sign in a user with email and password
 */
export async function signIn(email: string, password: string) {
  logger.info('User login attempt', { email });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    logger.error('Login failed', { email, error: error.message });
    return { error: error.message };
  }

  // Update the last_login timestamp
  if (data.user) {
    logger.info('User login successful', { 
      userId: data.user.id,
      email: data.user.email,
    });
    
    const timestamp = new Date().toISOString();
    logger.debug('Updating last login timestamp', { userId: data.user.id, timestamp });
    
    await supabase
      .from('profiles')
      .update({ last_login: timestamp })
      .eq('id', data.user.id);
      
    // Update auth store with session data
    if (data.session) {
      useAuthStore.getState().setSession(data.session);
      useAuthStore.getState().setUser(data.user);
      
      // Fetch and set the user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileData) {
        useAuthStore.getState().setProfile(profileData as Profile);
      }
    }
  }
  
  return { user: data.user };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const user = useAuthStore.getState().user;
  const userId = user?.id;
  
  if (userId) {
    logger.info('User signing out', { userId, email: user?.email });
  } else {
    logger.info('Sign out attempted with no active user');
  }
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    logger.error('Sign out failed', { userId, error: error.message });
    return { error: error.message };
  }
  
  // Clear session state in auth store
  useAuthStore.getState().clearSession();
  
  logger.info('User signed out successfully', { userId });
  return { success: true };
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  // First check the auth store for the current user
  const storeUser = useAuthStore.getState().user;
  
  if (storeUser) {
    logger.debug('Current user found in store', { userId: storeUser.id });
    return storeUser;
  }
  
  logger.debug('Checking with Supabase for current user');
  
  // If not in store, check with Supabase
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    logger.error('Error fetching current user', { error: error.message });
    return null;
  }
  
  if (!data.user) {
    logger.debug('No authenticated user found');
    return null;
  }
  
  logger.info('User authenticated via session', { 
    userId: data.user.id, 
    email: data.user.email 
  });
  
  // Update the auth store
  useAuthStore.getState().setUser(data.user);
  
  return data.user;
}

/**
 * Get the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  // First check the auth store for the current profile
  const storeProfile = useAuthStore.getState().profile;
  
  if (storeProfile) {
    return storeProfile;
  }
  
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  // Update the auth store with the profile
  useAuthStore.getState().setProfile(data as Profile);
  
  return data as Profile;
}

/**
 * Verify a user's email with a verification code
 * This function should be called after the user receives the verification code
 * and creates an entry in the profiles table
 */
export async function verifyEmail(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: 'Verification failed' };
  }

  // After successful verification, check if a profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  // If profile doesn't exist yet, create it
  if (!existingProfile) {
    // Try to get username from metadata, or generate from email
    let username = email.split('@')[0];
    let displayName = username;
    
    // Check if metadata contains username/display_name
    if (data.user.user_metadata && data.user.user_metadata.username) {
      username = data.user.user_metadata.username;
    }
    
    if (data.user.user_metadata && data.user.user_metadata.display_name) {
      displayName = data.user.user_metadata.display_name;
    }
    
    // Insert the profile record
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username,
      display_name: displayName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error('Error creating profile after verification:', profileError);
      return { error: profileError.message };
    }
  }

  return { success: true };
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

/**
 * Update the user's password
 */
export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

/**
 * Sign in with a third-party provider
 */
export async function signInWithProvider(provider: 'google' | 'apple' | 'facebook' | 'twitter') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { url: data.url };
}


