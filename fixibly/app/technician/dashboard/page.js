"use client";
import React from "react";
import DashboardHeader  from "../../components/technician/DashboardHeader";
import HeroSection      from "../../components/technician/HeroSection";
import AssignedJobs     from "../../components/technician/AssignedJobs";
import TechnicianProfile from "../../components/technician/TechnicianProfile";
import EmergencyCard    from "../../components/technician/EmergencyCard";
import PerformanceCard  from "../../components/technician/PerformanceCard";
import Timeline         from "../../components/technician/Timeline";
import StatsCard        from "../../components/technician/StatsCard";
import useTechnicianStore from "../store/technicianStore";
import { MdAssignment, MdCheckCircle, MdStar, MdEmergency } from "react-icons/md";

export default function TechnicianDashboard() {
  const technician   = useTechnicianStore((state) => state.technician);
  const stats        = useTechnicianStore((state) => state.stats);
  const emergencyJob = useTechnicianStore((state) => state.emergencyJob);
  const timeline     = useTechnicianStore((state) => state.timeline);
  const availability = useTechnicianStore((state) => state.availability);

  return (
    <div className="bg-[#F7F7F7] min-h-screen text-[#202020] font-sans pb-20">
      <DashboardHeader />
      <HeroSection technician={technician} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 -mt-10 relative z-30">
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-none bg-white border border-[#ECECEC] shadow-sm p-7 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard title="Assigned Jobs" value={stats?.activeJobs || 1}                            subtitle="Active Dispatch"   icon={<MdAssignment size={28} />} />
                <StatsCard title="Completed"     value={stats?.completedToday || 5}                        subtitle="Today's Finished"  icon={<MdCheckCircle size={28} />} />
                <StatsCard title="Current Mode"  value={availability || technician?.status || "Available"} subtitle="Work Availability" icon={<MdStar size={28} />} />
                <StatsCard title="Emergency"     value={stats?.emergencyRequests || 1}                     subtitle="Pending Request"   icon={<MdEmergency size={28} />} />
              </div>
            </div>
            <AssignedJobs />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <PerformanceCard />
              <Timeline timeline={timeline} />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-8">
            <TechnicianProfile technician={technician} />
            <EmergencyCard emergencyJob={emergencyJob} />
          </div>
        </div>
      </div>
    </div>
  );
}
