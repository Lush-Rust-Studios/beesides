/**
 * Authentication utilities for the Beesides music rating platform
 * 
 * This file provides helper functions for user authentication using Supabase Auth.
 */

import { supabase } from './client';
import { Profile } from '@/types/database';
import { useAuthStore } from './session';

/**
 * Sign up a new user with email and password
 * Requires email verification before the account is active
 */
export async function signUp(email: string, password: string, username: string) {
  // Sign up without requiring email verification
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username,
      },
      // No email verification needed - emailRedirectTo removed
    }
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: 'Signup failed' };
  }
  
  // Create a profile record for the new user immediately
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    username,
    display_name: username,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    // If we failed to create the profile, we should log this
    console.error('Error creating profile:', profileError);
    return { error: profileError.message };
  }

  // Return success, no verification needed
  return { user: authData.user, message: 'Account created successfully' };
}

/**
 * Sign in a user with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Update the last_login timestamp
  if (data.user) {
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
      
    // Fetch the user's profile and update the auth store
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileData) {
      useAuthStore.getState().setProfile(profileData as Profile);
    }
    
    // Update session state in auth store
    useAuthStore.getState().setSession(data.session);
  }

  return { user: data.user };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { error: error.message };
  }
  
  // Clear session state in auth store
  useAuthStore.getState().clearSession();
  
  return { success: true };
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  // First check the auth store for the current user
  const storeUser = useAuthStore.getState().user;
  
  if (storeUser) {
    return storeUser;
  }
  
  // If not in store, check with Supabase
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return null;
  }
  
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


