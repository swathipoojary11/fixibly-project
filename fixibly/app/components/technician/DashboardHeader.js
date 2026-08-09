"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import useTechnicianStore from "../../technician/store/technicianStore";

function DashboardHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const technician         = useTechnicianStore((state) => state.technician);
  const fetchNotifications = useTechnicianStore((state) => state.fetchNotifications);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const name        = technician?.full_name || technician?.name || "Technician";
  const userInitial = name.charAt(0).toUpperCase();

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
          <button onClick={() => router.push("/technician")} className="hover:text-[#FF5500] transition">Home</button>
          <button onClick={() => router.push("/technician#assigned-jobs")} className="hover:text-[#FF5500] transition">Jobs</button>
          <button onClick={() => router.push("/technician#completed-jobs")} className="hover:text-[#FF5500] transition">History</button>
          <button onClick={() => router.push("/technician/profile")} className="hover:text-[#FF5500] transition">Profile</button>
        </div>

        {/* Avatar — navigates to profile page, same as customer */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.push("/technician/profile")}
            title={`View profile for ${name}`}
            className="bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-bold w-9 h-9 rounded-full flex items-center justify-center transition shadow-md shadow-[#FF5500]/20"
          >
            {userInitial}
          </button>
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
          <button onClick={() => { router.push("/technician"); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]">Home</button>
          <button onClick={() => { router.push("/technician#assigned-jobs"); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]">Jobs</button>
          <button onClick={() => { router.push("/technician#completed-jobs"); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]">History</button>
          <button onClick={() => { router.push("/technician/profile"); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-200 hover:text-[#FF5500]">My Profile ({name})</button>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;
