"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MdArrowBack, MdBuild, MdLocationOn, MdPhone, MdPerson, MdAccessTime,
  MdCheckCircle, MdGpsFixed, MdReportProblem, MdAssignmentTurnedIn,
  MdCategory, MdCheck, MdNavigation, MdShield, MdHandyman, MdHourglassTop, MdDoneAll,
} from "react-icons/md";
import { FiClock, FiAlertCircle } from "react-icons/fi";
import useTechnicianStore from "../../technician/store/technicianStore";

function JobDetails() {
  const { id } = useParams();
  const router = useRouter();

  const storeJobs  = useTechnicianStore((state) => state.assignedJobs) || [];
  const matchedJob = storeJobs.find((j) => String(j.id) === String(id));

  const job = {
    id: id || "101",
    jobCode: `#${id || "101"}`,
    title:            matchedJob?.title    || "HVAC Compressor & Filter Maintenance",
    category:         matchedJob?.category || "Cooling & Electrical Systems",
    priority:         matchedJob?.priority || "High Priority",
    customer:         matchedJob?.customer || "Rahul Sharma",
    phone:            matchedJob?.phone    || "+91 98765 43210",
    address:          matchedJob?.address  || "12 MG Road, Opp. City Center, Mangalore, KA 575001",
    scheduledTime:    matchedJob?.time     || "10:30 AM (Today)",
    problemDescription: matchedJob?.problem ||
      "AC compressor is making an unusual buzzing noise and failing to produce cold air following a power fluctuation. Technician must inspect the electrical terminals, capacitor, and refrigerant pressure levels.",
  };

  const [currentStep, setCurrentStep]   = useState(-1);
  const setAvailability = useTechnicianStore((state) => state.setAvailability);
  const [location, setLocation]         = useState(null);
  const [gpsLoading, setGpsLoading]     = useState(false);
  const [checklist, setChecklist]       = useState({
    issueVerified: false, safetyInspected: false, toolsPrepared: false,
    customerBriefed: false, qualityTested: false,
  });

  const checklistItems = [
    { id: "issueVerified",   title: "Verify Reported Issue & Symptom",       description: "Inspect AC unit, confirm unusual buzzing noise, and log initial fault indicators." },
    { id: "safetyInspected", title: "Safety & High-Voltage Circuit Check",    description: "Safely isolate circuit breaker, discharge run capacitor, and inspect wiring terminals." },
    { id: "toolsPrepared",   title: "Inspect Required Tools & Spare Parts",   description: "Verify digital multimeter, manifold gauges, and replacement capacitor availability." },
    { id: "customerBriefed", title: "Brief Customer on Diagnostic Findings",  description: "Explain root cause, proposed capacitor replacement, and estimated completion time." },
    { id: "qualityTested",   title: "Post-Repair Cooling & Load Test",        description: "Operate unit for 10 minutes, verify temperature drop, and measure operating current." },
  ];

  const completedCount     = Object.values(checklist).filter(Boolean).length;
  const totalCount         = checklistItems.length;
  const isChecklistComplete = completedCount === totalCount;

  const captureGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ latitude: "12.914142", longitude: "74.855956", accuracy: 10, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) });
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6), accuracy: Math.round(pos.coords.accuracy), timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }); setGpsLoading(false); },
      ()    => { setLocation({ latitude: "12.914142", longitude: "74.855956", accuracy: 12, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }); setGpsLoading(false); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleNextStep = (targetStep) => {
    if (targetStep === 1 || targetStep === 0) setAvailability("Busy");
    if (targetStep === 2) captureGPSLocation();
    if (targetStep === 4 && !isChecklistComplete) { alert("Please complete all inspection checklist items before completing the job."); return; }
    setCurrentStep(targetStep);
  };

  const toggleChecklistItem = (itemId) => setChecklist((prev) => ({ ...prev, [itemId]: !prev[itemId] }));

  const stepperSteps = [
    { title: "On the Way",   label: "En Route" },
    { title: "Arrived",      label: "At Location" },
    { title: "Start Work",   label: "Work Initiated" },
    { title: "Checklist",    label: "Inspection" },
    { title: "Complete Job", label: "Job Finished" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#202020] font-sans">
      {/* Top Nav */}
      <div className="bg-white border-b border-[#ECECEC] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button onClick={() => router.push("/technician")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF3EE] text-[#F54C0F] font-semibold text-sm hover:bg-[#F54C0F] hover:text-white transition-all duration-200 group">
            <MdArrowBack className="text-lg transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="px-5 py-2 rounded-full border-2 border-[#F54C0F] bg-[#FFF3EE] text-[#F54C0F] font-bold text-sm shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F54C0F] animate-pulse"></span>
              <span>Job ID: {job.jobCode}</span>
            </div>
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase ${currentStep === 4 ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : currentStep >= 2 ? "bg-[#FFF3EE] text-[#F54C0F] border border-[#F54C0F]/20" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
              <MdHourglassTop size={14} />
              {currentStep >= 0 ? stepperSteps[currentStep].title : "Pending Start"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero */}
        <div className="bg-[#181818] text-white rounded-3xl sm:rounded-[28px] p-7 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#F54C0F]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#F54C0F] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#F54C0F]/30"><MdBuild size={32} /></div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#F54C0F]/20 text-[#F54C0F] border border-[#F54C0F]/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{job.priority}</span>
                  <span className="bg-[#202020] text-[#9A9A9A] px-3.5 py-1 rounded-full text-xs font-semibold border border-white/10">{job.category}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">{job.title}</h1>
                <p className="text-[#9A9A9A] text-sm mt-1.5 flex items-center gap-2"><FiClock className="text-[#F54C0F]" />Scheduled: <span className="text-white font-medium">{job.scheduledTime}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-start lg:self-center border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0 w-full lg:w-auto justify-between lg:justify-end">
              <div className="text-left lg:text-right">
                <p className="text-xs text-[#9A9A9A] uppercase tracking-wider font-semibold">Workflow Status</p>
                <p className="text-lg font-bold text-[#F54C0F] mt-0.5">{currentStep >= 0 ? stepperSteps[currentStep].title : "Pending Start"}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#202020] border border-white/10 flex items-center justify-center text-[#F54C0F]"><MdHandyman size={24} /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Job Info */}
            <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-[#ECECEC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-6 border-b border-[#ECECEC] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center"><MdAssignmentTurnedIn size={22} /></div>
                  <div><h2 className="text-xl font-bold text-[#202020]">Job & Customer Information</h2><p className="text-xs text-[#7B7B7B]">Service record details and contact info</p></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#ECECEC]"><p className="text-xs font-semibold text-[#7B7B7B] uppercase tracking-wider mb-1 flex items-center gap-1.5"><MdPerson className="text-[#F54C0F] text-base" /> Customer Name</p><p className="text-base font-bold text-[#202020]">{job.customer}</p></div>
                <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#ECECEC]"><p className="text-xs font-semibold text-[#7B7B7B] uppercase tracking-wider mb-1 flex items-center gap-1.5"><MdPhone className="text-[#F54C0F] text-base" /> Contact Number</p><a href={`tel:${job.phone}`} className="text-base font-bold text-[#F54C0F] hover:underline inline-block">{job.phone}</a></div>
                <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#ECECEC]"><p className="text-xs font-semibold text-[#7B7B7B] uppercase tracking-wider mb-1 flex items-center gap-1.5"><MdCategory className="text-[#F54C0F] text-base" /> Service Type</p><p className="text-base font-bold text-[#202020]">{job.category}</p></div>
                <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#ECECEC]"><p className="text-xs font-semibold text-[#7B7B7B] uppercase tracking-wider mb-1 flex items-center gap-1.5"><MdAccessTime className="text-[#F54C0F] text-base" /> Scheduled Slot</p><p className="text-base font-bold text-[#202020]">{job.scheduledTime}</p></div>
              </div>
              <div className="mt-6 p-5 rounded-2xl bg-[#FFF3EE] border border-[#F54C0F]/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F54C0F] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#F54C0F]/20"><MdLocationOn size={26} /></div>
                  <div><span className="text-xs font-bold text-[#F54C0F] uppercase tracking-wider">Destination Address</span><p className="text-base font-bold text-[#202020] mt-0.5">{job.address}</p><p className="text-xs text-[#7B7B7B] mt-1 flex items-center gap-1"><MdNavigation className="text-[#F54C0F]" /> Customer site location verified</p></div>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-[#ECECEC] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center"><MdReportProblem size={22} /></div>
                <div><h2 className="text-xl font-bold text-[#202020]">Problem Description</h2><p className="text-xs text-[#7B7B7B]">Reported issue & diagnostic instructions</p></div>
              </div>
              <div className="p-5 rounded-2xl bg-[#F7F7F7] border border-[#ECECEC] text-[#202020] leading-relaxed text-sm sm:text-base font-medium">"{job.problemDescription}"</div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-[#ECECEC] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ECECEC] mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center"><MdShield size={22} /></div>
                  <div><h2 className="text-xl font-bold text-[#202020]">Field Inspection Checklist</h2><p className="text-xs text-[#7B7B7B]">Mandatory safety and service quality checks</p></div>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#FFF3EE] border border-[#F54C0F]/30 px-4 py-2 rounded-full self-start sm:self-auto">
                  <span className="text-xs font-bold text-[#7B7B7B]">Inspection Progress:</span>
                  <span className="text-sm font-extrabold text-[#F54C0F]">{completedCount} / {totalCount} Completed</span>
                </div>
              </div>
              <div className="w-full bg-[#ECECEC] h-2.5 rounded-full mb-6 overflow-hidden">
                <div className="bg-[#F54C0F] h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
              </div>
              <div className="space-y-4">
                {checklistItems.map((item, index) => {
                  const isChecked = !!checklist[item.id];
                  return (
                    <div key={item.id} onClick={() => toggleChecklistItem(item.id)} className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${isChecked ? "bg-[#FFF3EE]/70 border-[#F54C0F]/40 shadow-sm" : "bg-[#F7F7F7] border-[#ECECEC] hover:border-[#F54C0F]/30"}`}>
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? <div className="w-6 h-6 rounded-lg bg-[#F54C0F] text-white flex items-center justify-center shadow-sm"><MdCheck size={18} /></div> : <div className="w-6 h-6 rounded-lg border-2 border-[#9A9A9A] bg-white flex items-center justify-center hover:border-[#F54C0F]"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold transition-colors ${isChecked ? "text-[#F54C0F]" : "text-[#202020]"}`}>{index + 1}. {item.title}</h4>
                          {isChecked && <span className="text-xs font-bold text-[#F54C0F] bg-[#FFF3EE] px-2.5 py-0.5 rounded-full border border-[#F54C0F]/20">Checked</span>}
                        </div>
                        <p className="text-xs sm:text-sm text-[#7B7B7B] mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column — Stepper */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-[#ECECEC] shadow-sm sticky top-28">
              <div className="flex items-center gap-3 pb-6 border-b border-[#ECECEC] mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center"><MdHandyman size={22} /></div>
                <div><h2 className="text-xl font-bold text-[#202020]">Workflow Stepper</h2><p className="text-xs text-[#7B7B7B]">Sequential technician execution steps</p></div>
              </div>
              <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#ECECEC]">
                {stepperSteps.map((step, idx) => {
                  const isPendingStart = currentStep < 0 && idx === 0;
                  const isPassed  = currentStep > idx;
                  const isCurrent = currentStep === idx || isPendingStart;
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-sm ${isPassed ? "bg-[#F54C0F] text-white ring-4 ring-[#FFF3EE]" : isCurrent ? "bg-[#F54C0F] text-white ring-4 ring-[#FFF3EE] animate-pulse" : "bg-white border-2 border-[#ECECEC] text-[#9A9A9A]"}`}>
                        {isPassed ? <MdCheck size={14} /> : idx + 1}
                      </div>
                      <div className="flex-1 ml-3">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-base font-bold ${isCurrent ? "text-[#F54C0F]" : isPassed ? "text-[#202020]" : "text-[#9A9A9A]"}`}>{isPendingStart ? "Ready to Start" : step.title}</h3>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${isPassed ? "bg-emerald-100 text-emerald-800" : isCurrent ? "bg-[#FFF3EE] text-[#F54C0F] border border-[#F54C0F]/20" : "bg-gray-100 text-[#9A9A9A]"}`}>
                            {isPassed ? "Completed" : isCurrent ? "Active Step" : "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-[#7B7B7B] mt-0.5">{isPendingStart ? "Tap Start to begin the workflow." : step.label}</p>
                        {isCurrent && (
                          <div className="mt-4 pt-2">
                            {idx === 0 && <button onClick={() => handleNextStep(1)} className="w-full bg-[#F54C0F] hover:bg-[#DB4206] text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-lg shadow-[#F54C0F]/20 transition-all flex items-center justify-center gap-2">Start</button>}
                            {idx === 1 && <button onClick={() => handleNextStep(2)} className="w-full bg-[#F54C0F] hover:bg-[#DB4206] text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-lg shadow-[#F54C0F]/20 transition-all flex items-center justify-center gap-2"><MdGpsFixed size={18} />Start Work & Capture GPS</button>}
                            {idx === 2 && <button onClick={() => handleNextStep(3)} className="w-full bg-[#F54C0F] hover:bg-[#DB4206] text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-lg shadow-[#F54C0F]/20 transition-all flex items-center justify-center gap-2">Proceed to Inspection Checklist</button>}
                            {idx === 3 && (
                              <>
                                <button onClick={() => handleNextStep(4)} disabled={!isChecklistComplete} className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isChecklistComplete ? "bg-[#F54C0F] hover:bg-[#DB4206] text-white shadow-lg shadow-[#F54C0F]/20" : "bg-[#ECECEC] text-[#9A9A9A] cursor-not-allowed"}`}>
                                  <MdDoneAll size={20} />Complete Job
                                </button>
                                {!isChecklistComplete && <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl mt-3 flex items-center gap-2"><FiAlertCircle className="shrink-0 text-amber-600 text-sm" />Complete all 5 inspection checklist items to unlock "Complete Job".</p>}
                              </>
                            )}
                            {idx === 4 && (
                              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-md"><MdCheckCircle size={24} /></div>
                                <h4 className="text-base font-bold text-emerald-900">Job Successfully Completed!</h4>
                                <p className="text-xs text-emerald-700 mt-1">Service report logged & customer notified.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* GPS */}
              <div className="mt-8 pt-6 border-t border-[#ECECEC]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-[#7B7B7B] uppercase tracking-wider flex items-center gap-1.5"><MdGpsFixed className="text-[#F54C0F] text-base" /> Technician GPS Coordinates</h4>
                  <button onClick={captureGPSLocation} disabled={gpsLoading} className="text-xs font-bold text-[#F54C0F] hover:underline disabled:opacity-50">{gpsLoading ? "Syncing..." : "Re-sync Location"}</button>
                </div>
                {location ? (
                  <div className="p-4 rounded-2xl bg-[#FFF3EE] border border-[#F54C0F]/20 text-xs font-semibold text-[#202020] space-y-2">
                    <div className="flex justify-between items-center"><span className="text-[#7B7B7B]">Latitude:</span><span className="font-mono text-[#F54C0F] text-sm font-bold">{location.latitude}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[#7B7B7B]">Longitude:</span><span className="font-mono text-[#F54C0F] text-sm font-bold">{location.longitude}</span></div>
                    <div className="flex justify-between items-center pt-1 border-t border-[#F54C0F]/10 text-[11px] text-[#7B7B7B]">
                      <span>Captured: {location.timestamp}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified GPS</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#ECECEC] text-xs text-[#7B7B7B] text-center">
                    {gpsLoading ? "Acquiring GPS location..." : "GPS coordinates will automatically capture upon stepping into 'Start Work'."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
