'use client';

// Import Navbar and ProfileCard components
import React from 'react';
import Navbar from '../../components/navbar';
import ProfileCard from '../../components/ProfileCard';

// Dedicated Customer Profile Page component
export default function CustomerProfilePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Profile View Section */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-24 pb-12 flex flex-col items-center">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My <span className="text-[#FF5500]">Profile</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            View and manage your FieldFlow customer account details and contact preferences.
          </p>
        </div>

        {/* Profile Card Component */}
        <ProfileCard className="shadow-2xl" />
      </main>
    </div>
  );
}
