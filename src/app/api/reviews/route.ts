import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createApiHandler, errorResponse, requireAuth, successResponse } from '../../../utils';

/**
 * POST: Create or update a review for a release by the current user
 */
export const POST = createApiHandler(async (request: NextRequest) => {
  // Require authentication
  const user = await requireAuth(request);
  const supabase = createClient();
  
  try {
    // Parse request body
    const body = await request.json();
    const { releaseId, title, content, ratingId = null, isPublished = true } = body;
    
    // Validate request
    if (!releaseId) {
      return errorResponse('Release ID is required', 400);
    }
    
    if (!content || content.trim().length < 10) {
      return errorResponse('Review content must be at least 10 characters', 400);
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
    
    // Check if rating exists (if provided)
    if (ratingId) {
      const { data: rating, error: ratingError } = await supabase
        .from('ratings')
        .select('id')
        .eq('id', ratingId)
        .eq('user_id', user.id)
        .single();
      
      if (ratingError || !rating) {
        return errorResponse('Rating not found', 404);
      }
    }
    
    // Check if user already has a review for this release
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('release_id', releaseId)
      .maybeSingle();
    
    // If review exists, update it, otherwise create a new one
    const now = new Date().toISOString();
    let result;
    
    if (existingReview) {
      // Update existing review
      result = await supabase
        .from('reviews')
        .update({
          title,
          content,
          rating_id: ratingId,
          is_published: isPublished,
          updated_at: now
        })
        .eq('id', existingReview.id)
        .select()
        .single();
    } else {
      // Create new review
      result = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          release_id: releaseId,
          title,
          content,
          rating_id: ratingId,
          is_published: isPublished,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
    }
    
    if (result.error) {
      return errorResponse(`Failed to save review: ${result.error.message}`);
    }
    
    return successResponse(result.data, existingReview ? 'Review updated' : 'Review added');
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse('An unexpected error occurred');
  }
});

/**
 * DELETE: Remove a review from a release
 */
export const DELETE = createApiHandler(async (request: NextRequest) => {
  // Require authentication
  const user = await requireAuth(request);
  const supabase = createClient();
  
  // Get the review ID from the URL
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get('id');
  
  if (!reviewId) {
    return errorResponse('Review ID is required', 400);
  }
  
  // Check if the review belongs to the user
  const { data: review, error: findError } = await supabase
    .from('reviews')
    .select('id')
    .eq('id', reviewId)
    .eq('user_id', user.id)
    .single();
  
  if (findError || !review) {
    return errorResponse('Review not found or you do not have permission to delete it', 404);
  }
  
  // Delete the review
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);
  
  if (error) {
    return errorResponse(`Failed to delete review: ${error.message}`);
  }
  
  return successResponse(null, 'Review removed successfully');
});
