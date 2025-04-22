/**
 * Supabase database models for the Beesides music rating platform
 * 
 * This file contains helper functions for interacting with the database tables.
 */

import { supabase } from '@/lib/supabase/client';
import type { 
  Profile, 
  Artist, 
  Release, 
  Track, 
  Genre, 
  Rating, 
  Review,
  Collection,
  ReleaseWithDetails,
  ArtistWithReleases,
  ProfileWithFollows
} from '@/types/database';

// PROFILES
export const profileModel = {
  /**
   * Get a user profile by ID
   */
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  },
  
  /**
   * Get a user profile by username
   */
  async getByUsername(username: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching profile by username:', error);
      return null;
    }
    
    return data as Profile;
  },
  
  /**
   * Get a user profile with follower counts
   */
  async getWithFollowCounts(id: string, currentUserId?: string): Promise<ProfileWithFollows | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    // Get follower counts
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', id);
    
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', id);
    
    // Check if the current user is following this profile
    let isFollowing = false;
    if (currentUserId) {
      const { data: followData } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUserId)
        .eq('following_id', id)
        .maybeSingle();
      
      isFollowing = !!followData;
    }
    
    return {
      ...data,
      followers_count: followersCount ?? 0,
      following_count: followingCount ?? 0,
      is_following: isFollowing
    };
  },
  
  /**
   * Update a user profile
   */
  async update(profile: Partial<Profile> & { id: string }): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data as Profile;
  }
};

// ARTISTS
export const artistModel = {
  /**
   * Get an artist by ID
   */
  async getById(id: string): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching artist:', error);
      return null;
    }
    
    return data as Artist;
  },
  
  /**
   * Get an artist with their releases
   */
  async getWithReleases(id: string): Promise<ArtistWithReleases | null> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching artist:', error);
      return null;
    }
    
    // Get the artist's releases through the junction table
    const { data: artistReleasesData, error: releasesError } = await supabase
      .from('artist_releases')
      .select(`
        release_id,
        releases (*)
      `)
      .eq('artist_id', id);
    
    if (releasesError) {
      console.error('Error fetching artist releases:', releasesError);
      return data as ArtistWithReleases;
    }
    
    const releases = artistReleasesData.map(ar => ar.releases) as Release[];
    
    return {
      ...data,
      releases
    };
  },
  
  /**
   * Search artists by name
   */
  async search(query: string, limit = 10): Promise<Artist[]> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error searching artists:', error);
      return [];
    }
    
    return data as Artist[];
  },
  
  /**
   * Create a new artist
   */
  async create(artist: Omit<Artist, 'id' | 'created_at' | 'updated_at'>): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .insert({
        ...artist,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating artist:', error);
      return null;
    }
    
    return data as Artist;
  }
};

