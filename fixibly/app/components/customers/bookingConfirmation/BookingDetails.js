"use client";

import {
  Wrench,
  MapPin,
  CalendarDays,
  Clock3,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function BookingDetails({ booking }) {
  if (!booking) return null;

  const categoryName = booking.service_categories?.category_name || "Service Category";
  const problemName = booking.service_problems?.problem_name || "Custom Service Request";
  const fullAddress = `${booking.house_number ? booking.house_number + ', ' : ''}${booking.apartment_name ? booking.apartment_name + ', ' : ''}${booking.street}, ${booking.area}, ${booking.city}, ${booking.state} - ${booking.pincode}`;

  return (
    <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8">
      {/* Heading */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-500 text-white p-3 rounded-full">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Booking Details</h2>
          <p className="text-gray-500 mt-1">Review your submitted booking information.</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Service Info */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Service Overview</h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Wrench className="text-orange-500" />
              <div>
                <p className="text-gray-500 text-sm">Category & Problem</p>
                <h4 className="font-semibold">{categoryName} - {problemName}</h4>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AlertTriangle className="text-orange-500" />
              <div>
                <p className="text-gray-500 text-sm">Emergency Booking</p>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${booking.emergency_flag ? 'bg-amber-600' : 'bg-gray-400'}`}>
                  {booking.emergency_flag ? 'YES (Priority)' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Service Address</h3>
          <div className="flex gap-4">
            <MapPin className="text-orange-500 mt-1" />
            <div>
              <p className="font-semibold">{fullAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <CalendarDays className="text-orange-500"/>
            <div>
              <p className="text-gray-500 text-sm">Preferred Date</p>
              <h4 className="font-semibold text-lg">
                {booking.anytime_service ? 'Anytime Service' : (booking.preferred_date || 'Not specified')}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Clock3 className="text-orange-500"/>
            <div>
              <p className="text-gray-500 text-sm">Preferred Time</p>
              <h4 className="font-semibold text-lg">
                {booking.anytime_service ? 'Anytime' : (booking.preferred_time || 'Not specified')}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Reported Issue Description */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-4">Reported Issue Description</h3>
        <p className="leading-8 text-gray-700">
          {booking.issue_description || 'No detailed issue description provided.'}
        </p>
        {booking.emergency_reason && (
          <div className="mt-3 pt-3 border-t border-orange-200 text-amber-800 text-sm font-semibold">
            Emergency Reason: {booking.emergency_reason}
          </div>
        )}
      </div>
    </section>
  );
}