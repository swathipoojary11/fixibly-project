'use client';

// Import React state and Next.js navigation hooks
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Import customer AuthContext hook to access live customer profile details
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  // Access logged-in customer state from context
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute display name and initial dynamically from customer state
  const displayName = user?.full_name || user?.name || user?.email || 'Profile';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0F172A] border-b border-gray-800 text-white">
      {/* Main Navigation Bar */}
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Routes back to customer home */}
        <div 
          onClick={() => router.push('/customer')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="text-xl font-extrabold tracking-tight text-white">
            Field<span className="text-[#FF5500]">Flow</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-200">
          <button onClick={() => router.push('/customer')} className="hover:text-[#FF5500] transition">
            Home
          </button>
          <button onClick={() => router.push('/customer/categories')} className="hover:text-[#FF5500] transition">
            Services
          </button>
          <button onClick={() => router.push('/customer/history')} className="hover:text-[#FF5500] transition">
            History
          </button>
          <button onClick={() => router.push('/customer/profile')} className="hover:text-[#FF5500] transition">
            Profile
          </button>
        </div>

        {/* User Profile Avatar / Initial Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.push('/customer/profile')}
            title={`View profile for ${displayName}`}
            className="bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-bold w-9 h-9 rounded-full flex items-center justify-center transition shadow-md shadow-[#FF5500]/20"
          >
            {userInitial}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-t border-gray-800 px-4 py-4 space-y-3 text-xs font-semibold">
          <button 
            onClick={() => { router.push('/customer'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]"
          >
            Home
          </button>
          <button 
            onClick={() => { router.push('/customer/categories'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]"
          >
            Services
          </button>
          <button 
            onClick={() => { router.push('/customer/history'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]"
          >
            History
          </button>
          <button 
            onClick={() => { router.push('/customer/profile'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]"
          >
            My Profile ({displayName})
          </button>
        </div>
      )}
    </header>
  );
}