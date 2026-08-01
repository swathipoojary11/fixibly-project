"use client";
import React from "react";
import { MdOutlineSpeed } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";
import { getAuthUser } from "@/app/utils/api";

function HeroSection({ technician }) {
  const availability = useTechnicianStore((state) => state.availability);
  const authUser = getAuthUser();

  const name = technician?.name || technician?.full_name || authUser?.full_name || "Field Specialist";
  const role = technician?.role || technician?.category || "Field Technician";
  const primaryService = technician?.category || "Home & Commercial Repair";
  const initials = name.split(" ").map((n) => n[0]).join("") || "TS";

  return (
    <section className="relative overflow-hidden pt-8 pb-24 bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[460px] lg:min-h-[520px] bg-[#181818] text-white rounded-3xl p-8 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#F54C0F]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#F54C0F]">Welcome back</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Technician Field Dashboard</h1>
                <p className="mt-4 max-w-xl text-[#9A9A9A] text-sm leading-relaxed">
                  Manage your assigned field bookings, track active job progress, and accept emergency service requests in real-time.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <a href="#assigned-jobs" className="inline-flex items-center justify-center rounded-xl bg-[#F54C0F] hover:bg-[#DB4206] px-7 py-3 text-white font-bold text-xs shadow-lg shadow-[#F54C0F]/25 transition-all">
                  View Assigned Jobs
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#1d1d1d] text-white p-7 shadow-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F54C0F] text-white flex items-center justify-center text-xl font-extrabold shadow-md shadow-[#F54C0F]/20 shrink-0">{initials}</div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F54C0F]">Verified Specialist</span>
                    <h3 className="text-lg font-extrabold text-white mt-0.5">{name}</h3>
                    <p className="text-[11px] text-[#b7b7b7] font-semibold mt-0.5">{role}</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#FFF3EE] border border-[#F54C0F]/20 p-4">
                    <p className="text-[10px] font-bold text-[#7B7B7B] uppercase tracking-wider">Work Mode</p>
                    <p className="mt-1.5 text-base font-extrabold text-[#F54C0F]">{availability || technician?.availability_status || "Available"}</p>
                  </div>
                  <div className="rounded-xl bg-[#252525] border border-white/10 p-4">
                    <p className="text-[10px] font-bold text-[#b7b7b7] uppercase tracking-wider">Service Skill</p>
                    <p className="mt-1.5 text-sm font-extrabold text-white truncate">{primaryService}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-xl bg-[#202020] p-4 text-white flex items-center justify-between border border-white/10">
                  <div>
                    <p className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider">Availability Status</p>
                    <p className="text-[11px] font-extrabold text-[#F54C0F] mt-0.5">{availability || technician?.availability_status || "Available"}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#F54C0F]"><MdOutlineSpeed size={20} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
