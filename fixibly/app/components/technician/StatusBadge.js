import React from "react";

const variants = {
  pending:     "bg-yellow-100 text-yellow-700 border border-yellow-200",
  assigned:    "bg-blue-100 text-blue-700 border border-blue-200",
  accepted:    "bg-teal-100 text-teal-700 border border-teal-200",
  on_the_way:  "bg-cyan-100 text-cyan-700 border border-cyan-200",
  arrived:     "bg-indigo-100 text-indigo-700 border border-indigo-200",
  working:     "bg-orange-100 text-orange-700 border border-orange-200",
  completed:   "bg-green-100 text-green-700 border border-green-200",
  cancelled:   "bg-gray-100 text-gray-500 border border-gray-200",
  available:   "bg-green-100 text-green-700 border border-green-200",
  busy:        "bg-orange-100 text-orange-700 border border-orange-200",
  offline:     "bg-gray-100 text-gray-500 border border-gray-200",
};

const labels = {
  on_the_way: "On The Way",
};

function StatusBadge({ status }) {
  const key = `${status || ""}`.trim().toLowerCase().replace(/\s+/g, "_");
  const cls = variants[key] || "bg-gray-100 text-gray-600 border border-gray-200";
  const label = labels[key] || (status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ") : "Pending");

  return (
    <span className={`inline-flex items-center font-semibold rounded-full text-xs px-2.5 py-1 whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
