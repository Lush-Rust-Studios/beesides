"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { MusicCollection } from "@/components/profile/MusicCollection";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import { StatsOverview } from "@/components/profile/StatsOverview";
import { useAuthStore } from "@/lib/supabase/session";
import { AuthModal } from "@/components/auth/AuthModal";
import { LoginForm } from "@/components/auth/LoginForm";
import { createLogger } from "@/lib/utils/logger";

// Create a logger for the profile page
const logger = createLogger("page:ProfileUsername");

export default function ProfileUsernamePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    // If not authenticated and not loading, show auth modal
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
      // Save current path for redirect after authentication
      sessionStorage.setItem("redirectPath", `/profile/${username}`);
      logger.info("Unauthenticated user viewing profile, showing auth modal");
    } else if (isAuthenticated && user) {
      setShowAuthModal(false);
      logger.info("User accessed profile page", {
        username,
        userId: user.id,
        user: JSON.stringify(user),
        profileData: profile ? JSON.stringify(profile) : "No profile data",
      });
    }
  }, [isAuthenticated, isLoading, user, username, profile]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <>
            <ProfileHeader username={username} />
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <MusicCollection />
                <ActivityFeed />
              </div>
              <div>
                <StatsOverview />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p>Please log in to view {username}'s profile</p>
          </div>
        )}
      </main>
    </div>
  );
}
