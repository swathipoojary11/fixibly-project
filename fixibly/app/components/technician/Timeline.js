import React from "react";
import { MdAccessTime } from "react-icons/md";

function Timeline({ timeline }) {
  const items = (timeline || [{ time: "10:30 AM", task: "AC Repair at MG Road" }]).slice(0, 1);

  return (
    <div className="rounded-none bg-white border border-[#ECECEC] shadow-sm p-7">
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
            <MdAccessTime size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#202020]">Today's Schedule</h3>
            <p className="text-xs text-[#7B7B7B]">Field timeline & dispatch agenda</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F54C0F] bg-[#FFF3EE] px-3 py-1 rounded-none border border-[#F54C0F]/20">
          Live Agenda
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="min-w-[4.5rem] rounded-none bg-[#FFF3EE] border border-[#F54C0F]/20 px-3 py-2 text-center text-xs font-bold text-[#F54C0F]">
              {item.time}
            </div>
            <div className="flex-1 rounded-none border border-[#ECECEC] bg-[#F7F7F7] p-3 text-xs font-bold text-[#202020]">
              {item.task}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
