"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import useTechnicianStore from "../../technician/store/technicianStore";
import ProfileCard from "../ProfileCard";

function DashboardHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile]             = useState(false);
  const profileRef = useRef(null);

  const technician         = useTechnicianStore((state) => state.technician);
  const fetchNotifications = useTechnicianStore((state) => state.fetchNotifications);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    useTechnicianStore.setState({ token: null, technician: null, assignedJobs: [], notifications: [] });
    router.push("/authentication/login");
  };

  const name     = technician?.full_name || technician?.name || "Technician";
  const category = technician?.service_category || "Field Technician";

  // Build user object for ProfileCard (same shape as dispatcher)
  const profileUser = {
    name,
    role: "Technician",
    email:    technician?.email   || "—",
    phone:    technician?.phone   || "—",
    address:  technician?.address || "—",
    category,
    specialization: category,
    rating: technician?.rating ?? null,
  };

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
            Home
          </button>
          <button onClick={() => router.push("/technician#assigned-jobs")} className="hover:text-[#FF5500] transition">
            Jobs
          </button>
          <button onClick={() => router.push("/technician#completed-jobs")} className="hover:text-[#FF5500] transition">
            History
          </button>
          <button onClick={() => setShowProfile(!showProfile)} className="hover:text-[#FF5500] transition">
            Profile
          </button>
        </div>

        {/* Right — profile avatar only */}
        <div className="hidden md:flex items-center gap-3">

          {/* Profile Button — dispatcher style with ProfileCard */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); }}
              className="bg-[#FF5500] hover:bg-[#e04b00] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center transition"
            >
              {name[0]?.toUpperCase() || "T"}
            </button>

            {showProfile && (
              <ProfileCard
                floating
                user={profileUser}
                onLogout={handleLogout}
              />
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
            Home
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
