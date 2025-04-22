import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createApiHandler, errorResponse, requireAuth, successResponse } from '../../../utils';

/**
 * GET: Get a list of the current user's collections
 */
export const GET = createApiHandler(async (request: NextRequest) => {
  // Require authentication
  const user = await requireAuth(request);
  const supabase = createClient();
  
  // Fetch the user's collections with counts of releases in each
  const { data: collections, error } = await supabase
    .from('collections')
    .select(`
      *,
      release_count:collection_releases (count)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  
  if (error) {
    return errorResponse(`Failed to fetch collections: ${error.message}`);
  }
  
  // Transform the data to include the count as a number
  const formattedCollections = collections.map(collection => ({
    ...collection,
    release_count: collection.release_count[0]?.count || 0
  }));
  
  return successResponse(formattedCollections);
});

/**
 * POST: Create a new collection
 */
export const POST = createApiHandler(async (request: NextRequest) => {
  // Require authentication
  const user = await requireAuth(request);
  const supabase = createClient();
  
  try {
    // Parse request body
    const body = await request.json();
    const { name, description = null, isPublic = true } = body;
    
    // Validate request
    if (!name || name.trim().length < 1) {
      return errorResponse('Collection name is required', 400);
    }
    
    // Create the collection
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('collections')
      .insert({
        user_id: user.id,
        name,
        description,
        is_public: isPublic,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) {
      return errorResponse(`Failed to create collection: ${error.message}`);
    }
    
    return successResponse(data, 'Collection created successfully');
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse('An unexpected error occurred');
  }
});
