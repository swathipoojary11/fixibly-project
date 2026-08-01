"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MdArrowBack, MdBuild, MdLocationOn, MdPhone, MdPerson, MdAccessTime,
  MdCheckCircle, MdGpsFixed, MdReportProblem, MdAssignmentTurnedIn,
  MdCategory, MdCheck, MdNavigation, MdShield, MdHandyman, MdHourglassTop, MdDoneAll,
  MdCancel,
} from "react-icons/md";
import { FiClock, FiAlertCircle } from "react-icons/fi";
import { fetchApi } from "@/app/utils/api";

function JobDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const [location, setLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const [checklist, setChecklist] = useState({
    issueVerified: false,
    safetyInspected: false,
    toolsPrepared: false,
    customerBriefed: false,
    qualityTested: false,
  });

  const checklistItems = [
    { id: "issueVerified", title: "Verify Reported Issue & Symptom", description: "Inspect unit, confirm fault symptoms, and log initial indicators." },
    { id: "safetyInspected", title: "Safety & Electrical Circuit Check", description: "Safely isolate circuit breaker, discharge run capacitor, and inspect wiring terminals." },
    { id: "toolsPrepared", title: "Inspect Required Tools & Spare Parts", description: "Verify digital multimeter, replacement parts, and tool availability." },
    { id: "customerBriefed", title: "Brief Customer on Diagnostic Findings", description: "Explain root cause, proposed fix, and estimated completion time." },
    { id: "qualityTested", title: "Post-Repair Quality & Load Test", description: "Operate unit for 10 minutes, verify temperature drop/performance." },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const isChecklistComplete = completedCount === totalCount;

  const loadJobData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetchApi(`/technician/jobs/${id}`);
      const jobData = res.booking || res.data || res;
      if (jobData && jobData.booking_id) {
        setBooking(jobData);
      } else {
        setError("Booking record not found.");
      }
    } catch (err) {
      setError(err.message || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobData();
  }, [id]);

  const captureGPSLocation = () => {
    setGpsLoading(true);
    const sendLocation = async (lat, lng) => {
      setLocation({
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      });
      await fetchApi('/technician/location', {
        method: 'PATCH',
        body: JSON.stringify({ latitude: lat, longitude: lng })
      }).catch(() => {});
      setGpsLoading(false);
    };

    if (!navigator.geolocation) {
      sendLocation(12.914142, 74.855956);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => sendLocation(pos.coords.latitude, pos.coords.longitude),
      () => sendLocation(12.914142, 74.855956),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const updateStatus = async (nextStatus) => {
    try {
      setStatusMessage("");
      setError("");
      const res = await fetchApi(`/technician/jobs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });

      const updated = res.booking || res.data || res;
      if (updated && updated.booking_status) {
        setBooking(updated);
        setStatusMessage(`Status updated to '${updated.booking_status}'.`);
      }
    } catch (err) {
      setError(err.message || "Failed to update status.");
    }
  };

  const handleFinishWork = async () => {
    if (!isChecklistComplete) {
      alert("Please complete all 5 inspection checklist items before finishing work.");
      return;
    }
    await updateStatus("Waiting for Customer Confirmation");
  };

  const handleCancelJob = async () => {
    if (cancelReason.trim().length < 5) {
      alert("Please provide a cancellation reason (at least 5 characters).");
      return;
    }
    try {
      setCancelling(true);
      await fetchApi(`/technician/jobs/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: cancelReason.trim() })
      });
      setShowCancelModal(false);
      router.push("/technician/dashboard");
    } catch (err) {
      alert(err.message || "Failed to reject job.");
    } finally {
      setCancelling(false);
    }
  };

  const toggleChecklistItem = (itemId) => setChecklist((prev) => ({ ...prev, [itemId]: !prev[itemId] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center text-xs font-bold text-slate-500">
        Loading job details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-6 text-center">
        <MdReportProblem size={40} className="text-amber-500 mb-2" />
        <h2 className="text-xl font-extrabold text-slate-900">Job Not Found</h2>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        <button onClick={() => router.push("/technician/dashboard")} className="mt-4 px-5 py-2.5 bg-[#F54C0F] text-white font-bold text-xs rounded-xl cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentStatus = booking.booking_status || "Assigned";
  const customerName = booking.users?.full_name || "Customer";
  const customerPhone = booking.users?.phone || "N/A";
  const categoryName = booking.service_categories?.category_name || "General Service";
  const problemName = booking.service_problems?.problem_name || booking.issue_description || "Field Repair";
  const addressText = `${booking.house_number || ''} ${booking.street || ''} ${booking.area || ''} ${booking.city || 'Mangalore'}`.trim();

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#202020] font-sans pb-16">
      
      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <MdCancel size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#202020]">Reject / Cancel Job</h3>
                <p className="text-xs text-[#7B7B7B]">Dispatcher will be notified to reassign</p>
              </div>
            </div>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for rejecting (min 5 characters)…"
              rows={3}
              className="w-full border border-[#ECECEC] rounded-xl p-3 text-xs text-[#202020] outline-none focus:border-red-400"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 border border-[#ECECEC] text-[#7B7B7B] py-2.5 rounded-xl font-bold text-xs cursor-pointer">
                Keep Job
              </button>
              <button onClick={handleCancelJob} disabled={cancelling || cancelReason.trim().length < 5} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-xs disabled:opacity-50 cursor-pointer">
                {cancelling ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Nav */}
      <div className="bg-white border-b border-[#ECECEC] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => router.push("/technician/dashboard")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF3EE] text-[#F54C0F] font-bold text-xs hover:bg-[#F54C0F] hover:text-white transition-all cursor-pointer">
            <MdArrowBack className="text-base" />
            <span>Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCancelModal(true)} className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-500 border border-red-200 bg-red-50 hover:bg-red-500 hover:text-white transition cursor-pointer">
              Reject Job
            </button>
            <div className="px-4 py-1.5 rounded-xl border border-[#F54C0F] bg-[#FFF3EE] text-[#F54C0F] font-bold text-xs">
              Booking #{booking.booking_id}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Status Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}
        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            {statusMessage}
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-[#181818] text-white rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F54C0F] text-white flex items-center justify-center shrink-0">
                <MdBuild size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#F54C0F]/20 text-[#F54C0F] border border-[#F54C0F]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">{booking.priority || 'Normal'}</span>
                  <span className="bg-[#202020] text-slate-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">{categoryName}</span>
                </div>
                <h1 className="text-xl font-bold text-white mt-1">{problemName}</h1>
                <p className="text-slate-400 text-xs mt-1">Customer: <span className="text-white font-bold">{customerName}</span></p>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-right self-stretch sm:self-auto">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Current Status</p>
              <p className="text-lg font-extrabold text-[#F54C0F] mt-0.5">{currentStatus}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer & Address Details */}
            <div className="bg-white rounded-2xl p-6 border border-[#ECECEC] shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#202020] border-b pb-3 flex items-center gap-2">
                <MdPerson className="text-[#F54C0F]" size={20} />
                <span>Customer & Location</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#F7F7F7]">
                  <span className="text-slate-400 font-medium">Name:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{customerName}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F7F7]">
                  <span className="text-slate-400 font-medium">Phone:</span>
                  <a href={`tel:${customerPhone}`} className="font-bold text-[#F54C0F] block mt-0.5 hover:underline">{customerPhone}</a>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#FFF3EE] border border-[#F54C0F]/20 text-xs">
                <span className="font-bold text-[#F54C0F] block mb-1">Service Address:</span>
                <p className="font-bold text-slate-900">{addressText}</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl p-6 border border-[#ECECEC] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
                  <MdShield className="text-[#F54C0F]" size={20} />
                  <span>Completion Checklist</span>
                </h2>
                <span className="text-xs font-bold text-[#F54C0F]">{completedCount} / {totalCount} Done</span>
              </div>
              <div className="space-y-3">
                {checklistItems.map((item, index) => {
                  const isChecked = !!checklist[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-3 ${isChecked ? "bg-[#FFF3EE] border-[#F54C0F]" : "bg-[#F7F7F7] border-[#ECECEC]"}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0 ${isChecked ? "bg-[#F54C0F] text-white" : "border border-slate-300 bg-white"}`}>
                        {isChecked && <MdCheck size={14} />}
                      </div>
                      <div>
                        <p className={`font-bold ${isChecked ? "text-[#F54C0F]" : "text-slate-900"}`}>{index + 1}. {item.title}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#ECECEC] shadow-sm space-y-4 sticky top-24">
              <h2 className="text-base font-bold text-[#202020] border-b pb-3 flex items-center gap-2">
                <MdHandyman className="text-[#F54C0F]" size={20} />
                <span>Job Status Workflow</span>
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => updateStatus("Accepted")}
                  disabled={currentStatus !== "Assigned" && currentStatus !== "Pending"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#F54C0F] text-white hover:bg-[#DB4206] transition disabled:opacity-40 disabled:hover:bg-[#F54C0F] cursor-pointer"
                >
                  1. Accept Job
                </button>

                <button
                  onClick={() => { updateStatus("On The Way"); captureGPSLocation(); }}
                  disabled={currentStatus !== "Accepted"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
                >
                  2. On The Way (Start Journey)
                </button>

                <button
                  onClick={() => { updateStatus("Arrived"); captureGPSLocation(); }}
                  disabled={currentStatus !== "On The Way"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
                >
                  3. Arrived at Site
                </button>

                <button
                  onClick={() => updateStatus("Working")}
                  disabled={currentStatus !== "Arrived"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
                >
                  4. Start Work
                </button>

                <button
                  onClick={handleFinishWork}
                  disabled={currentStatus !== "Working" || !isChecklistComplete}
                  className="w-full py-3 px-4 rounded-xl text-xs font-extrabold bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-40 flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <MdDoneAll size={16} />
                  <span>Finish Work (Notify Customer for Confirmation)</span>
                </button>
              </div>

              {currentStatus === "Waiting for Customer Confirmation" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 text-center">
                  ⏳ Work Finished! Waiting for customer to confirm completion on their screen.
                </div>
              )}

              {currentStatus === "Completed" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 text-center">
                  🎉 Job Fully Completed & Confirmed by Customer!
                </div>
              )}

              {/* GPS Tracker */}
              <div className="pt-4 border-t border-[#ECECEC]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">GPS Ping Location</span>
                  <button onClick={captureGPSLocation} disabled={gpsLoading} className="text-xs font-bold text-[#F54C0F] hover:underline cursor-pointer">
                    {gpsLoading ? "Syncing..." : "Sync GPS"}
                  </button>
                </div>
                {location && (
                  <div className="p-3 bg-[#FFF3EE] rounded-xl text-[11px] font-semibold text-slate-800 space-y-1">
                    <p>Lat: <span className="font-mono text-[#F54C0F]">{location.latitude}</span> | Long: <span className="font-mono text-[#F54C0F]">{location.longitude}</span></p>
                    <p className="text-slate-400 text-[10px]">Updated: {location.timestamp}</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
