"use client";

// fixibly/app/customer/bookingConfirmation/page.js
// Booking Confirmation & Tracking page featuring separate "Mark Job Completed" action section and live tracking

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import BookingSuccessCard from "@/app/components/customers/bookingConfirmation/BookingSuccessCard";
import BookingDetails from "@/app/components/customers/bookingConfirmation/BookingDetails";
import TechnicianCard from "@/app/components/customers/bookingConfirmation/TechnicianCard";
import TrackingTimeline from "@/app/components/customers/bookingConfirmation/TrackingTimeline";
import ActionButtons from "@/app/components/customers/bookingConfirmation/ActionButton";

function BookingConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [bookingData, setBookingData] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Quick 3-item verification checklist state
  const [inspectionChecks, setInspectionChecks] = useState({
    workInspected: false,
    serviceSatisfactory: false,
    areaCleaned: false
  });

  // Fetch booking details & tracking timeline on page load
  const fetchBookingInfo = async () => {
    if (!bookingId) {
      setError("No booking ID specified in URL.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    try {
      // Fetching booking details from GET /api/customer/bookings/:bookingId
      const detailsRes = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const detailsJson = await detailsRes.json();

      // Fetching status tracking history from GET /api/customer/bookings/:bookingId/tracking
      const trackingRes = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}/tracking`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const trackingJson = await trackingRes.json();

      if (detailsJson.success) {
        setBookingData(detailsJson.booking || detailsJson.data);
      } else {
        setError(detailsJson.message || "Failed to load booking details.");
      }

      if (trackingJson.success) {
        setTrackingData(trackingJson.data);
      }
    } catch (err) {
      console.error("Error fetching confirmation data:", err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingInfo();
  }, [bookingId]);

  // Handle Cancel Booking action
  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setActionMessage("");
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    try {
      const res = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cancellationReason: "Cancelled from Customer Portal" })
      });

      const result = await res.json();
      if (result.success) {
        setActionMessage("✅ Booking cancelled successfully.");
        fetchBookingInfo();
      } else {
        alert(result.message || "Cancellation failed.");
      }
    } catch (err) {
      alert("Error processing cancellation request.");
    }
  };

  // Handle "Mark Job Completed" action (Triggers backend handshake & immediate redirect to feedback)
  const handleCompleteJob = async () => {
    setActionMessage("");
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    try {
      // 1. Executing PATCH /api/customer/bookings/:bookingId/complete
      const res = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();
      if (result.success) {
        setActionMessage("🎉 Job completed! Redirecting to Technician Feedback screen...");
        // 2. IMMEDIATELY REDIRECTING customer to Technician Feedback Form screen
        router.push(`/customer/feedback?bookingId=${bookingId}`);
      } else {
        alert(result.message || "Job completion failed.");
      }
    } catch (err) {
      alert("Error processing job completion.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-semibold text-gray-600">Loading booking status & tracking details...</p>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-semibold text-red-500">{error || "Booking not found."}</p>
      </div>
    );
  }

  const isCancelled = bookingData.booking_status === "Cancelled";
  const isCompleted = bookingData.booking_status === "Completed";
  const isActiveBooking = !isCancelled && !isCompleted;
  
  // Checking quick verification checklist (3 items)
  const allInspected = inspectionChecks.workInspected && 
                       inspectionChecks.serviceSatisfactory && 
                       inspectionChecks.areaCleaned;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {actionMessage && (
        <div className="p-4 bg-orange-100 border border-orange-300 text-orange-800 rounded-2xl font-bold text-center">
          {actionMessage}
        </div>
      )}

      {/* SEPARATE ON-SITE VERIFICATION CHECKLIST SECTION (RENDERED FOR ALL ACTIVE BOOKINGS) */}
      {isActiveBooking && (
        <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Post-Service Handshake</span>
              <h3 className="text-2xl font-bold mt-1">Technician On-Site Verification Checklist</h3>
              <p className="text-slate-300 text-xs mt-1">Check all 3 items below to unlock the "Mark Job Completed" action button.</p>
            </div>
          </div>

          {/* 3 VERIFICATION CHECKBOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs font-medium">
            <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-700 transition">
              <input
                type="checkbox"
                checked={inspectionChecks.workInspected}
                onChange={(e) => setInspectionChecks({ ...inspectionChecks, workInspected: e.target.checked })}
                className="accent-orange-500 w-4 h-4"
              />
              <span>1. Work Inspected</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-700 transition">
              <input
                type="checkbox"
                checked={inspectionChecks.serviceSatisfactory}
                onChange={(e) => setInspectionChecks({ ...inspectionChecks, serviceSatisfactory: e.target.checked })}
                className="accent-orange-500 w-4 h-4"
              />
              <span>2. Service Satisfactory</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-700 transition">
              <input
                type="checkbox"
                checked={inspectionChecks.areaCleaned}
                onChange={(e) => setInspectionChecks({ ...inspectionChecks, areaCleaned: e.target.checked })}
                className="accent-orange-500 w-4 h-4"
              />
              <span>3. Work Area Cleaned</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-orange-300 font-semibold">
              {allInspected ? "✓ All 3 items verified! Use button below to complete job." : "⚠️ Check all 3 items above to unlock the Mark Job Completed button below."}
            </p>
          </div>
        </div>
      )}

      <BookingSuccessCard booking={bookingData} />

      <BookingDetails booking={bookingData} />

      {bookingData.technicians && (
        <TechnicianCard technician={bookingData.technicians} booking={bookingData} />
      )}

      <TrackingTimeline tracking={trackingData} currentStatus={bookingData.booking_status} />

      {/* SEPARATE STANDALONE MARK JOB COMPLETED & CANCEL ACTION BUTTONS */}
      <ActionButtons
        bookingStatus={bookingData.booking_status}
        onCancel={handleCancelBooking}
        onComplete={handleCompleteJob}
        isCancelled={isCancelled}
        isCompleted={isCompleted}
        allInspected={allInspected}
      />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen pt-24 pb-12">
        <Suspense fallback={<div className="p-8 text-center text-gray-500 font-semibold">Loading booking details...</div>}>
          <BookingConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}