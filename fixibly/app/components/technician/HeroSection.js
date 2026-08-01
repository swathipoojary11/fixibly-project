"use client";
import React from "react";
import { MdOutlineSpeed } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";

function HeroSection({ technician }) {
  const availability = useTechnicianStore((state) => state.availability);
  const initials = technician?.name?.split(" ").map((n) => n[0]).join("") || "FG";

  return (
    <section className="relative overflow-hidden pt-8 pb-24 bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[460px] lg:min-h-[520px] bg-[#181818] text-white rounded-none p-8 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#F54C0F]/15 rounded-none blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#F54C0F]">Welcome back</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Technician Dashboard</h1>
                <p className="mt-4 max-w-xl text-[#9A9A9A] text-sm leading-relaxed">
                  Manage daily field dispatch, track active job progress, and respond to urgent service requests from a single view.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <a href="#assigned-jobs" className="inline-flex items-center justify-center rounded-none bg-[#F54C0F] hover:bg-[#DB4206] px-7 py-3 text-white font-bold text-xs shadow-lg shadow-[#F54C0F]/25 transition-all">
                  View Assigned Jobs
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-none bg-[#1d1d1d] text-white p-7 shadow-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-none bg-[#F54C0F] text-white flex items-center justify-center text-xl font-bold shadow-md shadow-[#F54C0F]/20 shrink-0">{initials}</div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F54C0F]">Certified Specialist</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{technician?.name || "Alex Carter"}</h3>
                    <p className="text-[10px] text-[#b7b7b7] font-semibold mt-0.5">{technician?.role || "Field Technician"}</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-none bg-[#FFF3EE] border border-[#F54C0F]/20 p-4">
                    <p className="text-[10px] font-bold text-[#7B7B7B] uppercase tracking-wider">Work Mode</p>
                    <p className="mt-1.5 text-base font-extrabold text-[#F54C0F]">{availability || technician?.status || "Available"}</p>
                  </div>
                  <div className="rounded-none bg-[#252525] border border-white/10 p-4">
                    <p className="text-[10px] font-bold text-[#b7b7b7] uppercase tracking-wider">Primary Service</p>
                    <p className="mt-1.5 text-base font-extrabold text-white">AC & HVAC</p>
                  </div>
                </div>
                <div className="mt-5 rounded-none bg-[#202020] p-4 text-white flex items-center justify-between border border-white/10">
                  <div>
                    <p className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider">Work Status</p>
                    <p className="text-[11px] font-extrabold text-[#F54C0F] mt-0.5">{availability || technician?.status || "Available"}</p>
                  </div>
                  <div className="w-9 h-9 rounded-none bg-white/10 flex items-center justify-center text-[#F54C0F]"><MdOutlineSpeed size={20} /></div>
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
