"use client";

// fixibly/app/customer/feedback/page.js
// STEP 3: Dynamic Technician Feedback Screen with CHECKLIST-FIRST layout, STAR RATING AT END, and Customer Dashboard redirect

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  // State for fetched technician profile & booking details
  const [bookingData, setBookingData] = useState(null);
  const [technicianInfo, setTechnicianInfo] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // STEP 3: CHECKLIST-FIRST Tap Selection State
  const [checklist, setChecklist] = useState({
    arrivedOnTime: true,
    politeBehavior: true,
    areaCleaned: true,
    problemResolved: true
  });

  // STEP 3: STAR RATING AT THE END State (1 to 5 Stars)
  const [overallRating, setOverallRating] = useState(5);
  const [comments, setComments] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 1. Dynamically fetch assigned technician profile details from Supabase on load
  useEffect(() => {
    async function fetchTechnicianDetails() {
      if (!bookingId) {
        setLoadingDetails(false);
        return;
      }

      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

      try {
        // Calling GET /api/customer/bookings/:bookingId to fetch technician details
        const res = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();

        if (result.success && result.booking) {
          setBookingData(result.booking);
          if (result.booking.technicians) {
            setTechnicianInfo({
              name: result.booking.technicians.users?.full_name || "Assigned Technician",
              phone: result.booking.technicians.users?.phone || "",
              rating: result.booking.technicians.rating || 5.0,
              experience: result.booking.technicians.experience || "Experienced Specialist",
              picture: result.booking.technicians.profile_picture || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80",
              categoryName: result.booking.service_categories?.category_name || "Home Repair"
            });
          }
        }
      } catch (err) {
        console.error("Error fetching technician details for feedback:", err);
      } finally {
        setLoadingDetails(false);
      }
    }

    fetchTechnicianDetails();
  }, [bookingId]);

  // STEP 3: Handle Feedback Submission, Dispatcher Notification Trigger & Dashboard Redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId) {
      setError("No booking ID specified.");
      return;
    }

    setSubmitting(true);
    setError("");

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    // Formatting feedback comment including checklist responses
    const formattedComment = `[Checklist: Punctual=${checklist.arrivedOnTime ? 'Yes' : 'No'}, Polite=${checklist.politeBehavior ? 'Yes' : 'No'}, Cleaned=${checklist.areaCleaned ? 'Yes' : 'No'}, Resolved=${checklist.problemResolved ? 'Yes' : 'No'}] ${comments}`;

    try {
      // 1. Executing POST /api/customer/bookings/:bookingId/feedback (also writes Dispatcher notification entry)
      const res = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          overallRating: Number(overallRating),
          professionalBehaviour: checklist.politeBehavior ? 5 : 3,
          serviceQuality: checklist.problemResolved ? 5 : 3,
          timeliness: checklist.arrivedOnTime ? 5 : 3,
          cleanliness: checklist.areaCleaned ? 5 : 3,
          problemResolution: checklist.problemResolved ? 5 : 3,
          comments: formattedComment
        })
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(true);
        // 2. IMMEDIATELY REDIRECTING customer back to the Customer Dashboard (/customer)
        setTimeout(() => {
          router.push("/customer");
        }, 1200);
      } else {
        setError(result.message || "Failed to submit feedback.");
      }
    } catch (err) {
      setError("Network error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 space-y-8">
        
        {/* HEADER & DYNAMIC TECHNICIAN CARD */}
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Rate Your Technician</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">Technician Service Feedback</h1>
          <p className="text-gray-500 mt-1">Booking #{bookingId || "N/A"}</p>
        </div>

        {/* DYNAMIC ASSIGNED TECHNICIAN PROFILE */}
        {technicianInfo ? (
          <div className="flex items-center space-x-5 bg-orange-50/60 p-5 rounded-2xl border border-orange-200">
            <img
              src={technicianInfo.picture}
              alt={technicianInfo.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shadow"
            />
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                {technicianInfo.categoryName} Specialist
              </span>
              <h3 className="text-xl font-bold text-gray-900">{technicianInfo.name}</h3>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Rating: ⭐ {technicianInfo.rating} | Experience: {technicianInfo.experience}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 font-medium">
            {loadingDetails ? "Fetching assigned technician profile..." : "Service Feedback"}
          </div>
        )}

        {/* MESSAGES */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-medium text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl font-bold text-sm text-center">
            🎉 Feedback submitted! Redirecting to your Customer Dashboard...
          </div>
        )}

        {/* FEEDBACK FORM: CHECKLIST FIRST, STAR AT END */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: TAP CHECKLIST FIRST */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
              1. Service Checklist (Tap to Verify)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                  checklist.arrivedOnTime ? "border-green-500 bg-green-50/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist.arrivedOnTime}
                  onChange={(e) => setChecklist({ ...checklist, arrivedOnTime: e.target.checked })}
                  className="accent-green-600 w-5 h-5"
                />
                <span className="font-semibold text-gray-800 text-sm">⏱️ Technician Arrived on Time</span>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                  checklist.politeBehavior ? "border-green-500 bg-green-50/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist.politeBehavior}
                  onChange={(e) => setChecklist({ ...checklist, politeBehavior: e.target.checked })}
                  className="accent-green-600 w-5 h-5"
                />
                <span className="font-semibold text-gray-800 text-sm">🤝 Polite Behavior & Clear Communication</span>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                  checklist.areaCleaned ? "border-green-500 bg-green-50/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist.areaCleaned}
                  onChange={(e) => setChecklist({ ...checklist, areaCleaned: e.target.checked })}
                  className="accent-green-600 w-5 h-5"
                />
                <span className="font-semibold text-gray-800 text-sm">🧹 Work Area Thoroughly Cleaned Up</span>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                  checklist.problemResolved ? "border-green-500 bg-green-50/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist.problemResolved}
                  onChange={(e) => setChecklist({ ...checklist, problemResolved: e.target.checked })}
                  className="accent-green-600 w-5 h-5"
                />
                <span className="font-semibold text-gray-800 text-sm">🛠️ Problem Fully Resolved</span>
              </label>
            </div>
          </div>

          {/* SECTION 2: STAR RATING AT THE END */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
              2. Overall Technician Rating (1 - 5 Stars)
            </h3>
            <p className="text-xs text-gray-500">Tap stars below to grade overall service quality:</p>

            <div className="flex space-x-3 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className={`text-4xl transition ${
                    star <= overallRating ? "text-orange-500 scale-110" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-xl font-bold text-orange-600 self-center ml-3">
                {overallRating} / 5 Stars
              </span>
            </div>
          </div>

          {/* OPTIONAL SHORT COMMENT BOX */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">Optional Additional Comment</label>
            <textarea
              rows={3}
              placeholder="Share any additional feedback for the technician..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting || success || !bookingId}
            className="w-full py-4 bg-black hover:bg-orange-500 text-white font-bold rounded-2xl transition shadow-lg disabled:opacity-50 text-base"
          >
            {submitting ? "Submitting Feedback..." : "Submit Feedback & Return to Dashboard"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen pt-28 pb-16">
        <Suspense fallback={<div className="p-8 text-center text-gray-500 font-semibold">Loading feedback form...</div>}>
          <FeedbackContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}