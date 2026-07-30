"use client";

import Link from "next/link";
import { CalendarDays, User, Star } from "lucide-react";

export default function HistoryCard({
  id,
  service,
  technician,
  completedDate,
  rating,
  description,
  image,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col lg:flex-row">

      {/* Left Content */}

      <div className="flex-1 p-8">

        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">

          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-orange-500" />
            {completedDate}
          </div>

          <div className="flex items-center gap-2">
            <User size={18} className="text-orange-500" />
            {technician}
          </div>

        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {service}
        </h2>

        <p className="text-gray-600 leading-7">
          {description}
        </p>

        <div className="flex items-center gap-1 mt-5">

          {[...Array(rating)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className="fill-orange-500 text-orange-500"
            />
          ))}

        </div>

        <Link href={`/customer/history/${id}`}>
          <button className="mt-8 border border-orange-500 text-orange-500 px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition">
            View Details →
          </button>
        </Link>

      </div>

      {/* Right Image */}

      <div className="lg:w-[340px] h-72 overflow-hidden relative">

        <img
          src={image}
          alt={service}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />

      </div>

    </div>
  );
}