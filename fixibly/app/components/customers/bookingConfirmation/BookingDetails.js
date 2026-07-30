"use client";

import {
  User,
  Phone,
  Mail,
  Wrench,
  Home,
  MapPin,
  CalendarDays,
  Clock3,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function BookingDetails() {
  return (
    <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8">

      {/* Heading */}

      <div className="flex items-center gap-4 mb-8">

        <div className="bg-orange-500 text-white p-3 rounded-full">
          <FileText size={24} />
        </div>

        <div>

          <h2 className="text-3xl font-bold">
            Booking Details
          </h2>

          <p className="text-gray-500 mt-1">
            Review your submitted booking information.
          </p>

        </div>

      </div>

      {/* Details */}

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Customer */}

        <div className="bg-gray-50 rounded-2xl p-6">

          <h3 className="text-xl font-bold mb-6">
            Customer Information
          </h3>

          <div className="space-y-5">

            <div className="flex items-center gap-4">

              <User className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Full Name
                </p>

                <h4 className="font-semibold">
                  Swathi Poojary
                </h4>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <Phone className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Phone
                </p>

                <h4 className="font-semibold">
                  +91 9876543210
                </h4>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <Mail className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Email
                </p>

                <h4 className="font-semibold">
                  swathi@email.com
                </h4>

              </div>

            </div>

          </div>

        </div>

        {/* Service */}

        <div className="bg-gray-50 rounded-2xl p-6">

          <h3 className="text-xl font-bold mb-6">
            Service Information
          </h3>

          <div className="space-y-5">

            <div className="flex items-center gap-4">

              <Wrench className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Service Category
                </p>

                <h4 className="font-semibold">
                  Plumbing Service
                </h4>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <Home className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Property Type
                </p>

                <h4 className="font-semibold">
                  Apartment
                </h4>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <AlertTriangle className="text-orange-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Emergency Booking
                </p>

                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">

                  YES

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Address */}

      <div className="bg-gray-50 rounded-2xl p-6 mt-8">

        <h3 className="text-xl font-bold mb-5">
          Service Address
        </h3>

        <div className="flex gap-4">

          <MapPin className="text-orange-500 mt-1" />

          <div>

            <p className="font-semibold">
              House No 23, Bejai Main Road
            </p>

            <p className="text-gray-600">
              Mangalore, Karnataka - 575004
            </p>

          </div>

        </div>

      </div>

      {/* Schedule */}

      <div className="grid md:grid-cols-2 gap-8 mt-8">

        <div className="bg-gray-50 rounded-2xl p-6">

          <div className="flex items-center gap-4">

            <CalendarDays className="text-orange-500"/>

            <div>

              <p className="text-gray-500 text-sm">
                Preferred Date
              </p>

              <h4 className="font-semibold text-lg">
                30 July 2026
              </h4>

            </div>

          </div>

        </div>

        <div className="bg-gray-50 rounded-2xl p-6">

          <div className="flex items-center gap-4">

            <Clock3 className="text-orange-500"/>

            <div>

              <p className="text-gray-500 text-sm">
                Preferred Time
              </p>

              <h4 className="font-semibold text-lg">
                10:30 AM
              </h4>

            </div>

          </div>

        </div>

      </div>

      {/* Issue */}

      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-8">

        <h3 className="text-xl font-bold mb-4">
          Reported Issue
        </h3>

        <p className="leading-8 text-gray-700">

          Water leakage has been observed under the kitchen sink.
          The leakage increases whenever the tap is opened.
          Please inspect the pipeline and replace damaged fittings if required.

        </p>

      </div>

    </section>
  );
}