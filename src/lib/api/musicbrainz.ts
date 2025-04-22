/**
 * MusicBrainz API client for Beesides
 * 
 * This module provides functions to interact with the MusicBrainz API
 * for searching and retrieving music metadata.
 */

// MusicBrainz API base URL
const MB_API_BASE = 'https://musicbrainz.org/ws/2';
const MB_APP_NAME = 'Beesides-WebApp';
const MB_APP_VERSION = '0.1.0';
const MB_APP_CONTACT = 'contact@beesides.app'; // Replace with your actual contact info

// Default headers for MusicBrainz API
// MusicBrainz requires a proper User-Agent header with app name, version and contact
const MB_HEADERS = {
  'User-Agent': `${MB_APP_NAME}/${MB_APP_VERSION} ( ${MB_APP_CONTACT} )`,
  'Accept': 'application/json'
};

// Response types for MusicBrainz API
export interface MusicBrainzReleaseGroup {
  id: string;
  title: string;
  'first-release-date'?: string;
  'primary-type'?: string;
  'secondary-types'?: string[];
  disambiguation?: string;
  'artist-credit'?: Array<{
    name: string;
    artist: {
      id: string;
      name: string;
      'sort-name'?: string;
    }
  }>;
}

export interface MusicBrainzRelease {
  id: string;
  title: string;
  status?: string;
  date?: string;
  country?: string;
  'release-events'?: Array<{
    date?: string;
    area?: {
      id: string;
      name: string;
    }
  }>;
  'artist-credit'?: Array<{
    name: string;
    artist: {
      id: string;
      name: string;
      'sort-name'?: string;
    }
  }>;
  media?: Array<{
    format?: string;
    'track-count': number;
    tracks?: Array<{
      id: string;
      number: string;
      title: string;
      length?: number;
    }>
  }>;
  'cover-art-archive'?: {
    artwork: boolean;
    count: number;
    front: boolean;
    back: boolean;
  };
}

export interface MusicBrainzSearchResult<T> {
  created: string;
  count: number;
  offset: number;
  releases?: T[];
  'release-groups'?: T[];
}

/**
 * Fetches album cover art URL from Cover Art Archive
 */
export const getCoverArtUrl = (mbid: string, size: 'small' | 'large' | '500' = 'large'): string => {
  // Cover Art Archive uses MusicBrainz IDs for fetching covers
  return `https://coverartarchive.org/release/${mbid}/front-${size}`;
};

/**
 * Search for release groups (albums, singles, EPs) in MusicBrainz
 */
export async function searchReleaseGroups(query: string, limit = 10, offset = 0): Promise<MusicBrainzSearchResult<MusicBrainzReleaseGroup>> {
  const params = new URLSearchParams({
    query,
    limit: limit.toString(),
    offset: offset.toString(),
    fmt: 'json'
  });
  
  try {
    // Add a small delay to respect rate limiting (1s)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `${MB_API_BASE}/release-group?${params.toString()}`,
      { headers: MB_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching MusicBrainz:', error);
    throw error;
  }
}

/**
 * Get release details by MusicBrainz ID
 */
export async function getReleaseGroupById(mbid: string): Promise<MusicBrainzReleaseGroup> {
  try {
    // Add a small delay to respect rate limiting (1s)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `${MB_API_BASE}/release-group/${mbid}?fmt=json&inc=artists`,
      { headers: MB_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching MusicBrainz release group:', error);
    throw error;
  }
}

/**
 * Get releases (specific editions) for a release group
 */
export async function getReleasesForReleaseGroup(mbid: string, limit = 10): Promise<MusicBrainzSearchResult<MusicBrainzRelease>> {
  try {
    // Add a small delay to respect rate limiting (1s)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const params = new URLSearchParams({
      'release-group': mbid,
      limit: limit.toString(),
      fmt: 'json',
      inc: 'artists+recordings+media'
    });
    
    const response = await fetch(
      `${MB_API_BASE}/release?${params.toString()}`,
      { headers: MB_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching MusicBrainz releases:', error);
    throw error;
  }
}

/**
 * Get release details by ID with tracks
 */
export async function getReleaseById(mbid: string): Promise<MusicBrainzRelease> {
  try {
    // Add a small delay to respect rate limiting (1s)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `${MB_API_BASE}/release/${mbid}?fmt=json&inc=artists+recordings+media`,
      { headers: MB_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching MusicBrainz release:', error);
    throw error;
  }
}
