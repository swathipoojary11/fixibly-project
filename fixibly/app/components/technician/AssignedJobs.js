"use client";
import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import { fetchApi } from "@/app/utils/api";
import useTechnicianStore from "../../technician/store/technicianStore";
import { MdAssignment, MdRefresh } from "react-icons/md";

function AssignedJobs() {
  const storeJobs = useTechnicianStore((state) => state.assignedJobs);
  const [jobs, setJobs] = useState(storeJobs || []);
  const [loading, setLoading] = useState(false);

  const fetchAssignedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/technician/jobs');
      const rawList = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      const formatted = rawList.map(j => ({
        id: j.booking_id || j.id,
        booking_id: j.booking_id || j.id,
        title: j.service_problems?.problem_name || j.issue_description || j.title || "Field Repair Service",
        category: j.service_categories?.category_name || j.category || "General",
        customer: j.users?.full_name || j.customer || "Customer",
        phone: j.users?.phone || j.customer_phone || "N/A",
        address: `${j.street || ''} ${j.area || ''}, ${j.city || 'Mangalore'}`.trim() || j.service_address || "Location",
        time: j.anytime_service ? "Anytime" : (j.preferred_time || j.time || "Standard Slot"),
        status: j.booking_status || j.status || "Assigned",
        priority: j.priority || "Normal"
      }));
      setJobs(formatted);
    } catch (err) {
      console.error("Failed to load technician jobs:", err);
      if (storeJobs && storeJobs.length > 0) {
        setJobs(storeJobs);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedJobs();
  }, []);

  useEffect(() => {
    if (storeJobs && storeJobs.length > 0 && jobs.length === 0) {
      setJobs(storeJobs);
    }
  }, [storeJobs]);

  return (
    <div id="assigned-jobs" className="bg-white border border-[#ECECEC] shadow-sm p-6 sm:p-8 rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
            <MdAssignment size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#202020]">Assigned Field Jobs</h2>
            <p className="text-xs text-[#7B7B7B]">Active bookings assigned to you by Dispatch</p>
          </div>
        </div>
        <button onClick={fetchAssignedJobs} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#F54C0F] cursor-pointer">
          <MdRefresh size={18} />
        </button>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="text-center py-8 text-xs font-semibold text-slate-500">Loading assigned jobs from database...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-xs font-semibold text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          No jobs currently assigned to you. When a Dispatcher assigns a service request, it will appear here in real-time.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => <JobCard key={job.id || job.booking_id} job={job} />)}
        </div>
      )}
    </div>
  );
}

export default AssignedJobs;
