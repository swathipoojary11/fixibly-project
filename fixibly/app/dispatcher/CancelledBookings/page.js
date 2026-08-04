"use client";
import React, { useState, useMemo } from "react";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiXCircle, FiUser, FiClock, FiTag, FiArrowLeft } from "react-icons/fi";

const CancelledBookings = ({ onBack = () => {} }) => {
  const { cancelledBookings } = useAppStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const filtered = useMemo(() => {
    return (Array.isArray(cancelledBookings) ? cancelledBookings : [])
      .filter(Boolean)
      .filter(b => !search || [b.id, b.customer, b.technicianName].some(v => v?.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => sort === "latest" ? new Date(b.cancelledAt) - new Date(a.cancelledAt) : new Date(a.cancelledAt) - new Date(b.cancelledAt));
  }, [cancelledBookings, search, sort]);

  return (
    <div className="space-y-5 animate-fadeIn">

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="ff-card p-4 bg-red-50 border-red-100">
        <p className="text-2xl font-bold text-red-600">{filtered.length}</p>
        <p className="text-xs text-gray-500">Total Cancelled Bookings</p>
      </div>

      <div className="ff-card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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

                </div>
              </div>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2"><FiUser className="w-3 h-3 text-primary" /><span className="font-medium text-dark-800">{b.customer}</span></div>
                <div className="flex items-center gap-2"><FiUser className="w-3 h-3 text-gray-400" />Tech: {b.technicianName}</div>
                <div className="flex items-center gap-2"><FiTag className="w-3 h-3 text-gray-400" />{b.category}</div>
                <div className="flex items-center gap-2"><FiClock className="w-3 h-3 text-gray-400" />{new Date(b.cancelledAt).toLocaleString()}</div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="ff-card"><EmptyState icon={FiXCircle} title="No cancelled bookings" description="No cancelled bookings found." /></div>
      )}

    </div>
  );
};

export default CancelledBookings;
