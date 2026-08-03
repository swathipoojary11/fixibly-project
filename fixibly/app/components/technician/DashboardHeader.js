"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { MdEngineering } from "react-icons/md";
import { useRouter } from "next/navigation";
import useTechnicianStore from "../../technician/store/technicianStore";

function DashboardHeader() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen]     = useState(false);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  const technician      = useTechnicianStore((state) => state.technician);
  const notifications   = useTechnicianStore((state) => state.notifications);
  const unreadCount     = useTechnicianStore((state) => state.unreadCount);
  const markRead        = useTechnicianStore((state) => state.markNotificationsRead);
  const fetchNotifications = useTechnicianStore((state) => state.fetchNotifications);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Poll notifications every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      useTechnicianStore.setState({ token: null, technician: null, assignedJobs: [], notifications: [] });
      router.push("/authentication/login");
    }
  };

  const name = technician?.full_name || technician?.name || "Technician";
  const role = technician?.service_category || technician?.role || "Field Technician";

  const handleNotifOpen = () => {
    setIsNotifOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0F172A] border-b border-gray-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#FF5500] text-white flex items-center justify-center shadow-md shadow-[#FF5500]/20">
              <MdEngineering size={26} />
            </div>
            <div>
              <button onClick={() => router.push("/technician")} className="text-xl font-extrabold tracking-tight text-white">
                Field<span className="text-[#FF5500]">Flow</span>
              </button>
              <p className="text-xs font-semibold text-slate-300">Technician Portal</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wide text-slate-300">
            <button onClick={() => router.push("/technician")} className="hover:text-white transition">Dashboard</button>
            <button onClick={() => router.push("/technician#assigned-jobs")} className="hover:text-white transition">Jobs</button>
            <button onClick={() => router.push("/technician#completed-jobs")} className="hover:text-white transition">History</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotifOpen}
                className="w-11 h-11 rounded-full bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center border border-[#F54C0F]/20 hover:bg-[#F54C0F] hover:text-white transition-all relative"
                aria-label="Notifications"
              >
                <FiBell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-14 w-80 bg-white border border-[#ECECEC] shadow-xl z-50 rounded-[24px] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#ECECEC] flex items-center justify-between">
                    <h4 className="font-bold text-[#202020] text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markRead(null)}
                        className="text-xs text-[#F54C0F] font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#ECECEC]">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-[#7B7B7B] py-8">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className={`px-5 py-3 cursor-pointer hover:bg-[#FFF3EE] transition-colors ${!n.is_read ? "bg-[#FFF8F5]" : ""}`}
                        >
                          <p className={`text-xs font-semibold ${!n.is_read ? "text-[#202020]" : "text-[#7B7B7B]"}`}>
                            {n.title || n.message}
                          </p>
                          {n.body && <p className="text-[11px] text-[#9A9A9A] mt-0.5">{n.body}</p>}
                          <p className="text-[10px] text-[#9A9A9A] mt-1">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setIsProfileOpen((prev) => !prev); setIsNotifOpen(false); }}
                className="w-11 h-11 rounded-full bg-[#181818] text-white flex items-center justify-center border border-white/10 hover:bg-[#F54C0F] transition-all"
                aria-label="Open profile"
              >
                <FiUser size={18} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-14 w-64 bg-white border border-[#ECECEC] shadow-xl z-50 rounded-[24px] overflow-hidden">
                  <div className="px-5 py-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#7B7B7B]">Signed in as</p>
                    <p className="mt-2 text-sm font-bold text-[#202020]">{name}</p>
                    <p className="text-xs text-[#7B7B7B] mt-1">{role}</p>
                  </div>
                  <div className="border-t border-[#ECECEC]" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm font-semibold text-[#F54C0F] hover:bg-[#FFF3EE] transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default DashboardHeader;
