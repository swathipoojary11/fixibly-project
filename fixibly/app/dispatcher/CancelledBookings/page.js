"use client";
import React, { useState, useMemo } from "react";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import { FiXCircle, FiUser, FiClock, FiTag, FiArrowLeft, FiRefreshCw, FiX, FiSearch, FiStar, FiCheck } from "react-icons/fi";
import Portal from "../../components/dispatcher-admin/Portal";

const ReassignModal = ({ booking, techs, onAssign, onClose }) => {
  const [search, setSearch] = useState("");
  if (!booking) return null;

  const filtered = (Array.isArray(techs) ? techs : []).filter(t =>
    t.availability === "Available" &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => b.avgRating - a.avgRating);

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-fadeIn">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white rounded-t-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Reassign Technician</p>
              <p className="text-xs text-white/70">{booking?.id ?? "Unknown"} · {booking?.category ?? "Unknown"}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search technician..." className="ff-input pl-9" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {filtered.length === 0 && <EmptyState title="No available technicians" />}
          {filtered.map(t => (
            <div key={t.id} className="ff-card p-4 flex items-center gap-3 hover:border-orange-200">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shrink-0">{t.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-dark-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={t.availability} size="xs" />
                  <span className="flex items-center gap-1 text-xs text-yellow-500 font-semibold"><FiStar className="w-3 h-3 fill-current" />{t.avgRating}</span>
                </div>
              </div>
              <button onClick={() => onAssign(t)} className="ff-btn-primary flex items-center gap-1.5 shrink-0">
                <FiCheck className="w-3.5 h-3.5" /> Assign
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Portal>
  );
};

const CancelledBookings = ({ onBack }) => {
  const { cancelledBookings, technicians, reassignBooking } = useAppStore();
  const [tab, setTab] = useState("Customer");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [reassigning, setReassigning] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const safeCancelledBookings = useMemo(() => {
    return (Array.isArray(cancelledBookings) ? cancelledBookings : [])
      .filter(Boolean)
      .map((entry, index) => ({
        ...entry,
        id: entry.id ?? `CB-${index + 1}`,
        customer: entry.customer ?? "Unknown",
        cancelledBy: entry.cancelledBy ?? "Customer",
        needsReassign: entry.needsReassign ?? true,
        reassignedTo: entry.reassignedTo ?? null,
      }));
  }, [cancelledBookings]);

  const filtered = useMemo(() => {
    return safeCancelledBookings
      .filter(b => b.cancelledBy === tab && (!search || [b.id, b.customer, b.technicianName].some(v => v?.toLowerCase().includes(search.toLowerCase()))))
      .sort((a, b) => sort === "latest" ? new Date(b.cancelledAt) - new Date(a.cancelledAt) : new Date(a.cancelledAt) - new Date(b.cancelledAt));
  }, [safeCancelledBookings, tab, search, sort]);

  const byCustomer = safeCancelledBookings.filter(b => b.cancelledBy === "Customer").length;
  const byTech = safeCancelledBookings.filter(b => b.cancelledBy === "Technician").length;

  const handleReassign = (tech) => {
    const target = reassigning && typeof reassigning === "object" ? reassigning : null;
    if (!target?.id) {
      setReassigning(null);
      return;
    }

    reassignBooking(target.id, tech);
    showToast(`✅ ${target.id} reassigned to ${tech.name}`);
    setReassigning(null);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {toast && <div className="fixed top-4 right-4 z-50 bg-dark-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn">{toast}</div>}

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div className="ff-card p-4 bg-red-50 border-red-100">
          <p className="text-2xl font-bold text-red-600">{byCustomer}</p>
          <p className="text-xs text-gray-500">Cancelled by Customer</p>
        </div>
        <div className="ff-card p-4 bg-orange-50 border-orange-100">
          <p className="text-2xl font-bold text-primary">{byTech}</p>
          <p className="text-xs text-gray-500">Cancelled by Technician</p>
        </div>
      </div>

      <div className="ff-card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1">
          {["Customer", "Technician"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              By {t}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search..." className="flex-1" />
        <select value={sort} onChange={e => setSort(e.target.value)} className="ff-input !w-auto text-xs">
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => (
            <div key={b.id} className="ff-card p-4 border-l-4 border-l-red-400">
              <div className="flex items-start justify-between mb-3">
                <p className="font-mono text-xs text-red-500 font-semibold">{b.id}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Cancelled</span>
                  {(b.needsReassign ?? true) && !b.reassignedTo && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">Needs Reassign</span>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2"><FiUser className="w-3 h-3 text-primary" /><span className="font-medium text-dark-800">{b.customer}</span></div>
                <div className="flex items-center gap-2"><FiUser className="w-3 h-3 text-gray-400" />Tech: {b.technicianName}</div>
                <div className="flex items-center gap-2"><FiTag className="w-3 h-3 text-gray-400" />{b.category}</div>
                <div className="flex items-center gap-2"><FiClock className="w-3 h-3 text-gray-400" />{new Date(b.cancelledAt).toLocaleString()}</div>
              </div>
              <div className="mt-3 bg-red-50 rounded-lg p-2">
                <p className="text-xs text-red-400 mb-0.5">Reason</p>
                <p className="text-xs text-red-700 font-medium">{b.reason}</p>
              </div>
              {b.reassignedTo && (
                <div className="mt-2 bg-green-50 rounded-lg p-2">
                  <p className="text-xs text-green-600 font-semibold">Reassigned to: {b.reassignedTo}</p>
                </div>
              )}
              {(b.needsReassign ?? true) && !b.reassignedTo && (
                <button onClick={() => setReassigning(b || null)}
                  className="mt-3 w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <FiRefreshCw className="w-3.5 h-3.5" /> Reassign Technician
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="ff-card"><EmptyState icon={FiXCircle} title="No cancelled bookings" description={`No bookings cancelled by ${tab.toLowerCase()} found.`} /></div>
      )}

      {reassigning && (
        <ReassignModal
          booking={reassigning}
          techs={technicians}
          onAssign={handleReassign}
          onClose={() => setReassigning(null)}
        />
      )}
    </div>
  );
};

export default CancelledBookings;
