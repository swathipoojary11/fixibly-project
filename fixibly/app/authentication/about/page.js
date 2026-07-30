'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// 1. Keep standard UI icons from lucide-react
import { 
  Wrench, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Check, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Wind, 
  Droplets, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';

// 2. Import social brand icons from react-icons (Font Awesome 6 recommended)
import { 
  FaFacebook, 
  FaXTwitter, // or FaTwitter
  FaLinkedin, 
  FaInstagram 
} from 'react-icons/fa6';

const testimonials = [
  {
    id: 1,
    name: 'Madeline Gibson',
    role: 'Homeowner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    quote: 'FieldFlow sent a certified electrician within 30 minutes of our circuit breaker failing. Professional, clean work, and zero hidden fees!'
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Property Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    quote: 'Managing 20+ residential units used to be chaotic. FieldFlow plumbers and AC repair technicians handle emergency dispatches seamlessly with digital job checklists.'
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'Commercial Facility Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    quote: 'Our office central AC unit broke down during a heatwave. FieldFlow dispatched a top HVAC master tech who diagnosed and fixed the issue on the spot.'
  }
];

export default function AboutPage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[testimonialIdx];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* 1. TOP UTILITY HEADER BAR */}
      <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-4">
         {/* Example replacement in your JSX */}
<a href="#" className="hover:text-orange-400 transition-colors">
  <FaFacebook className="w-4 h-4" />
</a>
<a href="#" className="hover:text-orange-400 transition-colors">
  <FaXTwitter className="w-4 h-4" />
</a>
<a href="#" className="hover:text-orange-400 transition-colors">
  <FaLinkedin className="w-4 h-4" />
</a>
<a href="#" className="hover:text-orange-400 transition-colors">
  <FaInstagram className="w-4 h-4" />
