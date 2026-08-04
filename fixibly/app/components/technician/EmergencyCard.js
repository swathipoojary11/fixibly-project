"use client";
import React, { useState } from "react";
import { AlertTriangle, CheckCircle, MapPin, User, Zap } from "lucide-react";
import useTechnicianStore from "../../technician/store/technicianStore";

function EmergencyCard({ emergencyJob }) {
  const acceptEmergencyJob = useTechnicianStore((state) => state.acceptEmergencyJob);
  const [phase, setPhase]   = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  if (!emergencyJob) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">No Active Emergency</h3>
            <p className="text-xs text-gray-500">All clear — no urgent dispatch at this time</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400 border-t border-gray-100 pt-4">
          Emergency jobs will appear here when dispatched to you.
        </p>
      </div>
    );
  }

  const jobId = emergencyJob.id || emergencyJob.booking_id;

  const handleAccept = async () => {
    setPhase("loading"); setErrMsg("");
    try {
      await acceptEmergencyJob(jobId);
      setPhase("accepted");
    } catch (err) {
      setErrMsg(err.message || "Failed to accept emergency.");
      setPhase("error");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Emergency Dispatch</h3>
            <p className="text-xs text-gray-500">Urgent priority request</p>
          </div>
        </div>
        <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
          {phase === "accepted" ? "Accepted" : "Critical"}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <h4 className="text-base font-bold text-gray-900">
          {emergencyJob.title || emergencyJob.service_type || "Emergency Service"}
        </h4>
        {emergencyJob.service_address && (
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <MapPin size={12} className="text-orange-500 shrink-0" />
            {emergencyJob.service_address}
          </p>
        )}
        {emergencyJob.customer_name && (
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <User size={12} className="text-orange-500 shrink-0" />
            {emergencyJob.customer_name}
          </p>
        )}
      </div>

      <div className="mt-4">
        {phase === "idle" && (
          <button
            onClick={handleAccept}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Zap size={15} /> Accept Emergency
          </button>
        )}
        {phase === "loading" && (
          <div className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            Accepting...
          </div>
        )}
        {phase === "accepted" && (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 py-2.5 rounded-xl text-sm font-semibold text-center">
            ✓ Accepted — check your assigned jobs
          </div>
        )}
        {phase === "error" && (
          <div className="space-y-2">
            <div className="bg-red-50 border border-red-200 text-red-700 py-2.5 px-3 rounded-xl text-sm font-semibold">
              {errMsg}
            </div>
            <button
              onClick={() => setPhase("idle")}
              className="w-full border border-gray-200 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmergencyCard;
