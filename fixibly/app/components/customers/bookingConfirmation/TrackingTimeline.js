"use client";

import {
  CheckCircle2,
  Circle,
  Clock,
  UserCheck,
  Truck,
  Home,
  Wrench,
  ClipboardCheck,
  XCircle
} from "lucide-react";

export default function TrackingTimeline({ tracking, currentStatus }) {
  const statusOrder = [
    { key: "Pending", title: "Booking Created", icon: Clock },
    { key: "Assigned", title: "Dispatcher Assigned Technician", icon: UserCheck },
    { key: "Accepted", title: "Technician Accepted Job", icon: CheckCircle2 },
    { key: "On The Way", title: "Technician On The Way", icon: Truck },
    { key: "Arrived", title: "Technician Arrived", icon: Home },
    { key: "Working", title: "Work In Progress", icon: Wrench },
    { key: "Waiting for Customer Confirmation", title: "Work Done - Awaiting Customer Confirmation", icon: ClipboardCheck },
    { key: "Completed", title: "Job Fully Completed", icon: CheckCircle2 }
  ];

  if (currentStatus === "Cancelled") {
    return (
      <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8">
        <div className="flex items-center gap-4 text-red-600">
          <XCircle size={36} />
          <div>
            <h2 className="text-3xl font-bold">Booking Cancelled</h2>
            <p className="text-gray-500 mt-1">This booking has been cancelled and is no longer active.</p>
          </div>
        </div>
      </section>
    );
  }

  // Find index of current status
  const currentIndex = statusOrder.findIndex(s => s.key === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8">
      <h2 className="text-3xl font-bold mb-2">Live Booking Tracking Timeline</h2>
      <p className="text-gray-500 mb-10">Real-time status updates from Supabase database.</p>

      <div className="space-y-8">
        {statusOrder.map((step, index) => {
          const Icon = step.icon;

          let stepState = "pending";
          if (index < activeIndex) stepState = "completed";
          else if (index === activeIndex) stepState = "current";

          return (
            <div key={step.key} className="flex gap-6">
              <div className="flex flex-col items-center">
                {stepState === "completed" && (
                  <div className="bg-green-500 text-white rounded-full p-3 shadow">
                    <Icon size={22} />
                  </div>
                )}

                {stepState === "current" && (
                  <div className="bg-orange-500 text-white rounded-full p-3 animate-pulse shadow-lg">
                    <Icon size={22} />
                  </div>
                )}

                {stepState === "pending" && (
                  <div className="bg-gray-200 text-gray-500 rounded-full p-3">
                    <Circle size={22} />
                  </div>
                )}

                {index !== statusOrder.length - 1 && (
                  <div className={`w-1 h-12 mt-2 rounded-full ${index < activeIndex ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>

              <div className="pt-2">
                <h3 className={`text-xl font-semibold ${stepState === 'current' ? 'text-orange-600 font-bold' : ''}`}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {stepState === "completed" && "Completed."}
                  {stepState === "current" && "Currently in progress..."}
                  {stepState === "pending" && "Pending next step."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}