/**
 * Database types for Beesides Music Rating Platform
 * 
 * These types correspond to the tables defined in our database schema
 * and are used for type safety throughout the application.
 */

// Profile type - extends Supabase auth user with profile information
export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_admin: boolean;
}

// Artist type - represents musicians, bands, composers, etc.
export interface Artist {
  id: string;
  name: string;
  description: string | null;
  formed_date: string | null;
  disbanded_date: string | null;
  country_code: string | null;
  image_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Release types enum
export type ReleaseType = 
  | 'album'
  | 'ep'
  | 'single'
  | 'compilation'
  | 'live'
  | 'remix'
  | 'mixtape'
  | 'soundtrack';

// Release type - represents albums, EPs, singles, etc.
export interface Release {
  id: string;
  title: string;
  release_type: ReleaseType;
  release_date: string | null;
  label: string | null;
  cover_art_url: string | null;
  description: string | null;
  language: string | null;
  country_code: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Artist-Release relationship
export interface ArtistRelease {
  artist_id: string;
  release_id: string;
  role: string | null; // primary, featured, producer, etc.
  created_at: string;
}

// Track type - individual songs
export interface Track {
  id: string;
  release_id: string;
  title: string;
  duration: number | null; // in seconds
  track_number: number | null;
  disc_number: number;
  isrc: string | null; // International Standard Recording Code
  is_explicit: boolean;
  created_at: string;
  updated_at: string;
}

// Genre type - music genres with hierarchical structure
export interface Genre {
  id: string;
  name: string;
  parent_id: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Release-Genre relationship
export interface ReleaseGenre {
  release_id: string;
  genre_id: string;
  created_at: string;
}

// Rating type - user ratings for releases
export interface Rating {
  id: string;
  user_id: string;
  release_id: string;
  score: number; // 0.0 to 10.0
  created_at: string;
  updated_at: string;
}

// Review type - detailed user reviews
export interface Review {
  id: string;
  user_id: string;
  release_id: string;
  title: string | null;
  content: string;
  rating_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Collection type - user-created collections of releases
export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Collection-Release relationship
export interface CollectionRelease {
  collection_id: string;
  release_id: string;
  added_at: string;
  note: string | null;
}

// Tag type - user-generated tags
export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

// Release-Tag relationship
export interface ReleaseTag {
  release_id: string;
  tag_id: string;
  user_id: string;
  created_at: string;
}

// User Follow relationship
export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

// Extended types with related data
export interface ReleaseWithDetails extends Release {
  artists?: Artist[];
  genres?: Genre[];
  tracks?: Track[];
  average_rating?: number;
  rating_count?: number;
}

export interface ArtistWithReleases extends Artist {
  releases?: ReleaseWithDetails[];
}

export interface ProfileWithFollows extends Profile {
  followers_count?: number;
  following_count?: number;
  is_following?: boolean; // whether the current user is following this profile
}

export interface ReviewWithUserAndRelease extends Review {
  user?: Profile;
  release?: Release;
}
