"use client";
import React from "react";
import DashboardHeader from "../../components/technician/DashboardHeader";
import ProfileCard from "../../components/ProfileCard";
import useTechnicianStore from "../store/technicianStore";

export default function TechnicianProfilePage() {
  const technician = useTechnicianStore((state) => state.technician);

  const name     = technician?.full_name || technician?.name || "Technician";
  const category = technician?.service_category || "Field Technician";

  const profileUser = {
    name,
    role: "Technician",
    email:          technician?.email    || "—",
    phone:          technician?.phone    || "—",
    address:        technician?.address  || "—",
    specialization: category,
    rating:         technician?.rating   ?? null,
    user_id:        technician?.user_id  || technician?.id || null,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    useTechnicianStore.setState({ token: null, technician: null, assignedJobs: [], notifications: [] });
    window.location.href = "/authentication/login";
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans">
      <DashboardHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-24 pb-12 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My <span className="text-[#FF5500]">Profile</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            View and manage your FieldFlow technician account details.
          </p>
        </div>
        <ProfileCard user={profileUser} onLogout={handleLogout} className="shadow-2xl" />
      </main>
    </div>
  );
}
