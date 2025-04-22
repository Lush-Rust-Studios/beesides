/**
 * Album Search Page for Beesides
 *
 * This page allows users to search for albums via MusicBrainz
 * to add to their collection for review.
 */
import { AlbumSearch } from "@/components/AlbumSearch";

export default function SearchAlbumsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Search Albums to Review
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Search for albums, EPs, and singles from MusicBrainz&apos;s extensive
          database. Select an album to add it to your collection or write a
          review.
        </p>

        <AlbumSearch />
      </main>
    </div>
  );
}
