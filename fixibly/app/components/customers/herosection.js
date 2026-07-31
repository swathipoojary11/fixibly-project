"use client";
import Image from "next/image";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function HeroSection() {
const router = useRouter();
  return (
    <section className="relative items-center bg-[#111827] text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage:"url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1920&auto=format&fit=crop')", }}> </div>
      <div className="relative z-10 w-full mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-center gap-16">
        <div className="lg:w-1/2">
          <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            HOME REPAIR SERVICES
          </span>
          <h1 className="text-7xl lg:text-6xl font-bold leading-tight mb-6">
            Book Trusted
            <br />
            Home Services
          </h1>
          <p className="text-gray-300 text-lg leading-8 mb-8">
            Find verified professionals for plumbing, electrical,
            AC repair, cleaning, painting, carpentry and more.
            Book appointments in minutes with real-time tracking.
          </p>
          <div className="flex gap-5">
            <button onClick={() => router.push('/customer/categories')} className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-lg font-semibold">
              Explore Services
            </button>
            <button onClick={() => router.push('/customer/history')} className="border border-white hover:bg-white hover:text-black transition px-8 py-4 rounded-lg font-semibold">
              View History
            </button>
          </div>
        </div>
      
        {/* <div className="relative lg:w-1/2 flex justify-center">

          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdPL9_qBQgtKiVcKRIu8dtHsgQL8k1rGfxFBo5WCKsPA&s=10"
            alt="Technician"
            width={450}
            height={600}
            priority
          /> 

     

          <div className="absolute top-10 right-0 bg-orange-500 rounded-2xl p-8 shadow-2xl w-72">

            <div className="mb-6 border-b border-orange-300 pb-4">
              <h2 className="text-4xl font-bold">250+</h2>
              <p className="text-orange-100">
                Verified Technicians
              </p>
            </div>

            <div className="mb-6 border-b border-orange-300 pb-4">
              <h2 className="text-4xl font-bold">15+</h2>
              <p className="text-orange-100">
                Service Categories
              </p>
            </div>

            <div className="mb-6 border-b border-orange-300 pb-4">
              <h2 className="text-4xl font-bold">24/7</h2>
              <p className="text-orange-100">
                Emergency Support
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">4.8★</h2>
              <p className="text-orange-100">
                Customer Rating
              </p>
            </div>

          </div>

        </div> */}

      </div>
    </section>
  );
}