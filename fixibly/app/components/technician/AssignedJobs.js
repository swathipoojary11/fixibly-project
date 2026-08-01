"use client";
import React from "react";
import JobCard from "./JobCard";
import useTechnicianStore from "../../technician/store/technicianStore";
import { MdAssignment } from "react-icons/md";

function AssignedJobs() {
  const jobs = useTechnicianStore((state) => state.assignedJobs) || [];

  return (
    <div id="assigned-jobs" className="rounded-none bg-white border border-[#ECECEC] shadow-sm p-7 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ECECEC] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
            <MdAssignment size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#202020]">Assigned Jobs</h2>
            <p className="text-xs text-[#7B7B7B]">Today's active field dispatch</p>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
}

export default AssignedJobs;
