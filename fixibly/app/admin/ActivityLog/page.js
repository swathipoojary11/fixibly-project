"use client";
import React, { useState, useMemo } from "react";
import { activityLogs } from "../../data/activityLogs";
import ActivityTimeline from "../../components/admin/ActivityTimeline";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import FilterBar from "../../components/dispatcher-admin/FilterBar";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiActivity, FiArrowLeft } from "react-icons/fi";

const ActivityLog = ({ onBack }) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const filtered = useMemo(() => {
    return activityLogs.filter(l => {
      const matchSearch = !search || [l.action, l.user, l.detail, l.bookingId].some(v => v?.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = !filters.status || l.status === filters.status;
      return matchSearch && matchStatus;
    });
  }, [search, filters]);

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="ff-card p-4 flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search actions, users, booking IDs..." className="flex-1" />
        <FilterBar
          filters={[{ key: "status", label: "Status", options: ["Created", "Assigned", "Accepted", "In Progress", "Completed", "Cancelled", "Emergency", "Arrived"] }]}
          values={filters}
          onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        />
      </div>

      <div className="ff-card p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="ff-section-title">Audit Timeline <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length} events)</span></p>
          <p className="text-xs text-gray-400">Today, Jan 15 2025</p>
        </div>
        {filtered.length > 0
          ? <ActivityTimeline logs={filtered} />
          : <EmptyState icon={FiActivity} title="No activity found" description="Try adjusting your search or filters." />
        }
      </div>
    </div>
  );
};

export default ActivityLog;
