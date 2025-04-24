import React, { useState, useEffect } from "react";
import { Grid, List, Plus, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/supabase/session";

// Sample collections data - this should be replaced with real API calls
const sampleCollections = [
  {
    id: "1",
    name: "ALL TIME FAVORITES",
    count: 3,
    albums: [
      {
        id: "a1",
        title: "IN RAINBOWS",
        artist: "RADIOHEAD",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
      },
      {
        id: "a2",
        title: "VESPERTINE",
        artist: "BJÖRK",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
      },
      {
        id: "a3",
        title: "BLONDE",
        artist: "FRANK OCEAN",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0",
      },
    ],
  },
  {
    id: "2",
    name: "2023 HIGHLIGHTS",
    count: 1,
    albums: [
      {
        id: "a4",
        title: "THE RECORD",
        artist: "BOYGENIUS",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8",
      },
    ],
  },
];

export function MusicCollection() {
  const [collections, setCollections] = useState(sampleCollections);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Function to fetch user collections from API
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with an actual API call
        // For now, simulate loading with sample data
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCollections(sampleCollections);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCollections();
    }
  }, [user]);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    // This would actually call an API to create a new collection
    const newCollection = {
      id: `new-${Date.now()}`,
      name: newCollectionName.toUpperCase(),
      count: 0,
      albums: [],
    };

    setCollections([...collections, newCollection]);
    setIsCreatingCollection(false);
    setNewCollectionName("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">COLLECTIONS</h2>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-[4px] transition ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <Grid size={20} />
          </button>
          <button
            className={`p-2 rounded-[4px] transition ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <List size={20} />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-[4px] transition ml-2 bg-[#FF3B3B] text-white hover:bg-[#ff5555]"
            onClick={() => setIsCreatingCollection(true)}
            title="Create new collection"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {isCreatingCollection && (
        <div className="bg-white p-4 rounded-[4px] border-4 border-black mb-6">
          <h3 className="font-bold mb-2">Create New Collection</h3>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="w-full p-2 border-2 border-black rounded-[4px] mb-3"
            placeholder="Collection name"
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-[4px]"
              onClick={() => setIsCreatingCollection(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#FF3B3B] text-white rounded-[4px]"
              onClick={handleCreateCollection}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black text-center">
          <p className="text-lg mb-4">
            You haven't created any collections yet.
          </p>
          <button
            onClick={() => setIsCreatingCollection(true)}
            className="bg-[#FF3B3B] text-white px-6 py-3 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition"
          >
            CREATE YOUR FIRST COLLECTION
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{collection.name}</h3>
                  <p className="font-mono text-sm text-gray-600">
                    {collection.count} ALBUMS
                  </p>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-[4px] text-sm font-bold hover:translate-x-1 hover:-translate-y-1 transition">
                  VIEW ALL
                </button>
              </div>

              {collection.albums.length === 0 ? (
                <p className="text-gray-500 italic">
                  No albums in this collection yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.albums.map((album) => (
                    <div
                      key={album.id}
                      className="bg-white p-3 rounded-[4px] border-2 border-black hover:translate-x-1 hover:-translate-y-1 transition cursor-pointer"
                    >
                      <div className="aspect-square mb-3 overflow-hidden rounded-[4px] border-2 border-black">
                        <img
                          src={album.image}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm truncate">
                          {album.title}
                        </h4>
                        <p className="font-mono text-xs text-gray-600 truncate">
                          {album.artist}
                        </p>
                        <div className="mt-2 bg-[#FF3B3B] text-white px-2 py-1 rounded-[4px] text-xs font-mono inline-block">
                          {album.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
