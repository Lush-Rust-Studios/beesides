import React, { useState, useEffect } from "react";
import { BarChart2, PieChart, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/supabase/session";

// Sample data - would be replaced with API calls
const sampleGenres = [
  {
    name: "ALTERNATIVE",
    percentage: 32,
  },
  {
    name: "ELECTRONIC",
    percentage: 24,
  },
  {
    name: "HIP-HOP",
    percentage: 18,
  },
  {
    name: "ROCK",
    percentage: 15,
  },
  {
    name: "JAZZ",
    percentage: 11,
  },
];

const sampleRatings = [
  {
    score: 5,
    count: 142,
  },
  {
    score: 4,
    count: 287,
  },
  {
    score: 3,
    count: 164,
  },
  {
    score: 2,
    count: 53,
  },
  {
    score: 1,
    count: 12,
  },
];

export function StatsOverview() {
  const [genres, setGenres] = useState(sampleGenres);
  const [ratings, setRatings] = useState(sampleRatings);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Function to fetch user stats from API
    const fetchUserStats = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with an actual API call
        // For now, simulate loading with sample data
        await new Promise((resolve) => setTimeout(resolve, 700));
        setGenres(sampleGenres);
        setRatings(sampleRatings);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const maxRating = Math.max(...ratings.map((r) => r.count));
  const totalRatings = ratings.reduce((acc, curr) => acc + curr.count, 0);

  if (isLoading) {
    return (
      <div className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black">
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black">
        <div className="flex items-center gap-2 mb-4">
          <PieChart size={20} />
          <h2 className="font-bold">TOP GENRES</h2>
        </div>
        <div className="space-y-4">
          {genres.map((genre) => (
            <div key={genre.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-mono">{genre.name}</span>
                <span className="font-mono">{genre.percentage}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 border-2 border-black">
                <div
                  className="bg-[#FF3B3B] h-full rounded-full"
                  style={{ width: `${genre.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={20} />
          <h2 className="font-bold">RATING DISTRIBUTION</h2>
        </div>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div key={rating.score} className="flex items-center gap-2">
              <span className="font-mono w-4">{rating.score}</span>
              <div className="flex-1 bg-white h-6 border-2 border-black rounded-[4px] overflow-hidden">
                <div
                  className="bg-[#FF3B3B] h-full"
                  style={{ width: `${(rating.count / maxRating) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-sm w-12 text-right">
                {rating.count}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center font-mono text-sm">
          {totalRatings} TOTAL RATINGS
        </div>
      </div>
    </div>
  );
}
