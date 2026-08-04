"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, User, Menu, X } from "lucide-react";
import useTechnicianStore from "../../technician/store/technicianStore";

function DashboardHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen]       = useState(false);
  const [isProfileOpen, setIsProfileOpen]   = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const technician         = useTechnicianStore((state) => state.technician);
  const notifications      = useTechnicianStore((state) => state.notifications);
  const unreadCount        = useTechnicianStore((state) => state.unreadCount);
  const markRead           = useTechnicianStore((state) => state.markNotificationsRead);
  const fetchNotifications = useTechnicianStore((state) => state.fetchNotifications);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const role = technician?.service_category || "Field Technician";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0F172A] border-b border-gray-800 text-white">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Brand */}
        <div
          onClick={() => router.push("/technician")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="text-xl font-extrabold tracking-tight text-white">
            Field<span className="text-[#FF5500]">Flow</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-200">
          <button onClick={() => router.push("/technician")} className="hover:text-[#FF5500] transition">
            Dashboard
          </button>
          <button onClick={() => router.push("/technician#assigned-jobs")} className="hover:text-[#FF5500] transition">
            Jobs
          </button>
          <button onClick={() => router.push("/technician#completed-jobs")} className="hover:text-[#FF5500] transition">
            History
          </button>
        </div>

        {/* Right — notifications + profile */}
        <div className="hidden md:flex items-center gap-3">

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setIsNotifOpen((p) => !p); setIsProfileOpen(false); }}
              className="relative bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-full border border-gray-700 transition"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 z-50 p-4 max-h-96 overflow-y-auto space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900">Notifications ({notifications.length})</h4>
                  {unreadCount > 0 && (
                    <button onClick={() => markRead(null)} className="text-xs text-orange-600 font-semibold hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No notifications.</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`p-3 rounded-xl border text-xs space-y-1 cursor-pointer ${n.is_read ? "bg-gray-50 border-gray-200" : "bg-orange-50/70 border-orange-200"}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-900">{n.title || n.message}</span>
                        {!n.is_read && (
                          <span className="text-orange-600 flex items-center gap-1 font-semibold text-[10px]">
                            <Check size={12} /> Unread
                          </span>
                        )}
                      </div>
                      {n.body && <p className="text-gray-600">{n.body}</p>}
                      <p className="text-gray-400 text-[10px]">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile Button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setIsProfileOpen((p) => !p); setIsNotifOpen(false); }}
              className="bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition"
            >
              <User size={16} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-1"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-t border-gray-800 px-4 py-4 space-y-3 text-xs font-semibold">
          <button
            onClick={() => { router.push("/technician"); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]"
          >
            Dashboard
          </button>
          <button
            onClick={() => { router.push("/technician#assigned-jobs"); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]"
          >
            Jobs
          </button>
          <button
            onClick={() => { router.push("/technician#completed-jobs"); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]"
          >
            History
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-[#FF5500] text-white text-center py-2.5 rounded font-bold"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;
