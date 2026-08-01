'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0F172A] border-b border-gray-800 text-white">


      {/* Main Navigation Bar */}
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => router.push('/customer')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          {/* <div className="bg-[#FF5500] text-white font-black text-xl px-2.5 py-1 rounded">
            FF
          </div> */}
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
          {/* <button onClick={() => router.push('/customer/tracking/BK-102')} className="hover:text-[#FF5500] transition">
            Active Booking
          </button> */}
           <button onClick={() => router.push('/components/contactSupportSection.js')} className="hover:text-[#FF5500] transition">
            Contact
          </button>
            <button onClick={() => router.push('/customer/aboutus')} className="hover:text-[#FF5500] transition">
            About us
          </button>
          <button onClick={() => router.push('/customer/history')} className="hover:text-[#FF5500] transition">
            History
          </button>
        </div>


        <div className="hidden md:flex items-center  gap-3">
          <button
            onClick={() => router.push('/components/ProfileCard.js')}
            className="bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-bold px-4 py-2 h-10 w-10 rounded-4xl transition"
          >
            P
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

      {/* Mobile Drawer */}
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
            onClick={() => { router.push('/customer/book'); setMobileMenuOpen(false); }}
            className="w-full bg-[#FF5500] text-white text-center py-2.5 rounded font-bold"
          >
            Book Now
          </button>
        </div>
      )}
    </header>
  );
}