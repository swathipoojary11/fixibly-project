"use client";
import React, { useState, useEffect, useCallback } from "react";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import {
    FiCheckCircle, FiCircle, FiMapPin, FiClock, FiUser,
    FiArrowLeft, FiNavigation, FiAlertCircle, FiPhone,
    FiRefreshCw, FiTag
} from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TIMELINE = [
    { key: "Assigned",   label: "Dispatcher Assigned"  },
    { key: "Accepted",   label: "Technician Accepted"   },
    { key: "On The Way", label: "On The Way"            },
    { key: "Arrived",    label: "Arrived at Customer"   },
    { key: "Working",    label: "Work In Progress"      },
    { key: "Completed",  label: "Completed"             },
];
const STATUS_ORDER = TIMELINE.map(s => s.key);
const LOCATION_STATUSES = ["On The Way", "Arrived", "Working", "Completed"];

const CurrentStatus = ({ onBack = () => {} }) => {
    const [activeBookings, setActiveBookings] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const fetchActive = useCallback(async () => {
        try {
            const res = await fetch(`${API}/dispatcher/active-with-location`);
            const data = await res.json();
            if (data.success) {
                const list = data.bookings || [];
                setActiveBookings(list);
                // Auto-select first booking if nothing selected yet
                setSelectedId(prev => prev || (list[0]?.bookingId ?? null));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActive();
        const interval = setInterval(fetchActive, 5000);
        return () => clearInterval(interval);
    }, [fetchActive]);

    const selected = activeBookings.find(b => b.bookingId === selectedId) ?? null;
    const currentStageIdx = selected ? STATUS_ORDER.indexOf(selected.status) : -1;

    return (
        <div className="space-y-5 animate-fadeIn">
            {toast && (
                <div className="fixed top-4 right-4 z-[9999] bg-dark-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn">
                    {toast}
                </div>
            )}

            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
                    <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <button onClick={() => { setLoading(true); fetchActive(); showToast("Refreshed"); }}
                    className="flex items-center gap-2 text-xs text-primary font-semibold hover:underline">
                    <FiRefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Booking list */}
                    <div className="space-y-3">
                        <p className="ff-section-title">Active Jobs ({activeBookings.length})</p>
                        {activeBookings.length === 0 && (
                            <div className="ff-card p-8 text-center text-gray-400 text-sm">No active jobs right now</div>
                        )}
                        {activeBookings.map(b => (
                            <button key={b.bookingId} onClick={() => setSelectedId(b.bookingId)}
                                className={`ff-card p-4 w-full text-left hover:border-orange-200 transition-all duration-200 ${selectedId === b.bookingId ? "border-primary ring-2 ring-primary/20" : ""}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <p className="font-mono text-xs text-primary font-semibold">#{b.bookingId}</p>
                                    <StatusBadge status={b.status} size="xs" />
                                </div>
                                <p className="font-semibold text-dark-900 text-sm">{b.customerName || "—"}</p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{b.issue || "—"}</p>
                                {b.technicianName
                                    ? <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1"><FiUser className="w-3 h-3" />{b.technicianName}</p>
                                    : <p className="text-xs text-red-400 mt-1">No technician assigned</p>
                                }
                                {b.location && (
                                    <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                                        <FiMapPin className="w-3 h-3" /> Location available
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Detail panel */}
                    <div className="lg:col-span-2">
                        {selected ? (
                            <div className="ff-card overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
                                    <p className="font-mono text-sm text-white/70">#{selected.bookingId}</p>
                                    <p className="text-xl font-bold">{selected.customerName || "—"}</p>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <StatusBadge status={selected.status} />
                                    </div>
                                </div>

                                <div className="p-5 space-y-5">
                                    {/* Customer & Technician info */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Customer</p>
                                            <p className="text-sm font-bold text-dark-800">{selected.customerName || "—"}</p>
                                            {selected.customerPhone && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <FiPhone className="w-3 h-3" />{selected.customerPhone}
                                                </p>
                                            )}
                                            {selected.address && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <FiMapPin className="w-3 h-3" />{selected.address}
                                                </p>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Technician</p>
                                            <p className="text-sm font-bold text-dark-800">{selected.technicianName || <span className="text-red-400">Unassigned</span>}</p>
                                            {selected.technicianPhone && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <FiPhone className="w-3 h-3" />{selected.technicianPhone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Issue */}
                                    {selected.issue && (
                                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                                            <p className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
                                                <FiTag className="w-3.5 h-3.5" /> Issue
                                            </p>
                                            <p className="text-sm text-dark-700">{selected.issue}</p>
                                        </div>
                                    )}

                                    {/* Location */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                                            <FiMapPin className="w-3.5 h-3.5" /> Technician Location
                                        </p>
                                        {LOCATION_STATUSES.includes(selected.status) ? (
                                            selected.location ? (
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div>
                                                        <p className="text-gray-400">Latitude</p>
                                                        <p className="font-mono font-semibold text-dark-800">{Number(selected.location.lat).toFixed(5)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400">Longitude</p>
                                                        <p className="font-mono font-semibold text-dark-800">{Number(selected.location.lng).toFixed(5)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400">Updated</p>
                                                        <p className="font-semibold text-dark-800">
                                                            {new Date(selected.location.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-blue-500">Waiting for technician location...</p>
                                            )
                                        ) : (
                                            <p className="text-xs text-gray-400">Location shared once technician is on the way.</p>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <p className="text-sm font-bold text-dark-900 mb-4 flex items-center gap-2">
                                            <FiClock className="w-4 h-4 text-primary" /> Job Progress
                                        </p>
                                        <div className="space-y-0">
                                            {TIMELINE.map((stage, i) => {
                                                const stageIdx = STATUS_ORDER.indexOf(stage.key);
                                                const done = stageIdx <= currentStageIdx;
                                                const isActive = stage.key === selected.status;
                                                return (
                                                    <div key={i} className="flex gap-3">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-primary text-white" : isActive ? "bg-orange-200 text-orange-600 animate-pulse" : "bg-gray-100 text-gray-400"}`}>
                                                                {done ? <FiCheckCircle className="w-4 h-4" /> : <FiCircle className="w-4 h-4" />}
                                                            </div>
                                                            {i < TIMELINE.length - 1 && <div className={`w-0.5 h-8 ${done ? "bg-primary" : "bg-gray-100"}`} />}
                                                        </div>
                                                        <div className="pb-4 pt-1.5">
                                                            <p className={`text-sm font-semibold ${done ? "text-dark-900" : "text-gray-400"}`}>{stage.label}</p>
                                                            {isActive && (
                                                                <p className="text-xs text-primary">Current status</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-center gap-2"> */}
                                        {/* <FiAlertCircle className="w-4 h-4 text-yellow-500 shrink-0" /> */}
                                        {/* <p className="text-xs text-yellow-700">Status updates are driven by the technician. This view auto-refreshes every 15 seconds.</p> */}
                                    {/* </div> */}
                                </div>
                            </div>
                        ) : (
                            <div className="ff-card p-12 text-center text-gray-400">
                                Select a booking from the left to view live status and technician location.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentStatus;
