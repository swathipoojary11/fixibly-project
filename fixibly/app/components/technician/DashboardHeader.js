"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiSettings, FiUser } from "react-icons/fi";
import { MdEngineering } from "react-icons/md";
import ProfileCard from "../ProfileCard";
import useTechnicianStore from "../../technician/store/technicianStore";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/app/utils/api";

function DashboardHeader() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const technician = useTechnicianStore((state) => state.technician);
  const authUser = getAuthUser();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileUser = {
    name: technician?.name || technician?.full_name || authUser?.full_name || "Field Specialist",
    role: technician?.role || technician?.category || "Technician",
    id: technician?.technician_id ? `TECH-${technician.technician_id}` : (authUser?.user_id ? `USER-${authUser.user_id}` : "TECH-101"),
    email: technician?.email || authUser?.email || "technician@fieldflow.com",
    phone: technician?.phone || authUser?.phone || "N/A",
    address: authUser?.address || "Mangalore, Karnataka",
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/authentication/login");
    }
  };

  return (
    <header className="bg-white border-b border-[#ECECEC] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F54C0F] text-white flex items-center justify-center shadow-md shadow-[#F54C0F]/20">
            <MdEngineering size={26} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#202020]">FieldFlow</h2>
            <p className="text-xs font-semibold text-[#7B7B7B]">Technician Field Portal</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3" ref={profileRef}>
          <button onClick={() => router.push('/technician')} className="w-11 h-11 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center border border-[#F54C0F]/20 hover:bg-[#F54C0F] hover:text-white transition-all">
            <FiBell size={18} />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="w-11 h-11 rounded-xl bg-[#181818] text-white flex items-center justify-center border border-white/10 hover:bg-[#F54C0F] transition-all cursor-pointer"
              aria-label="Open profile"
            >
              <FiUser size={18} />
            </button>
            {isProfileOpen && (
              <ProfileCard
                user={profileUser}
                floating
                onEdit={() => {}}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
