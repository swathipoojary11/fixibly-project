"use client";
import React, { useState } from "react";
import { useAdminStore as useAppStore } from "../AdminStore";
import ReportCard from "../../components/admin/ReportCard";
import { FiSun, FiCalendar, FiBarChart2, FiArrowLeft } from "react-icons/fi";

const TABS = [
  { key: "daily", label: "Daily Report", icon: FiSun, color: "orange" },
  { key: "weekly", label: "Weekly Report", icon: FiCalendar, color: "blue" },
  { key: "monthly", label: "Monthly Report", icon: FiBarChart2, color: "purple" },
];

const Reports = ({ onBack }) => {
  const { reports = {} } = useAppStore();
  const [active, setActive] = useState(null);

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="ff-card p-4">
        <p className="text-sm text-gray-500">Generate and view reports. Select a report type below.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TABS.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setActive(active === key ? null : key)}
            className={`ff-card p-5 text-left transition-all duration-200 hover:border-orange-200 ${active === key ? "border-primary ring-2 ring-primary/20" : ""}`}>
            <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center ${color === "orange" ? "bg-orange-100" : color === "blue" ? "bg-blue-100" : "bg-purple-100"
              }`}>
              <Icon className={`w-6 h-6 ${color === "orange" ? "text-primary" : color === "blue" ? "text-blue-600" : "text-purple-600"
                }`} />
            </div>
            <p className="font-bold text-dark-900 mb-1">{label}</p>
            <p className="text-xs text-gray-400">{reports[key]?.period || "Current Period"}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${active === key ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                {active === key ? "Viewing" : "View Report"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="animate-fadeIn">
          <ReportCard
            title={TABS.find(t => t.key === active)?.label}
            icon={TABS.find(t => t.key === active)?.icon}
            data={reports[active]}
            color={TABS.find(t => t.key === active)?.color}
          />
        </div>
      )}

      {!active && (
        <div className="ff-card p-8 text-center">
          <p className="text-gray-400 text-sm">Select a report type above to view details.</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
