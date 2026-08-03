"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdLocationOn, MdAccessTime, MdArrowForward, MdBuild,
  MdCheck, MdClose,
} from "react-icons/md";
import StatusBadge from "./StatusBadge";
import useTechnicianStore from "../../technician/store/technicianStore";

function JobCard({ job }) {
  const router      = useRouter();
  const acceptJob   = useTechnicianStore((state) => state.acceptJob);
  const rejectJob   = useTechnicianStore((state) => state.rejectJob);

  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [actionError, setActionError] = useState("");

  const jobId      = job.id || job.booking_id;
  const title      = job.title || job.service_type || "Service Job";
  const customer   = job.customer_name || job.customer || "—";
  const address    = job.service_address || job.address || job.customer_address || "—";
  const status     = job.status || "pending";
  const time       = job.schedule_time
    ? new Date(job.schedule_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : (job.time || "—");

  const normalizedStatus = status?.toLowerCase();
  const showAcceptanceActions = ["pending", "assigned"].includes(normalizedStatus);

  const handleAccept = async (e) => {
    e.stopPropagation();
    setAccepting(true);
    setActionError("");
    try {
      await acceptJob(jobId);
    } catch (err) {
      setActionError(err.message || "Accept failed.");
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    setRejecting(true);
    setActionError("");
    try {
      await rejectJob(jobId);
    } catch (err) {
      setActionError(err.message || "Reject failed.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-7 border border-[#ECECEC] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center shrink-0 shadow-sm">
            <MdBuild size={28} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-[#202020]">{title}</h3>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm font-semibold text-[#7B7B7B] mt-2">
              Customer: <span className="text-[#202020] font-bold">{customer}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B7B7B] bg-[#F7F7F7] px-3 py-1.5 rounded-full border border-[#ECECEC]">
                <MdLocationOn className="text-[#F54C0F]" />{address}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B7B7B] bg-[#F7F7F7] px-3 py-1.5 rounded-full border border-[#ECECEC]">
                <MdAccessTime className="text-[#F54C0F]" />{time}
              </span>
            </div>
            {actionError && (
              <p className="mt-2 text-xs text-red-600 font-semibold">{actionError}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {/* Accept/Reject buttons only when the technician can respond to an assignment */}
          {showAcceptanceActions && (
            <>
              <button
                onClick={handleReject}
                disabled={rejecting || accepting}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-500 hover:text-white px-5 py-2.5 text-red-600 font-bold text-sm transition-all disabled:opacity-50"
              >
                <MdClose size={16} />
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
              <button
                onClick={handleAccept}
                disabled={accepting || rejecting}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-md"
              >
                <MdCheck size={16} />
                {accepting ? "Accepting…" : "Accept"}
              </button>
            </>
          )}

          {/* View Details button for all jobs */}
          <button
            onClick={() => router.push(`/technician/job/${jobId}`)}
            className="inline-flex items-center justify-center rounded-full bg-[#F54C0F] hover:bg-[#DB4206] px-6 py-3 text-white font-bold text-sm shadow-md shadow-[#F54C0F]/20 transition-all group"
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
