import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createApiHandler, errorResponse, successResponse } from '../../utils';

/**
 * GET: Fetch a single artist by ID
 */
export const GET = createApiHandler(async (request: NextRequest) => {
  // Get the artist ID from the URL
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get('id');
  
  if (!artistId) {
    return errorResponse('Artist ID is required', 400);
  }
  
  const supabase = createClient();
  
  // Fetch the artist
  const { data: artist, error } = await supabase
    .from('artists')
    .select(`
      *,
      artist_releases!inner (
        role,
        releases:release_id (
          id, 
          title,
          release_type,
          release_date,
          cover_art_url
        )
      )
    `)
    .eq('id', artistId)
    .single();
  
  if (error) {
    return errorResponse(`Failed to fetch artist: ${error.message}`);
  }
  
  if (!artist) {
    return errorResponse('Artist not found', 404);
  }
  
  // Transform the data to a more convenient structure
  const formattedArtist = {
    ...artist,
    releases: artist.artist_releases.map((ar: any) => ({
      ...ar.releases,
      role: ar.role
    }))
  };
  
  // Remove the original artist_releases array
  delete formattedArtist.artist_releases;
  
  return successResponse(formattedArtist);
});
