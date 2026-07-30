// src/components/admin/ReportCard.jsx
import React, { useState } from "react";
import { FiFileText, FiChevronDown, FiChevronUp } from "react-icons/fi";

const ReportCard = ({ title, icon: Icon = FiFileText, data, color = "orange" }) => {
  const [expanded, setExpanded] = useState(false);
  const colorMap = {
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="ff-card overflow-hidden">
      <div className={`bg-gradient-to-r ${colorMap[color]} p-5 text-white`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <span className="font-bold text-base">{title}</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{data.period}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-2xl font-bold">{data.totalBookings}</p><p className="text-xs text-white/70">Total Bookings</p></div>
          <div><p className="text-2xl font-bold">{data.completedJobs}</p><p className="text-xs text-white/70">Completed</p></div>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-red-50 rounded-xl p-3">
            <p className="text-lg font-bold text-red-600">{data.cancelledJobs}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <p className="text-lg font-bold text-primary">{data.emergencyJobs}</p>
            <p className="text-xs text-gray-500">Emergency</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-lg font-bold text-green-600">₹{data.expectedRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Expected Revenue</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-lg font-bold text-blue-600">{data.completionRate}%</p>
            <p className="text-xs text-gray-500">Completion Rate</p>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="w-full ff-btn-secondary flex items-center justify-center gap-2 text-xs">
          {expanded ? "Hide" : "View"} Technician Performance
          {expanded ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
        </button>
        {expanded && (
          <div className="mt-3 space-y-2 animate-fadeIn">
            {data.technicianPerformance.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">{t.name.charAt(0)}</div>
                  <span className="text-sm font-medium text-dark-800">{t.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{t.completed} jobs</span>
                  <span className="text-yellow-500 font-semibold">★ {t.rating}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
