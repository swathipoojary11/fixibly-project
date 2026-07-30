// src/components/admin/TechnicianCard.jsx
import React from "react";
import StatusBadge from "../dispatcher-admin/StatusBadge";
import { FiStar, FiClock, FiAlertCircle } from "react-icons/fi";

const ProgressBar = ({ value, max = 100, color = "bg-primary" }) => (
  <div className="w-full bg-gray-100 rounded-full h-1.5">
    <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
  </div>
);

const TechnicianCard = ({ tech }) => (
  <div className="ff-card p-5 hover:border-orange-200">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
        {tech.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-dark-900 text-sm truncate">{tech.name}</p>
        <p className="text-xs text-gray-400">{tech.id} · {tech.category}</p>
        <div className="mt-1"><StatusBadge status={tech.availability} size="xs" /></div>
      </div>
      <div className="flex items-center gap-1 text-yellow-500">
        <FiStar className="w-3.5 h-3.5 fill-current" />
        <span className="text-xs font-bold text-dark-800">{tech.avgRating}</span>
      </div>
    </div>

    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Completion Rate</span>
          <span className="font-semibold text-dark-700">{tech.completionRate}%</span>
        </div>
        <ProgressBar value={tech.completionRate} color={tech.completionRate >= 90 ? "bg-green-500" : tech.completionRate >= 75 ? "bg-primary" : "bg-red-400"} />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="text-center">
          <p className="text-base font-bold text-dark-900">{tech.assignedJobs}</p>
          <p className="text-xs text-gray-400">Assigned</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-green-600">{tech.completedJobs}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-red-500">{tech.delayedJobs}</p>
          <p className="text-xs text-gray-400">Delayed</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className="flex items-center gap-1 text-xs text-gray-400"><FiClock className="w-3 h-3" />{tech.avgResponseTime} avg</span>
        {tech.delayedJobs > 1 && <span className="flex items-center gap-1 text-xs text-red-400"><FiAlertCircle className="w-3 h-3" />{tech.delayedJobs} delays</span>}
      </div>
    </div>
  </div>
);

export default TechnicianCard;