</a>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline-block">Support: +1 (800) 555-FIELD</span>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:inline-block">Hours: 24/7 Certified Electrical, Plumbing & AC Dispatch</span>
        </div>
      </div>

      {/* 2. MAIN BRANDING HEADER */}
      <header className="bg-white py-4 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm font-bold group-hover:bg-orange-600 transition-colors">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                FIELD<span className="text-orange-500">FLOW</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Electrical, Plumbing & AC Repair Platform</p>
            </div>
          </Link>

          {/* Contact Info Widgets */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-200">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Emergency Hotline</span>
                <span className="text-sm font-bold text-slate-900">+1 800 555 3435</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-200">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Operations Hub</span>
                <span className="text-sm font-bold text-slate-900">City Service & Dispatch Center</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 3. ORANGE NAVIGATION BAR */}
      <nav className="bg-orange-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-start space-x-6 sm:space-x-8 py-3 text-xs sm:text-sm font-bold text-white tracking-wider overflow-x-auto">
            <Link href="/" className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50">
              HOME
            </Link>
            <Link href="/about" className="py-1 transition-all whitespace-nowrap border-b-2 border-white font-extrabold text-white">
              ABOUT US
            </Link>
            <Link href="/" className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50">
              HISTORY
            </Link>
            <Link href="/" className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50">
              NOTIFICATION
            </Link>
            <Link href="/contact" className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50">
              CONTACT
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. HERO / BREADCRUMB HEADER BANNER */}
      <div className="relative bg-slate-950 text-white py-14 px-6 sm:px-12 overflow-hidden border-b border-slate-800">
        
        {/* Subtle decorative outline graphic */}
        <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none text-slate-300 select-none">
          <svg className="w-80 h-80" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,30 A20,20 0 1,0 50,70 A20,20 0 1,0 50,30 Z M50,5 A45,45 0 0,1 95,50 A45,45 0 0,1 50,95 A45,45 0 0,1 5,50 A45,45 0 0,1 50,5 Z" fillRule="evenodd" />
          </svg>
        </div>

        <div className="absolute right-12 bottom-6 opacity-15 pointer-events-none">
          <Zap className="w-36 h-36 text-slate-400 rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            About Us
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <span className="text-orange-500 font-bold">&gt;</span>
            <span className="text-orange-500">About</span>
          </div>
        </div>
      </div>

      {/* 5. WHY CHOOSE US SECTION (Collage & Stats) */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-orange-600 uppercase mb-2">
                <span>WHY CHOOSE US</span>
                <span className="w-8 h-[2px] bg-orange-600 inline-block"></span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                Empowering Your Home & Business One Service at a Time
              </h2>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              FieldFlow bridges the gap between homeowners and certified electrical, plumbing, and AC repair experts. We eliminate chaotic phone calls with instant digital booking, real-time technician location tracking, verified digital proof of work, and transparent pricing.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {[
                'Certified Electrical & Master Plumbing Services',
                'Emergency AC & HVAC cooling diagnostics',
                'Background-verified & licensed field technicians',
                '24/7 rapid response dispatch & digital job checklists'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 text-xs sm:text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 rounded font-extrabold text-xs tracking-wider uppercase shadow-md transition-all group"
              >
                <span>BOOK SERVICE NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column Image Collage */}
          <div className="lg:col-span-6 relative pt-4 pb-8 sm:py-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Large Image */}
              <div className="relative rounded-lg overflow-hidden border-r-4 border-t-4 border-orange-600 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop" 
                  alt="Certified Electrician and HVAC Technician repairing equipment" 
                  className="w-full h-[380px] sm:h-[430px] object-cover"
                />
              </div>

              {/* Stat Badge Box Overlay */}
              <div className="absolute left-4 bottom-[-20px] sm:bottom-[-25px] bg-orange-600 text-white p-4 sm:p-5 rounded-lg shadow-xl flex items-center gap-4 z-20 border-2 border-white">
                <div className="w-12 h-12 bg-orange-700 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black leading-none">6.5k+</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-100 mt-1">Trusted Bookings</div>
                </div>
              </div>

              {/* Secondary Overlapping Inset Image */}
              <div className="absolute right-[-10px] sm:right-[-20px] bottom-[-40px] sm:bottom-[-50px] w-48 sm:w-60 h-36 sm:h-44 rounded-lg overflow-hidden border-4 border-white shadow-2xl z-10 hidden sm:block">
                <img 
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=500&auto=format&fit=crop" 
                  alt="Plumbing and Pipe maintenance specialist" 
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. CLIENTS TESTIMONIAL SECTION */}
      <section className="py-16 px-6 sm:px-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Image with Carousel Arrows */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-lg overflow-hidden shadow-lg border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop" 
                  alt="Technician explaining repair job details to customer" 
                  className="w-full h-[280px] sm:h-[320px] object-cover"
                />
              </div>

              {/* Slider Navigation Controls */}
              <div className="flex items-center justify-start gap-2">
                <button 
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded bg-white hover:bg-orange-600 hover:text-white text-slate-700 flex items-center justify-center border border-slate-200 transition-colors shadow-sm"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded bg-white hover:bg-orange-600 hover:text-white text-slate-700 flex items-center justify-center border border-slate-200 transition-colors shadow-sm"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side Content & Card */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-orange-600 uppercase mb-2">
                  <span>CLIENTS TESTIMONIAL</span>
                  <span className="w-8 h-[2px] bg-orange-600 inline-block"></span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  Performance that Speaks Volumes
                </h2>
              </div>

              {/* Floating Testimonial Review Box */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xl border border-slate-100 relative">
                
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">
                      {currentTestimonial.role}
                    </p>
                  </div>

                  <img 
                    src={currentTestimonial.avatar} 
                    alt={currentTestimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                  />
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                  "{currentTestimonial.quote}"
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. RED/ORANGE BRAND EMBLEM STRIP */}
      <section className="bg-gradient-to-r from-orange-600 via-orange-600 to-red-600 text-white py-10 px-6 sm:px-12 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
          
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-center">Licensed Electrical</span>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-center">Master Plumbing</span>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <Wind className="w-7 h-7 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-center">HVAC & AC Cooling</span>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-center">Verified Technicians</span>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-pointer col-span-2 md:col-span-1">
            <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-center">24/7 Rapid Dispatch</span>
          </div>

        </div>
      </section>

      {/* 8. DARK FEATURE HIGHLIGHT SECTION */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Service Work Photo */}
          <div className="lg:col-span-6">
            <div className="rounded-lg overflow-hidden border-2 border-slate-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop" 
                alt="Electrical panel and home service equipment" 
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
            </div>
          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-orange-500 uppercase mb-2">
                <span>ABOUT US</span>
                <span className="w-8 h-[2px] bg-orange-500 inline-block"></span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Delivering Confidence One Repair at a Time
              </h2>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Whether it’s a sudden power grid failure, a leaking water pipe, or a broken AC unit in peak summer, FieldFlow connects you to top-rated master technicians with digital proof-of-work and GPS tracking.
            </p>

            {/* Feature Cards Grid */}
            <div className="space-y-4 pt-2">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 rounded bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white mb-1">
                    Air Conditioning & HVAC Maintenance
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Complete AC compressor diagnostics, duct cleaning, refrigerant recharge, thermostat installation, and annual preventive cooling maintenance.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 rounded bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white mb-1">
                    Electrical & Plumbing Emergency Repairs
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Circuit breaker panel upgrades, short-circuit troubleshooting, pipe leak repair, drain unclogging, and instant water heater servicing.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 9. WORK PROCESS SECTION */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-extrabold tracking-widest text-orange-600 uppercase">
              <span className="w-6 h-[2px] bg-orange-600 inline-block"></span>
              <span>WORK PROCESS</span>
              <span className="w-6 h-[2px] bg-orange-600 inline-block"></span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              When Quality Counts Count on Us
            </h2>
          </div>

          {/* 3 Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 text-center pt-12 relative hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mb-3 mt-2">
                Electrical Repairs
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Complete house rewiring, breaker panel upgrades, short-circuit diagnostics, EV charger setup, and custom indoor/outdoor lighting installation.
              </p>

              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:text-orange-600 uppercase tracking-wider group-hover:translate-x-0.5 transition-all"
              >
                <span>BOOK ELECTRICIAN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 text-center pt-12 relative hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Droplets className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mb-3 mt-2">
                Plumbing & Drain Cleaning
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Rapid pipe leak detection, main drain unclogging, water heater replacement, bathroom fixture fittings, and hydro-jetting services.
              </p>

              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:text-orange-600 uppercase tracking-wider group-hover:translate-x-0.5 transition-all"
              >
                <span>BOOK PLUMBER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 text-center pt-12 relative hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Wind className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mb-3 mt-2">
                AC & HVAC Servicing
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Emergency air conditioning repair, freon gas refilling, compressor overhauls, duct cleaning, and smart thermostat integration.
              </p>

              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:text-orange-600 uppercase tracking-wider group-hover:translate-x-0.5 transition-all"
              >
                <span>BOOK AC TECH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-6 px-4 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-500" />
            <span>FieldFlow - Electrical, Plumbing & AC Repair Platform</span>
          </div>
          <div>© {new Date().getFullYear()} FieldFlow. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
