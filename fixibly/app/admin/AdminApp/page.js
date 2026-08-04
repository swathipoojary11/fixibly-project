"use client";

import React, { useState, useEffect } from "react";
import {
  FiGrid, FiCalendar, FiUsers,
  FiBell, FiMenu, FiX,
} from "react-icons/fi";
import Dashboard from "../AdminDashboard/page";
import BookingMonitoring from "../BookMonitering/page";
import TechnicianPerformance from "../TechnicianPerformance/page";
import NotificationCenter from "../NotificationCenter/page";
import UserManagement from "../UserManagement/page";
import { useAdminStore as useAppStore } from "../AdminStore";
import ProfileCard from "../../components/ProfileCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const navItems = [
  { key: "dashboard",     label: "Dashboard",     icon: FiGrid },
  { key: "bookings",      label: "Bookings",      icon: FiCalendar },
  { key: "technicians",   label: "Technicians",   icon: FiUsers },
  { key: "notifications", label: "Notifications", icon: FiBell },
  { key: "users",         label: "User Mgmt",     icon: FiUsers },
];

const AdminApp = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);

  const { adminNotifs } = useAppStore();
  const unreadCount = adminNotifs.filter(n => !n.read).length;
  const goBack = () => setActivePage("dashboard");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setAdminProfile({
          name: u.full_name || u.name || "Admin",
          role: "Admin",
          id: u.user_id ? `ADM-${u.user_id}` : "ADM",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
        });
      } catch (_) {}
    }
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":     return <Dashboard onBack={goBack} onNavigate={setActivePage} />;
      case "bookings":      return <BookingMonitoring onBack={goBack} />;
      case "technicians":   return <TechnicianPerformance onBack={goBack} />;
      case "notifications": return <NotificationCenter onBack={goBack} />;
      case "users":         return <UserManagement onBack={goBack} />;
      default:              return <Dashboard onBack={goBack} onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="bg-[#0b1329] text-white shrink-0 shadow-lg z-40">
        <div className="px-4 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => setActivePage("dashboard")}>
            <span className="text-xl lg:text-2xl font-extrabold tracking-wide text-white">
              Field<span className="text-orange-500">Flow</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map(({ key, label }) => {
              const active = activePage === key;
              return (
                <button key={key} onClick={() => setActivePage(key)}
                  className={`text-sm font-medium transition-colors duration-150 relative py-1 ${
                    active ? "text-orange-500 font-semibold" : "text-gray-300 hover:text-white"
                  }`}>
                  {label}
                  {key === "notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button onClick={() => setActivePage("notifications")}
              className="relative p-2 rounded-full hover:bg-white/10 text-gray-300 lg:hidden">
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />}
            </button>

            <div className="relative">
              <button onClick={() => setShowProfile(p => !p)}
                className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md hover:scale-105 transition">
                A
              </button>
              {showProfile && adminProfile && (
                <ProfileCard
                  floating
                  user={adminProfile}
                  onLogout={() => { window.location.href = "/authentication/login"; }}
                />
              )}
            </div>

            <button onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-gray-300 focus:outline-none">
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-2 bg-[#0b1329]">
            {navItems.map(({ key, label, icon: Icon }) => {
              const active = activePage === key;
              return (
                <button key={key} onClick={() => { setActivePage(key); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    active ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-white/10"
                  }`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                  {key === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
