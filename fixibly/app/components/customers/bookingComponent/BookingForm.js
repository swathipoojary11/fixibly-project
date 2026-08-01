'use client';
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { User, Phone, Mail, MapPin, CalendarDays, AlertTriangle, ShieldCheck, ArrowRight, PhoneCall, Check, Loader2 } from "lucide-react";
import { fetchApi, getAuthUser } from "@/app/utils/api";

export default function SingleBookingForm({ searchParams }) {
  const resolvedParams = use(searchParams);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  
  // Location
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Mangalore");
  const [pincode, setPincode] = useState("575001");
  
  // Schedule
  const [scheduleType, setScheduleType] = useState("anytime");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // Emergency
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user profile & service categories
  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Fetch profile from backend if stored token exists
      fetchApi('/profile')
        .then(res => {
          if (res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
        .catch(() => {});
    }

    // Fetch categories
    fetchApi('/customer/services')
      .then(res => {
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
          
          // Pre-select category if passed in query params
          const paramCatId = resolvedParams?.categoryId;
          const paramCatName = resolvedParams?.categoryName;
          
          let initialCat = res.categories[0];
          if (paramCatId) {
            initialCat = res.categories.find(c => String(c.category_id) === String(paramCatId)) || initialCat;
          } else if (paramCatName) {
            initialCat = res.categories.find(c => c.category_name.toLowerCase().includes(paramCatName.toLowerCase())) || initialCat;
          }
          setSelectedCategoryId(initialCat.category_id);
        }
      })
      .catch(err => setError('Failed to load service categories: ' + err.message));
  }, [resolvedParams]);

  // Fetch problems when selected category changes
  useEffect(() => {
    if (!selectedCategoryId) return;
    fetchApi(`/customer/services/${selectedCategoryId}/problems`)
      .then(res => {
        if (res.problems) {
          setProblems(res.problems);
          if (res.problems.length > 0) {
            setSelectedProblemId(res.problems[0].problem_id);
          } else {
            setSelectedProblemId("");
          }
        }
      })
      .catch(err => console.error('Failed to load problems:', err));
  }, [selectedCategoryId]);

  const selectedCategory = categories.find(c => String(c.category_id) === String(selectedCategoryId));
  const selectedProblem = problems.find(p => String(p.problem_id) === String(selectedProblemId));

  const basePrice = selectedProblem?.fixed_price ? Number(selectedProblem.fixed_price) : 0;
  const emergencyCharge = isEmergency ? 300 : 0;
  const totalAmount = basePrice + emergencyCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCategoryId) {
      setError("Please select a service category.");
      return;
    }

    if (isEmergency && !emergencyReason.trim()) {
      setError("Emergency reason is required for priority emergency bookings.");
      return;
    }

    if (!street.trim() && !area.trim()) {
      setError("Please provide street and area for the service location.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        category_id: selectedCategoryId,
        problem_id: selectedProblemId || null,
        issue_description: customDescription,
        emergency_flag: isEmergency,
        emergency_reason: emergencyReason,
        priority: isEmergency ? "Emergency" : "Normal",
        preferred_date: scheduleType === "scheduled" ? preferredDate : null,
        preferred_time: scheduleType === "scheduled" ? preferredTime : null,
        anytime_service: scheduleType === "anytime",
        house_number: "",
        apartment_name: "",
        street: street.trim() || "Main Road",
        area: area.trim() || "City Center",
        city: city.trim() || "Mangalore",
        state: "Karnataka",
        pincode: pincode.trim() || "575001"
      };

      const result = await fetchApi('/customer/bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setLoading(false);

      if (result.success && result.booking) {
        setSuccess("Booking created successfully! Redirecting...");
        setTimeout(() => {
          router.push(`/customer/bookingConfirmation?bookingId=${result.booking.booking_id}`);
        }, 800);
      } else {
        setError(result.message || "Failed to create booking.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to submit booking.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 text-slate-900">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Book a Field Service</h1>
          <p className="text-xs text-slate-500 mt-1">Select your service details and schedule a verified technician.</p>
        </div>
        <a
          href="tel:+919876543210"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
        >
          <PhoneCall size={14} className="text-orange-500" />
          <span>Priority Helpline: +91 98765 43210</span>
        </a>
      </div>

      {/* Account Info (Auto-filled) */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Customer Details (Auto-filled from Session)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <User size={15} className="text-orange-500 shrink-0" />
            <span className="truncate">{currentUser?.full_name || 'Customer'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-orange-500 shrink-0" />
            <span>{currentUser?.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-orange-500 shrink-0" />
            <span className="truncate">{currentUser?.email || 'customer@fieldflow.com'}</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {success}
        </div>
      )}

      {/* Category Selector */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">Service Category *</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-orange-600 bg-orange-50/20 outline-none focus:border-orange-500"
        >
          {categories.map(cat => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* Problems List */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2">
          Select Problem / Issue *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {problems.map((prob) => {
            const isSelected = String(prob.problem_id) === String(selectedProblemId);
            return (
              <button
                type="button"
                key={prob.problem_id}
                onClick={() => setSelectedProblemId(prob.problem_id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left transition ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 font-bold text-slate-900 ring-1 ring-orange-500"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300'}`}>
                    {isSelected && <Check size={12} />}
                  </div>
                  <span>{prob.problem_name}</span>
                </div>
                <span className="font-extrabold text-orange-600">
                  {prob.fixed_price ? `₹${prob.fixed_price}` : 'Quote on Inspection'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Issue Description */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">
          Additional Notes / Custom Issue Details
        </label>
        <textarea
          rows={2}
          placeholder="Describe your issue or specific instructions..."
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-orange-500"
        />
      </div>

      {/* Emergency Toggle */}
      <div className={`p-4 rounded-xl border transition ${isEmergency ? "bg-orange-50 border-orange-500" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className={isEmergency ? "text-orange-600" : "text-slate-400"} />
            <div>
              <span className="text-xs font-bold block text-slate-900">Priority Emergency Booking</span>
              <span className="text-[11px] text-slate-500">Immediate technician broadcast for urgent repair needs</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEmergency(!isEmergency)}
            className={`w-11 h-6 rounded-full transition p-0.5 ${isEmergency ? "bg-orange-500" : "bg-slate-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition transform ${isEmergency ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {isEmergency && (
          <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
            <label className="text-xs font-bold text-slate-900">Reason for Emergency *</label>
            <input
              type="text"
              placeholder="e.g. Active pipe burst, severe short circuit"
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              className="w-full border border-orange-300 bg-white rounded-lg p-2 text-xs outline-none focus:border-orange-500"
            />
            <p className="text-[11px] text-orange-600 font-semibold">
              ⚡ Emergency priority charge (+₹300) included.
            </p>
          </div>
        )}
      </div>

      {/* Address & Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Service Location *</label>
          <input
            type="text"
            placeholder="Street Address / House No."
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-orange-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Area / Locality"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border border-slate-300 rounded-xl p-2 text-xs outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-slate-300 rounded-xl p-2 text-xs outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Time Preference</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setScheduleType("anytime")}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                scheduleType === "anytime"
                  ? "bg-orange-50 border-orange-500 text-orange-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              🚀 Send Anytime
            </button>
            <button
              type="button"
              onClick={() => setScheduleType("scheduled")}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                scheduleType === "scheduled"
                  ? "bg-orange-50 border-orange-500 text-orange-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              📅 Preferred Slot
            </button>
          </div>

          {scheduleType === "scheduled" && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="border border-slate-300 rounded-lg p-2 text-xs outline-none"
              />
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="border border-slate-300 rounded-lg p-2 text-xs outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Booking Cost Summary</span>
          <span className="text-xs bg-orange-500 text-white px-2.5 py-0.5 rounded font-bold">
            {selectedCategory?.category_name || 'Service'}
          </span>
        </div>

        <div className="text-xs space-y-1.5 text-slate-300">
          <div className="flex justify-between">
            <span>Base Service Price:</span>
            <span className="font-semibold text-white">
              {basePrice > 0 ? `₹${basePrice}` : 'Pending Inspection'}
            </span>
          </div>

          {isEmergency && (
            <div className="flex justify-between text-orange-400 font-bold">
              <span>Emergency Charge:</span>
              <span>+ ₹300</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
            <span>Grand Total:</span>
            <span className="text-orange-500 text-base">
              {basePrice > 0 ? `₹${totalAmount}` : 'Quote on Site Inspection'}
            </span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md mt-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <span>Confirm & Submit Booking</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] pt-1">
          <ShieldCheck size={13} className="text-orange-500" />
          <span>Verified Local Technicians • Real-time Tracking Enabled</span>
        </div>
      </div>

    </div>
  );
}