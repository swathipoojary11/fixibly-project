"use client";

import {
  Phone,
  MessageCircle,
  Star,
  BadgeCheck,
  Clock3,
} from "lucide-react";

export default function TechnicianCard() {
  return (
    <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            Assigned Technician
          </h2>

          <p className="text-gray-500 mt-2">
            Your service professional has been assigned.
          </p>

        </div>

        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
          Available
        </span>

      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Photo */}

        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500"
          alt="Technician"
          className="w-44 h-44 rounded-3xl object-cover shadow-lg"
        />

        {/* Details */}

        <div className="flex-1">

          <div className="flex items-center gap-3">

            <h2 className="text-3xl font-bold">
              Rakesh Sharma
            </h2>

            <BadgeCheck className="text-blue-500" />
          </div>

          <p className="text-orange-500 font-semibold mt-2">
            Plumbing Specialist
          </p>

          <div className="flex gap-8 mt-6">

            <div>

              <p className="text-gray-500">
                Rating
              </p>

              <div className="flex items-center gap-1 mt-1">

                <Star
                  fill="#F97316"
                  className="text-orange-500"
                  size={18}
                />

                <span className="font-bold">
                  4.9
                </span>

              </div>

            </div>

            <div>

              <p className="text-gray-500">
                Experience
              </p>

              <h4 className="font-bold mt-1">
                8 Years
              </h4>

            </div>

            <div>

              <p className="text-gray-500">
                ETA
              </p>

              <div className="flex items-center gap-2 mt-1">

                <Clock3 size={18} />

                <span className="font-bold">
                  25 mins
                </span>

              </div>

            </div>

          </div>

          <div className="flex gap-5 mt-8">

            <button className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-xl">

              <Phone size={20} />

              Call

            </button>

            <button className="flex items-center gap-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl">

              <MessageCircle size={20} />

              Chat

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}