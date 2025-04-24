import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

// List of paths that don't require authentication
const publicPaths = ['/', '/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/profile'];

// Special paths that should be accessible without authentication but excluded from middleware handling
const specialPaths = ['/api', '/_next', '/static', '/favicon.ico'];

// Function to check if a path is a profile page
const isProfilePath = (path: string) => path === '/profile' || path.startsWith('/profile/');

/**
 * Middleware to verify authentication on protected routes
 * This runs before pages are rendered
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public, profile path, or special
  if (publicPaths.includes(pathname) || 
      isProfilePath(pathname) ||
      specialPaths.some(path => pathname.startsWith(path)) ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  try {
    // Create a Supabase client for the middleware
    const { supabase, response } = createClient(request);

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to sign in page if not authenticated
      const redirectUrl = new URL('/sign-in', request.url);
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If authenticated, proceed
    return response;
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    // In case of error, redirect to sign in
    const redirectUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  // Apply this middleware to all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
