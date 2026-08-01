"use client";
import React, { useState, useEffect } from "react";
import { MdWarning, MdCheckCircle, MdArrowForward } from "react-icons/md";
import { fetchApi } from "@/app/utils/api";
import { useRouter } from "next/navigation";

function EmergencyCard() {
  const router = useRouter();
  const [emergencyList, setEmergencyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchEmergencyJobs = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/technician/emergency');
      if (res.data) {
        setEmergencyList(res.data);
      }
    } catch (err) {
      console.error("Failed to load emergency jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyJobs();
    const interval = setInterval(fetchEmergencyJobs, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (bookingId) => {
    try {
      setAcceptingId(bookingId);
      const res = await fetchApi(`/technician/emergency/${bookingId}/accept`, {
        method: 'PATCH'
      });
      if (res.success) {
        router.push(`/technician/job/${bookingId}`);
      }
    } catch (err) {
      alert(err.message || "Failed to accept emergency job.");
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading && emergencyList.length === 0) {
    return (
      <div className="bg-[#181818] border border-[#202020] text-white p-6 rounded-2xl shadow-xl">
        <p className="text-xs text-[#9A9A9A] font-semibold">Checking broadcast emergency dispatches...</p>
      </div>
    );
  }

  if (emergencyList.length === 0) {
    return (
      <div className="bg-[#181818] border border-[#202020] text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MdCheckCircle size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">No Active Emergency Broadcast</h3>
            <p className="text-[11px] text-[#9A9A9A]">Urgent priority jobs will broadcast here</p>
          </div>
        </div>
      </div>
    );
  }

  const activeJob = emergencyList[0];

  return (
    <div className="bg-[#181818] border border-orange-500/40 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F54C0F] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#F54C0F]/30 animate-pulse">
            <MdWarning size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">🚨 Emergency Broadcast</h3>
            <p className="text-[11px] text-orange-400">Immediate Response Required</p>
          </div>
        </div>
        <span className="bg-[#F54C0F] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">
          CRITICAL
        </span>
      </div>

      <div className="pt-2 border-t border-white/10 space-y-2">
        <h4 className="text-base font-bold text-white">
          {activeJob.service_problems?.problem_name || activeJob.issue_description || 'Emergency Repair'}
        </h4>
        <p className="text-xs text-[#9A9A9A]">
          📍 Location: {activeJob.area || activeJob.city || 'Local Area'}
        </p>
        <p className="text-xs text-orange-300">
          Reason: {activeJob.emergency_reason || 'Urgent repair required'}
        </p>

        <button
          onClick={() => handleAccept(activeJob.booking_id)}
          disabled={acceptingId === activeJob.booking_id}
          className="mt-3 w-full bg-[#F54C0F] hover:bg-[#DB4206] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{acceptingId === activeJob.booking_id ? "Accepting..." : "Accept Emergency Job Now"}</span>
          <MdArrowForward size={16} />
        </button>
      </div>
    </div>
  );
}

export default EmergencyCard;
