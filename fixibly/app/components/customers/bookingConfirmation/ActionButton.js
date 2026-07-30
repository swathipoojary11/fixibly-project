"use client";

import {
  MapPinned,
  PhoneCall,
  CircleX,
  Headphones,
} from "lucide-react";

export default function ActionButtons() {
  return (
    <section className="mt-10">

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <button className="bg-orange-500 hover:bg-orange-600 transition text-white rounded-2xl py-6 flex flex-col items-center gap-3 shadow-lg">

          <MapPinned size={30} />

          <span className="font-semibold">
            Track Location
          </span>

        </button>

        <button className="bg-white border rounded-2xl py-6 flex flex-col items-center gap-3 hover:border-orange-500 hover:text-orange-500 transition shadow">

          <PhoneCall size={30} />

          <span className="font-semibold">
            Contact Technician
          </span>

        </button>

        <button className="bg-white border rounded-2xl py-6 flex flex-col items-center gap-3 hover:border-red-500 hover:text-red-500 transition shadow">

          <CircleX size={30} />

          <span className="font-semibold">
            Cancel Booking
          </span>

        </button>

        <button className="bg-white border rounded-2xl py-6 flex flex-col items-center gap-3 hover:border-orange-500 hover:text-orange-500 transition shadow">

          <Headphones size={30} />

          <span className="font-semibold">
            Contact Support
          </span>

        </button>

      </div>

    </section>
  );
}