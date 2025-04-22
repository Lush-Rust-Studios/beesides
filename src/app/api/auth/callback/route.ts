import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handle OAuth callback redirects
 * This endpoint handles the callback from third-party authentication providers
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/auth/error`);
    }

    // Successfully authenticated
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error('Unexpected error during auth callback:', error);
    return NextResponse.redirect(`${origin}/auth/error`);
  }
}
