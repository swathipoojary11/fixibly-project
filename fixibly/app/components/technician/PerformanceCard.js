import React from "react";
import { MdTrendingUp } from "react-icons/md";

function PerformanceCard() {
  return (
    <div className="rounded-none bg-white border border-[#ECECEC] shadow-sm p-7">
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-[#FFF3EE] text-[#F54C0F] flex items-center justify-center">
            <MdTrendingUp size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#202020]">Today's Performance</h3>
            <p className="text-xs text-[#7B7B7B]">Service metrics & completion rate</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-[#7B7B7B] mb-2">
          <span>Completion Efficiency</span>
          <span className="text-[#F54C0F]">75%</span>
        </div>
        <div className="h-2.5 rounded-none bg-[#ECECEC] overflow-hidden">
          <div className="h-full w-3/4 rounded-none bg-[#F54C0F]" />
        </div>
      </div>

      <div className="mt-6 space-y-3.5 pt-4 border-t border-[#ECECEC] text-xs font-semibold">
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Jobs Finished Today</span>
          <span className="text-[#202020] font-extrabold text-xs">5</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Average Resolution Time</span>
          <span className="text-[#202020] font-extrabold text-xs">42 mins</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#7B7B7B]">Customer Satisfaction</span>
          <span className="text-[#F54C0F] font-extrabold text-[9px] flex items-center gap-0.5">
            4.8<span className="text-[7px] leading-none">★</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceCard;
