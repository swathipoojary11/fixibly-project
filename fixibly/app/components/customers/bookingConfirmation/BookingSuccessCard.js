"use client";

import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  Receipt,
  CreditCard,
} from "lucide-react";

export default function BookingSuccessCard() {
  return (
    <section className="bg-white rounded-3xl shadow-xl overflow-hidden border">

      {/* Header */}

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-10">

        <div className="flex items-center gap-5">

          <div className="bg-white text-orange-500 p-4 rounded-full">
            <CheckCircle2 size={42} />
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              Booking Confirmed
            </h1>

            <p className="mt-2 text-orange-100 text-lg">
              Your request has been successfully received.
            </p>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-10">

        {/* Booking ID */}

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">

            <div className="flex items-center gap-3">

              <Receipt className="text-orange-500" />

              <h3 className="text-lg font-semibold">
                Booking ID
              </h3>

            </div>

            <h2 className="text-3xl font-bold mt-4 tracking-wider text-orange-600">
              BK-2026-001245
            </h2>

            <p className="text-gray-500 mt-2">
              Save this ID for future reference.
            </p>

          </div>

          {/* Payment */}

          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">

            <div className="flex items-center gap-3">

              <CreditCard className="text-green-600" />

              <h3 className="text-lg font-semibold">
                Payment Status
              </h3>

            </div>

            <span className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-full font-semibold">

              Payment Successful

            </span>

            <p className="text-gray-500 mt-3">
              Your booking has been confirmed successfully.
            </p>

          </div>

        </div>

        {/* Booking Info */}

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-gray-50 rounded-2xl p-6">

            <CalendarDays className="text-orange-500 mb-4" />

            <p className="text-gray-500">
              Booking Date
            </p>

            <h3 className="font-bold text-xl mt-2">
              29 July 2026
            </h3>

          </div>

          <div className="bg-gray-50 rounded-2xl p-6">

            <Clock3 className="text-orange-500 mb-4" />

            <p className="text-gray-500">
              Estimated Arrival
            </p>

            <h3 className="font-bold text-xl mt-2">
              Within 2 Hours
            </h3>

          </div>

          <div className="bg-gray-50 rounded-2xl p-6">

            <MapPin className="text-orange-500 mb-4" />

            <p className="text-gray-500">
              Service Location
            </p>

            <h3 className="font-bold text-xl mt-2">
              Mangalore, Karnataka
            </h3>

          </div>

        </div>

        {/* Success Message */}

        <div className="mt-10 bg-orange-100 border border-orange-300 rounded-2xl p-8">

          <h2 className="text-2xl font-bold text-orange-700">

            🎉 What Happens Next?

          </h2>

          <div className="mt-6 space-y-4 text-gray-700 leading-8">

            <p>
              ✅ Your booking has been sent to the dispatcher.
            </p>

            <p>
              👨‍🔧 A suitable technician will be assigned shortly.
            </p>

            <p>
              📱 You'll receive updates as the technician accepts the request and starts traveling.
            </p>

            <p>
              🚨 Emergency bookings receive higher priority.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}