"use client";
import React from "react";
import { MdOutlineSpeed, MdStar } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";

function HeroSection({ technician }) {
  const availability = useTechnicianStore((state) => state.availability);
  const updateAvailability = useTechnicianStore((state) => state.updateAvailability);
  const stats = useTechnicianStore((state) => state.stats) || {};

  const name     = technician?.full_name || technician?.name || "Technician";
  const category = technician?.service_category || technician?.role || "Field Technician";
  const rating   = technician?.rating != null ? Number(technician.rating).toFixed(1) : null;
  const email = technician?.email || null;
  const phone = technician?.phone || null;

  const availabilityLabel = availability
    ? availability.charAt(0).toUpperCase() + availability.slice(1)
    : "Available";

  const availabilityOptions = ["available", "busy", "offline"];
  const handleAvailabilityChange = (status) => updateAvailability(status);

  return (
    <section className="relative overflow-hidden pt-8 pb-24 bg-slate-950">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5P5zsgIIjtvqkprbCOWSXKx4R6qvR0JealBaBl_nN1w&s=10')" }}
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="min-h-[420px] lg:min-h-[460px] text-white rounded-[28px] p-8 sm:p-10 lg:p-14 relative overflow-hidden border border-slate-800/60">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-orange-400">Welcome back</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {name && name !== "Technician" ? `Hello, ${name.split(" ")[0]}` : "Welcome back"}
                </h1>
                <p className="mt-4 max-w-xl text-slate-300 text-sm leading-relaxed">
                  Manage daily field dispatch, track active job progress, and respond to urgent service requests from a single view.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-[24px] bg-slate-900 border border-slate-800 p-5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Work mode</p>
                  <p className="mt-2 text-xl font-bold text-white">{availabilityLabel}</p>
                </div>
                <div className="rounded-[24px] bg-slate-900 border border-slate-800 p-5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Primary service</p>
                  <p className="mt-2 text-xl font-bold text-white">{category}</p>
                </div>
                <div className="rounded-[24px] bg-slate-900 border border-slate-800 p-5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Active jobs</p>
                  <p className="mt-2 text-xl font-bold text-white">{stats?.activeJobs ?? 0}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Work mode</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {availabilityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleAvailabilityChange(option)}
                        className={`rounded-full border px-3 py-2 text-xs font-bold transition-all uppercase ${
                          availability === option
                            ? "border-orange-400 bg-orange-500 text-white"
                            : "border-slate-700 bg-slate-950 text-slate-300 hover:border-orange-400"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                {(email || phone) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {email && (
                      <div className="rounded-[24px] bg-slate-900 border border-slate-800 p-5">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Email</p>
                        <p className="mt-2 text-sm text-slate-200 break-all">{email}</p>
                      </div>
                    )}
                    {phone && (
                      <div className="rounded-[24px] bg-slate-900 border border-slate-800 p-5">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Phone</p>
                        <p className="mt-2 text-sm text-slate-200">{phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
