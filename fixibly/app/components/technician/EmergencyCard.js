"use client";
import React, { useState } from "react";
import { MdWarning, MdCheckCircle } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";

function EmergencyCard({ emergencyJob }) {
  const acceptEmergencyJob = useTechnicianStore((state) => state.acceptEmergencyJob);
  const [phase, setPhase]   = useState("idle"); // idle | loading | accepted | error
  const [errMsg, setErrMsg] = useState("");

  // ── No active emergency ────────────────────────────────────────────────────
  if (!emergencyJob) {
    return (
      <div className="rounded-[28px] bg-white border border-slate-200 text-slate-900 p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[18px] bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm shrink-0">
            <MdCheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Active Emergency</h3>
            <p className="text-xs text-slate-500">All clear — no urgent dispatch at this time</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-sm text-[#9A9A9A]">
            Emergency jobs will appear here when dispatched to you.
          </p>
        </div>
      </div>
    );
  }

  // ── Active emergency ───────────────────────────────────────────────────────
  const jobId = emergencyJob.id || emergencyJob.booking_id;

  const handleAccept = async () => {
    setPhase("loading");
    setErrMsg("");
    try {
      await acceptEmergencyJob(jobId);
      setPhase("accepted");
    } catch (err) {
      setErrMsg(err.message || "Failed to accept emergency.");
      setPhase("error");
    }
  };

  const renderButton = () => {
    if (phase === "idle") return (
      <button
        onClick={handleAccept}
        className="mt-6 w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 font-bold text-sm shadow-lg shadow-orange-500/20 transition-all"
      >
        Accept Emergency Request
      </button>
    );
    if (phase === "loading") return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-700 flex items-center gap-2">
        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin shrink-0" />
        Accepting emergency request...
      </div>
    );
    if (phase === "accepted") return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-100 p-3 text-sm font-semibold text-emerald-800">
        ✓ Emergency accepted — it will appear in your assigned jobs list shortly.
      </div>
    );
    if (phase === "error") return (
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-red-200 bg-red-100 p-3 text-sm font-semibold text-red-700">
          {errMsg}
        </div>
        <button
          onClick={() => setPhase("idle")}
          className="w-full rounded-full border border-slate-200 text-slate-900 py-2.5 text-sm font-bold hover:bg-slate-100 transition-all"
        >
          Try Again
        </button>
      </div>
    );
    return null;
  };

  return (
    <div className="rounded-[28px] bg-white border border-slate-200 text-slate-900 p-7 shadow-sm relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[18px] bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <MdWarning size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Emergency Dispatch</h3>
            <p className="text-xs text-slate-500">Urgent priority request</p>
          </div>
        </div>
        <span className="rounded-full bg-orange-50 text-orange-700 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider border border-orange-200">
          {phase === "accepted" ? "ACCEPTED" : emergencyJob.severity?.toUpperCase() || "CRITICAL"}
        </span>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-200 relative z-10">
        <h4 className="text-xl font-bold text-slate-900">
          {emergencyJob.title || emergencyJob.service_type || "Emergency Service"}
        </h4>
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          📍 {emergencyJob.service_address || emergencyJob.address || "Address not available"}
        </p>
        {emergencyJob.customer_name && (
          <p className="mt-1 text-xs text-slate-500">
            👤 {emergencyJob.customer_name}
          </p>
        )}
        {renderButton()}
      </div>
    </div>
  );
}

export default EmergencyCard;
