"use client";
import React, { useState, useMemo } from "react";
import { useAppStore } from "../../context/AppStore";
import TechnicianCard from "../../components/admin/TechnicianCard";
import SearchBar from "../../components/common/SearchBar";
import FilterBar from "../../components/common/FilterBar";
import EmptyState from "../../components/common/EmptyState";
import { FiUsers, FiArrowLeft } from "react-icons/fi";

const SORT_OPTIONS = [
  { key: "best",     label: "Best Performer",  fn: (a, b) => b.completionRate - a.completionRate },
  { key: "rating",   label: "Lowest Rating",   fn: (a, b) => a.avgRating - b.avgRating },
  { key: "delays",   label: "Most Delays",     fn: (a, b) => b.delayedJobs - a.delayedJobs },
  { key: "workload", label: "Highest Workload", fn: (a, b) => b.assignedJobs - a.assignedJobs },
];

const TechnicianPerformance = ({ onBack }) => {
  const { technicians } = useAppStore();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState("best");

  const filtered = useMemo(() => {
    const sortFn = SORT_OPTIONS.find(s => s.key === sortKey)?.fn || SORT_OPTIONS[0].fn;
    return technicians
      .filter(t => {
        const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
        const matchCategory = !filters.category || t.category === filters.category;
        const matchAvail = !filters.availability || t.availability === filters.availability;
        return matchSearch && matchCategory && matchAvail;
      })
      .sort(sortFn);
  }, [technicians, search, filters, sortKey]);

  const avgRating = (technicians.reduce((s, t) => s + t.avgRating, 0) / technicians.length).toFixed(1);
  const avgCompletion = (technicians.reduce((s, t) => s + t.completionRate, 0) / technicians.length).toFixed(1);

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Technicians", value: technicians.length,                                                    color: "bg-orange-50 text-primary" },
          { label: "Available Now",     value: technicians.filter(t => t.availability === "Available").length,        color: "bg-green-50 text-green-600" },
          { label: "Avg Rating",        value: `★ ${avgRating}`,                                                      color: "bg-yellow-50 text-yellow-600" },
          { label: "Avg Completion",    value: `${avgCompletion}%`,                                                   color: "bg-blue-50 text-blue-600" },
        ].map((s, i) => (
          <div key={i} className={`ff-card p-4 ${s.color.split(" ")[0]}`}>
            <p className={`text-2xl font-bold mb-0.5 ${s.color.split(" ")[1]}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="ff-card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search technician..." className="flex-1" />
        <FilterBar
          filters={[
            { key: "category",     label: "Category",     options: ["Electrician", "Plumber", "AC Repair", "Carpenter", "Painter"] },
            { key: "availability", label: "Availability", options: ["Available", "Busy"] },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        />
        <div className="flex gap-1 flex-wrap">
          {SORT_OPTIONS.map(s => (
            <button key={s.key} onClick={() => setSortKey(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${sortKey === s.key ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(t => <TechnicianCard key={t.id} tech={t} />)}
        </div>
      ) : (
        <div className="ff-card"><EmptyState icon={FiUsers} title="No technicians found" /></div>
      )}
    </div>
  );
};

export default TechnicianPerformance;
