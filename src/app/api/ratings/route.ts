import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createApiHandler, errorResponse, requireAuth, successResponse } from '../../../utils';

/**
 * POST: Add or update a rating for a release by the current user
 */
export const POST = createApiHandler(async (request: NextRequest) => {
  // Require authentication
  const user = await requireAuth(request);
  const supabase = createClient();
  
  try {
    // Parse request body
    const body = await request.json();
    const { releaseId, score } = body;
    
    // Validate request
    if (!releaseId) {
      return errorResponse('Release ID is required', 400);
    }
    
    if (typeof score !== 'number' || score < 0 || score > 10) {
      return errorResponse('Score must be a number between 0 and 10', 400);
    }
    
    // Check if release exists
    const { data: release, error: releaseError } = await supabase
      .from('releases')
      .select('id')
      .eq('id', releaseId)
      .single();
    
    if (releaseError || !release) {
      return errorResponse('Release not found', 404);
    }
    
    // Check if user already has a rating for this release
    const { data: existingRating, error: ratingError } = await supabase
      .from('ratings')
      .select('id, score')
      .eq('user_id', user.id)
      .eq('release_id', releaseId)
      .maybeSingle();
    
    // If rating exists, update it, otherwise create a new one
    const now = new Date().toISOString();
    let result;
    
    if (existingRating) {
      // Update existing rating
      result = await supabase
        .from('ratings')
        .update({
          score,
          updated_at: now
        })
        .eq('id', existingRating.id)
        .select()
        .single();
    } else {
      // Create new rating
      result = await supabase
        .from('ratings')
        .insert({
          user_id: user.id,
          release_id: releaseId,
          score,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
    }
    
    if (result.error) {
      return errorResponse(`Failed to save rating: ${result.error.message}`);
    }
    
    // Get updated rating stats for this release
    const { data: ratingsData, error: statsError } = await supabase
      .from('ratings')
      .select('score', { count: 'exact' })
      .eq('release_id', releaseId);
    
    const ratingsCount = ratingsData?.length || 0;
    const averageRating = ratingsCount > 0
      ? ratingsData.reduce((sum, rating) => sum + rating.score, 0) / ratingsCount
      : 0;
    
    return successResponse({
      ...result.data,
      isNew: !existingRating,
      releaseStats: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingsCount
      }
    }, existingRating ? 'Rating updated' : 'Rating added');
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse('An unexpected error occurred');
  }
});

/**
 * DELETE: Remove a rating from a release
 */
export const DELETE = createApiHandler(async (request: NextRequest) => {
  // Require authentication
  const user = await requireAuth(request);
  const supabase = createClient();
  
  // Get the release ID from the URL
  const { searchParams } = new URL(request.url);
  const releaseId = searchParams.get('releaseId');
  
  if (!releaseId) {
    return errorResponse('Release ID is required', 400);
  }
  
  // Delete the rating
  const { error } = await supabase
    .from('ratings')
    .delete()
    .eq('user_id', user.id)
    .eq('release_id', releaseId);
  
  if (error) {
    return errorResponse(`Failed to delete rating: ${error.message}`);
  }
  
  return successResponse(null, 'Rating removed successfully');
});
