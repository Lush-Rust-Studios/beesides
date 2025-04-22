import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  createApiHandler, 
  errorResponse, 
  requireAuth, 
  successResponse 
} from '../../utils';
import { ProfileWithFollows } from '@/types/database';

/**
 * GET: Fetch the current user's profile
 */
export const GET = createApiHandler(async (request: NextRequest) => {
  try {
    // Require authentication
    const user = await requireAuth(request);
    const supabase = createClient();
    
    // Get the user's profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      return errorResponse('Failed to fetch profile');
    }
    
    if (!profile) {
      return errorResponse('Profile not found', 404);
    }
    
    // Get follower and following counts
    const [followersResult, followingResult] = await Promise.all([
      supabase
        .from('follows')
        .select('count', { count: 'exact', head: true })
        .eq('following_id', user.id),
        
      supabase
        .from('follows')
        .select('count', { count: 'exact', head: true })
        .eq('follower_id', user.id)
    ]);
    
    const enrichedProfile: ProfileWithFollows = {
      ...profile,
      followers_count: followersResult.count || 0,
      following_count: followingResult.count || 0
    };
    
    return successResponse(enrichedProfile);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse('An unexpected error occurred');
  }
});

/**
 * PATCH: Update the current user's profile
 */
export const PATCH = createApiHandler(async (request: NextRequest) => {
  try {
    // Require authentication
    const user = await requireAuth(request);
    const supabase = createClient();
    
    // Parse the request body
    const body = await request.json();
    
    // Fields that are allowed to be updated
    const allowedFields = [
      'display_name',
      'bio',
      'website_url',
      'avatar_url'
    ];
    
    // Filter out any fields that are not allowed
    const updates = Object.entries(body).reduce((acc, [key, value]) => {
      if (allowedFields.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      return errorResponse(`Failed to update profile: ${error.message}`);
    }
    
    return successResponse(data, 'Profile updated successfully');
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse('An unexpected error occurred');
  }
});
