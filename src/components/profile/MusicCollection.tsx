import React from 'react';
import { Grid, List } from 'lucide-react';
const collections = [{
  name: 'ALL TIME FAVORITES',
  count: 142,
  albums: [{
    title: 'IN RAINBOWS',
    artist: 'RADIOHEAD',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'
  }, {
    title: 'VESPERTINE',
    artist: 'BJÖRK',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1'
  }, {
    title: 'BLONDE',
    artist: 'FRANK OCEAN',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0'
  }]
}, {
  name: '2023 HIGHLIGHTS',
  count: 87,
  albums: [{
    title: 'THE RECORD',
    artist: 'BOYGENIUS',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8'
  }]
}];
export function MusicCollection() {
  return <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">COLLECTIONS</h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-[4px] transition">
            <Grid size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-[4px] transition">
            <List size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-6">
        {collections.map((collection, i) => <div key={i} className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black">
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
            <div className="grid grid-cols-3 gap-4">
              {collection.albums.map((album, j) => <div key={j} className="bg-white p-3 rounded-[4px] border-2 border-black hover:translate-x-1 hover:-translate-y-1 transition cursor-pointer">
                  <div className="aspect-square mb-3 overflow-hidden rounded-[4px] border-2 border-black">
                    <img src={album.image} alt={album.title} className="w-full h-full object-cover" />
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
                </div>)}
            </div>
          </div>)}
      </div>
    </div>;
}