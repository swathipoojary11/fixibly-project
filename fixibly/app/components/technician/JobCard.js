"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MdLocationOn, MdAccessTime, MdArrowForward, MdBuild } from "react-icons/md";
import StatusBadge from "./StatusBadge";

function JobCard({ job }) {
  const router = useRouter();
  const jobId = job.id || job.booking_id;
  const title = job.title || job.issue_description || "Field Service Repair";
  const customerName = job.customer || job.customer_name || job.users?.full_name || "Customer";
  const address = job.address || job.service_address || "Service Location";
  const time = job.time || (job.anytime_service ? "Anytime Service" : "Scheduled Slot");
  const status = job.status || job.booking_status || "Assigned";

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#ECECEC] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center shrink-0 shadow-sm">
            <MdBuild size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-extrabold text-[#202020]">{title}</h3>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs font-bold text-[#7B7B7B] mt-1.5">
              Customer: <span className="text-[#202020] font-extrabold">{customerName}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7B7B7B] bg-[#F7F7F7] px-3 py-1 rounded-xl border border-[#ECECEC]">
                <MdLocationOn className="text-[#F54C0F]" />{address}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7B7B7B] bg-[#F7F7F7] px-3 py-1 rounded-xl border border-[#ECECEC]">
                <MdAccessTime className="text-[#F54C0F]" />{time}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => router.push(`/technician/job/${jobId}`)}
            className="inline-flex items-center justify-center rounded-xl bg-[#F54C0F] hover:bg-[#DB4206] px-5 py-2.5 text-white font-extrabold text-xs shadow-md shadow-[#F54C0F]/20 transition-all group cursor-pointer"
          >
            <span>View Job Workflow</span>
            <MdArrowForward className="ml-1.5 text-base transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
