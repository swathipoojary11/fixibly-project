"use client";
import React, { useState } from "react";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import { FiZap, FiX, FiPhone, FiMapPin, FiAlertTriangle, FiRadio, FiCheck, FiArrowLeft, FiArrowDown } from "react-icons/fi";
import Portal from "../../components/dispatcher-admin/Portal";

const EmergencyBookings = ({ onBack }) => {
  const { emergencies, technicians, assignTechnician, qualifyToNormal } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [qualifyMode, setQualifyMode] = useState(false);
  const [qualifyReason, setQualifyReason] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const handleBroadcast = async () => {
    if (!skillFilter || !selected) return;
    setBroadcasting(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/dispatcher/emergency/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: selected.id, dispatcherUserId: null })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Broadcast failed");
      showToast(`🚨 ${data.message}`);
      setSelected(null);
      setSkillFilter("");
    } catch (err) {
      showToast(`⚠️ ${err.message}`);
    } finally {
      setBroadcasting(false);
    }
  };

  const handleQualify = () => {
    if (!qualifyReason.trim()) return;
    qualifyToNormal(selected.id, qualifyReason);
    setSelected(null); setQualifyMode(false); setQualifyReason("");
    showToast("✅ Emergency downgraded to normal booking.");
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {toast && <div className="fixed top-4 right-4 z-50 bg-dark-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn">{toast}</div>}

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
        <FiAlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
        <p className="text-sm text-red-700">Emergency bookings require immediate action. Verify if it is a genuine emergency — if not (e.g. "AC not cooling" is not life-threatening), qualify it as a normal booking. Otherwise broadcast to available technicians.</p>
      </div>

      {emergencies.length === 0 && (
        <div className="ff-card p-8 text-center text-gray-400 text-sm">No emergency bookings at this time.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencies.map(em => (
          <div key={em.id} onClick={() => { setSelected(em); setQualifyMode(false); setQualifyReason(""); }}
            className="ff-card p-4 border-l-4 border-l-red-500 cursor-pointer hover:border-red-300 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FiZap className="w-4 h-4 text-red-500" />
                  <span className="font-mono text-xs text-red-500 font-semibold">{em.id}</span>
                </div>
                <p className="font-bold text-dark-900 text-sm">{em.customer}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${em.emergencyLevel === "Critical" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                {em.emergencyLevel}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-2"><FiPhone className="w-3 h-3" />{em.phone}</div>
              <div className="flex items-center gap-2 truncate"><FiMapPin className="w-3 h-3 shrink-0" /><span className="truncate">{em.address}</span></div>
            </div>
            <p className="text-xs text-gray-600 italic mb-3 line-clamp-2">"{em.issue}"</p>
            <div className="flex items-center justify-between">
              <StatusBadge status={em.status} />
              {em.broadcastSent && <span className="text-xs text-green-500 font-semibold flex items-center gap-1"><FiRadio className="w-3 h-3" />Broadcast Sent</span>}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <Portal>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelected(null); setQualifyMode(false); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiZap className="w-5 h-5" />
                  <div>
                    <p className="font-mono text-sm text-white/70">{selected.id}</p>
                    <p className="text-xl font-bold">{selected.customer}</p>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setQualifyMode(false); }} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Phone",    value: selected.phone },
                  { label: "Category", value: selected.category },
                  { label: "Level",    value: selected.emergencyLevel },
                  { label: "Status",   value: selected.status },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-dark-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Address</p>
                <p className="text-sm text-dark-700">{selected.address}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-xs text-red-400 mb-1">Issue Description</p>
                <p className="text-sm text-red-700">{selected.issue}</p>
              </div>

              {!selected.technicianName && selected.status !== "Cancelled" && (
                <>
                  {/* Qualify to normal */}
                  {!qualifyMode ? (
                    <button onClick={() => setQualifyMode(true)}
                      className="w-full py-2.5 rounded-xl border-2 border-orange-300 text-orange-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors">
                      <FiArrowDown className="w-4 h-4" /> Not a Real Emergency? Qualify as Normal
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <label className="ff-label">Reason for downgrading to normal</label>
                      <textarea value={qualifyReason} onChange={e => setQualifyReason(e.target.value)}
                        placeholder="e.g. AC not cooling is not life-threatening, reclassifying as normal repair..."
                        rows={2} className="ff-input resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => setQualifyMode(false)} className="ff-btn-secondary flex-1">Cancel</button>
                        <button onClick={handleQualify} disabled={!qualifyReason.trim()}
                          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${qualifyReason.trim() ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                          Confirm Downgrade
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Broadcast */}
                  {!qualifyMode && (
                    <div className="space-y-3">
                      <div>
                        <label className="ff-label">Required Technician Skill</label>
                        <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className="ff-input">
                          <option value="">Select skill...</option>
                          {["Electrician", "Plumber", "AC Repair", "Carpenter", "Painter"].map(s => (
                            <option key={s} value={s}>{s} ({technicians.filter(t => t.availability === "Available" && t.category === s).length} available)</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={handleBroadcast} disabled={!skillFilter || broadcasting}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${!skillFilter || broadcasting ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white shadow-lg"}`}>
                        {broadcasting ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Broadcasting...</>
                        ) : (
                          <><FiRadio className="w-4 h-4" />Broadcast to Available Technicians</>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}

              {selected.technicianName && (
                <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-700 font-semibold">Assigned to {selected.technicianName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
};

export default EmergencyBookings;
