"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiSettings, FiUser } from "react-icons/fi";
import { MdEngineering } from "react-icons/md";
import ProfileCard from "../ProfileCard";

function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileUser = {
    name: "Alex Carter", role: "Field Technician", id: "FT-1024",
    email: "alex.carter@fieldflow.com", phone: "+91 98765 43210", address: "Mangalore, Karnataka",
  };

  return (
    <header className="bg-white border-b border-[#ECECEC] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-none bg-[#F54C0F] text-white flex items-center justify-center shadow-md shadow-[#F54C0F]/20">
            <MdEngineering size={26} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#202020]">FieldFlow</h2>
            <p className="text-xs font-semibold text-[#7B7B7B]">Technician Portal</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3" ref={profileRef}>
          <button className="w-11 h-11 rounded-none bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center border border-[#F54C0F]/20 hover:bg-[#F54C0F] hover:text-white transition-all"><FiBell size={18} /></button>
          <button className="w-11 h-11 rounded-none bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center border border-[#F54C0F]/20 hover:bg-[#F54C0F] hover:text-white transition-all"><FiSettings size={18} /></button>
          <div className="relative">
            <button onClick={() => setIsProfileOpen((prev) => !prev)} className="w-11 h-11 rounded-none bg-[#181818] text-white flex items-center justify-center border border-white/10 hover:bg-[#F54C0F] transition-all" aria-label="Open profile">
              <FiUser size={18} />
            </button>
            {isProfileOpen && (
              <ProfileCard user={profileUser} floating onEdit={() => {}}
                onLogout={() => { setIsProfileOpen(false); if (window.confirm("Are you sure you want to logout?")) alert("Logged out successfully!"); }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
