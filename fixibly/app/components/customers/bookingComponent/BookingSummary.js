
//app/components/customers/bookingComponent/BookingSummary.js
"use client";
import {
  ClipboardList,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export default function BookingSummary({
  categoryName = "Service",
  problemName = "Not selected",
  preferredDate,
  preferredTime,
  anytimeService,
  address,
  priceSummary,
  step,
  loading,
  onConfirm
}) {
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
          <div className="flex gap-4 pb-6 border-b border-gray-100">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <ClipboardList className="text-orange-500" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Service Category
              </p>
              <h3 className="font-bold mt-1 text-gray-900">
                {categoryName}
              </h3>
            </div>
          </div>

          {/* PROBLEM */}
          <div className="py-5 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Selected Problem
            </p>
            <p className="font-semibold mt-1 text-gray-800">
              {problemName}
            </p>
          </div>

          {/* SCHEDULE & ADDRESS */}
          <div className="py-5 border-b border-gray-100 space-y-4">
            <div className="flex gap-3 items-center">
              <CalendarDays size={18} className="text-orange-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">
                  {anytimeService ? "Anytime (Earliest Slot)" : preferredDate || "Not selected"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Clock size={18} className="text-orange-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="font-semibold text-gray-800">
                  {anytimeService ? "First Available" : preferredTime || "Not selected"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Service Location</p>
                <p className="font-semibold text-gray-800 text-xs leading-relaxed">
                  {address || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* ESTIMATED TOTAL */}
          <div className="py-6">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Pricing Breakdown
            </p>

            <div className="flex justify-between items-end mt-3">
              <span className="text-gray-600 text-sm">Base / Inspection Fee</span>
              <span className="font-semibold text-gray-900">
                {priceSummary ? (typeof priceSummary.baseOrInspectionFee === 'number' ? `₹${priceSummary.baseOrInspectionFee}` : priceSummary.baseOrInspectionFee) : '--'}
              </span>
            </div>

            {priceSummary?.emergencySurcharge > 0 && (
              <div className="flex justify-between items-end mt-2 text-amber-600">
                <span className="text-sm">Emergency Surcharge</span>
                <span className="font-semibold">+ ₹{priceSummary.emergencySurcharge}</span>
              </div>
            )}

            <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between items-center">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="text-2xl font-bold text-orange-500">
                {priceSummary ? (typeof priceSummary.grandTotal === 'number' ? `₹${priceSummary.grandTotal}` : priceSummary.grandTotal) : '--'}
              </span>
            </div>
          </div>

          {/* TRUST BADGES */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex gap-3">
              <ShieldCheck className="text-orange-500 shrink-0" size={20} />
              <p className="text-xs text-gray-600">
                Your details are auto-verified and routed directly to certified technicians.
              </p>
            </div>
            <div className="flex gap-3">
              <CreditCard className="text-orange-500 shrink-0" size={20} />
              <p className="text-xs text-gray-600">
                Emergency dispatch may require advance confirmation payment.
              </p>
            </div>
          </div>

          {/* CONFIRM BUTTON */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={step < 2 || loading}
            className="w-full mt-6 bg-black hover:bg-orange-500 text-white py-4 rounded-xl font-bold transition disabled:opacity-40"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}