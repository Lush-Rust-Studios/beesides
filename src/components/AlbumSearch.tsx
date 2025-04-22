/**
 * Album Search component for Beesides
 *
 * This component provides an interface for users to search for albums
 * using the MusicBrainz API and add them to their collection for review.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MusicBrainzReleaseGroup } from "@/lib/api/musicbrainz";

export function AlbumSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MusicBrainzReleaseGroup[]>([]);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/music/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search for albums");
      }

      const data = await response.json();

      if (data.success && data.data["release-groups"]) {
        setResults(data.data["release-groups"]);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error searching albums:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAlbum = (album: MusicBrainzReleaseGroup) => {
    // Navigate to album details page with the MusicBrainz ID
    router.push(`/albums/details?mbid=${album.id}`);
  };

  // Helper function to format artist credits
  const formatArtistCredits = (artistCredits?: Array<{ name: string }>) => {
    if (!artistCredits || artistCredits.length === 0) return "Unknown Artist";
    return artistCredits.map((credit) => credit.name).join(", ");
  };

  // Helper function to determine release type display
  const getReleaseTypeDisplay = (album: MusicBrainzReleaseGroup) => {
    if (album["primary-type"]) {
      if (album["secondary-types"] && album["secondary-types"].length > 0) {
        return `${album["primary-type"]} (${album["secondary-types"].join(", ")})`;
      }
      return album["primary-type"];
    }
    return "Unknown Type";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for albums, singles, EPs..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((album) => (
              <div
                key={album.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectAlbum(album)}
              >
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{album.title}</h3>
                  <p className="text-gray-700">
                    {formatArtistCredits(album["artist-credit"])}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-600">
                      {album["first-release-date"]
                        ? new Date(album["first-release-date"]).getFullYear()
                        : "Unknown year"}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {getReleaseTypeDisplay(album)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && results.length === 0 && query && (
        <div className="text-center my-8">
          <p className="text-gray-600">No albums found matching your search.</p>
          <p className="text-sm mt-2">
            Try a different search term or check the spelling.
          </p>
        </div>
      )}
    </div>
  );
}
