'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Phone, 
  MapPin, 
  User, 
  Radio, 
  ShieldCheck, 
  LogIn, 
  UserPlus,
  Bell,
  Clock,
  Info,
  Mail,
  CheckCircle2
  
} from 'lucide-react';

// Remove the import from 'react-icons/si' and use 'react-icons/fa6' instead:
import { 
  FaFacebook, 
  FaXTwitter, // or FaTwitter
  FaLinkedin, 
  FaInstagram 
} from 'react-icons/fa6';

export default function HomePage() {
  const [activeNav, setActiveNav] = useState('HOME');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      
{/* 1. TOP UTILITY HEADER BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-orange-400 transition-colors"><FaFacebook className="w-3.5 h-3.5" /></a>
          <a href="#" className="hover:text-orange-400 transition-colors"><FaXTwitter className="w-3.5 h-3.5" /></a>
          <a href="#" className="hover:text-orange-400 transition-colors"><FaLinkedin className="w-3.5 h-3.5" /></a>
          <a href="#" className="hover:text-orange-400 transition-colors"><FaInstagram className="w-3.5 h-3.5" /></a>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block">Support: +1 (800) 555-FIELD</span>
          <span className="hidden md:inline-block">|</span>
          <span className="hidden md:inline-block">Hours: 24/7 Emergency Dispatch</span>
        </div>
      </div>

      {/* 2. MAIN BRANDING HEADER */}
      <header className="bg-white py-4 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                FIELD<span className="text-orange-500">FLOW</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Home Repair & Field Service Booking</p>
            </div>
          </div>

          {/* Contact Info Widgets */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-bold uppercase">Phone Support</span>
                <span className="text-sm font-bold text-slate-800">+1 800 555 3435</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-bold uppercase">Main Address</span>
                <span className="text-sm font-bold text-slate-800">City Dispatch Hub</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 3. ORANGE NAVIGATION BAR */}
      <nav className="bg-orange-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-start space-x-6 sm:space-x-8 py-3 text-xs sm:text-sm font-bold text-white tracking-wider overflow-x-auto">
            <Link
              href="/"
              onClick={() => setActiveNav('HOME')}
              className={`py-1 transition-all whitespace-nowrap border-b-2 ${
                activeNav === 'HOME' 
                  ? 'border-white font-extrabold text-white' 
                  : 'border-transparent text-white/90 hover:text-white hover:border-white/50'
              }`}
            >
              HOME
            </Link>
            <Link
              href="/authentication/about"
              className={`py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50`}
            >
              ABOUT US
            </Link>
            {['HISTORY', 'NOTIFICATION'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`py-1 transition-all whitespace-nowrap border-b-2 ${
                  activeNav === item 
                    ? 'border-white font-extrabold text-white' 
                    : 'border-transparent text-white/90 hover:text-white hover:border-white/50'
                }`}
              >
                {item}
              </button>
            ))}
            <Link
              href="/authentication/contact"
              className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. MAIN HERO BANNER */}
      <main className="flex-1 relative bg-slate-900 text-white min-h-[520px] flex items-center">
        
        {/* Real Technician Repair Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1600&auto=format&fit=crop')`
          }}
        ></div>
        
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 w-full">
          <div className="max-w-xl space-y-6">
            
            {activeNav === 'HOME' && (
              <>
                <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
                  WE ARE AVAILABLE FOR EMERGENCY REPAIRS
                </h1>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                  Our highly trained and skilled technicians offer a full range of services for residential and commercial plumbing, electrical, and AC repairs.
                </p>

                {/* Login & Register Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/authentication/login"
                    className="px-7 py-3 rounded border-2 border-white bg-black/40 hover:bg-white hover:text-slate-900 text-white font-bold text-sm tracking-wider transition-all flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>LOGIN</span>
                  </Link>

                  <Link
                    href="/authentication/register"
                    className="px-7 py-3 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wider transition-all shadow-md flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>REGISTER</span>
                  </Link>
                </div>
              </>
            )}

            {activeNav === 'ABOUT US' && (
              <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                  <Info className="w-5 h-5" />
                  <span>About FieldFlow</span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  FieldFlow is a home-services marketplace connecting customers directly with electricians, plumbers, and AC repair techs. Replacing WhatsApp/phone call chaos with streamlined booking, dispatch, and checklist tracking.
                </p>
              </div>
            )}

            {activeNav === 'HISTORY' && (
              <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                  <Clock className="w-5 h-5" />
                  <span>Service History</span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Sign in to view your past repair bookings, technician notes, and complete service records.
                </p>
                <Link href="/authentication/login" className="inline-block mt-2 px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded hover:bg-orange-600">
                  LOGIN TO VIEW
                </Link>
              </div>
            )}

            {activeNav === 'NOTIFICATION' && (
              <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                  <Bell className="w-5 h-5" />
                  <span>Live System Alerts</span>
                </div>
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between">
                    <span>⚡ Emergency Broadcast Active</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between">
                    <span>📍 Location Proof Service</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'CONTACT' && (
              <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                  <Mail className="w-5 h-5" />
                  <span>Contact Operations</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong>Hotline:</strong> +1 800 555 3435</p>
                  <p><strong>Email:</strong> support@fieldflow.com</p>
                  <p><strong>Operations:</strong> Central Dispatch Center</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* 5. ROLE DISCOVERY STRIP */}
      <section className="bg-white py-8 px-4 sm:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wide">Role-Based Access Portals</h2>
            <p className="text-slate-500 text-xs mt-1">Select your account type to proceed to sign in</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/authentication/login?role=customer" className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all">
              <User className="w-6 h-6 text-orange-500 mb-2" />
              <div className="font-bold text-sm text-slate-800">Customer</div>
              <p className="text-xs text-slate-500 mt-1">Book repair services & track arrival</p>
            </Link>

            <Link href="/authentication/login?role=technician" className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all">
              <Wrench className="w-6 h-6 text-orange-500 mb-2" />
              <div className="font-bold text-sm text-slate-800">Technician</div>
              <p className="text-xs text-slate-500 mt-1">Tap-driven job lists & status updates</p>
            </Link>

            <Link href="/authentication/login?role=dispatcher" className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all">
              <Radio className="w-6 h-6 text-orange-500 mb-2" />
              <div className="font-bold text-sm text-slate-800">Dispatcher</div>
              <p className="text-xs text-slate-500 mt-1">Assign jobs & emergency broadcasts</p>
            </Link>

            <Link href="/authentication/login?role=admin" className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all">
              <ShieldCheck className="w-6 h-6 text-orange-500 mb-2" />
              <div className="font-bold text-sm text-slate-800">Admin</div>
              <p className="text-xs text-slate-500 mt-1">Metrics, revenue & operational overview</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-500" />
            <span>FieldFlow Home Repair Platform</span>
          </div>
          <div>© {new Date().getFullYear()} FieldFlow. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
