"use client";
import React, { useState } from "react";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import { FiCheckCircle, FiCircle, FiMapPin, FiClock, FiUser, FiArrowLeft, FiNavigation, FiAlertCircle, FiSend } from "react-icons/fi";

const STATUS_ACTIONS = [
  { key: "accepted", label: "Accepted Job",       color: "bg-blue-500 hover:bg-blue-600" },
  { key: "started",  label: "Started Journey",    color: "bg-cyan-500 hover:bg-cyan-600" },
  { key: "ontheway", label: "On The Way",         color: "bg-indigo-500 hover:bg-indigo-600" },
  { key: "fivemin",  label: "5 Min Away",         color: "bg-purple-500 hover:bg-purple-600" },
  { key: "arrived",  label: "Arrived",            color: "bg-orange-500 hover:bg-orange-600" },
];

const timelineStages = [
  { key: "accepted", label: "Technician Accepted" },
  { key: "started",  label: "Started Journey" },
  { key: "ontheway", label: "On The Way" },
  { key: "fivemin",  label: "5 Min Away" },
  { key: "arrived",  label: "Arrived at Customer" },
  { key: "completed",label: "Completed" },
];

// Simulated location for demo — in production this comes from device GPS
const MOCK_LOCATION = { lat: 12.9716, lng: 77.5946 };

const CurrentStatus = ({ onBack }) => {
  const { bookings, emergencies, updateTechnicianStatus, customerMarkCompleted } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const activeBookings = [...bookings, ...emergencies].filter(b =>
    ["Assigned", "On The Way", "In Progress"].includes(b.status)
  );

  const liveSelected = selected
    ? ([...bookings, ...emergencies].find(b => b.id === selected.id) || selected)
    : null;

  const handleStatusUpdate = (statusKey) => {
    if (!liveSelected) return;
    // Pass location — stored on booking for dispatcher only
    updateTechnicianStatus(liveSelected.id, statusKey, MOCK_LOCATION);
    const label = STATUS_ACTIONS.find(s => s.key === statusKey)?.label;
    showToast(`✅ "${label}" — Dispatcher & Customer notified automatically.`);
  };

  const handleComplete = () => {
    if (!liveSelected) return;
    customerMarkCompleted(liveSelected.id);
    setSelected(null);
    showToast("✅ Completed. Technician marked available.");
  };

  const stageOrder = timelineStages.map(s => s.key);
  const lastIdx = liveSelected?.lastUpdate ? stageOrder.indexOf(liveSelected.lastUpdate) : -1;

  return (
    <div className="space-y-5 animate-fadeIn">
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-dark-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn">
          {toast}
        </div>
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Booking list */}
        <div className="space-y-3">
          <p className="ff-section-title">Active Bookings ({activeBookings.length})</p>
          {activeBookings.map(b => (
            <button key={b.id} onClick={() => setSelected(b)}
              className={`ff-card p-4 w-full text-left hover:border-orange-200 transition-all duration-200 ${liveSelected?.id === b.id ? "border-primary ring-2 ring-primary/20" : ""}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-mono text-xs text-primary font-semibold">{b.id}</p>
                <StatusBadge status={b.status} size="xs" />
              </div>
              <p className="font-semibold text-dark-900 text-sm">{b.customer}</p>
              <p className="text-xs text-gray-400 mt-0.5">{b.category} · {b.technicianName}</p>
            </button>
          ))}
          {activeBookings.length === 0 && (
            <div className="ff-card p-8 text-center text-gray-400 text-sm">No active bookings</div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {liveSelected ? (
            <div className="ff-card overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
                <p className="font-mono text-sm text-white/70">{liveSelected.id}</p>
                <p className="text-xl font-bold">{liveSelected.customer}</p>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={liveSelected.status} />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{liveSelected.category}</span>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiUser className="w-3 h-3" />Technician</p>
                    <p className="text-sm font-semibold text-dark-800">{liveSelected.technicianName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiClock className="w-3 h-3" />Scheduled</p>
                    <p className="text-sm font-semibold text-dark-800">
                      {new Date(liveSelected.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                {/* Location — dispatcher only, never shown to customer */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5" /> Technician Location
                  </p>
                  {liveSelected.technicianLocation ? (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><p className="text-gray-400">Latitude</p><p className="font-mono font-semibold text-dark-800">{liveSelected.technicianLocation.lat.toFixed(4)}</p></div>
                      <div><p className="text-gray-400">Longitude</p><p className="font-mono font-semibold text-dark-800">{liveSelected.technicianLocation.lng.toFixed(4)}</p></div>
                      <div><p className="text-gray-400">Updated</p><p className="font-semibold text-dark-800">{new Date(liveSelected.lastUpdateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div>
                    </div>
                  ) : (
                    <p className="text-xs text-blue-500">Location will appear when technician updates status.</p>
                  )}
                </div>

                {/* Status update buttons — technician presses these, auto-notifies dispatcher + customer */}
                <div>
                  <p className="text-sm font-bold text-dark-900 mb-1 flex items-center gap-2">
                    <FiSend className="w-4 h-4 text-primary" /> Update Status
                  </p>
                  <p className="text-xs text-gray-400 mb-3">Each update automatically notifies dispatcher and customer.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STATUS_ACTIONS.map(({ key, label, color }) => {
                      const idx = stageOrder.indexOf(key);
                      const isDone = idx <= lastIdx;
                      return (
                        <button key={key} onClick={() => handleStatusUpdate(key)}
                          className={`${isDone ? "opacity-50" : ""} ${color} text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5`}>
                          {isDone ? <FiCheckCircle className="w-3 h-3" /> : <FiNavigation className="w-3 h-3" />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer confirm completed */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <p className="text-xs text-green-700 font-semibold mb-2 flex items-center gap-1.5">
                    <FiAlertCircle className="w-3.5 h-3.5" />
                    Technician marks completed only after customer confirms
                  </p>
                  <button onClick={handleComplete}
                    className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors">
                    Customer Confirmed — Mark Completed
                  </button>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-sm font-bold text-dark-900 mb-4">Job Lifecycle</p>
                  <div className="space-y-0">
                    {timelineStages.map((stage, i) => {
                      const done = i <= lastIdx || liveSelected.status === "Completed";
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                              {done ? <FiCheckCircle className="w-4 h-4" /> : <FiCircle className="w-4 h-4" />}
                            </div>
                            {i < timelineStages.length - 1 && <div className={`w-0.5 h-8 ${done ? "bg-primary" : "bg-gray-100"}`} />}
                          </div>
                          <div className="pb-4 pt-1.5">
                            <p className={`text-sm font-semibold ${done ? "text-dark-900" : "text-gray-400"}`}>{stage.label}</p>
                            {done && liveSelected.lastUpdateTime && stage.key === liveSelected.lastUpdate && (
                              <p className="text-xs text-primary">
                                {new Date(liveSelected.lastUpdateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="ff-card p-12 text-center text-gray-400">Select a booking to view its status and update.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentStatus;
