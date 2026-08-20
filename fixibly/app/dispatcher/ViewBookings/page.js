"use client";
import React, { useState, useCallback } from "react";
import { useDispatcherStore } from "../DispatcherStore";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import FilterBar from "../../components/dispatcher-admin/FilterBar";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import Portal from "../../components/dispatcher-admin/Portal";
import {
    FiCalendar, FiUser, FiMapPin, FiPhone, FiTag, FiClock,
    FiX, FiSearch, FiStar, FiCheck, FiArrowLeft, FiMail, FiAlertTriangle
} from "react-icons/fi";
import BookingForm from "../../components/customers/bookingComponent/BookingForm";
// ─── Booking Card ────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onView }) => (
    <div
        className={`ff-card p-4 hover:border-orange-200 cursor-pointer ${booking.emergency ? "border-l-4 border-l-red-500" : ""}`}
        onClick={() => onView(booking)}
    >
        <div className="flex items-start justify-between gap-2 mb-3">
            <div>
                <p className="font-mono text-xs text-primary font-semibold">#{booking.id}</p>
                <p className="font-bold text-dark-900 text-sm mt-0.5">{booking.customer}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
                <StatusBadge status={booking.status} />
                <StatusBadge status={booking.priority} size="xs" />
            </div>
        </div>
        <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2"><FiTag className="w-3 h-3 text-primary" />{booking.category}</div>
            <div className="flex items-center gap-2">
                <FiUser className="w-3 h-3 text-gray-400" />
                {booking.technicianName || <span className="text-red-400 font-medium">Unassigned</span>}
            </div>
            <div className="flex items-center gap-2 truncate">
                <FiMapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{booking.address || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
                <FiClock className="w-3 h-3 text-gray-400" />
                {booking.scheduledAt
                    ? new Date(booking.scheduledAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                    : "ASAP"}
            </div>
        </div>
        {booking.issue && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 bg-gray-50 rounded-lg p-2">
                {booking.issue}
            </p>
        )}
    </div>
);

