"use client";
import React, { useState, useMemo } from "react";
import { useAdminStore as useAppStore } from "../AdminStore";
import BookingTable from "../../components/admin/BookingTable";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import FilterBar from "../../components/dispatcher-admin/FilterBar";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiCalendar, FiX, FiUser, FiMapPin, FiPhone, FiTag, FiClock, FiArrowLeft } from "react-icons/fi";

const STATUS_TABS = ["All", "Pending", "Assigned", "On The Way", "In Progress", "Completed", "Cancelled", "Delayed"];

const BookingMonitoring = ({ onBack }) => {
  const { bookings, emergencies } = useAppStore();
  const allBookings = useMemo(() => [...bookings, ...emergencies], [bookings, emergencies]);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return allBookings.filter(b => {
      const matchTab = activeTab === "All" || b.status === activeTab;
      const matchSearch = !search || [b.id, b.customer, b.category, b.technicianName].some(v => v?.toLowerCase().includes(search.toLowerCase()));
      const matchPriority = !filters.priority || b.priority === filters.priority;
      const matchCategory = !filters.category || b.category === filters.category;
      return matchTab && matchSearch && matchPriority && matchCategory;
    });
  }, [allBookings, search, filters, activeTab]);

  const counts = useMemo(() => {
    const c = {};
    STATUS_TABS.forEach(s => { c[s] = s === "All" ? allBookings.length : allBookings.filter(b => b.status === s).length; });
    return c;
  }, [allBookings]);

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="ff-card p-1 flex gap-1 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${activeTab === tab ? "bg-primary text-white shadow-orange" : "text-gray-500 hover:bg-gray-100"}`}>
            {tab}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="ff-card p-4 flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by ID, customer, category..." className="flex-1" />
        <FilterBar
          filters={[
            { key: "priority", label: "Priority", options: ["High", "Normal", "Low", "Emergency"] },
            { key: "category", label: "Category", options: ["Electrician", "Plumber", "AC Repair", "Carpenter", "Painter"] },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        />
      </div>

      <div className="ff-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="ff-section-title">Bookings <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length})</span></p>
          <p className="text-xs text-gray-400">Read-only view · Admin cannot modify bookings</p>
        </div>
        {filtered.length > 0
          ? <BookingTable bookings={filtered} onView={setSelected} />
          : <EmptyState icon={FiCalendar} title="No bookings found" description="Try adjusting your search or filters." />
        }
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-white/70">{selected.id}</p>
                  <p className="text-xl font-bold">{selected.customer}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
              </div>
              <div className="flex gap-2 mt-3">
                <StatusBadge status={selected.status} />
                <StatusBadge status={selected.priority} />
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { icon: FiTag,    label: "Category",   value: selected.category },
                { icon: FiPhone,  label: "Phone",      value: selected.phone },
                { icon: FiMapPin, label: "Address",    value: selected.address },
                { icon: FiUser,   label: "Technician", value: selected.technicianName || "Unassigned" },
                { icon: FiClock,  label: "Scheduled",  value: new Date(selected.scheduledAt).toLocaleString() },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-medium text-dark-800">{value}</p></div>
                </div>
              ))}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Issue Description</p>
                <p className="text-sm text-dark-700">{selected.issue}</p>
              </div>
              {selected.cancelReason && (
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs text-red-400 mb-1">Cancellation Reason</p>
                  <p className="text-sm text-red-700">{selected.cancelReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingMonitoring;
