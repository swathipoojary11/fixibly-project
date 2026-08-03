import React from "react";
import { MdTrendingUp } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";

function PerformanceCard() {
  const stats = useTechnicianStore((state) => state.stats);
  const technician = useTechnicianStore((state) => state.technician);
  const jobs = useTechnicianStore((state) => state.assignedJobs) || [];

  const completedJobs = jobs.filter((job) => job.status === "completed");
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

  const completionRate = jobs.length
    ? Math.round((completedJobs.length / jobs.length) * 100)
    : 0;

  return (
    <div className="rounded-none bg-white border border-[#ECECEC] shadow-sm p-7">
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
            <MdTrendingUp size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#202020]">Today's Performance</h3>
            <p className="text-xs text-[#7B7B7B]">Live service metrics from your assigned work</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-[#7B7B7B] mb-2">
          <span>Completion Efficiency</span>
          <span className="text-[#F54C0F]">{completionRate}%</span>
        </div>
        <div className="h-2.5 rounded-none bg-[#ECECEC] overflow-hidden">
          <div className="h-full rounded-none bg-[#F54C0F]" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <div className="mt-6 space-y-3.5 pt-4 border-t border-[#ECECEC] text-xs font-semibold">
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Jobs Finished</span>
          <span className="text-[#202020] font-extrabold text-xs">{stats?.completedToday ?? completedJobs.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Average Resolution Time</span>
          <span className="text-[#202020] font-extrabold text-xs">{resolutionMinutes ? `${resolutionMinutes} mins` : "—"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Current Rating</span>
          <span className="text-[#F54C0F] font-extrabold text-[9px] flex items-center gap-0.5">
            {technician?.rating != null ? Number(technician.rating).toFixed(1) : "—"}
            <span className="text-[7px] leading-none">★</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceCard;
