"use client";

import {
  CheckCircle2,
  Circle,
  Truck,
  Home,
  Wrench,
  ClipboardCheck,
} from "lucide-react";

const steps = [
  {
    title: "Booking Confirmed",
    status: "completed",
    icon: CheckCircle2,
  },
  {
    title: "Dispatcher Assigned",
    status: "completed",
    icon: CheckCircle2,
  },
  {
    title: "Technician On The Way",
    status: "current",
    icon: Truck,
  },
  {
    title: "Technician Arrived",
    status: "pending",
    icon: Home,
  },
  {
    title: "Work In Progress",
    status: "pending",
    icon: Wrench,
  },
  {
    title: "Service Completed",
    status: "pending",
    icon: ClipboardCheck,
  },
];

export default function TrackingTimeline() {
  return (
    <section className="bg-white rounded-3xl shadow-xl border p-8 mt-8">

      <h2 className="text-3xl font-bold mb-2">
        Live Booking Tracking
      </h2>

      <p className="text-gray-500 mb-10">
        Track your booking status in real time.
      </p>

      <div className="space-y-8">

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={index}
              className="flex gap-6"
            >

              <div className="flex flex-col items-center">

                {step.status === "completed" && (
                  <div className="bg-green-500 text-white rounded-full p-3">
                    <Icon size={22} />
                  </div>
                )}

                {step.status === "current" && (
                  <div className="bg-orange-500 text-white rounded-full p-3 animate-pulse">
                    <Icon size={22} />
                  </div>
                )}

                {step.status === "pending" && (
                  <div className="bg-gray-200 text-gray-500 rounded-full p-3">
                    <Circle size={22} />
                  </div>
                )}

                {index !== steps.length - 1 && (
                  <div className="w-1 h-16 bg-gray-300 mt-2 rounded-full"></div>
                )}

              </div>

              <div className="pt-2">

                <h3 className="text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="text-gray-500 mt-2">

                  {step.status === "completed" &&
                    "Completed successfully."}

                  {step.status === "current" &&
                    "Currently happening."}

                  {step.status === "pending" &&
                    "Waiting for previous step."}

                </p>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}