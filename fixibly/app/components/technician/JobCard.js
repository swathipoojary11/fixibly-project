"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MdLocationOn, MdAccessTime, MdArrowForward, MdBuild } from "react-icons/md";
import StatusBadge from "./StatusBadge";

function JobCard({ job }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-none p-7 border border-[#ECECEC] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-none bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center shrink-0 shadow-sm">
            <MdBuild size={28} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-[#202020]">{job.title}</h3>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-sm font-semibold text-[#7B7B7B] mt-2">
              Customer: <span className="text-[#202020] font-bold">{job.customer}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B7B7B] bg-[#F7F7F7] px-3 py-1.5 rounded-none border border-[#ECECEC]">
                <MdLocationOn className="text-[#F54C0F]" />{job.address}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B7B7B] bg-[#F7F7F7] px-3 py-1.5 rounded-none border border-[#ECECEC]">
                <MdAccessTime className="text-[#F54C0F]" />{job.time}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => router.push(`/technician/job/${job.id}`)}
            className="inline-flex items-center justify-center rounded-none bg-[#F54C0F] hover:bg-[#DB4206] px-6 py-3 text-white font-bold text-sm shadow-md shadow-[#F54C0F]/20 transition-all group"
          >
            <span>View Details</span>
            <MdArrowForward className="ml-2 text-base transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
