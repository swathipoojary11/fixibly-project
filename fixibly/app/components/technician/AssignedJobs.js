"use client";
import React from "react";
import JobCard from "./JobCard";
import useTechnicianStore from "../../technician/store/technicianStore";
import { MdAssignment, MdRefresh, MdCheckCircle } from "react-icons/md";

function AssignedJobs() {
  const jobs    = useTechnicianStore((state) => state.assignedJobs) || [];
  const loading = useTechnicianStore((state) => state.loading);
  const fetchAll = useTechnicianStore((state) => state.fetchAll);

  const activeJobs = jobs.filter((job) => !["completed", "cancelled"].includes((job.status || "").toLowerCase()));
  const completedJobs = jobs.filter((job) => (job.status || "").toLowerCase() === "completed");

  return (
    <div id="assigned-jobs" className="space-y-8">
      <div className="rounded-[28px] bg-white border border-[#ECECEC] shadow-sm p-7 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ECECEC] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
              <MdAssignment size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#202020]">Assigned Jobs</h2>
              <p className="text-xs text-[#7B7B7B]">Active field dispatch assigned to you</p>
            </div>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F54C0F] border border-[#F54C0F]/30 bg-[#FFF3EE] px-4 py-2 hover:bg-[#F54C0F] hover:text-white transition-all disabled:opacity-50"
          >
            <MdRefresh size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="space-y-5">
          {activeJobs.length === 0 && !loading ? (
            <div className="text-center py-12 text-[#7B7B7B]">
              <MdAssignment size={40} className="mx-auto mb-3 text-[#ECECEC]" />
              <p className="font-semibold text-sm">No assigned jobs ready for action</p>
              <p className="text-xs mt-1">Assigned jobs will appear here once dispatch is confirmed.</p>
            </div>
          ) : (
            activeJobs.map((job) => <JobCard key={job.id || job.booking_id} job={job} />)
          )}
        </div>
      </div>

      <div id="completed-jobs" className="rounded-[28px] bg-white border border-[#ECECEC] shadow-sm p-7 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ECECEC] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F8EF] text-emerald-700 flex items-center justify-center">
              <MdCheckCircle size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#202020]">Completed Jobs</h2>
              <p className="text-xs text-[#7B7B7B]">Jobs finished and ready for reporting</p>
            </div>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7B7B7B]">
            {completedJobs.length} completed job{completedJobs.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-5">
          {completedJobs.length === 0 && !loading ? (
            <div className="text-center py-12 text-[#7B7B7B]">
              <MdCheckCircle size={40} className="mx-auto mb-3 text-[#ECECEC]" />
              <p className="font-semibold text-sm">No completed jobs yet</p>
              <p className="text-xs mt-1">Completed jobs will appear here for your review.</p>
            </div>
          ) : (
            completedJobs.map((job) => <JobCard key={job.id || job.booking_id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignedJobs;
