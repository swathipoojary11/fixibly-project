"use client";
import React from "react";
import { MdTrendingUp } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";

function PerformanceCard() {
  const stats = useTechnicianStore((state) => state.stats);
  const technician = useTechnicianStore((state) => state.technician);
  const assignedJobs = useTechnicianStore((state) => state.assignedJobs) || [];

  const completedCount = stats?.completedToday ?? (assignedJobs.filter(j => j.status === 'Completed' || j.booking_status === 'Completed').length);
  const rating = technician?.rating || 5.0;
  const efficiency = completedCount > 0 ? "100%" : "Ready";

  return (
    <div className="rounded-2xl bg-white border border-[#ECECEC] shadow-sm p-7">
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
            <MdTrendingUp size={22} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#202020]">Service Performance</h3>
            <p className="text-xs text-[#7B7B7B]">Live field metrics & completion rate</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-[#7B7B7B] mb-2">
          <span>Service Efficiency</span>
          <span className="text-[#F54C0F]">{efficiency}</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#ECECEC] overflow-hidden">
          <div className="h-full w-full rounded-full bg-[#F54C0F]" />
        </div>
      </div>

      <div className="mt-6 space-y-3.5 pt-4 border-t border-[#ECECEC] text-xs font-semibold">
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Completed Jobs</span>
          <span className="text-[#202020] font-extrabold text-xs">{completedCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Average Response Time</span>
          <span className="text-[#202020] font-extrabold text-xs">15 mins</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Customer Rating</span>
          <span className="text-[#F54C0F] font-extrabold text-xs flex items-center gap-1">
            {rating} <span className="text-amber-400">★</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceCard;
