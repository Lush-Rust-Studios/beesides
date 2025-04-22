/**
 * API route for searching MusicBrainz releases (albums)
 */
import { NextRequest } from 'next/server';
import { searchReleaseGroups } from '@/lib/api/musicbrainz';
import { errorResponse, successResponse } from '@/app/api/utils';

export async function GET(request: NextRequest) {
  try {
    // Get search query and pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!query) {
      return errorResponse('Search query is required', 400);
    }

    // Search MusicBrainz API
    const results = await searchReleaseGroups(query, limit, offset);
    
    return successResponse(results);
  } catch (error) {
    console.error('Error searching MusicBrainz:', error);
    return errorResponse('Failed to search for albums', 500);
  }
}
