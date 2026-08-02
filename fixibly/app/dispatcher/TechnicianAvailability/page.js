"use client";
import React, { useState, useMemo } from "react";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import FilterBar from "../../components/dispatcher-admin/FilterBar";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiUsers, FiStar, FiClock, FiX, FiPhone, FiMail, FiArrowLeft } from "react-icons/fi";
import Portal from "../../components/dispatcher-admin/Portal";

const TechnicianAvailability = ({ onBack }) => {
  const { technicians } = useAppStore();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    return technicians.filter(t => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || String(t.id).includes(search);
      const matchSkill = !filters.skill || t.category === filters.skill;
      const matchAvail = !filters.availability || t.availability === filters.availability;
      return matchSearch && matchSkill && matchAvail;
    });
  }, [technicians, search, filters]);

  const available = filtered.filter(t => t.availability === "Available").length;
  const busy = filtered.filter(t => t.availability === "Busy").length;

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-3 gap-4">
        <div className="ff-card p-4 bg-green-50 border-green-100">
          <p className="text-2xl font-bold text-green-600">{available}</p>
          <p className="text-xs text-gray-500">Available</p>
        </div>
        <div className="ff-card p-4 bg-orange-50 border-orange-100">
          <p className="text-2xl font-bold text-primary">{busy}</p>
          <p className="text-xs text-gray-500">Busy</p>
        </div>
        <div className="ff-card p-4">
          <p className="text-2xl font-bold text-dark-900">{filtered.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>

      <div className="ff-card p-4 flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search technician..." className="flex-1" />
        <FilterBar
          filters={[
            { key: "skill",        label: "Skill",        options: ["Electrician", "Plumber", "AC Repair", "Carpenter", "Painter"] },
            { key: "availability", label: "Availability", options: ["Available", "Busy"] },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className={`ff-card p-4 hover:border-orange-200 ${t.availability === "Available" ? "border-l-4 border-l-green-400" : "border-l-4 border-l-orange-400"}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shrink-0">{t.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark-900 text-sm truncate">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={t.availability} size="xs" />
                    <span className="text-xs text-gray-400">{t.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 shrink-0">
                  <FiStar className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold text-dark-800">{t.avgRating}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-2"><FiClock className="w-3 h-3" />Avg response: {t.avgResponseTime}</div>
                {t.currentBooking && <div className="text-orange-500 font-medium">Current: {t.currentBooking}</div>}
              </div>
              <button onClick={() => setDetail(t)} className="ff-btn-secondary w-full text-xs">Check Status</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="ff-card"><EmptyState icon={FiUsers} title="No technicians found" /></div>
      )}

      {detail && (
        <Portal>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn overflow-hidden">
            <div className="bg-gradient-to-r from-dark-800 to-dark-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">{detail.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold">{detail.name}</p>
                    <p className="text-xs text-gray-400">{detail.id} · {detail.category}</p>
                  </div>
                </div>
                <button onClick={() => setDetail(null)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><FiX className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Availability</span>
                <StatusBadge status={detail.availability} />
              </div>
              {[
                { label: "Phone",          value: detail.phone,          icon: FiPhone },
                { label: "Email",          value: detail.email,          icon: FiMail },
                { label: "Avg Rating",     value: `★ ${detail.avgRating}`, icon: FiStar },
                { label: "Response Time",  value: detail.avgResponseTime, icon: FiClock },
                { label: "Completed Jobs", value: detail.completedJobs,  icon: null },
                { label: "Delayed Jobs",   value: detail.delayedJobs,    icon: null },
                { label: "Current Booking",value: detail.currentBooking || "None", icon: null },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 flex items-center gap-1">{Icon && <Icon className="w-3 h-3" />}{label}</span>
                  <span className="text-sm font-semibold text-dark-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
};

export default TechnicianAvailability;
