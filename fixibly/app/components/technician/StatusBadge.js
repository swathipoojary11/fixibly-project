import React from "react";

function StatusBadge({ status }) {
  const badgeStyles = {
    Scheduled:      "bg-[#FFF3EE] text-[#F54C0F] border border-[#F54C0F]/30",
    "In Progress":  "bg-[#F54C0F] text-white shadow-sm shadow-[#F54C0F]/30",
    Completed:      "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Available:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Busy:           "bg-amber-100 text-amber-800 border border-amber-200",
    Started:        "bg-[#FFF3EE] text-[#F54C0F] border border-[#F54C0F]/30",
    "On the Way":   "bg-[#F54C0F] text-white shadow-sm shadow-[#F54C0F]/30",
    Closed:         "bg-[#F7F7F7] text-[#7B7B7B] border border-[#ECECEC]",
    Offline:        "bg-[#F7F7F7] text-[#7B7B7B] border border-[#ECECEC]",
  };

  const styleClass = badgeStyles[status] || "bg-[#FFF3EE] text-[#F54C0F] border border-[#F54C0F]/30";

  return (
    <span className={`inline-flex items-center px-3.5 py-1 rounded-none text-xs font-bold tracking-wide uppercase ${styleClass}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
