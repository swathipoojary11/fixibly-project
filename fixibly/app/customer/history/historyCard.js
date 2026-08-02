"use client";

// fixibly/app/customer/history/historyCard.js
// Individual booking card rendering status badges, dates, and pricing details

import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

export default function HistoryCard({
  id,
  categoryName,
  problemName,
  service,
  technician,
  completedDate,
  status,
  estimatedAmount,
  description,
  image,
}) {
  // Status check for badge color rendering
  const isCompleted = status === 'Completed';
  const isCancelled = status === 'Cancelled';

  let badgeColor = "bg-blue-100 text-blue-700 border-blue-200";
  let badgeLabel = `Active (${status})`;

  if (isCompleted) {
    badgeColor = "bg-green-100 text-green-700 border-green-200";
    badgeLabel = "Completed";
  } else if (isCancelled) {
    badgeColor = "bg-red-100 text-red-700 border-red-200";
    badgeLabel = "Cancelled";
  }

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col lg:flex-row border border-gray-200">
      {/* Left Content */}
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4 items-center font-medium">
            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl text-gray-700 font-semibold">
              <CalendarDays size={15} className="text-orange-500" />
              {completedDate}
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl text-gray-700 font-semibold">
              <User size={15} className="text-orange-500" />
              {technician}
            </div>

            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${badgeColor}`}>
              {badgeLabel}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {service}
          </h2>

          <p className="text-gray-600 text-sm leading-6 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-1 text-gray-900 font-bold text-lg">
            <span className="text-xs text-gray-400 font-medium mr-1">Cost / Estimate:</span>
            {estimatedAmount ? `₹${estimatedAmount}` : 'Inspection Quote'}
          </div>

          <Link href={`/customer/bookingConfirmation?bookingId=${id}`}>
            <button className="border-2 border-orange-500 text-orange-500 px-5 py-2.5 rounded-xl hover:bg-orange-500 hover:text-white transition font-bold text-sm">
              View Booking Details & Tracking →
            </button>
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="lg:w-[320px] h-64 lg:h-auto overflow-hidden relative shrink-0">
        <img
          src={image}
          alt={service}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
      </div>
    </div>
  );
}