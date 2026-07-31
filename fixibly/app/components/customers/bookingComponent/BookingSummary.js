"use client";

import {
  ClipboardList,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export default function BookingSummary() {

  return (

    <div className="sticky top-24">

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}

        <div className="bg-black text-white p-6">

          <p className="text-orange-500 text-xs uppercase tracking-[3px] font-semibold">
            Review
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Booking Summary
          </h2>

        </div>


        <div className="p-6">

          {/* SERVICE */}

          <div className="flex gap-4 pb-6 border-b">

            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
              <ClipboardList
                className="text-orange-500"
                size={22}
              />
            </div>

            <div>

              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Service
              </p>

              <h3 className="font-bold mt-1">
                Plumbing Services
              </h3>

            </div>

          </div>


          {/* PROBLEM */}

          <div className="py-5 border-b">

            <p className="text-xs text-gray-500">
              Problem
            </p>

            <p className="font-semibold mt-1">
              Not selected
            </p>

          </div>


          {/* DATE */}

          <div className="py-5 border-b space-y-4">

            <div className="flex gap-3 items-center">

              <CalendarDays
                size={18}
                className="text-orange-500"
              />

              <div>

                <p className="text-xs text-gray-500">
                  Date
                </p>

                <p className="font-semibold">
                  Not selected
                </p>

              </div>

            </div>


            <div className="flex gap-3 items-center">

              <Clock
                size={18}
                className="text-orange-500"
              />

              <div>

                <p className="text-xs text-gray-500">
                  Time
                </p>

                <p className="font-semibold">
                  Anytime
                </p>

              </div>

            </div>


            <div className="flex gap-3 items-center">

              <MapPin
                size={18}
                className="text-orange-500"
              />

              <div>

                <p className="text-xs text-gray-500">
                  Address
                </p>

                <p className="font-semibold">
                  Not provided
                </p>

              </div>

            </div>

          </div>


          {/* PRICE */}

          <div className="py-6">

            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Estimated Total
            </p>

            <div className="flex justify-between items-end mt-3">

              <span className="text-gray-600">
                Service charge
              </span>

              <span className="font-semibold">
                --
              </span>

            </div>

            <div className="flex justify-between items-end mt-3">

              <span className="text-gray-600">
                Platform fee
              </span>

              <span className="font-semibold">
                --
              </span>

            </div>


            <div className="border-t mt-5 pt-5 flex justify-between items-center">

              <span className="font-bold text-lg">
                Total
              </span>

              <span className="text-3xl font-bold text-orange-500">
                --
              </span>

            </div>

          </div>


          {/* TRUST */}

          <div className="bg-gray-50 rounded-2xl p-4">

            <div className="flex gap-3">

              <ShieldCheck
                className="text-orange-500 shrink-0"
                size={20}
              />

              <p className="text-sm text-gray-600">
                Your booking details are securely processed and shared only
                with the required service team.
              </p>

            </div>

            <div className="flex gap-3 mt-3">

              <CreditCard
                className="text-orange-500 shrink-0"
                size={20}
              />

              <p className="text-sm text-gray-600">
                Emergency bookings may require an advance payment.
              </p>

            </div>

          </div>


          {/* CONFIRM */}

          <button
            type="button"
            className="w-full mt-6 bg-black hover:bg-orange-500 text-white py-4 rounded-xl font-bold transition"
          >
            Confirm Booking
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Final confirmation will be available after review.
          </p>

        </div>

      </div>

    </div>
  );
}