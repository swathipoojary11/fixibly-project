"use client";
import React from "react";
import useTechnicianStore from "../../technician/store/technicianStore";
import StatusBadge from "./StatusBadge";

function TechnicianProfile({ technician }) {
  const availability   = useTechnicianStore((state) => state.availability);
  const setAvailability = useTechnicianStore((state) => state.setAvailability);
  const name     = technician?.name || "Loading...";
  const role     = technician?.role || "Loading...";
  const initials = name !== "Loading..." ? name.split(" ").map((n) => n[0]).join("").substring(0,2).toUpperCase() : "";
  const options  = ["Available", "Busy", "Closed"];

  return (
    <div className="rounded-none bg-white border border-[#ECECEC] shadow-sm p-7 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-none bg-[#F54C0F] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#F54C0F]/20">{initials}</div>
        <h3 className="mt-4 text-xl font-bold text-[#202020]">{name}</h3>
        <p className="text-xs font-semibold text-[#7B7B7B] mt-1">{role}</p>
        <div className="mt-4"><StatusBadge status={availability} /></div>
      </div>
      <div className="mt-6 border-t border-[#ECECEC] pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7B7B7B]">Work mode</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {options.map((option) => (
            <button key={option} onClick={() => setAvailability(option)}
              className={`border px-3 py-2 text-xs font-bold transition-all ${availability === option ? "border-[#F54C0F] bg-[#FFF3EE] text-[#F54C0F]" : "border-[#ECECEC] bg-white text-[#7B7B7B] hover:border-[#F54C0F]/30"}`}>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 rounded-none bg-[#F7F7F7] border border-[#ECECEC] p-4 text-left">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7B7B7B]">Current assignment</p>
        <p className="mt-2 text-lg font-extrabold text-[#202020]">1 active job</p>
        <p className="mt-1 text-sm text-[#7B7B7B]">The technician can switch to Closed when they are unavailable.</p>
      </div>
    </div>
  );
}

export default TechnicianProfile;