// RELEASES
export const releaseModel = {
  /**
   * Get a release by ID
   */
  async getById(id: string): Promise<Release | null> {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching release:', error);
      return null;
    }
    
    return data as Release;
  },
  
  /**
   * Get a release with all details (artists, tracks, genres, ratings)
   */
  async getWithDetails(id: string): Promise<ReleaseWithDetails | null> {
    // First get the release
    const { data: release, error } = await supabase
      .from('releases')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !release) {
      console.error('Error fetching release:', error);
      return null;
    }
    
    // Get the artists
    const { data: artistReleasesData } = await supabase
      .from('artist_releases')
      .select(`
        role,
        artists (*)
      `)
      .eq('release_id', id);
    
    const artists = artistReleasesData?.map(ar => ar.artists) || [];
    
    // Get the tracks
    const { data: tracks } = await supabase
      .from('tracks')
      .select('*')
      .eq('release_id', id)
      .order('disc_number', { ascending: true })
      .order('track_number', { ascending: true });
    
    // Get the genres
    const { data: genreData } = await supabase
      .from('release_genres')
      .select(`
        genres (*)
      `)
      .eq('release_id', id);
    
    const genres = genreData?.map(g => g.genres) || [];
    
    // Get average rating
    const { data: ratingData } = await supabase
      .rpc('get_release_rating', { release_id: id });
    
    const averageRating = ratingData?.average_rating || 0;
    const ratingCount = ratingData?.rating_count || 0;
    
    return {
      ...release,
      artists: artists as Artist[],
      tracks: tracks as Track[],
      genres: genres as Genre[],
      average_rating: averageRating,
      rating_count: ratingCount
    };
  },
  
  /**
   * Get trending releases based on recent ratings and reviews
   */
  async getTrending(limit = 10): Promise<ReleaseWithDetails[]> {
    // This would typically be a complex query using a database function
    // For now, we'll simulate by getting recent high-rated releases
    const { data, error } = await supabase
      .rpc('get_trending_releases', { limit_count: limit });
    
    if (error) {
      console.error('Error fetching trending releases:', error);
      return [];
    }
    
    return data as ReleaseWithDetails[];
  },
  
  /**
   * Search releases by title
   */
  async search(query: string, limit = 10): Promise<Release[]> {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .ilike('title', `%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error searching releases:', error);
      return [];
    }
    
    return data as Release[];
  },
  
  /**
   * Create a new release
   */
  async create(release: Omit<Release, 'id' | 'created_at' | 'updated_at'>): Promise<Release | null> {
    const { data, error } = await supabase
      .from('releases')
      .insert({
        ...release,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating release:', error);
      return null;
    }
    
    return data as Release;
  }
};

// RATINGS
export const ratingModel = {
  /**
   * Get a user's rating for a specific release
   */
  async getUserRating(userId: string, releaseId: string): Promise<Rating | null> {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('user_id', userId)
      .eq('release_id', releaseId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user rating:', error);
      return null;
    }
    
    return data as Rating | null;
  },
  
  /**
   * Create or update a rating
   */
  async upsert(rating: Pick<Rating, 'user_id' | 'release_id' | 'score'>): Promise<Rating | null> {
    // Check if the rating already exists
    const existing = await this.getUserRating(rating.user_id, rating.release_id);
    
    if (existing) {
      // Update existing rating
      const { data, error } = await supabase
        .from('ratings')
        .update({
          score: rating.score,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating rating:', error);
        return null;
      }
      
      return data as Rating;
    } else {
      // Create new rating
      const { data, error } = await supabase
        .from('ratings')
        .insert({
          user_id: rating.user_id,
          release_id: rating.release_id,
          score: rating.score,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating rating:', error);
        return null;
      }
      
      return data as Rating;
    }
  },
  
  /**
   * Delete a rating
   */
  async delete(userId: string, releaseId: string): Promise<boolean> {
    const { error } = await supabase
      .from('ratings')
      .delete()
      .eq('user_id', userId)
      .eq('release_id', releaseId);
    
    if (error) {
      console.error('Error deleting rating:', error);
      return false;
    }
    
    return true;
  }
};

// REVIEWS
export const reviewModel = {
  /**
   * Get review by ID
   */
  async getById(id: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching review:', error);
      return null;
    }
    
    return data as Review;
  },
  
  /**
   * Get a user's review for a specific release
   */
  async getUserReview(userId: string, releaseId: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('release_id', releaseId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user review:', error);
      return null;
    }
    
    return data as Review | null;
  },
  
  /**
   * Get recent reviews
   */
  async getRecent(limit = 10): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent reviews:', error);
      return [];
    }
    
    return data as Review[];
  },
  
  /**
   * Create a new review
   */
  async create(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating review:', error);
      return null;
    }
    
    return data as Review;
  },
  
  /**
   * Update an existing review
   */
  async update(id: string, review: Partial<Omit<Review, 'id' | 'created_at' | 'updated_at'>>): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...review,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating review:', error);
      return null;
    }
    
    return data as Review;
  },
  
  /**
   * Delete a review
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting review:', error);
      return false;
    }
    
    return true;
  }
};

// Export all models
export const models = {
  profile: profileModel,
  artist: artistModel,
  release: releaseModel,
  rating: ratingModel,
  review: reviewModel
};
