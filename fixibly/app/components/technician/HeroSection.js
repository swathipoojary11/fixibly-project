"use client";
import React, { useState } from "react";
import { Activity, Bell, Check } from "lucide-react";
import useTechnicianStore from "../../technician/store/technicianStore";

function HeroSection({ technician }) {
  const availability       = useTechnicianStore((state) => state.availability);
  const updateAvailability = useTechnicianStore((state) => state.updateAvailability);
  const stats              = useTechnicianStore((state) => state.stats) || {};
  const notifications      = useTechnicianStore((state) => state.notifications);
  const unreadCount        = useTechnicianStore((state) => state.unreadCount);
  const markRead           = useTechnicianStore((state) => state.markNotificationsRead);

  const [showNotifications, setShowNotifications] = useState(false);

  const name     = technician?.full_name || technician?.name || null;
  const category = technician?.service_category || "Field Technician";

  const availabilityOptions = ["available", "busy", "offline"];

  return (
    <section className="relative items-center bg-[#111827] text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1920&auto=format&fit=crop')" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left */}
        <div className="lg:w-1/2">

          {/* Badge + Notification Bell — same as customer hero */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold">
              TECHNICIAN DASHBOARD
            </span>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-full border border-gray-700 transition"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-12 left-0 w-80 sm:w-96 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 z-50 p-4 max-h-96 overflow-y-auto space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h4 className="font-bold text-sm text-gray-900">Notifications ({notifications.length})</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-orange-600 font-semibold">Close</button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${n.is_read ? "bg-gray-50 border-gray-200" : "bg-orange-50/70 border-orange-200"}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-gray-900">{n.title || n.message}</span>
                          {!n.is_read && (
                            <button
                              onClick={() => markRead(n.id)}
                              className="text-orange-600 hover:underline flex items-center gap-1 font-semibold text-[10px]"
                            >
                              <Check size={12} /> Mark Read
                            </button>
                          )}
                        </div>
                        {n.body && <p className="text-gray-600">{n.body}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            {name ? (
              <>Welcome back,<br /><span className="text-orange-500">{name.split(" ")[0]}</span></>
            ) : (
              <>Welcome back</>
            )}
          </h1>

          <p className="text-gray-300 text-base leading-7 mb-8">
            Manage daily field dispatch, track active job progress, and respond to urgent service requests — all from a single view.
          </p>

          <div className="flex flex-wrap gap-4">
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-6 py-3 rounded-xl font-semibold text-sm">
              {category}
            </span>
            <span className={`px-6 py-3 rounded-xl font-semibold text-sm border ${
              availability === "available"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : availability === "busy"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
            }`}>
              {availability ? availability.charAt(0).toUpperCase() + availability.slice(1) : "Offline"}
            </span>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Set work mode</p>
            <div className="flex flex-wrap gap-3">
              {availabilityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateAvailability(option)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition ${
                    availability === option
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-gray-600 text-gray-300 hover:border-orange-500 hover:text-white"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — stats card */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
            <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <Activity size={22} />
              Your Real-Time Job Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
                <span className="text-2xl font-extrabold text-white">{stats?.activeJobs ?? 0}</span>
                <p className="text-xs text-gray-400 font-medium mt-1">Active Jobs</p>
              </div>
              <div className="bg-green-950/40 p-4 rounded-2xl border border-green-800/50">
                <span className="text-2xl font-extrabold text-green-400">{stats?.completedToday ?? 0}</span>
                <p className="text-xs text-green-300 font-medium mt-1">Completed</p>
              </div>
              <div className="bg-red-950/40 p-4 rounded-2xl border border-red-800/50">
                <span className="text-2xl font-extrabold text-red-400">{stats?.emergencyRequests ?? 0}</span>
                <p className="text-xs text-red-300 font-medium mt-1">Emergency</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
