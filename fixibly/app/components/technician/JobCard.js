"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, User, Check, X, ArrowRight, Wrench } from "lucide-react";
import StatusBadge from "./StatusBadge";
import useTechnicianStore from "../../technician/store/technicianStore";

function JobCard({ job }) {
  const router    = useRouter();
  const acceptJob = useTechnicianStore((state) => state.acceptJob);
  const rejectJob = useTechnicianStore((state) => state.rejectJob);

  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [actionError, setActionError] = useState("");

  const jobId    = job.id || job.booking_id;
  const title    = job.title || job.service_type || "Service Job";
  const customer = job.customer_name || job.customer || "—";
  const address  = job.service_address || job.address || "—";
  const status   = job.status || "pending";
  const time     = job.schedule_time
    ? new Date(job.schedule_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : job.time || "—";
  const category = job.category || "—";

  const showActions = ["pending", "assigned"].includes(status?.toLowerCase());

  const handleAccept = async (e) => {
    e.stopPropagation();
    setAccepting(true); setActionError("");
    try { await acceptJob(jobId); }
    catch (err) { setActionError(err.message || "Accept failed."); }
    finally { setAccepting(false); }
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    setRejecting(true); setActionError("");
    try { await rejectJob(jobId); }
    catch (err) { setActionError(err.message || "Reject failed."); }
    finally { setRejecting(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

        {/* Left */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Wrench size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>
              <StatusBadge status={status} />
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1"><User size={12} />{customer}</span>
              <span className="flex items-center gap-1"><MapPin size={12} />{address}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{time}</span>
            </div>
            {category !== "—" && (
              <span className="mt-2 inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {category}
              </span>
            )}
            {actionError && <p className="mt-2 text-xs text-red-600 font-semibold">{actionError}</p>}
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {showActions && (
            <>
              <button
                onClick={handleReject}
                disabled={rejecting || accepting}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-500 hover:text-white px-4 py-2 text-red-600 font-semibold text-sm transition-all disabled:opacity-50"
              >
                <X size={14} />{rejecting ? "Rejecting…" : "Reject"}
              </button>
              <button
                onClick={handleAccept}
                disabled={accepting || rejecting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                <Check size={14} />{accepting ? "Accepting…" : "Accept"}
              </button>
            </>
          )}
          <button
            onClick={() => router.push(`/technician/job/${jobId}`)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white font-semibold text-sm transition-all"
          >
            View <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
