import React from "react";
import { TrendingUp } from "lucide-react";
import useTechnicianStore from "../../technician/store/technicianStore";

function PerformanceCard() {
  const stats      = useTechnicianStore((state) => state.stats);
  const technician = useTechnicianStore((state) => state.technician);
  const jobs       = useTechnicianStore((state) => state.assignedJobs) || [];

  const completedJobs = jobs.filter((j) => j.status === "completed");
  const completionRate = jobs.length ? Math.round((completedJobs.length / jobs.length) * 100) : 0;

  const resolutionMinutes = completedJobs.length
    ? Math.round(
        completedJobs.reduce((total, job) => {
          if (!job.schedule_time) return total;
          const created = new Date(job.created_at || job.schedule_time);
          const updated = new Date(job.updated_at || Date.now());
          return total + Math.max(0, Math.round((updated - created) / 60000));
        }, 0) / completedJobs.length
      )
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Performance</h3>
          <p className="text-xs text-gray-500">Live service metrics</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
          <span>Completion Rate</span>
          <span className="text-orange-600 font-bold">{completionRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Jobs Finished</span>
          <span className="font-bold text-gray-900">{stats?.completedToday ?? completedJobs.length}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Avg Resolution</span>
          <span className="font-bold text-gray-900">{resolutionMinutes ? `${resolutionMinutes} min` : "—"}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Rating</span>
          <span className="font-bold text-orange-600">
            {technician?.rating != null ? `${Number(technician.rating).toFixed(1)} ★` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceCard;
