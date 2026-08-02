"use client";

import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  Receipt,
  CreditCard,
} from "lucide-react";

export default function BookingSuccessCard({ booking }) {
  if (!booking) return null;

  const displayAddress = `${booking.street || ''}, ${booking.area || ''}, ${booking.city || 'Mangalore'}`;
  const isEmergency = booking.emergency_flag;

  return (
    <section className="bg-white rounded-3xl shadow-xl overflow-hidden border">
      {/* Header */}
      <div className={`bg-gradient-to-r ${isEmergency ? 'from-amber-600 to-orange-600' : 'from-orange-500 to-orange-600'} text-white px-10 py-10`}>
        <div className="flex items-center gap-5">
          <div className="bg-white text-orange-500 p-4 rounded-full">
            <CheckCircle2 size={42} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">
              {booking.booking_status === 'Cancelled' ? 'Booking Cancelled' : 'Booking Confirmed'}
            </h1>
            <p className="mt-2 text-orange-100 text-lg">
              {booking.booking_status === 'Cancelled'
                ? 'This booking has been cancelled.'
                : 'Your request has been successfully received.'}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-10">
        {/* Booking ID & Payment Status */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-3">
              <Receipt className="text-orange-500" />
              <h3 className="text-lg font-semibold">Booking ID</h3>
            </div>
            <h2 className="text-3xl font-bold mt-4 tracking-wider text-orange-600">
              #{booking.booking_id}
            </h2>
            <p className="text-gray-500 mt-2">Save this ID for future reference.</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3">
              <CreditCard className="text-green-600" />
              <h3 className="text-lg font-semibold">Status & Pricing</h3>
            </div>
            <span className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-full font-semibold">
              Status: {booking.booking_status}
            </span>
            <p className="text-gray-500 mt-3 font-semibold">
              Estimated Amount: {booking.estimated_amount ? `₹${booking.estimated_amount}` : 'Inspection Required'}
            </p>
          </div>
        </div>

        {/* Booking Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-gray-50 rounded-2xl p-6">
            <CalendarDays className="text-orange-500 mb-4" />
            <p className="text-gray-500">Scheduled Date</p>
            <h3 className="font-bold text-xl mt-2">
              {booking.anytime_service ? 'Anytime Service' : (booking.preferred_date || 'As soon as available')}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <Clock3 className="text-orange-500 mb-4" />
            <p className="text-gray-500">Scheduled Time / Priority</p>
            <h3 className="font-bold text-xl mt-2">
              {booking.emergency_flag ? '🚨 EMERGENCY (Priority Dispatch)' : (booking.preferred_time || 'Anytime')}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <MapPin className="text-orange-500 mb-4" />
            <p className="text-gray-500">Service Location</p>
            <h3 className="font-bold text-xl mt-2 truncate">
              {displayAddress}
            </h3>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-10 bg-orange-100 border border-orange-300 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-orange-700">
            🎉 What Happens Next?
          </h2>
          <div className="mt-6 space-y-4 text-gray-700 leading-8">
            <p>✅ Your booking has been recorded in Supabase and notified to dispatchers.</p>
            <p>👨‍🔧 A verified technician will be assigned for your area.</p>
            <p>📱 Live status tracking update is rendered automatically on this page.</p>
          </div>
        </div>
      </div>
    </section>
  );
}