
// app/components/customers/bookingComponent/ElderlySupport.js
"use client";

import { Phone, Headphones, ArrowRight } from "lucide-react";

export default function ElderlySupport({ dispatcherPhone = "+919876543210" }) {
  return (
    <section className="bg-[#0F172A] py-10 rounded-2xl text-white my-6">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shrink-0">
              <Headphones size={24} />
            </div>

            <div>
              <p className="text-[#FF5500] text-xs uppercase tracking-wider font-bold">
                Need Help Booking?
              </p>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Senior Citizen & Elderly Assistance
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                Prefer not to fill out the form? Call our dedicated hotline to speak directly with an emergency dispatcher.
              </p>
            </div>
          </div>

          <a
            href={`tel:${dispatcherPhone}`}
            className="flex items-center gap-2 bg-[#FF5500] hover:bg-[#e04b00] text-white px-5 py-3 rounded-xl font-bold text-xs transition shrink-0 shadow-md"
          >
            <Phone size={16} />
            <span>Call Dispatcher Now</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}