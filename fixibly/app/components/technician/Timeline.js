"use client";
import React from "react";
import { MdAccessTime } from "react-icons/md";
import useTechnicianStore from "../../technician/store/technicianStore";

function Timeline({ timeline }) {
  const storeTimeline = useTechnicianStore((state) => state.timeline);
  const items = timeline || storeTimeline || [];

  return (
    <div className="rounded-2xl bg-white border border-[#ECECEC] shadow-sm p-7">
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
            <MdAccessTime size={22} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#202020]">Today's Dispatch Schedule</h3>
            <p className="text-xs text-[#7B7B7B]">Live field agenda & timeline</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F54C0F] bg-[#FFF3EE] px-3 py-1 rounded-xl border border-[#F54C0F]/20">
          Live Agenda
        </span>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#7B7B7B] bg-[#F7F7F7] rounded-xl border border-dashed border-[#ECECEC]">
            No assigned dispatches scheduled for today.
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="min-w-[4.5rem] rounded-xl bg-[#FFF3EE] border border-[#F54C0F]/20 px-3 py-2 text-center text-xs font-bold text-[#F54C0F]">
                {item.time || "Today"}
              </div>
              <div className="flex-1 rounded-xl border border-[#ECECEC] bg-[#F7F7F7] p-3 text-xs font-bold text-[#202020]">
                {item.task || "Field Repair Service"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Timeline;
