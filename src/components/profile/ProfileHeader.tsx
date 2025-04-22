import React, { useState } from 'react';
import { Settings, Users, Music, Star } from 'lucide-react';
export function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false);
  return <div className="bg-black text-white p-8 rounded-[4px] border-4 border-black">
      <div className="flex items-start justify-between">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-[#FF3B3B] rounded-[4px] border-4 border-white overflow-hidden">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black">EMMA WILSON</h1>
              <span className="bg-[#FF3B3B] px-3 py-1 rounded-[4px] text-sm font-mono">
                PRO
              </span>
            </div>
            <p className="font-mono text-gray-400 mb-4">
              @emmareviews • Joined 2023
            </p>
            <p className="text-lg mb-6 max-w-2xl">
              Music journalist and vinyl collector. Always hunting for that
              perfect bass line. Let's talk about post-punk revival and modern
              jazz.
            </p>
            <div className="flex gap-6 font-mono">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>4.2K FOLLOWERS</span>
              </div>
              <div className="flex items-center gap-2">
                <Music size={16} />
                <span>1.8K ALBUMS</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span>12.4K RATINGS</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#FF3B3B] text-white px-6 py-2 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition">
            FOLLOW
          </button>
          <button onClick={() => setIsEditing(true)} className="bg-white text-black p-2 rounded-[4px] hover:translate-x-1 hover:-translate-y-1 transition">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>;
}