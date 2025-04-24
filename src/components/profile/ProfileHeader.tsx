import React, { useState, useEffect } from "react";
import { Settings, Users, Music, Star, Edit } from "lucide-react";
import { useAuthStore } from "@/lib/supabase/session";
import { format } from "date-fns";
import { createLogger } from "@/lib/utils/logger";

// Create logger for ProfileHeader
const logger = createLogger("component:ProfileHeader");

interface ProfileHeaderProps {
  username?: string;
}

export function ProfileHeader({ username }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);

  // Log profile and user data when component renders
  useEffect(() => {
    logger.info("ProfileHeader rendering", {
      providedUsername: username,
      profileUsername: profile?.username,
      hasProfile: !!profile,
      profileData: profile ? JSON.stringify(profile) : "No profile data",
      hasUser: !!user,
      userData: user ? JSON.stringify(user) : "No user data",
    });
  }, [username, profile, user]);

  // Format join date if available
  const joinDate = user?.created_at
    ? format(new Date(user.created_at), "yyyy")
    : new Date().getFullYear();

  // Handle saving bio
  const handleSaveBio = () => {
    // Here you would implement saving to your database
    setIsEditingBio(false);
  };

  return (
    <div className="bg-black text-white p-8 rounded-[4px] border-4 border-black">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 bg-[#FF3B3B] rounded-[4px] border-4 border-white overflow-hidden">
            {/* Use default avatar if profile pic not available */}
            <img
              src={
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.username || "User"}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black">
                {profile?.username?.toUpperCase() || "USER"}
              </h1>
              {/* Premium badge can be shown based on admin status or other criteria */}
              {profile?.is_admin && (
                <span className="bg-[#FF3B3B] px-3 py-1 rounded-[4px] text-sm font-mono">
                  ADMIN
                </span>
              )}
            </div>
            <p className="font-mono text-gray-400 mb-4">
              @{profile?.username?.toLowerCase() || "user"} • Joined {joinDate}
            </p>

            {isEditingBio ? (
              <div className="mb-4">
                <textarea
                  value={bio || profile?.bio || ""}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-[4px] p-2 mb-2"
                  rows={3}
                  placeholder="Tell us about yourself and your music tastes..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBio}
                    className="bg-[#FF3B3B] text-white px-4 py-1 rounded-[4px] text-sm font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="bg-gray-700 text-white px-4 py-1 rounded-[4px] text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative mb-6 max-w-2xl">
                <p className="text-lg">
                  {profile?.bio ||
                    "No bio yet. Click the edit button to add one!"}
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="absolute top-0 right-0 text-gray-400 hover:text-white"
                  title="Edit bio"
                >
                  <Edit size={16} />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-6 font-mono">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>0 FOLLOWERS</span>
              </div>
              <div className="flex items-center gap-2">
                <Music size={16} />
                <span>0 ALBUMS</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span>0 RATINGS</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          {/* Only show edit button if viewing own profile */}
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white text-black px-4 py-2 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition flex items-center gap-2"
          >
            <Settings size={18} />
            <span>EDIT PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
