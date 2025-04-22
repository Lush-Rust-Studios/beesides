import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { MusicCollection } from '@/components/profile/MusicCollection';
import { ActivityFeed } from '@/components/profile/ActivityFeed';
import { StatsOverview } from '@/components/profile/StatsOverview';
export default function ProfilePage() {
  return <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ProfileHeader />
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <MusicCollection />
            <ActivityFeed />
          </div>
          <div>
            <StatsOverview />
          </div>
        </div>
      </main>
      <Footer />
    </div>;
}