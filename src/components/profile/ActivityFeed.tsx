import React from 'react';
import { Star, MessageCircle, Heart, Plus } from 'lucide-react';
const activities = [{
  type: 'rating',
  album: 'THE RECORD',
  artist: 'BOYGENIUS',
  rating: 4.5,
  timestamp: '2 HOURS AGO',
  image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8'
}, {
  type: 'review',
  album: 'IN RAINBOWS',
  artist: 'RADIOHEAD',
  content: 'A masterpiece that continues to reveal new layers with each listen. The production is immaculate.',
  likes: 24,
  comments: 8,
  timestamp: '1 DAY AGO',
  image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'
}, {
  type: 'collection',
  album: 'VESPERTINE',
  artist: 'BJÖRK',
  collection: 'EXPERIMENTAL FAVORITES',
  timestamp: '2 DAYS AGO',
  image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1'
}];
export function ActivityFeed() {
  return <div className="mt-8">
      <h2 className="text-2xl font-black mb-6">RECENT ACTIVITY</h2>
      <div className="space-y-4">
        {activities.map((activity, i) => <div key={i} className="bg-[#f0f0f0] p-4 rounded-[4px] border-2 border-black">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-[4px] border-2 border-black overflow-hidden flex-shrink-0">
                <img src={activity.image} alt={activity.album} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{activity.album}</h3>
                    <p className="font-mono text-sm text-gray-600">
                      {activity.artist}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-gray-500">
                    {activity.timestamp}
                  </span>
                </div>
                {activity.type === 'rating' && <div className="mt-2 flex items-center gap-2">
                    <Star className="text-[#FF3B3B]" size={16} />
                    <span className="font-bold">{activity.rating}</span>
                  </div>}
                {activity.type === 'review' && <>
                    <p className="mt-2 text-sm">{activity.content}</p>
                    <div className="mt-3 flex gap-4">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-[#FF3B3B] transition">
                        <Heart size={16} />
                        <span className="text-sm">{activity.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-[#FF3B3B] transition">
                        <MessageCircle size={16} />
                        <span className="text-sm">{activity.comments}</span>
                      </button>
                    </div>
                  </>}
                {activity.type === 'collection' && <div className="mt-2 flex items-center gap-2">
                    <Plus size={16} />
                    <span className="font-mono text-sm">
                      Added to {activity.collection}
                    </span>
                  </div>}
              </div>
            </div>
          </div>)}
      </div>
      <button className="mt-6 w-full bg-black text-white py-3 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition">
        LOAD MORE
      </button>
    </div>;
}