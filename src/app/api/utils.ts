/**
 * Base API handler utilities for Beesides
 * 
 * This file contains shared utilities and types for API route handlers
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Standard API response format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error response helper
export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// Success response helper
export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message
  });
}

// Get authenticated user from request
export async function getAuthenticatedUser(request: NextRequest) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

// Check if user is authenticated
export async function requireAuth(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// API route handler wrapper with error handling
export function createApiHandler(
  handler: (req: NextRequest, user?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API error:', error);
      
      if (error instanceof Error) {
        // Handle known errors
        if (error.message === 'Unauthorized') {
          return errorResponse('Unauthorized access', 401);
        }
        
        return errorResponse(error.message);
      }
      
      // Handle unknown errors
      return errorResponse('An unexpected error occurred', 500);
    }
  };
}
