"use client";
import React, { useEffect } from "react";
import Footer from "../components/footer";
import DashboardHeader from "../components/technician/DashboardHeader";
import HeroSection from "../components/technician/HeroSection";
import AssignedJobs from "../components/technician/AssignedJobs";
import EmergencyCard from "../components/technician/EmergencyCard";
import TechnicianProfile from "../components/technician/TechnicianProfile";
import PerformanceCard from "../components/technician/PerformanceCard";
import Timeline from "../components/technician/Timeline";
import StatsCard from "../components/technician/StatsCard";
import useTechnicianStore from "./store/technicianStore";
import { MdAssignment, MdCheckCircle, MdStar, MdEmergency } from "react-icons/md";

export default function TechnicianDashboard() {
  const technician  = useTechnicianStore((state) => state.technician);
  const stats       = useTechnicianStore((state) => state.stats);
  const emergencyJob = useTechnicianStore((state) => state.emergencyJob);
  const timeline    = useTechnicianStore((state) => state.timeline);
  const availability = useTechnicianStore((state) => state.availability);
  const loading     = useTechnicianStore((state) => state.loading);
  const error       = useTechnicianStore((state) => state.error);
  const setToken    = useTechnicianStore((state) => state.setToken);
  const setTechnician = useTechnicianStore((state) => state.setTechnician);
  const fetchAll    = useTechnicianStore((state) => state.fetchAll);

  // On mount: read token from localStorage and fetch all dashboard data
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);
      fetchAll();
    }
  }, []);

  return (
    <div className="bg-[#F7F7F7] min-h-screen text-[#202020] font-sans flex flex-col">
      <DashboardHeader />

      <div className="flex-1">
        <HeroSection technician={technician} />

        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {error && (
            <div className="mb-5 -mt-5 relative z-30 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-3 text-sm font-medium flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
              <button onClick={fetchAll} className="ml-auto text-xs font-bold underline hover:no-underline">Retry</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 -mt-10 relative z-30">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatsCard
                    title="Assigned Jobs"
                    value={loading ? "…" : (stats?.activeJobs ?? 0)}
                    subtitle="Active Dispatch"
                    icon={<MdAssignment size={22} />}
                    color="orange"
                  />
                  <StatsCard
                    title="Completed"
                    value={loading ? "…" : (stats?.completedToday ?? 0)}
                    subtitle="Today's Finished"
                    icon={<MdCheckCircle size={22} />}
                    color="green"
                  />
                  <StatsCard
                    title="Work Mode"
                    value={loading ? "…" : (availability || "available")}
                    subtitle="Availability"
                    icon={<MdStar size={22} />}
                    color="blue"
                  />
                  <StatsCard
                    title="Emergency"
                    value={loading ? "…" : (stats?.emergencyRequests ?? 0)}
                    subtitle="Pending Request"
                    icon={<MdEmergency size={22} />}
                    color="red"
                  />
                </div>
              </div>

              {loading ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-pulse">
                  <div className="h-5 bg-gray-100 rounded w-1/3 mb-5" />
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
                    ))}
                  </div>
                </div>
              ) : (
                <AssignedJobs />
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <PerformanceCard />
                <Timeline timeline={timeline} />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <TechnicianProfile technician={technician} />
              <EmergencyCard emergencyJob={emergencyJob} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
