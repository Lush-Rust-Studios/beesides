import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, display_name, userId } = await request.json();
  
  // Initialize Supabase client with server-side auth (has higher privileges)
  const supabase = createRouteHandlerClient({ cookies });

  // Create profile record
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      display_name: display_name || username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Server-side profile creation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile: data });
}
