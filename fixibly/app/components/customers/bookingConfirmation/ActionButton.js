"use client";

// fixibly/app/components/customers/bookingConfirmation/ActionButton.js
// Standalone Action Buttons section rendering separate "Mark Job Completed" and "Cancel Booking" buttons

import { CircleX, CheckCircle, Headphones, CheckCircle2 } from "lucide-react";

export default function ActionButtons({
  bookingStatus,
  onCancel,
  onComplete,
  isCancelled,
  isCompleted,
  allInspected
}) {
  // Render completion handshake action button for all active (non-cancelled and non-completed) bookings
  const isActiveBooking = !isCancelled && !isCompleted;

  return (
    <section className="mt-10 space-y-6">
      
      {/* SEPARATE STANDALONE "MARK JOB COMPLETED" ACTION BUTTON CARD */}
      {isActiveBooking && (
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-green-500 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-green-200">
              <CheckCircle2 size={18} />
              <span>Standalone Handshake Action</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Technician Finished the Work?
            </h3>
            <p className="text-sm text-green-100 font-medium">
              Tap the button below to confirm job completion & proceed to rate your technician.
            </p>
          </div>

          <button
            onClick={onComplete}
            disabled={!allInspected}
            className="w-full md:w-auto px-8 py-4 bg-white hover:bg-green-50 text-green-800 disabled:opacity-40 disabled:hover:bg-white font-extrabold rounded-2xl shadow-lg transition text-base whitespace-nowrap flex items-center justify-center gap-3 shrink-0"
          >
            <CheckCircle size={22} className="text-green-600" />
            <span>{allInspected ? "Mark Job Completed →" : "Check 3 Items Above First"}</span>
          </button>
        </div>
      )}

      {/* SECONDARY ACTION BUTTONS: CANCEL BOOKING & SUPPORT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* CANCEL BOOKING BUTTON */}
        {!isCancelled && !isCompleted && (
          <button
            onClick={onCancel}
            className="bg-white border-2 border-gray-200 rounded-2xl py-5 px-6 flex items-center justify-center gap-3 hover:border-red-500 hover:text-red-600 transition shadow text-gray-700 font-bold text-base"
          >
            <CircleX size={24} className="text-red-500" />
            <span>Cancel Booking</span>
          </button>
        )}

        {/* PLATFORM SUPPORT & FEEDBACK BUTTON */}
        <a
          href="/customer/customerfeedback"
          className="bg-white border-2 border-gray-200 rounded-2xl py-5 px-6 flex items-center justify-center gap-3 hover:border-orange-500 hover:text-orange-600 transition shadow text-gray-700 font-bold text-base"
        >
          <Headphones size={24} className="text-orange-500" />
          <span>Platform Support & Feedback</span>
        </a>

      </div>
    </section>
  );
}