/**
 * Supabase client for middleware
 * This provides a client for the middleware with proper cookie handling
 */
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function createClient(request: NextRequest) {
  // Create a cookies instance
  const cookieStore = cookies();
  
  // Create a new response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create the Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, any>) {
          cookieStore.set({ name, value, ...options });
          response.cookies.set({ 
            name, 
            value, 
            ...options 
          });
        },
        remove(name: string, options: Record<string, any>) {
          cookieStore.set({ name, value: '', ...options });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}
