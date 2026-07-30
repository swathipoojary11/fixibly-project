"use client";

import {
  BadgeCheck,
  CalendarDays,
  MapPin,
  Wrench,
  Star,
} from "lucide-react";

export default function TechnicianCard() {
  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 mb-10">

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Technician Image */}

        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600"
          alt="Technician"
          className="w-56 h-56 rounded-3xl object-cover"
        />

        {/* Details */}

        <div className="flex-1">

          <div className="flex items-center gap-3">

            <h2 className="text-3xl font-bold">
              Rakesh Sharma
            </h2>

            <BadgeCheck
              className="text-blue-500"
              size={28}
            />

          </div>

          <p className="text-orange-500 font-semibold mt-2">
            Plumbing Specialist
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="flex gap-4">

              <CalendarDays className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Completed On
                </p>

                <h4 className="font-semibold">
                  29 July 2026
                </h4>

              </div>

            </div>

            <div className="flex gap-4">

              <MapPin className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Service Location
                </p>

                <h4 className="font-semibold">
                  Mangalore
                </h4>

              </div>

            </div>

            <div className="flex gap-4">

              <Wrench className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Booking ID
                </p>

                <h4 className="font-semibold">
                  BK102348
                </h4>

              </div>

            </div>

            <div className="flex gap-4">

              <Star
                className="text-yellow-500"
                fill="#facc15"
              />

              <div>

                <p className="text-gray-500 text-sm">
                  Technician Rating
                </p>

                <h4 className="font-semibold">
                  4.9 / 5
                </h4>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}