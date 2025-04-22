import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createApiHandler, errorResponse, successResponse } from '../../utils';
import { ReleaseWithDetails } from '@/types/database';

/**
 * GET: Fetch a single release by ID with related data
 */
export const GET = createApiHandler(async (request: NextRequest) => {
  // Get the release ID from the URL
  const { searchParams } = new URL(request.url);
  const releaseId = searchParams.get('id');
  
  if (!releaseId) {
    return errorResponse('Release ID is required', 400);
  }
  
  const supabase = createClient();
  
  // Fetch the release with related data
  const [releaseResult, artistsResult, genresResult, tracksResult, ratingsResult] = await Promise.all([
    // Fetch the release
    supabase
      .from('releases')
      .select('*')
      .eq('id', releaseId)
      .single(),
      
    // Fetch the artists
    supabase
      .from('artist_releases')
      .select(`
        role,
        artists:artist_id (
          id,
          name,
          image_url
        )
      `)
      .eq('release_id', releaseId),
      
    // Fetch the genres
    supabase
      .from('release_genres')
      .select(`
        genres:genre_id (
          id,
          name,
          parent_id
        )
      `)
      .eq('release_id', releaseId),
      
    // Fetch the tracks
    supabase
      .from('tracks')
      .select('*')
      .eq('release_id', releaseId)
      .order('disc_number', { ascending: true })
      .order('track_number', { ascending: true }),
      
    // Fetch rating summary
    supabase
      .from('ratings')
      .select('score', { count: 'exact' })
      .eq('release_id', releaseId)
  ]);
  
  // Check for errors
  if (releaseResult.error) {
    return errorResponse(`Failed to fetch release: ${releaseResult.error.message}`);
  }
  
  if (!releaseResult.data) {
    return errorResponse('Release not found', 404);
  }
  
  // Calculate average rating
  const ratings = ratingsResult.data || [];
  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0
    ? ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings
    : null;
  
  // Combine data
  const release: ReleaseWithDetails = {
    ...releaseResult.data,
    artists: artistsResult.data?.map((ar) => ar.artists) || [],
    genres: genresResult.data?.map((rg) => rg.genres) || [],
    tracks: tracksResult.data || [],
    average_rating: averageRating,
    rating_count: totalRatings
  };
  
  return successResponse(release);
});
