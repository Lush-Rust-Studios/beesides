/**
 * Two-factor authentication utilities for the Beesides music rating platform
 * 
 * This file provides helper functions for managing two-factor authentication using Supabase Auth.
 */

import { supabase } from './client';

/**
 * Enable two-factor authentication for a user
 * Returns the secret and a QR code URL that can be used to set up an authenticator app
 */
export async function enableTwoFactor() {
  const { data, error } = await supabase.auth.mfa.enroll();
  
  if (error) {
    return { error: error.message };
  }
  
  return {
    factorId: data.id,
    secret: data.totp.secret,
    qrCode: data.totp.qr_code,
  };
}

/**
 * Verify a two-factor authentication code during enrollment
 */
export async function verifyTwoFactorEnrollment(factorId: string, code: string) {
  const { data, error } = await supabase.auth.mfa.challenge({ 
    factorId 
  });
  
  if (error) {
    return { error: error.message };
  }
  
  const challengeId = data.id;
  const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({ 
    factorId,
    challengeId, 
    code 
  });
  
  if (verifyError) {
    return { error: verifyError.message };
  }
  
  return { 
    success: true,
    verified: verifyData 
  };
}

/**
 * Disable two-factor authentication for a user
 */
export async function disableTwoFactor(factorId: string) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

/**
 * Get all factors for the current user
 */
export async function getTwoFactorFactors() {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  
  if (error) {
    return { error: error.message };
  }
  
  const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
  
  if (factorsError) {
    return { error: factorsError.message };
  }
  
  return { 
    currentLevel: data.currentLevel,
    nextLevel: data.nextLevel,
    currentFactor: factorsData.currentFactor,
    factors: factorsData.totp 
  };
}

/**
 * Verify a two-factor authentication code during sign in
 */
export async function verifyTwoFactorChallenge(factorId: string, challengeId: string, code: string) {
  const { data, error } = await supabase.auth.mfa.verify({ 
    factorId, 
    challengeId, 
    code 
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { 
    success: true,
    verified: data 
  };
}
