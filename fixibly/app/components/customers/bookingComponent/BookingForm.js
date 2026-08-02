'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  User, Phone, Mail, MapPin, CalendarDays, 
  AlertTriangle, ShieldCheck, ArrowRight, PhoneCall, Loader2, Wrench 
} from "lucide-react";

export default function SingleBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params auto-fill extraction
  const preselectedServiceId = searchParams.get("serviceId") || searchParams.get("categoryId");
  const preselectedServiceName = searchParams.get("service") || searchParams.get("category");

  // Loaders & Error States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // DB Data
  const [categories, setCategories] = useState([]);
  const [availableProblems, setAvailableProblems] = useState([]);

  // Customer Profile (Fetched from DB)
  const [userProfile, setUserProfile] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
  });

  // Central Form State
  const [formData, setFormData] = useState({
    categoryId: "",
    selectedCategoryName: "",
    selectedProblems: [], // Array of problem objects with fixed prices
    customProblem: "",
    address: "",
    scheduleType: "anytime", // 'anytime' | 'scheduled'
    date: "",
    time: "",
    isEmergency: false,
    emergencyReason: "",
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Helper for Safe Fetch Execution
  const safeFetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("text/html")) {
      throw new Error(`Endpoint ${url} returned HTML instead of JSON (${res.status}). Check server routing.`);
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Server request failed with status ${res.status}`);
    }

    return data;
  };

  // ----------------------------------------------------
  // 1. Fetch Logged-in Customer Details & Service Categories
  // ----------------------------------------------------
  // Replace Section 1 inside useEffect with this diagnostic block:
useEffect(() => {
  const initializeData = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");

    console.log("🔍 Checking Auth Token:", token ? "Token found" : "NO TOKEN FOUND");

    if (!token) {
      setErrorMessage("Authentication token not found in localStorage. Please log in.");
      setLoadingProfile(false);
      return;
    }

    try {
      setLoadingProfile(true);

      // 1. Log Profile Raw Output
      const profileUrl = `${BACKEND_URL}/api/customer/profile`;
      console.log("🌐 Fetching Profile from:", profileUrl);
      const profileData = await safeFetchJson(profileUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("👤 Raw Profile Data from DB:", profileData);

      // 2. Log Services Raw Output
      const servicesUrl = `${BACKEND_URL}/api/customer/services`;
      console.log("🌐 Fetching Services from:", servicesUrl);
      const catData = await safeFetchJson(servicesUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🏷️ Raw Services/Categories Data from DB:", catData);

      // Set user profile state
      const user = profileData.user || profileData.data || profileData.customer || profileData;
      if (user) {
        setUserProfile({
          id: user.id || user.user_id || user.customer_id,
          name: user.full_name || user.name || user.username || "Logged Customer",
          phone: user.phone_number || user.phone || user.mobile || "N/A",
          email: user.email || "N/A",
        });

        if (user.address) {
          setFormData((prev) => ({ ...prev, address: user.address }));
        }
      }

      // Handle categories array parsing
      const fetchedCategories = Array.isArray(catData)
        ? catData
        : catData.categories || catData.services || catData.data || [];

      console.log("✅ Parsed Categories Array:", fetchedCategories);

      if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);

        const matchedCategory = fetchedCategories.find(
          (c) =>
            (c.id || c.category_id || c.service_id)?.toString() === preselectedServiceId ||
            c.name?.toLowerCase() === preselectedServiceName?.toLowerCase()
        );

        const activeCat = matchedCategory || fetchedCategories[0];
        const activeCatId = activeCat.id || activeCat.category_id || activeCat.service_id;

        console.log("🎯 Active Selected Category:", activeCat.name, "ID:", activeCatId);

        setFormData((prev) => ({
          ...prev,
          categoryId: activeCatId,
          selectedCategoryName: activeCat.name,
        }));
      } else {
        setErrorMessage("No categories or services found in database response.");
      }
    } catch (err) {
      console.error("❌ Initialization Fetch Error:", err);
      setErrorMessage(err.message || "Failed to fetch data from backend server.");
    } finally {
      setLoadingProfile(false);
    }
  };

  initializeData();
}, [preselectedServiceId, preselectedServiceName]);

  // ----------------------------------------------------
  // 2. Fetch Fixed-Price Problems for Selected Service
  // ----------------------------------------------------
  useEffect(() => {
    if (!formData.categoryId) return;

    const fetchCategoryProblems = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      try {
        const data = await safeFetchJson(
          `${BACKEND_URL}/api/customer/services/${formData.categoryId}/problems`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedProblems = Array.isArray(data)
          ? data
          : data.problems || data.data || [];

        if (Array.isArray(fetchedProblems)) {
          setAvailableProblems(fetchedProblems);
        } else {
          setAvailableProblems([]);
        }
      } catch (err) {
        console.error("Failed to load category problems:", err);
        setAvailableProblems([]);
      }
    };

    setFormData((prev) => ({ ...prev, selectedProblems: [] }));
    fetchCategoryProblems();
  }, [formData.categoryId]);

  // Toggle problem selection
  const handleProblemToggle = (problem) => {
    const probId = problem.id || problem.problem_id;
    setFormData((prev) => {
      const exists = prev.selectedProblems.some((p) => (p.id || p.problem_id) === probId);
      const updated = exists
        ? prev.selectedProblems.filter((p) => (p.id || p.problem_id) !== probId)
        : [...prev.selectedProblems, problem];
      return { ...prev, selectedProblems: updated };
    });
  };

  // Pricing Logic
  const basePrice = formData.selectedProblems.reduce(
    (sum, p) => sum + (Number(p.price) || 0),
    0
  );
  const platformFee = 29;
  const emergencyAdvanceFee = formData.isEmergency ? 150 : 0;
  const totalAmount = basePrice + platformFee + emergencyAdvanceFee;

  // ----------------------------------------------------
  // 3. Submit Booking
  // ----------------------------------------------------
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.address.trim()) {
      setErrorMessage("Service address is required.");
      return;
    }

    if (formData.selectedProblems.length === 0 && !formData.customProblem.trim()) {
      setErrorMessage("Please select at least one problem or describe your issue.");
      return;
    }

    if (formData.isEmergency && !formData.emergencyReason.trim()) {
      setErrorMessage("Please state the reason for your emergency booking.");
      return;
    }

    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    setIsSubmitting(true);

    let scheduledAt = null;
    if (formData.scheduleType === "scheduled" && formData.date && formData.time) {
      scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
    }

    const payload = {
      customer_id: userProfile.id,
      category_id: formData.categoryId,
      problem_ids: formData.selectedProblems.map((p) => p.id || p.problem_id),
      custom_problem: formData.customProblem || null,
      address: formData.address,
      schedule_type: formData.scheduleType,
      scheduled_at: scheduledAt,
      is_emergency: formData.isEmergency,
      emergency_reason: formData.isEmergency ? formData.emergencyReason : null,
      advance_fee: emergencyAdvanceFee,
      total_amount: totalAmount,
    };

    try {
      const result = await safeFetchJson(`${BACKEND_URL}/api/customer/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      router.push(`/customer/bookingConfirmation?bookingId=${result.booking_id || result.id || result.data?.id}`);
    } catch (err) {
      setErrorMessage(err.message || "An error occurred while creating your booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-12 rounded-2xl shadow-md text-center space-y-3">
        <Loader2 size={32} className="animate-spin text-[#FF5500] mx-auto" />
        <p className="text-xs font-bold text-gray-600">Fetching customer profile & service details from database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 space-y-6 text-[#0F172A]">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">Book a Service</h1>
          <p className="text-xs text-gray-500">Auto-filled based on your selected service card.</p>
        </div>
        <a
          href="tel:+919876543210"
          className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#FF5500] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
        >
          <PhoneCall size={15} className="text-[#FF5500]" />
          <span>Call Dispatcher: +91 98765 43210</span>
        </a>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-xl font-medium flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Customer Account Details */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
          Logged-In Customer Details
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-medium">
          <div className="flex items-center gap-2 truncate">
            <User size={15} className="text-[#FF5500] shrink-0" />
            <span className="truncate">{userProfile.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-[#FF5500] shrink-0" />
            <span>{userProfile.phone}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Mail size={15} className="text-[#FF5500] shrink-0" />
            <span className="truncate">{userProfile.email}</span>
          </div>
        </div>
      </div>

      {/* 2. Selected Service (Read-Only Badge - Dropdown Removed) */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">Selected Service</label>
        <div className="w-full border border-orange-200 rounded-xl p-3 bg-orange-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-[#FF5500]" />
            <span className="text-xs font-extrabold text-[#0F172A]">
              {formData.selectedCategoryName || "Service Selected"}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide bg-[#FF5500] text-white px-2 py-0.5 rounded-md">
            Auto-Selected
          </span>
        </div>
      </div>

      {/* 3. Fixed Problems & Price Checklist */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-2">
          Fixed-Price Problems for {formData.selectedCategoryName}
        </label>
        {availableProblems.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No pre-set issues found for this service. Please describe below.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {availableProblems.map((prob, index) => {
              const probId = prob.id || prob.problem_id;
              const isChecked = formData.selectedProblems.some(
                (p) => (p.id || p.problem_id) === probId
              );
              return (
                <label
                  key={probId || index}
                  onClick={() => handleProblemToggle(prob)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isChecked
                      ? "border-[#FF5500] bg-orange-50/50 font-semibold text-[#0F172A]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={isChecked} readOnly className="accent-[#FF5500]" />
                    <span>{prob.title || prob.name}</span>
                  </div>
                  <span className="font-bold text-[#FF5500]">₹{prob.price}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Custom Problem Box */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1">
          Custom Problem / Specific Description
        </label>
        <textarea
          rows={2}
          placeholder="Describe your issue if not listed in the preset options..."
          value={formData.customProblem}
          onChange={(e) => setFormData({ ...formData, customProblem: e.target.value })}
          className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#FF5500]"
        />
        {formData.customProblem && (
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            * Custom problems will be verified on-site by technician before final quote.
          </p>
        )}
      </div>

      {/* 5. Emergency Priority Toggle */}
      <div className={`p-4 rounded-xl border transition ${formData.isEmergency ? "bg-orange-50 border-[#FF5500]" : "bg-gray-50 border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className={formData.isEmergency ? "text-[#FF5500]" : "text-gray-400"} />
            <div>
              <span className="text-xs font-bold block">Is this an Emergency Booking?</span>
              <span className="text-[11px] text-gray-500">Triggers instant alert to nearby technicians & dispatchers.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isEmergency: !formData.isEmergency })}
            className={`w-11 h-6 rounded-full transition p-0.5 ${formData.isEmergency ? "bg-[#FF5500]" : "bg-gray-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition transform ${formData.isEmergency ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {formData.isEmergency && (
          <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
            <label className="text-xs font-bold text-[#0F172A]">Reason for Emergency (Notified to Dispatcher)</label>
            <input
              type="text"
              placeholder="e.g. Major water leak, short circuit risk"
              value={formData.emergencyReason}
              onChange={(e) => setFormData({ ...formData, emergencyReason: e.target.value })}
              className="w-full border border-orange-300 bg-white rounded-lg p-2 text-xs outline-none"
            />
            <p className="text-[11px] text-[#FF5500] font-semibold">
              ⚡ Emergency booking requires an advance payment of ₹150 for priority dispatch.
            </p>
          </div>
        )}
      </div>

      {/* 6. Address & Schedule Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Service Address</label>
          <textarea
            rows={3}
            placeholder="Enter house no, street, landmark..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#FF5500]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Time Preference</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scheduleType: "anytime" })}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                formData.scheduleType === "anytime"
                  ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🚀 Send Anytime
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scheduleType: "scheduled" })}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                formData.scheduleType === "scheduled"
                  ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              📅 Specific Time
            </button>
          </div>

          {formData.scheduleType === "scheduled" && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* 7. Pricing Summary & Final Booking Submission */}
      <div className="bg-[#0F172A] text-white rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Booking Summary</span>
          <span className="text-xs bg-[#FF5500] text-white px-2.5 py-1 rounded font-bold">
            {formData.selectedCategoryName || "Service"}
          </span>
        </div>

        <div className="text-xs space-y-1.5 text-gray-300">
          <div className="flex justify-between">
            <span>Fixed Problems ({formData.selectedProblems.length}):</span>
            <span className="font-semibold text-white">₹{basePrice}</span>
          </div>

          <div className="flex justify-between">
            <span>Platform Fee:</span>
            <span className="font-semibold text-white">₹{platformFee}</span>
          </div>

          {formData.isEmergency && (
            <div className="flex justify-between text-[#FF5500] font-bold">
              <span>Emergency Advance Fee:</span>
              <span>+ ₹{emergencyAdvanceFee}</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-gray-800 text-sm font-black text-white">
            <span>Total Payable:</span>
            <span className="text-[#FF5500] text-base">₹{totalAmount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmitBooking}
          disabled={isSubmitting}
          className="w-full bg-[#FF5500] hover:bg-[#e04b00] disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md mt-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Submitting Booking...</span>
            </>
          ) : (
            <>
              <span>Submit Booking & Proceed</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[10px] pt-1">
          <ShieldCheck size={13} className="text-[#FF5500]" />
          <span>Verified Local Technicians • Direct Dispatcher Alerts</span>
        </div>
      </div>

    </div>
  );
}