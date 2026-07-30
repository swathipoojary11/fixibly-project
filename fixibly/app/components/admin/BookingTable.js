// src/components/admin/BookingTable.jsx
import React, { useState } from "react";
import StatusBadge from "../common/StatusBadge";
import { FiEye, FiChevronUp, FiChevronDown } from "react-icons/fi";

const BookingTable = ({ bookings, onView }) => {
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...bookings].sort((a, b) => {
    const av = a[sortKey] || ""; const bv = b[sortKey] || "";
    return sortDir === "asc" ? av > bv ? 1 : -1 : av < bv ? 1 : -1;
  });

  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === "asc" ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />)
    : <FiChevronDown className="w-3 h-3 opacity-30" />;

  const cols = [
    { key: "id", label: "Booking ID" },
    { key: "customer", label: "Customer" },
    { key: "category", label: "Category" },
    { key: "technicianName", label: "Technician" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {cols.map(c => (
              <th key={c.key} onClick={() => handleSort(c.key)}
                className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-dark-700 whitespace-nowrap">
                <span className="flex items-center gap-1">{c.label}<SortIcon k={c.key} /></span>
              </th>
            ))}
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((b) => (
            <tr key={b.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors duration-150">
              <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">{b.id}</td>
              <td className="py-3 px-4 font-medium text-dark-800 whitespace-nowrap">{b.customer}</td>
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{b.category}</td>
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{b.technicianName || <span className="text-gray-300 italic">Unassigned</span>}</td>
              <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
              <td className="py-3 px-4"><StatusBadge status={b.priority} /></td>
              <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">{new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
              <td className="py-3 px-4">
                <button onClick={() => onView && onView(b)} className="ff-btn-ghost flex items-center gap-1 text-xs">
                  <FiEye className="w-3.5 h-3.5" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
