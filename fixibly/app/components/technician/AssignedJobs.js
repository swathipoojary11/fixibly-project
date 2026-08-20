"use client";
import React from "react";
import JobCard from "./JobCard";
import useTechnicianStore from "../../technician/store/technicianStore";
import { Briefcase, CheckCircle, RefreshCw } from "lucide-react";

function AssignedJobs() {
  const jobs    = useTechnicianStore((state) => state.assignedJobs) || [];
  const loading = useTechnicianStore((state) => state.loading);
  const fetchAll = useTechnicianStore((state) => state.fetchAll);

  const activeJobs    = jobs.filter((j) => !["completed", "cancelled"].includes((j.status || "").toLowerCase()));
  const completedJobs = jobs.filter((j) => (j.status || "").toLowerCase() === "completed");

  return (
    <div id="assigned-jobs" className="space-y-6">

      {/* Active Jobs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Assigned Jobs</h2>
              <p className="text-xs text-gray-500">Active field dispatch assigned to you</p>
            </div>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          {activeJobs.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-400">
              <Briefcase size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm text-gray-500">No active jobs right now</p>
              <p className="text-xs mt-1">Assigned jobs will appear here once dispatch is confirmed.</p>
            </div>
          ) : (
            activeJobs.map((job) => <JobCard key={job.id || job.booking_id} job={job} />)
          )}
        </div>
      </div>

      {/* Completed Jobs */}
      <div id="completed-jobs" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Completed Jobs</h2>
              <p className="text-xs text-gray-500">Jobs finished and ready for reporting</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {completedJobs.length} completed
          </span>
        </div>

        <div className="space-y-3">
          {completedJobs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <CheckCircle size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm text-gray-500">No completed jobs yet</p>
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
