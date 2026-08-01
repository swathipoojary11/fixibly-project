"use client";
import React from "react";
import useTechnicianStore from "../../technician/store/technicianStore";
import StatusBadge from "./StatusBadge";

function TechnicianProfile({ technician }) {
  const availability = useTechnicianStore((state) => state.availability);
  const setAvailability = useTechnicianStore((state) => state.setAvailability);
  const assignedJobs = useTechnicianStore((state) => state.assignedJobs);
  
  const name = technician?.name || technician?.full_name || "Field Specialist";
  const role = technician?.role || technician?.category || "Field Technician";
  const initials = name.split(" ").map((n) => n[0]).join("") || "TS";
  const options = ["Available", "Busy", "Closed"];
  const activeCount = (assignedJobs || []).filter(j => j.status !== 'Completed' && j.booking_status !== 'Completed').length;

  return (
    <div className="rounded-2xl bg-white border border-[#ECECEC] shadow-sm p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#F54C0F] text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-[#F54C0F]/20">
          {initials}
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-[#202020]">{name}</h3>
        <p className="text-xs font-bold text-orange-600 mt-0.5">{role}</p>
        <div className="mt-3"><StatusBadge status={availability} /></div>
      </div>

      <div className="mt-6 border-t border-[#ECECEC] pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7B7B7B]">Availability Work Mode</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setAvailability(option)}
              className={`border px-2.5 py-2 text-xs font-extrabold rounded-xl transition-all ${
                availability === option
                  ? "border-[#F54C0F] bg-[#FFF3EE] text-[#F54C0F] shadow-sm"
                  : "border-[#ECECEC] bg-white text-[#7B7B7B] hover:border-[#F54C0F]/40"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-[#F7F7F7] border border-[#ECECEC] p-4 text-left">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#7B7B7B]">Current Field Queue</p>
        <p className="mt-1 text-base font-extrabold text-[#202020]">{activeCount} active job{activeCount === 1 ? '' : 's'}</p>
        <p className="mt-0.5 text-xs text-[#7B7B7B]">Switch to Closed when off-duty to pause automatic dispatching.</p>
      </div>
    </div>
  );
}

export default TechnicianProfile;
