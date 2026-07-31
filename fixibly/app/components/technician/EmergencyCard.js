"use client";
import React, { useState } from "react";
import { MdWarning, MdCheckCircle } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";

function EmergencyCard({ emergencyJob }) {
  const setAvailability = useTechnicianStore((state) => state.setAvailability);
  const [phase, setPhase] = useState("idle");

  // ── No active emergency ────────────────────────────────────────────────────
  if (!emergencyJob) {
    return (
      <div className="rounded-none bg-[#181818] border border-[#202020] text-white p-7 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-none bg-emerald-600 text-white flex items-center justify-center shadow-lg shrink-0">
            <MdCheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Active Emergency</h3>
            <p className="text-xs text-[#9A9A9A]">All clear — no urgent dispatch at this time</p>
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
  const handleAccept = () => { setAvailability("busy"); setPhase("pending"); };

  const renderButton = () => {
    if (phase === "idle") return (
      <button
        onClick={handleAccept}
        className="mt-6 w-full rounded-none bg-[#F54C0F] hover:bg-[#DB4206] text-white py-3.5 font-bold text-sm shadow-lg shadow-[#F54C0F]/25 transition-all"
      >
        Accept Emergency Request
      </button>
    );
    if (phase === "pending") return (
      <div className="mt-6 rounded-none border border-white/10 bg-white/10 p-3 text-sm text-[#f2f2f2]">
        Emergency request sent to the dispatcher. Once assigned, it will appear in your assigned jobs list.
      </div>
    );
    return (
      <div className="mt-6 rounded-none border border-[#F54C0F]/30 bg-[#FFF3EE] p-3 text-sm font-semibold text-[#F54C0F]">
        Dispatch in progress — technician is now on the way.
      </div>
    );
  };

  return (
    <div className="rounded-none bg-[#181818] border border-[#202020] text-white p-7 shadow-xl relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#F54C0F]/20 rounded-none blur-2xl pointer-events-none"></div>
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-none bg-[#F54C0F] text-white flex items-center justify-center shadow-lg shadow-[#F54C0F]/30 shrink-0">
            <MdWarning size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Emergency Dispatch</h3>
            <p className="text-xs text-[#9A9A9A]">Urgent priority request</p>
          </div>
        </div>
        <span className="rounded-none bg-[#F54C0F] text-white px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider">
          {phase === "pending" ? "PENDING" : emergencyJob.severity?.toUpperCase() || "CRITICAL"}
        </span>
      </div>
      <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
        <h4 className="text-xl font-bold text-white">{emergencyJob.title}</h4>
        <p className="mt-1.5 text-xs text-[#9A9A9A] font-medium">📍 {emergencyJob.service_address}</p>
        {renderButton()}
      </div>
    </div>
  );
}

export default EmergencyCard;
