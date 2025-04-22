import React from 'react';
import { BarChart2, PieChart } from 'lucide-react';
const genres = [{
  name: 'ALTERNATIVE',
  percentage: 32
}, {
  name: 'ELECTRONIC',
  percentage: 24
}, {
  name: 'HIP-HOP',
  percentage: 18
}, {
  name: 'ROCK',
  percentage: 15
}, {
  name: 'JAZZ',
  percentage: 11
}];
const ratings = [{
  score: 5,
  count: 142
}, {
  score: 4,
  count: 287
}, {
  score: 3,
  count: 164
}, {
  score: 2,
  count: 53
}, {
  score: 1,
  count: 12
}];
export function StatsOverview() {
  const maxRating = Math.max(...ratings.map(r => r.count));
  return <div className="space-y-6">
      <div className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black">
        <div className="flex items-center gap-2 mb-4">
          <PieChart size={20} />
          <h2 className="font-bold">TOP GENRES</h2>
        </div>
        <div className="space-y-4">
          {genres.map(genre => <div key={genre.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-mono">{genre.name}</span>
                <span className="font-mono">{genre.percentage}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 border-2 border-black">
                <div className="bg-[#FF3B3B] h-full rounded-full" style={{
              width: `${genre.percentage}%`
            }} />
              </div>
            </div>)}
        </div>
      </div>
      <div className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={20} />
          <h2 className="font-bold">RATING DISTRIBUTION</h2>
        </div>
        <div className="space-y-3">
          {ratings.map(rating => <div key={rating.score} className="flex items-center gap-3">
              <span className="font-mono w-3">{rating.score}</span>
              <div className="flex-grow bg-white rounded-[4px] h-8 border-2 border-black overflow-hidden">
                <div className="bg-[#FFE14D] h-full transition-all" style={{
              width: `${rating.count / maxRating * 100}%`
            }} />
              </div>
              <span className="font-mono w-12 text-right">{rating.count}</span>
            </div>)}
        </div>
      </div>
      <div className="bg-black text-white p-6 rounded-[4px] border-4 border-black">
        <h2 className="font-bold mb-4">2023 HIGHLIGHTS</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-[4px]">
            <div className="font-mono text-sm mb-1">ALBUMS RATED</div>
            <div className="text-2xl font-black">487</div>
          </div>
          <div className="bg-white/10 p-4 rounded-[4px]">
            <div className="font-mono text-sm mb-1">REVIEWS WRITTEN</div>
            <div className="text-2xl font-black">142</div>
          </div>
          <div className="bg-white/10 p-4 rounded-[4px]">
            <div className="font-mono text-sm mb-1">HOURS LISTENED</div>
            <div className="text-2xl font-black">1,248</div>
          </div>
          <div className="bg-white/10 p-4 rounded-[4px]">
            <div className="font-mono text-sm mb-1">NEW FOLLOWERS</div>
            <div className="text-2xl font-black">2.4K</div>
          </div>
        </div>
      </div>
    </div>;
}