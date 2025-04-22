import { Hero } from "@/components/Hero";
import { StatsGrid } from "@/components/StatsGrid";
import { TrendingAlbums } from "@/components/TrendingAlbums";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4">
        <Hero />
        <StatsGrid />
        <TrendingAlbums />
      </main>
    </div>
  );
}