// ─── Technician Select Modal ─────────────────────────────────────────────────
const TechnicianSelectModal = ({ booking, techs, onAssign, onClose }) => {
    const [search, setSearch] = useState("");
    const [availFilter, setAvailFilter] = useState("Available");

    // Filter by category using categoryId — no hardcoded skill names needed
    const filtered = techs.filter(t => {
        const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
        const matchAvail = !availFilter || t.availability === availFilter;
        return matchSearch && matchAvail;
    }).sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

    // Best match: same category as booking
    const topRecommend = filtered.find(t => t.category === booking.category && t.availability === "Available") || null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fadeIn">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white rounded-t-2xl shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg">Assign Technician</p>
                                <p className="text-xs text-white/70">Booking #{booking.id} · {booking.category}</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="p-4 border-b border-gray-100 shrink-0 space-y-3 bg-gray-50">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search technician by name..."
                                className="ff-input pl-9 bg-white w-full"
                            />
                        </div>
                        <button
                            onClick={() => setAvailFilter(v => v === "Available" ? "" : "Available")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${availFilter === "Available" ? "bg-green-500 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                        >
                            Available Only
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-4 space-y-4">
                        {filtered.length === 0 && <EmptyState title="No technicians match criteria" />}

                        {topRecommend && (
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-dark-800 flex items-center gap-2">
                                    <FiStar className="w-4 h-4 text-yellow-500 fill-current" /> Best Match for {booking.category}
                                </p>
                                <div className="border-2 border-primary/30 bg-orange-50 rounded-xl p-4 flex gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                                        {topRecommend.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-dark-900">{topRecommend.name}</p>
                                        <div className="flex gap-4 text-xs text-gray-600 mt-1">
                                            <span className="flex items-center gap-1"><FiPhone className="w-3 h-3" />{topRecommend.phone || "—"}</span>
                                            <span className="flex items-center gap-1"><FiMail className="w-3 h-3" />{topRecommend.email || "—"}</span>
                                        </div>
                                        <div className="mt-2 flex gap-2 flex-wrap text-[11px] font-medium">
                                            <span className="bg-white px-2 py-1 rounded-md text-green-700">✓ {topRecommend.availability}</span>
                                            <span className="bg-white px-2 py-1 rounded-md text-yellow-600">✓ {topRecommend.avgRating} Rating</span>
                                            <span className="bg-white px-2 py-1 rounded-md text-primary">✓ {topRecommend.category}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => onAssign(booking, topRecommend)} className="ff-btn-primary h-fit mt-auto whitespace-nowrap">
                                        Assign
                                    </button>
                                </div>
                            </div>
                        )}

                        {filtered.filter(t => t.id !== topRecommend?.id).length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm font-bold text-gray-500">All Technicians</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {filtered.filter(t => t.id !== topRecommend?.id).map(t => (
                                        <div key={t.id} className={`ff-card p-4 flex flex-col gap-3 ${t.availability !== "Available" ? "opacity-60" : "hover:border-orange-200"}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-dark-700 font-bold text-lg shrink-0">
                                                    {t.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-dark-900 text-sm truncate">{t.name}</p>
                                                    <p className="text-xs text-gray-400">{t.category}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <StatusBadge status={t.availability} size="xs" />
                                                        <span className="flex items-center gap-1 text-xs text-yellow-500 font-semibold">
                                                            <FiStar className="w-3 h-3 fill-current" />{t.avgRating}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {t.availability === "Available" && (
                                                <button onClick={() => onAssign(booking, t)} className="w-full py-2 bg-orange-100 text-primary font-bold text-sm rounded-lg hover:bg-orange-200 transition-colors flex justify-center items-center gap-2">
                                                    <FiCheck className="w-4 h-4" /> Select
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

// ─── Booking Detail Modal ────────────────────────────────────────────────────
const BookingDetailModal = ({ booking, onClose, onAssign, onMarkCompleted }) => {
    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fadeIn overflow-hidden">
                    {/* Header */}
                    <div className={`p-5 text-white shrink-0 ${booking.emergency ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-orange-500 to-orange-600"}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-mono text-sm text-white/70">ID: #{booking.id}</p>
                                <p className="text-2xl font-bold">{booking.customer}</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <StatusBadge status={booking.status} />
                            <StatusBadge status={booking.priority} />
                            {booking.emergency && <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-bold">🚨 Emergency</span>}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left: Customer & Booking Info */}
                            <div className="p-5 border-r border-gray-100 space-y-4">
                                <p className="font-bold text-dark-900 border-b border-gray-100 pb-2">Customer & Booking Info</p>
                                <div className="space-y-2">
                                    {[
                                        { label: "Category",   value: booking.category },
                                        { label: "Phone",      value: booking.customerPhone || "—" },
                                        { label: "Email",      value: booking.customerEmail || "—" },
                                        { label: "Address",    value: booking.address || "—" },
                                        { label: "Pref. Time", value: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "ASAP" },
                                        { label: "Created",    value: new Date(booking.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="grid grid-cols-3 text-xs">
                                            <span className="text-gray-400">{label}</span>
                                            <span className="font-medium text-dark-800 col-span-2">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Issue Description</p>
                                    <p className="text-sm text-dark-700">{booking.issue || "No description provided"}</p>
                                </div>

                                {booking.status === "Pending" && (
                                    <button onClick={() => onAssign(booking)} className="ff-btn-primary w-full flex items-center justify-center gap-2">
                                        <FiUser className="w-4 h-4" /> Assign Technician
                                    </button>
                                )}

                                {booking.technicianName && !["Completed", "Cancelled"].includes(booking.status) && (
                                    <button
                                        onClick={() => { onMarkCompleted(booking.id); onClose(); }}
                                        className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <FiCheck className="w-4 h-4" /> Customer Confirms Completed
                                    </button>
                                )}
                            </div>

                            {/* Right: Technician & Timeline */}
                            <div className="p-5 space-y-4 bg-gray-50">
                                {booking.technicianName ? (
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assigned Technician</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                                {booking.technicianName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-dark-800">{booking.technicianName}</p>
                                                {booking.technicianRating && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FiStar className="w-3 h-3 text-yellow-500 fill-current" /> {booking.technicianRating}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <FiPhone className="w-3 h-3 text-gray-400" />
                                                {booking.technicianPhone || "—"}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <FiTag className="w-3 h-3 text-gray-400" />
                                                {booking.technicianCategory || booking.category}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center gap-2">
                                        <FiAlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                                        <p className="text-xs text-yellow-700 font-medium">No technician assigned yet</p>
                                    </div>
                                )}

                                {/* Completed technician info */}
                                {booking.status === "Completed" && booking.technicianName && (
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                                        <p className="text-xs font-bold text-green-700 mb-1">✅ Completed by</p>
                                        <p className="text-sm font-semibold text-dark-800">{booking.technicianName}</p>
                                        {booking.technicianPhone && (
                                            <p className="text-xs text-gray-500 mt-0.5">{booking.technicianPhone}</p>
                                        )}
                                    </div>
                                )}

                                {/* Timeline */}
                                <div>
                                    <p className="font-bold text-dark-900 border-b border-gray-200 pb-2 mb-3">Timeline</p>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Booking Created", time: booking.createdAt, done: true },
                                            { label: "Technician Assigned", time: null, done: !!booking.technicianName },
                                            { label: "On The Way", time: null, done: ["On The Way", "Arrived", "In Progress", "Completed"].includes(booking.status) },
                                            { label: "Completed", time: null, done: booking.status === "Completed" },
                                        ].map((step, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-2.5 h-2.5 rounded-full mt-1 ${step.done ? "bg-primary" : "bg-gray-200"}`} />
                                                    {i < 3 && <div className={`w-0.5 h-6 ${step.done ? "bg-primary" : "bg-gray-100"}`} />}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-semibold ${step.done ? "text-dark-800" : "text-gray-400"}`}>{step.label}</p>
                                                    {step.time && <p className="text-[10px] text-gray-400">{new Date(step.time).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

// ─── Main ViewBookings ───────────────────────────────────────────────────────
const ViewBookings = ({ onBack = () => {} }) => {
    const { bookings, emergencies, technicians, assignTechnician, customerMarkCompleted } = useDispatcherStore();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const [selected, setSelected] = useState(null);
    const [assigning, setAssigning] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleAssign = useCallback((booking, tech) => {
        assignTechnician(booking.id, tech, false);
        setAssigning(null);
        setSelected(null);
        showToast(`✅ ${tech.name} assigned to #${booking.id}`);
    }, [assignTechnician, showToast]);

    const allBookings = [...bookings, ...emergencies];
    const totalCount = allBookings.length;

    const statusCounts = ["Pending", "Assigned", "On The Way", "In Progress", "Completed", "Cancelled"].reduce((acc, s) => {
        acc[s] = allBookings.filter(b => b.status === s).length;
        return acc;
    }, {});

    const applyFilters = (list) => list.filter(b => {
        const q = search.toLowerCase();
        const matchSearch = !search || [String(b.id), b.customer, b.category, b.technicianName].some(v => v?.toLowerCase().includes(q));
        const matchStatus = !filters.status || b.status === filters.status;
        const matchPriority = !filters.priority || b.priority === filters.priority;
        return matchSearch && matchStatus && matchPriority;
    });

    const filteredEmergency = applyFilters(emergencies);
    const filteredNormal = applyFilters(bookings);

    return (
        <div className="space-y-5 animate-fadeIn">
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-dark-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn">
                    {toast}
                </div>
            )}

            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            {/* Summary strip */}
            <div className="ff-card p-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-dark-900">Total: {totalCount}</span>
                    <span className="text-gray-300">|</span>
                    {Object.entries(statusCounts).map(([s, count]) => count > 0 && (
                        <button key={s} onClick={() => setFilters(f => ({ ...f, status: f.status === s ? "" : s }))}
                            className={`text-xs px-2 py-1 rounded-full font-semibold transition-all ${filters.status === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                            {s}: {count}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search & Filter */}
            <div className="ff-card p-4 flex flex-col sm:flex-row gap-3">
                <SearchBar value={search} onChange={setSearch} placeholder="Search by ID, customer, category..." className="flex-1" />
                <FilterBar
                    filters={[
                        { key: "status",   label: "Status",   options: ["Pending", "Assigned", "On The Way", "In Progress", "Completed", "Cancelled"] },
                        { key: "priority", label: "Priority", options: ["Normal", "Emergency"] },
                    ]}
                    values={filters}
                    onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
                />
            </div>

            {/* Emergency section */}
            {filteredEmergency.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="font-bold text-red-600 text-sm">Emergency Bookings ({filteredEmergency.length})</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEmergency.map(b => <BookingCard key={b.id} booking={b} onView={setSelected} />)}
                    </div>
                </div>
            )}

            {/* Normal section */}
            <div>
                <p className="font-bold text-dark-800 text-sm mb-3">Normal Bookings ({filteredNormal.length})</p>
                {filteredNormal.length > 0
                    ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNormal.map(b => <BookingCard key={b.id} booking={b} onView={setSelected} />)}
                    </div>
                    : <div className="ff-card"><EmptyState icon={FiCalendar} title="No bookings found" /></div>
                }
            </div>

            {/* Modals */}
            {selected && !assigning && (
                <BookingDetailModal
                    booking={selected}
                    onClose={() => setSelected(null)}
                    onAssign={(b) => setAssigning(b)}
                    onMarkCompleted={(id) => { customerMarkCompleted(id); showToast("✅ Booking marked completed."); }}
                />
            )}
            {assigning && (
                <TechnicianSelectModal
                    booking={assigning}
                    techs={technicians}
                    onAssign={handleAssign}
                    onClose={() => setAssigning(null)}
                />
            )}
        </div>
    );
};

export default ViewBookings;
