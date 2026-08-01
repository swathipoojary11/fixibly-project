"use client";
import React, { useState } from "react";
import {
  FiGrid, FiCalendar, FiUsers, FiBarChart2, FiFileText,
  FiActivity, FiBell, FiMenu, FiX, FiZap,
} from "react-icons/fi";
import Dashboard from "../AdminDashboard/page";
import BookingMonitoring from "../BookMonitering/page";
import TechnicianPerformance from "../TechnicianPerformance/page";
import RevenueOverview from "../RevenueOverview/page";
import Reports from "../Reports/page";
import ActivityLog from "../ActivityLog/page";
import NotificationCenter from "../NotificationCenter/page";
import UserManagement from "../UserManagement/page";
import { useAdminStore as useAppStore } from "../AdminStore";

const navItems = [
  { key: "dashboard",     label: "Dashboard",       icon: FiGrid },
  { key: "bookings",      label: "Bookings",        icon: FiCalendar },
  { key: "technicians",   label: "Technicians",     icon: FiUsers },
  { key: "revenue",       label: "Revenue",         icon: FiBarChart2 },
  { key: "reports",       label: "Reports",         icon: FiFileText },
  { key: "activity",      label: "Activity Log",    icon: FiActivity },
  { key: "notifications", label: "Notifications",   icon: FiBell },
  { key: "users",         label: "User Mgmt",       icon: FiUsers },
];

const AdminApp = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { adminNotifs } = useAppStore();
  const unreadCount = adminNotifs.filter(n => !n.read).length;

  const goBack = () => setActivePage("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":     return <Dashboard onBack={goBack} onNavigate={setActivePage} />;
      case "bookings":      return <BookingMonitoring onBack={goBack} />;
      case "technicians":   return <TechnicianPerformance onBack={goBack} />;
      case "revenue":       return <RevenueOverview onBack={goBack} />;
      case "reports":       return <Reports onBack={goBack} />;
      case "activity":      return <ActivityLog onBack={goBack} />;
      case "notifications": return <NotificationCenter onBack={goBack} />;
      case "users":         return <UserManagement onBack={goBack} />;
      default:              return <Dashboard onBack={goBack} onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <header className="bg-dark-900 text-white shrink-0 shadow-lg z-40">
        <div className="px-4 lg:px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FiZap className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight">FieldFlow</p>
              <p className="text-gray-400 text-xs">Admin</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ key, label, icon: Icon }) => {
              const active = activePage === key;
              return (
                <button key={key} onClick={() => setActivePage(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${active ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                  {key === "notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button onClick={() => setActivePage("notifications")} className="relative p-2 rounded-lg hover:bg-white/10 text-gray-300 lg:hidden">
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">A</div>
            <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-gray-300">
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-1">
            {navItems.map(({ key, label, icon: Icon }) => {
              const active = activePage === key;
              return (
                <button key={key} onClick={() => { setActivePage(key); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${active ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10"}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                  {key === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Page content — scroll on div so fixed modals escape to viewport ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
