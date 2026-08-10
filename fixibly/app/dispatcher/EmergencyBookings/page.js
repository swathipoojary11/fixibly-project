"use client";
import React, { useState } from "react";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiZap, FiX, FiPhone, FiMapPin, FiCheck, FiArrowLeft, FiUser, FiSearch, FiStar } from "react-icons/fi";
import Portal from "../../components/dispatcher-admin/Portal";

const AssignModal = ({ booking, techs, onAssign, onClose }) => {
  const [search, setSearch] = useState("");
  const filtered = techs.filter(t =>
    t.availability === "Available" &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-fadeIn">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white rounded-t-2xl shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Assign Technician</p>
                <p className="text-xs text-white/70">#{booking.id} · {booking.category}</p>
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
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold shrink-0">{t.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={t.availability} size="xs" />
                    <span className="flex items-center gap-1 text-xs text-yellow-500 font-semibold"><FiStar className="w-3 h-3 fill-current" />{t.avgRating}</span>
                  </div>
                </div>
                <button onClick={() => onAssign(booking, t)} className="ff-btn-primary flex items-center gap-1.5 shrink-0">
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

const EmergencyBookings = ({ onBack = () => {} }) => {
  const { emergencies, technicians, assignTechnician } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleAssign = (booking, tech) => {
    assignTechnician(booking.id, tech, true);
    setAssigning(null);
    setSelected(null);
    showToast(`✅ ${tech.name} assigned to #${booking.id}`);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {toast && <div className="fixed top-4 right-4 z-50 bg-dark-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn">{toast}</div>}

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {emergencies.length === 0 && (
        <div className="ff-card p-8 text-center text-gray-400 text-sm">No emergency bookings at this time.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencies.map(em => (
          <div key={em.id} onClick={() => setSelected(em)}
            className="ff-card p-4 border-l-4 border-l-red-500 cursor-pointer hover:border-red-300 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiZap className="w-4 h-4 text-red-500" />
                <span className="font-mono text-xs text-red-500 font-semibold">{em.id}</span>
              </div>
              <StatusBadge status={em.status} size="xs" />
            </div>
            <p className="font-bold text-dark-900 text-sm mb-2">{em.customer}</p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-2"><FiPhone className="w-3 h-3" />{em.phone || "—"}</div>
              <div className="flex items-center gap-2 truncate"><FiMapPin className="w-3 h-3 shrink-0" /><span className="truncate">{em.address || "—"}</span></div>
            </div>
            {em.issue && <p className="text-xs text-gray-600 italic mt-2 line-clamp-2">"{em.issue}"</p>}
            {em.technicianName && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-semibold">
                <FiCheck className="w-3 h-3" /> {em.technicianName}
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && !assigning && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
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
                  <button onClick={() => setSelected(null)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Phone",    value: selected.phone || "—" },
                    { label: "Category", value: selected.category },
                    { label: "Priority", value: selected.priority },
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
                  <p className="text-sm text-dark-700">{selected.address || "—"}</p>
                </div>
                {selected.issue && (
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-red-400 mb-1">Issue</p>
                    <p className="text-sm text-red-700">{selected.issue}</p>
                  </div>
                )}
                {selected.technicianName ? (
                  <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700 font-semibold">Assigned to {selected.technicianName}</p>
                  </div>
                ) : (
                  <button onClick={() => setAssigning(selected)}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold flex items-center justify-center gap-2">
                    <FiUser className="w-4 h-4" /> Assign Technician
                  </button>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {assigning && (
        <AssignModal
          booking={assigning}
          techs={technicians}
          onAssign={handleAssign}
          onClose={() => setAssigning(null)}
        />
      )}
    </div>
  );
};

export default EmergencyBookings;
