"use client";
import React from "react";
import useTechnicianStore from "../../technician/store/technicianStore";
import StatusBadge from "./StatusBadge";
import { MdMail, MdPhone, MdLocationOn, MdStar } from "react-icons/md";

function TechnicianProfile({ technician }) {
  const availability        = useTechnicianStore((state) => state.availability);
  const updateAvailability  = useTechnicianStore((state) => state.updateAvailability);
  const assignedJobs        = useTechnicianStore((state) => state.assignedJobs);

  const name     = technician?.full_name || technician?.name || "—";
  const email    = technician?.email || "—";
  const phone    = technician?.phone || "—";
  const address  = technician?.address || "—";
  const category = technician?.service_category || technician?.role || "—";
  const rating   = technician?.rating != null ? Number(technician.rating).toFixed(1) : "—";
  const profilePic = technician?.profile_picture || null;

  const initials = name !== "—"
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  const options  = ["available", "busy", "offline"];
  const activeJobs = assignedJobs.filter(
    (j) => j.status !== "completed" && j.status !== "cancelled"
  ).length;

  const handleAvailabilityChange = (option) => {
    updateAvailability(option);
  };

  return (
    <div className="rounded-[28px] bg-white border border-[#ECECEC] shadow-sm p-7 sm:p-8">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center text-center">
        {profilePic ? (
          <img
            src={profilePic}
            alt={name}
            className="w-24 h-24 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[#F54C0F] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#F54C0F]/20">
            {initials}
          </div>
        )}
        <h3 className="mt-4 text-xl font-bold text-[#202020]">{name}</h3>
        <p className="text-xs font-semibold text-[#7B7B7B] mt-1">{category}</p>
        <div className="mt-4">
          <StatusBadge status={availability} />
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-6 border-t border-[#ECECEC] pt-5 space-y-3">
        {email !== "—" && (
          <div className="flex items-center gap-3 text-sm">
            <MdMail className="text-[#F54C0F] shrink-0" size={16} />
            <span className="text-[#7B7B7B] truncate">{email}</span>
          </div>
        )}
        {phone !== "—" && (
          <div className="flex items-center gap-3 text-sm">
            <MdPhone className="text-[#F54C0F] shrink-0" size={16} />
            <span className="text-[#7B7B7B]">{phone}</span>
          </div>
        )}
        {address !== "—" && (
          <div className="flex items-center gap-3 text-sm">
            <MdLocationOn className="text-[#F54C0F] shrink-0" size={16} />
            <span className="text-[#7B7B7B]">{address}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <MdStar className="text-[#F54C0F] shrink-0" size={16} />
          <span className="text-[#7B7B7B]">Rating: <span className="font-bold text-[#202020]">{rating}</span></span>
        </div>
      </div>

      {/* Work Mode Selector */}
      <div className="mt-6 border-t border-[#ECECEC] pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7B7B7B]">Work mode</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAvailabilityChange(option)}
              className={`border px-3 py-2 text-xs font-bold transition-all capitalize ${
                availability === option
                  ? "border-[#F54C0F] bg-[#FFF3EE] text-[#F54C0F]"
                  : "border-[#ECECEC] bg-white text-[#7B7B7B] hover:border-[#F54C0F]/30"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Jobs Summary */}
      <div className="mt-5 rounded-[24px] bg-[#F7F7F7] border border-[#ECECEC] p-4 text-left">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7B7B7B]">Current assignment</p>
        <p className="mt-2 text-lg font-extrabold text-[#202020]">
          {activeJobs} active {activeJobs === 1 ? "job" : "jobs"}
        </p>
        <p className="mt-1 text-sm text-[#7B7B7B]">
          Switch to <span className="font-semibold">Offline</span> when you are unavailable.
        </p>
      </div>
    </div>
  );
}

export default TechnicianProfile;
