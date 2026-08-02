"use client";

import {
  Phone,
  MessageCircle,
  Star,
  BadgeCheck,
  Clock3,
} from "lucide-react";

export default function TechnicianCard({ technician, booking }) {
  if (!technician) {
    return (
      <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Technician Assignment Pending</h2>
        <p className="text-gray-500 mt-2">A verified technician will be assigned to your booking shortly by the dispatcher.</p>
      </section>
    );
  }

  const techUser = technician.users || {};
  const name = techUser.full_name || "Assigned Technician";
  const phone = techUser.phone || "N/A";
  const rating = technician.rating || "4.8";
  const experience = technician.experience ? `${technician.experience} Years` : "Experienced";
  const photo = technician.profile_picture || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500";

  return (
    <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Assigned Technician</h2>
          <p className="text-gray-500 mt-2">Your service professional has been assigned.</p>
        </div>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
          {technician.availability_status || "Assigned"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <img
          src={photo}
          alt={name}
          className="w-44 h-44 rounded-3xl object-cover shadow-lg"
        />

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">{name}</h2>
            <BadgeCheck className="text-blue-500" />
          </div>

          <p className="text-orange-500 font-semibold mt-2">Verified Professional</p>

          <div className="flex gap-8 mt-6">
            <div>
              <p className="text-gray-500">Rating</p>
              <div className="flex items-center gap-1 mt-1">
                <Star fill="#F97316" className="text-orange-500" size={18} />
                <span className="font-bold">{rating}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-500">Experience</p>
              <h4 className="font-bold mt-1">{experience}</h4>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock3 size={18} />
                <span className="font-bold">{phone}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-5 mt-8">
            <a href={`tel:${phone}`} className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-xl font-semibold">
              <Phone size={20} />
              Call Technician
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}