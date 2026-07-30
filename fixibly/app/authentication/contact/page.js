'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// 1. Standard UI icons from lucide-react
// 1. Keep UI icons from lucide-react (without Facebook, Twitter, Linkedin, Instagram)
import { 
  Wrench, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  Send,
  Zap,
  Droplets,
  Wind,
  Clock,
  Check
} from 'lucide-react';

// 2. Import your brand icons from react-icons
import { 
  FaFacebook, 
  FaXTwitter, 
  FaLinkedin, 
  FaInstagram 
} from 'react-icons/fa6';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Electrical Repair',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', service: 'Electrical Repair', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* 1. TOP UTILITY HEADER BAR */}
      <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-4">
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
                <span className="text-sm font-bold text-slate-900">Central Dispatch Center</span>
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
            <Link href="/about" className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50">
              ABOUT US
            </Link>
            <Link href="/" className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50">
              HISTORY
            </Link>
            <Link href="/" className="py-1 transition-all whitespace-nowrap border-b-2 border-transparent text-white/90 hover:text-white hover:border-white/50">
              NOTIFICATION
            </Link>
            <Link href="/contact" className="py-1 transition-all whitespace-nowrap border-b-2 border-white font-extrabold text-white">
              CONTACT
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. HERO / BREADCRUMB HEADER BANNER */}
      <div className="relative bg-slate-950 text-white py-14 px-6 sm:px-12 overflow-hidden border-b border-slate-800">
        
        <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none text-slate-300 select-none">
          <svg className="w-80 h-80" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,30 A20,20 0 1,0 50,70 A20,20 0 1,0 50,30 Z M50,5 A45,45 0 0,1 95,50 A45,45 0 0,1 50,95 A45,45 0 0,1 5,50 A45,45 0 0,1 50,5 Z" fillRule="evenodd" />
          </svg>
        </div>

        <div className="absolute right-12 bottom-6 opacity-15 pointer-events-none">
          <Mail className="w-36 h-36 text-slate-400 rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Contact
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <span className="text-orange-500 font-bold">&gt;</span>
            <span className="text-orange-500">Contact</span>
          </div>
        </div>
      </div>

      {/* 5. CONTACT CONTENT SECTION */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 bg-white flex-1">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-8">
            
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">
                Let Us Know About Your Next Project
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have a question about our electrical rewiring, plumbing leak repairs, or AC maintenance services? Reach out directly to our central dispatch center.
              </p>
            </div>

            {/* Info Cards List */}
            <div className="space-y-6">
              
              {/* Location Card */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-md bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-6 h-6 fill-white text-orange-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">
                    Location
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Dhaka 102, utl 1216, road 45 house of street
                  </p>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    Central Dispatch Hub, Suite 400
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-md bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-6 h-6 fill-white text-orange-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">
                    Phone number
                  </h3>
                  <p className="text-slate-800 font-bold text-xs sm:text-sm">
                    +88 0123456789
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    1234 - 000 - 000
                  </p>
                  <p className="text-orange-600 text-xs font-bold mt-0.5">
                    Toll Free: +1 (800) 555-FIELD
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-md bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-6 h-6 fill-white text-orange-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">
                    Emails
                  </h3>
                  <p className="text-slate-700 text-xs sm:text-sm font-medium">
                    info@exampleyourmail.com
                  </p>
                  <p className="text-slate-700 text-xs sm:text-sm font-medium">
                    support@fieldflow.com
                  </p>
                </div>
              </div>

            </div>

            <hr className="border-slate-200" />

            
{/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 rounded bg-slate-100 text-slate-600 hover:bg-orange-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded bg-slate-100 text-slate-600 hover:bg-orange-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Twitter"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded bg-slate-100 text-slate-600 hover:bg-orange-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded bg-slate-100 text-slate-600 hover:bg-orange-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>

             </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-10 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Send Us a Message
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Fill out the form below to request a service callback or project quote.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900">Message Received!</h4>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Thank you for reaching out. Our dispatch team has logged your inquiry and will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Service Required
                    </label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                    >
                      <option value="Electrical Repair">⚡ Electrical Repair & Rewiring</option>
                      <option value="Plumbing Service">💧 Plumbing & Pipe Leak Fix</option>
                      <option value="AC Servicing">❄️ AC Maintenance & Cooling</option>
                      <option value="Emergency Dispatch">🚨 24/7 Emergency Dispatch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project / Issue Details *
                  </label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Describe your service request or issue..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>SEND MESSAGE</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* 6. FOOTER */}
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
